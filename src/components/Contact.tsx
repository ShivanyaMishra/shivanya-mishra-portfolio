import React, { useState } from 'react';
import {
  Mail,
  Linkedin,
  Github,
  Phone,
  MapPin,
  Check,
  Copy,
  ExternalLink,
  Send,
  CheckCircle2,
  Inbox,
  Sparkles,
  Info,
  AlertCircle,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useMessages } from '../context/MessagesContext';
import { ContactNetwork3D } from './3d/ContactNetwork3D';
import { WavingRobot3D } from './3d/WavingRobot3D';

interface ContactProps {
  onOpenResume: () => void;
}

export const Contact: React.FC<ContactProps> = ({ onOpenResume }) => {
  const { data } = usePortfolio();
  const { sendMessage, setIsInboxOpen, unreadCount, messages } = useMessages();

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailDelivered, setEmailDelivered] = useState(false);
  const [deliveryNotice, setDeliveryNotice] = useState<string | null>(null);
  const [deliveryError, setDeliveryError] = useState<string | null>(null);
  const [lastSent, setLastSent] = useState<{ name: string; email: string; message: string } | null>(null);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(data.personal.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(data.personal.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    // 1. Validate Name
    if (!trimmedName) {
      setDeliveryError('Please enter your name.');
      return;
    }

    // 2. Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setDeliveryError('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    // 3. Validate Message
    if (!trimmedMessage) {
      setDeliveryError('Please write a message before sending.');
      return;
    }

    setDeliveryError(null);
    setIsSubmitting(true);
    setIsSuccess(false);

    const timestamp = new Date().toISOString();
    const sentData = {
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
    };
    setLastSent(sentData);

    try {
      // 4. Save using portfolio inbox functionality
      const savedMsg = await sendMessage({
        name: sentData.name,
        email: sentData.email,
        message: sentData.message,
        subject: `New Portfolio Message from ${sentData.name}`,
      });

      // 5. Send to server-side email endpoint
      let isSent = false;
      let notice: string | null = null;

      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: savedMsg.id,
            name: sentData.name,
            email: sentData.email,
            message: sentData.message,
            timestamp,
          }),
        });

        const result = await response.json().catch(() => ({}));
        isSent = Boolean(result.emailSent);
        notice = result.emailError || null;
      } catch {
        isSent = false;
        notice = 'Awaiting server SMTP configuration';
      }

      // 6. Complete submission cleanly
      setEmailDelivered(isSent);
      setDeliveryNotice(notice);

      if (isSent) {
        setIsSuccess(true);
        setDeliveryError(null);
      } else {
        setIsSuccess(false);
        setDeliveryError(
          notice ||
            'Direct email transmission to shivanyamishra84@gmail.com is pending configuration. Your message has been safely saved in the portfolio Inbox.'
        );
      }

      setFormData({ name: '', email: '', message: '' });
    } catch (err: any) {
      setIsSuccess(false);
      setEmailDelivered(false);
      setDeliveryError(
        err.message || 'Direct email transmission failed. Your message is safely stored in the portfolio Inbox.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const mailtoHref = lastSent
    ? `mailto:${data.personal.email}?subject=${encodeURIComponent(
        `Portfolio Inquiry from ${lastSent.name}`
      )}&body=${encodeURIComponent(
        `Hi Shivanya,\n\n${lastSent.message}\n\nFrom: ${lastSent.name}\nEmail: ${lastSent.email}`
      )}`
    : `mailto:${data.personal.email}`;

  return (
    <section id="contact" className="py-20 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">
            07 // CONNECT
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight">
            Let&apos;s Connect
          </h2>
          <div className="h-0.5 w-16 bg-cyan-500/80 mt-3" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <p className="text-base text-slate-300 max-w-2xl">
            Open to entry-level Data Analyst opportunities and relevant data-focused roles.
          </p>

          {/* Quick Inbox Shortcut */}
          <button
            onClick={() => setIsInboxOpen(true)}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-cyan-950/70 border border-cyan-500/40 hover:bg-cyan-900/80 text-cyan-300 hover:text-white text-xs font-mono transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Inbox className="w-4 h-4 text-cyan-400" />
            <span>Received Messages ({messages.length})</span>
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* 1. Contact Details Cards */}
          <div className="order-1 lg:order-none lg:col-span-6 space-y-3">
            {/* Email */}
            <div className="p-4 rounded-xl bg-[#080d19]/90 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-slate-400">Email Address</div>
                  <a
                    href={`mailto:${data.personal.email}`}
                    className="text-xs sm:text-sm font-medium text-white hover:text-cyan-400 transition-colors"
                  >
                    {data.personal.email}
                  </a>
                </div>
              </div>

              <button
                onClick={handleCopyEmail}
                className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copiedEmail ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Copied
                  </span>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Phone */}
            <div className="p-4 rounded-xl bg-[#080d19]/90 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-slate-400">Phone</div>
                  <a
                    href={`tel:${data.personal.phone.replace(/\s+/g, '')}`}
                    className="text-xs sm:text-sm font-medium text-white hover:text-cyan-400 transition-colors"
                  >
                    {data.personal.phone}
                  </a>
                </div>
              </div>

              <button
                onClick={handleCopyPhone}
                className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copiedPhone ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Copied
                  </span>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* LinkedIn */}
            <a
              href={data.personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-[#080d19]/90 border border-slate-800 hover:border-slate-700 flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 group-hover:text-cyan-300">
                  <Linkedin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-slate-400">LinkedIn</div>
                  <div className="text-xs sm:text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">
                    {data.personal.linkedin.replace('https://', '')}
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
            </a>

            {/* GitHub */}
            <a
              href={data.personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-[#080d19]/90 border border-slate-800 hover:border-slate-700 flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-indigo-400 group-hover:text-indigo-300">
                  <Github className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-slate-400">GitHub</div>
                  <div className="text-xs sm:text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">
                    {data.personal.github.replace('https://', '')}
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
            </a>

            {/* Location */}
            <div className="p-4 rounded-xl bg-[#080d19]/90 border border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-mono text-slate-400">Location</div>
                <div className="text-xs sm:text-sm font-medium text-white">
                  {data.personal.location}
                </div>
              </div>
            </div>
          </div>

          {/* 2. 3D Network Topology (Desktop: Row 1 Right, Mobile: Order 4) */}
          <div className="order-4 lg:order-none lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-1">
              <span className="text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                3D Network Topology
              </span>
              <span>Interactive Nodes</span>
            </div>

            <ContactNetwork3D
              onOpenResume={onOpenResume}
              email={data.personal.email}
              linkedin={data.personal.linkedin}
              github={data.personal.github}
            />
          </div>

          {/* 3. Quick Contact Form (Desktop: Row 2 Left, Mobile: Order 2 - directly after contact details) */}
          <div className="order-2 lg:order-none lg:col-span-6">
            <div className="p-6 rounded-2xl bg-[#080d19]/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <Send className="w-4 h-4 text-cyan-400" />
                  <span>Send Direct Message</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsInboxOpen(true)}
                  className="px-2.5 py-1 text-xs font-mono text-cyan-300 hover:text-white bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-600/50 rounded transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Inbox className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View Received Messages {unreadCount > 0 ? `(${unreadCount})` : ''}</span>
                </button>
              </div>

              {/* Success Notification - shown ONLY after email request succeeds */}
              {isSuccess && (
                <div className="p-4 rounded-xl border border-cyan-500/60 bg-[#081b21] text-slate-200 text-xs space-y-3 shadow-lg">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
                    <div>
                      <div className="font-semibold text-white text-sm">
                        Message Sent &amp; Delivered to Email!
                      </div>
                      <p className="text-slate-300 text-xs mt-0.5">
                        Your message has been emailed directly to <strong>shivanyamishra84@gmail.com</strong> and recorded in your portfolio Inbox.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsInboxOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Inbox className="w-3.5 h-3.5" />
                      <span>Open Received Messages ({messages.length})</span>
                    </button>

                    <a
                      href={mailtoHref}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700 font-mono text-xs flex items-center gap-1.5 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Open in Mail App</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Delivery Warning Notification - shown if email transmission is pending or failed */}
              {deliveryError && (
                <div className="p-4 rounded-xl bg-[#1c120c] border border-amber-500/60 text-slate-200 text-xs space-y-3 shadow-lg">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-amber-300 text-sm">
                        Message Saved to Portfolio Inbox (Email Forwarding Notice)
                      </div>
                      <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">
                        Your message was safely recorded in your portfolio Inbox. However, automated forwarding to <strong>shivanyamishra84@gmail.com</strong> could not complete:
                      </p>
                      <div className="text-amber-200/90 text-[11px] font-mono mt-1.5 p-2 bg-black/40 rounded border border-amber-900/40">
                        {deliveryError}
                      </div>
                      <p className="text-slate-400 text-[11px] mt-1.5">
                        You can also send this message directly via your email client:
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-900/40">
                    <button
                      type="button"
                      onClick={() => setIsInboxOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Inbox className="w-3.5 h-3.5" />
                      <span>Open Portfolio Inbox ({messages.length})</span>
                    </button>

                    <a
                      href={mailtoHref}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs flex items-center gap-1.5 transition-colors font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Forward via Mail App</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setDeliveryError(null)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs transition-colors cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your.email@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Message
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Role details, project questions, or inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 text-xs font-mono font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Sending to Email...' : 'SEND MESSAGE'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsInboxOpen(true)}
                    className="text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                  >
                    <span>Inbox ({messages.length})</span>
                  </button>
                </div>
              </form>

              {/* Explanatory Note for User */}
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Where can I see received messages?</strong> Click the <em>&ldquo;View Received Messages&rdquo;</em> button above or the <em>&ldquo;INBOX&rdquo;</em> button in the top navigation bar to view, search, export, or reply to all incoming messages.
                </span>
              </div>
            </div>
          </div>

          {/* 4. 3D Robot & Hover Platform (Desktop: Row 2 Right beside form, Mobile: Order 3 directly below form) */}
          <div className="order-3 lg:order-none lg:col-span-6 flex items-center justify-center py-4 sm:py-6 lg:py-0 select-none overflow-visible">
            <div className="w-full max-w-[210px] sm:max-w-[250px] lg:max-w-[320px] mx-auto flex items-center justify-center relative overflow-visible">
              <WavingRobot3D />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
