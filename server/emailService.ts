import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export interface EmailPayload {
  name: string;
  email: string;
  message: string;
  timestamp?: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function sendPortfolioEmail(
  data: EmailPayload
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const recipient = process.env.EMAIL_TO || 'shivanyamishra84@gmail.com';
  const resendApiKey = process.env.RESEND_API_KEY;
  const smtpUser = process.env.SMTP_USER || 'shivanyamishra84@gmail.com';
  const rawPass = process.env.SMTP_PASS?.trim();
  const cleanPass = rawPass ? rawPass.replace(/\s+/g, '') : '';
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 465;
  const smtpSecure = process.env.SMTP_SECURE === 'false' ? false : true;

  const dateStr = data.timestamp
    ? new Date(data.timestamp).toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'long',
      })
    : new Date().toLocaleString();

  const subject = `New Portfolio Message from ${data.name}`;

  const textBody = `New message received from my portfolio.

Name: ${data.name}
Email: ${data.email}

Message:
${data.message}

Date:
${dateStr}`;

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #1e293b;">
      <h2 style="color: #0284c7; margin-top: 0; border-bottom: 2px solid #38bdf8; padding-bottom: 8px;">New Portfolio Message</h2>
      <p style="color: #475569; font-size: 14px;">You have received a new direct message through your portfolio website.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #334155; width: 80px;">Name:</td>
          <td style="padding: 8px 0; color: #0f172a;">${escapeHtml(data.name)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #334155;">Email:</td>
          <td style="padding: 8px 0; color: #0f172a;">
            <a href="mailto:${escapeHtml(data.email)}" style="color: #0284c7; text-decoration: none;">${escapeHtml(data.email)}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #334155;">Date:</td>
          <td style="padding: 8px 0; color: #64748b; font-size: 13px;">${escapeHtml(dateStr)}</td>
        </tr>
      </table>
      
      <div style="margin-top: 20px; padding: 16px; background-color: #f8fafc; border-left: 4px solid #0284c7; border-radius: 4px;">
        <strong style="color: #1e293b; display: block; margin-bottom: 8px;">Message:</strong>
        <p style="color: #334155; white-space: pre-wrap; margin: 0; line-height: 1.6;">${escapeHtml(data.message)}</p>
      </div>
      
      <div style="margin-top: 28px; padding-top: 14px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
        Dispatched automatically from Shivanya Mishra's Portfolio Website to ${escapeHtml(recipient)}
      </div>
    </div>
  `;

  // Option A: Resend API if RESEND_API_KEY is configured
  if (resendApiKey) {
    try {
      const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: recipient,
          reply_to: data.email,
          subject: subject,
          text: textBody,
          html: htmlBody,
        }),
      });

      const resData = (await response.json()) as any;
      if (!response.ok) {
        return {
          success: false,
          error: resData.message || 'Resend API returned an error',
        };
      }

      return {
        success: true,
        messageId: resData.id,
      };
    } catch (err: any) {
      return {
        success: false,
        error: `Resend API transmission failed: ${err.message}`,
      };
    }
  }

  // Option B: Standard SMTP / Gmail App Password
  const isPlaceholder =
    !cleanPass ||
    cleanPass.startsWith('[') ||
    cleanPass.includes('your-16-character') ||
    cleanPass.length < 8;

  if (smtpUser && !isPlaceholder) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: cleanPass,
        },
        tls: {
          rejectUnauthorized: process.env.NODE_ENV === 'production',
        },
      });

      const info = await transporter.sendMail({
        from: `"${data.name} via Portfolio" <${smtpUser}>`,
        to: recipient,
        replyTo: data.email,
        subject: subject,
        text: textBody,
        html: htmlBody,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (err: any) {
      console.warn('Nodemailer transmission failed, attempting fallback service:', err.message);
    }
  }

  // Option C: FormSubmit Forwarding Service (Direct to recipient with Reply-To)
  try {
    const fsResponse = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Origin: 'https://shivanya-mishra.portfolio',
        Referer: 'https://shivanya-mishra.portfolio/',
        'User-Agent': 'Mozilla/5.0 (compatible; PortfolioBackend/1.0)',
      },
      body: JSON.stringify({
        _subject: subject,
        _replyto: data.email,
        name: data.name,
        email: data.email,
        message: data.message,
        timestamp: dateStr,
      }),
    });

    const fsData = (await fsResponse.json()) as any;
    if (fsData.success === 'true' || fsData.success === true) {
      return {
        success: true,
        messageId: 'formsubmit-delivered',
      };
    }

    if (typeof fsData.message === 'string' && fsData.message.includes('needs Activation')) {
      return {
        success: false,
        error: `FormSubmit requires a one-time activation. Check ${recipient} for the "Activate Form" email and click it to activate, or add your 16-character Google App Password to SMTP_PASS in .env.`,
      };
    }

    return {
      success: false,
      error:
        fsData.message ||
        'Email delivery credentials not configured. Please enter your 16-character Google App Password in the SMTP_PASS environment variable in .env.',
    };
  } catch (fsErr: any) {
    return {
      success: false,
      error:
        'Google App Password not configured yet. Please enter your 16-character Google App Password in the SMTP_PASS environment variable in .env.',
    };
  }
}
