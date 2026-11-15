import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';
import { sendPortfolioEmail } from './server/emailService';

function profileUploadPlugin(): Plugin {
  return {
    name: 'profile-upload-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/upload-profile' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              if (data && data.imageBase64) {
                const base64Data = data.imageBase64.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');

                const publicPath = path.resolve(__dirname, 'public/shivi.png');
                const srcPath = path.resolve(__dirname, 'src/assets/images/shivi.png');
                const distPath = path.resolve(__dirname, 'dist/shivi.png');

                fs.writeFileSync(publicPath, buffer);
                if (!fs.existsSync(path.resolve(__dirname, 'src/assets/images'))) {
                  fs.mkdirSync(path.resolve(__dirname, 'src/assets/images'), { recursive: true });
                }
                fs.writeFileSync(srcPath, buffer);
                if (fs.existsSync(path.resolve(__dirname, 'dist'))) {
                  fs.writeFileSync(distPath, buffer);
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'shivi.png updated successfully' }));
                return;
              }
            } catch (err) {
              console.error('Failed to parse uploaded image:', err);
            }
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid payload' }));
          });
          return;
        }
        next();
      });
    },
  };
}

function resumeServePlugin(): Plugin {
  return {
    name: 'resume-serve-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || '').split('?')[0];
        if (
          url === '/Shivanya_Mishra_Resume.pdf' ||
          url === '/resume.pdf' ||
          url === '/api/resume.pdf' ||
          url === '/api/download-resume'
        ) {
          const filePath = path.resolve(__dirname, 'public/Shivanya_Mishra_Resume.pdf');
          if (fs.existsSync(filePath)) {
            const stat = fs.statSync(filePath);
            res.writeHead(200, {
              'Content-Type': 'application/pdf',
              'Content-Length': stat.size,
              'Content-Disposition': 'inline; filename="Shivanya_Mishra_Resume.pdf"',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
            });
            fs.createReadStream(filePath).pipe(res);
            return;
          }
        }
        next();
      });
    },
  };
}

function messagesApiPlugin(): Plugin {
  const dataDir = path.resolve(__dirname, 'data');
  const messagesFile = path.resolve(dataDir, 'messages.json');

  const getStoredMessages = (): any[] => {
    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      if (fs.existsSync(messagesFile)) {
        const raw = fs.readFileSync(messagesFile, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error reading messages file:', err);
    }
    return [];
  };

  const saveMessages = (msgs: any[]) => {
    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(messagesFile, JSON.stringify(msgs, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing messages file:', err);
    }
  };

  return {
    name: 'messages-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const parsedUrl = new URL(req.url || '/', 'http://localhost');

        if (parsedUrl.pathname === '/api/send-email' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const data = JSON.parse(body);
              if (!data.name || !data.email || !data.message) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Name, email, and message are required.' }));
                return;
              }

              // 1. Guarantee recording into received-messages inbox (messages.json)
              const msgs = getStoredMessages();
              const savedItem = {
                id: data.id || `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                name: data.name.trim(),
                email: data.email.trim(),
                subject: data.subject || `New Portfolio Message from ${data.name.trim()}`,
                message: data.message.trim(),
                timestamp: data.timestamp || new Date().toISOString(),
                read: false,
              };

              if (!msgs.some((m) => m.id === savedItem.id)) {
                msgs.unshift(savedItem);
                saveMessages(msgs);
              }

              // 2. Dispatch real email server-side
              const emailResult = await sendPortfolioEmail({
                name: data.name.trim(),
                email: data.email.trim(),
                message: data.message.trim(),
                timestamp: savedItem.timestamp,
              });

              // Return 200: Message is safely saved in the portfolio inbox, with exact email delivery status
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(
                JSON.stringify({
                  success: true,
                  emailSent: emailResult.success,
                  emailError: emailResult.success ? undefined : emailResult.error,
                  messageId: emailResult.messageId,
                  savedMessage: savedItem,
                })
              );
              return;
            } catch (err: any) {
              console.error('Error in POST /api/send-email:', err);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: err.message || 'Internal server error' }));
            }
          });
          return;
        }

        if (parsedUrl.pathname === '/api/messages') {
          // GET
          if (req.method === 'GET') {
            const list = getStoredMessages();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(list));
            return;
          }

          // POST
          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                const newMsg = JSON.parse(body);
                if (newMsg && newMsg.name && newMsg.email && newMsg.message) {
                  const msgs = getStoredMessages();
                  const savedItem = {
                    id: newMsg.id || `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                    name: newMsg.name,
                    email: newMsg.email,
                    subject: newMsg.subject || `Inquiry from ${newMsg.name}`,
                    message: newMsg.message,
                    timestamp: newMsg.timestamp || new Date().toISOString(),
                    read: false,
                  };
                  msgs.unshift(savedItem);
                  saveMessages(msgs);

                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: true, message: savedItem }));
                  return;
                }
              } catch (err) {
                console.error('Error in POST /api/messages:', err);
              }
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid message payload' }));
            });
            return;
          }

          // PATCH (Mark read / mark all read)
          if (req.method === 'PATCH') {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                const patch = JSON.parse(body);
                const msgs = getStoredMessages();
                let updated = msgs;
                if (patch.markAllRead) {
                  updated = msgs.map((m) => ({ ...m, read: true }));
                } else if (patch.id) {
                  updated = msgs.map((m) => (m.id === patch.id ? { ...m, read: patch.read ?? true } : m));
                }
                saveMessages(updated);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
                return;
              } catch (err) {
                console.error('Error in PATCH /api/messages:', err);
              }
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid patch payload' }));
            });
            return;
          }

          // DELETE
          if (req.method === 'DELETE') {
            const id = parsedUrl.searchParams.get('id');
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                let clearAll = false;
                let targetId = id;
                if (body) {
                  const parsed = JSON.parse(body);
                  if (parsed.clearAll) clearAll = true;
                  if (parsed.id) targetId = parsed.id;
                }

                if (clearAll) {
                  saveMessages([]);
                } else if (targetId) {
                  const msgs = getStoredMessages();
                  const filtered = msgs.filter((m) => m.id !== targetId);
                  saveMessages(filtered);
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
                return;
              } catch (err) {
                console.error('Error in DELETE /api/messages:', err);
              }
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid delete request' }));
            });
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), profileUploadPlugin(), messagesApiPlugin(), resumeServePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
