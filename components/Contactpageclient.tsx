// components/Contactpageclient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Instagram,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  CheckCircle,
  Loader2,
  Clock,
} from "lucide-react";
import { cn } from "@/utils/cn";

type FormState = {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
};
type FormErrors = Partial<Record<keyof FormState, string>>;

const contactInfo = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+91 97871 74450",
    href: "https://wa.me/919787174450",
    color: "bg-green-50 text-green-500 border-green-100",
    description: "Fastest way to reach us — we reply within an hour!",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@kaycandles",
    href: "https://instagram.com",
    color: "bg-pink-50 text-pink-500 border-pink-100",
    description: "Follow us for new drops, behind-the-scenes, and more.",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@kaycandles.com",
    href: "mailto:hello@kaycandles.com",
    color: "bg-blush-50 text-blush-500 border-blush-100",
    description: "For bulk orders, collaborations, or general queries.",
  },
  {
    icon: Clock,
    label: "Response Time",
    value: "Within 24 hours",
    href: null,
    color: "bg-amber-50 text-amber-500 border-amber-100",
    description: "We try to respond to all messages same day.",
  },
];

const subjects = [
  "Order Enquiry",
  "Custom Order",
  "Bulk / Wholesale",
  "Collaboration",
  "Feedback",
  "Other",
];

export default function ContactPageClient() {
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name as keyof FormErrors])
      setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.message.trim()) e.message = "Message is required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address";
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, "")))
      e.phone = "Enter a valid 10-digit number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Build WhatsApp message from form
    const lines = [
      `📩 *New Contact Form Message*`,
      ``,
      `*Name:* ${form.name}`,
      form.phone ? `*Phone:* ${form.phone}` : null,
      form.email ? `*Email:* ${form.email}` : null,
      form.subject ? `*Subject:* ${form.subject}` : null,
      ``,
      `*Message:*`,
      form.message,
    ]
      .filter(Boolean)
      .join("\n");

    setStatus("sending");
    setTimeout(() => {
      setStatus("sent");
      window.open(
        `https://wa.me/919787174450?text=${encodeURIComponent(lines)}`,
        "_blank",
      );
    }, 600);
  };

  return (
    <div className="min-h-screen bg-blush-50">
      {/* ── Hero ── */}
      <section className="relative bg-white pt-16 pb-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blush-100/50 blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blush-50 border border-blush-200 rounded-full mb-6">
            <MessageCircle size={12} className="text-blush-400" />
            <span className="font-body text-xs text-blush-500 tracking-widest uppercase font-medium">
              Get In Touch
            </span>
          </div>
          <h1 className="font-display text-6xl sm:text-7xl font-light text-blush-900 leading-[0.95] mb-5">
            We&apos;d love to
            <em className="italic text-blush-400 block mt-1">hear from you</em>
          </h1>
          <p className="font-body text-blush-500 text-lg max-w-md mx-auto">
            Have a question, want a custom order, or just want to say hi? Reach
            out — we reply fast!
          </p>
        </div>
        <svg
          viewBox="0 0 1440 50"
          className="w-full fill-blush-50 block -mb-px"
          preserveAspectRatio="none"
        >
          <path d="M0,25 C360,50 1080,0 1440,25 L1440,50 L0,50 Z" />
        </svg>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* ── Left: Contact info ── */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <h2 className="font-display text-3xl font-light text-blush-900 mb-2">
                Contact Details
              </h2>
              <p className="font-body text-sm text-blush-500 leading-relaxed">
                The quickest way to reach us is WhatsApp — we&apos;re usually
                online and reply fast!
              </p>
            </div>

            <div className="space-y-3">
              {contactInfo.map((item) => (
                <div
                  key={item.label}
                  className="bg-white rounded-2xl border border-blush-100 p-5 hover:shadow-sm hover:shadow-blush-100 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full border flex items-center justify-center shrink-0",
                        item.color,
                      )}
                    >
                      <item.icon size={17} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-[10px] text-blush-400 uppercase tracking-widest mb-0.5">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-accent text-sm font-semibold text-blush-800 hover:text-blush-500 transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-accent text-sm font-semibold text-blush-800">
                          {item.value}
                        </p>
                      )}
                      <p className="font-body text-xs text-blush-400 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct WhatsApp CTA */}
            <a
              href="https://wa.me/919787174450"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-green-500 hover:bg-green-600 text-white font-body font-medium rounded-xl transition-colors shadow-sm"
            >
              <MessageCircle size={18} />
              Chat on WhatsApp Now
            </a>

            {/* Location note */}
            <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-blush-100">
              <MapPin size={16} className="text-blush-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-body text-xs font-semibold text-blush-700">
                  Based in India
                </p>
                <p className="font-body text-xs text-blush-400 mt-0.5">
                  We ship pan-India. Custom orders and local pickup available —
                  ask us via WhatsApp!
                </p>
              </div>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div className="lg:col-span-3">
            {status === "sent" ? (
              <div className="bg-white rounded-3xl border border-blush-100 p-10 text-center flex flex-col items-center justify-center min-h-[500px]">
                <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mb-6">
                  <CheckCircle size={36} className="text-green-500" />
                </div>
                <h3 className="font-display text-3xl font-light text-blush-900 mb-3">
                  Message Sent!
                </h3>
                <p className="font-body text-sm text-blush-500 mb-2 max-w-xs">
                  Your message has been sent to our WhatsApp. We&apos;ll reply
                  as soon as possible!
                </p>
                <p className="font-body text-xs text-blush-400 mb-8">
                  Usually within a few hours.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setStatus("idle");
                      setForm({
                        name: "",
                        phone: "",
                        email: "",
                        subject: "",
                        message: "",
                      });
                    }}
                    className="px-6 py-2.5 border border-blush-200 text-blush-600 font-body text-sm rounded-full hover:bg-blush-50 transition-colors"
                  >
                    Send Another
                  </button>
                  <Link
                    href="/"
                    className="px-6 py-2.5 bg-blush-400 text-white font-body text-sm rounded-full hover:bg-blush-500 transition-colors"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl border border-blush-100 p-8 space-y-5"
              >
                <div>
                  <h2 className="font-display text-3xl font-light text-blush-900 mb-1">
                    Send a Message
                  </h2>
                  <p className="font-body text-xs text-blush-400">
                    Fill in the form and we&apos;ll get back to you via
                    WhatsApp.
                  </p>
                </div>

                {/* Name + Phone row */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-body text-xs text-blush-600 font-medium">
                      Full Name <span className="text-blush-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className={cn(
                        "w-full px-4 py-3 bg-blush-50 border rounded-xl font-body text-sm text-blush-800 placeholder-blush-300 focus:outline-none focus:ring-2 focus:ring-blush-300 transition-all",
                        errors.name
                          ? "border-red-300 bg-red-50"
                          : "border-blush-100",
                      )}
                    />
                    {errors.name && (
                      <p className="font-body text-xs text-red-500">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-body text-xs text-blush-600 font-medium">
                      Phone{" "}
                      <span className="text-blush-300 font-normal">
                        (optional)
                      </span>
                    </label>
                    <div className="flex gap-2">
                      <div className="flex items-center px-3 bg-blush-50 border border-blush-100 rounded-xl shrink-0">
                        <span className="font-body text-sm text-blush-500">
                          🇮🇳 +91
                        </span>
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="10-digit number"
                        maxLength={10}
                        className={cn(
                          "flex-1 px-4 py-3 bg-blush-50 border rounded-xl font-body text-sm text-blush-800 placeholder-blush-300 focus:outline-none focus:ring-2 focus:ring-blush-300 transition-all",
                          errors.phone
                            ? "border-red-300 bg-red-50"
                            : "border-blush-100",
                        )}
                      />
                    </div>
                    {errors.phone && (
                      <p className="font-body text-xs text-red-500">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email + Subject row */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-body text-xs text-blush-600 font-medium">
                      Email{" "}
                      <span className="text-blush-300 font-normal">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={cn(
                        "w-full px-4 py-3 bg-blush-50 border rounded-xl font-body text-sm text-blush-800 placeholder-blush-300 focus:outline-none focus:ring-2 focus:ring-blush-300 transition-all",
                        errors.email
                          ? "border-red-300 bg-red-50"
                          : "border-blush-100",
                      )}
                    />
                    {errors.email && (
                      <p className="font-body text-xs text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-body text-xs text-blush-600 font-medium">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm text-blush-700 focus:outline-none focus:ring-2 focus:ring-blush-300 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select a topic…</option>
                      {subjects.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="font-body text-xs text-blush-600 font-medium">
                    Message <span className="text-blush-400">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us what you need — custom orders, questions, feedback, anything!"
                    rows={5}
                    className={cn(
                      "w-full px-4 py-3 bg-blush-50 border rounded-xl font-body text-sm text-blush-800 placeholder-blush-300 focus:outline-none focus:ring-2 focus:ring-blush-300 transition-all resize-none",
                      errors.message
                        ? "border-red-300 bg-red-50"
                        : "border-blush-100",
                    )}
                  />
                  {errors.message && (
                    <p className="font-body text-xs text-red-500">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-4 font-body font-medium rounded-xl transition-all",
                    status === "sending"
                      ? "bg-blush-200 text-blush-400 cursor-not-allowed"
                      : "bg-blush-400 hover:bg-blush-500 text-white hover:shadow-lg hover:shadow-blush-200",
                  )}
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      <Send size={18} /> Send via WhatsApp
                    </>
                  )}
                </button>

                <p className="font-body text-[11px] text-blush-400 text-center">
                  Your message will open in WhatsApp so we can reply directly.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── FAQ strip ── */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-4xl font-light text-blush-900 text-center mb-10">
            Common Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I place a custom order?",
                a: "Absolutely! We love custom orders — custom scents, colors, packaging, and gift sets. Just send us a message on WhatsApp with your idea.",
              },
              {
                q: "How long does delivery take?",
                a: "We dispatch within 1–2 business days. Standard delivery takes 3–5 business days across India depending on your location.",
              },
              {
                q: "Do you do bulk or wholesale orders?",
                a: "Yes! We offer bulk pricing for events, corporate gifting, and resellers. Reach out via email or WhatsApp for a custom quote.",
              },
              {
                q: "What if my order arrives damaged?",
                a: "We pack everything with care, but if something arrives damaged, take a photo and message us within 48 hours — we'll sort it out right away.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="p-6 bg-blush-50 rounded-2xl border border-blush-100"
              >
                <h4 className="font-accent text-sm font-semibold text-blush-800 mb-2">
                  {faq.q}
                </h4>
                <p className="font-body text-sm text-blush-500 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
          <p className="text-center font-body text-sm text-blush-400 mt-8">
            Still have questions?{" "}
            <a
              href="https://wa.me/919787174450"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blush-500 hover:text-blush-700 underline underline-offset-2 transition-colors"
            >
              Ask us on WhatsApp
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
