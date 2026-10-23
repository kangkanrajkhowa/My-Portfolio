"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Mail, Phone, Send } from "lucide-react";
import { profile } from "@/content/profile";
import { socials } from "@/content/socials";
import { socialIconMap } from "@/components/ui/brand-icons";
import { toast } from "@/components/ui/toast";

const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";

type Status = "idle" | "sending" | "success" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

const budgets = [
  "Under ₹25k",
  "₹25k – ₹75k",
  "₹75k – ₹2L",
  "₹2L+",
  "Not sure yet",
];

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    budget: budgets[0],
    message: "",
    company: "",
  });

  const update = (key: keyof typeof form) => (value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (key !== "company" && key !== "budget") {
      setErrors((current) => ({ ...current, [key]: undefined }));
    }
  };

  const validate = () => {
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = "Tell me your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      next.email = "A valid email so I can reply.";
    if (form.message.trim().length < 12)
      next.message = "A little more detail, please (12+ characters).";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const mailtoHref = () => {
    const subject = encodeURIComponent(`Project enquiry from ${form.name || "portfolio"}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nBudget: ${form.budget}\n\n${form.message}`,
    );
    return `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (form.company) return; // honeypot
    if (!validate()) return;

    if (!ACCESS_KEY) {
      window.location.href = mailtoHref();
      toast("Opening your email app…");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `Portfolio enquiry — ${form.name}`,
          from_name: "kangkanrajkhowa portfolio",
          name: form.name,
          email: form.email,
          budget: form.budget,
          message: form.message,
        }),
      });

      const data = (await response.json()) as { success?: boolean };
      if (!response.ok || !data.success) throw new Error("Submission failed");

      setStatus("success");
      toast("Message sent — thank you!");
      setForm({ name: "", email: "", budget: budgets[0], message: "", company: "" });
    } catch {
      setStatus("error");
      toast("Could not send — email me directly instead.");
    }
  };

  const fieldError = (key: keyof Errors) =>
    errors[key] ? (
      <p className="mt-1.5 text-[11px] text-danger" role="alert">
        {errors[key]}
      </p>
    ) : null;

  return (
    <section id="contact" className="section">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="eyebrow">07 — Contact</p>
            <h2 className="display mt-6 text-4xl md:text-5xl">
              Don&apos;t be shy.
              <br />
              Drop me a <span className="serif text-lime">line</span>.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
              Have a product to build, an old system to rescue, or an AI idea that
              needs a reality check? Send the details and I will reply with
              questions and an estimate — usually within two working days.
            </p>

            <div className="mt-10 space-y-1">
              <a
                href={`mailto:${profile.email}`}
                className="group flex items-center justify-between gap-4 border-b border-line py-4"
              >
                <span className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-lime" />
                  {profile.email}
                </span>
                <ArrowUpRight
                  size={16}
                  className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lime"
                />
              </a>
              <a
                href={`tel:${profile.phoneHref}`}
                className="group flex items-center justify-between gap-4 border-b border-line py-4"
              >
                <span className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-lime" />
                  {profile.phone}
                </span>
                <ArrowUpRight
                  size={16}
                  className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lime"
                />
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {socials.slice(0, 5).map((social) => {
                const Icon = socialIconMap[social.icon];
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={social.label}
                    className="inline-flex size-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-lime hover:text-lime"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>

            <div className="mt-10 rounded-2xl border border-line bg-panel/50 p-5">
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-muted">
                <span className="accent-dot" />
                {profile.availability}
              </p>
              <p className="mt-2 text-sm text-muted">
                Based in {profile.location} · IST (UTC+5:30) · remote-friendly
              </p>
            </div>
          </div>

          <div className="card p-6 md:p-8">
            {!ACCESS_KEY && (
              <p className="mb-5 rounded-xl border border-line bg-bg/60 px-4 py-3 text-[11px] leading-relaxed text-muted">
                The form is not connected to an inbox yet — submitting opens your
                email app with everything prefilled. (Set{" "}
                <code className="text-fg">NEXT_PUBLIC_WEB3FORMS_KEY</code> to
                enable direct delivery.)
              </p>
            )}

            {status === "success" ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <span className="grid size-14 place-items-center rounded-full bg-lime text-on-accent">
                  <Check size={24} />
                </span>
                <h3 className="display mt-6 text-2xl">Message sent.</h3>
                <p className="mt-2 max-w-xs text-sm text-muted">
                  Thank you — I will get back to you at the email you provided.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="btn btn-ghost btn-sm mt-6"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-xs text-muted">
                      Your name
                    </label>
                    <input
                      id="name"
                      name="name"
                      className="field"
                      value={form.name}
                      onChange={(event) => update("name")(event.target.value)}
                      aria-invalid={Boolean(errors.name)}
                      autoComplete="name"
                      placeholder="Kangkan"
                    />
                    {fieldError("name")}
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-xs text-muted">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="field"
                      value={form.email}
                      onChange={(event) => update("email")(event.target.value)}
                      aria-invalid={Boolean(errors.email)}
                      autoComplete="email"
                      placeholder="you@company.com"
                    />
                    {fieldError("email")}
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="budget" className="mb-1.5 block text-xs text-muted">
                    Budget range
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    className="field appearance-none"
                    value={form.budget}
                    onChange={(event) => update("budget")(event.target.value)}
                  >
                    {budgets.map((budget) => (
                      <option key={budget} value={budget}>
                        {budget}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4">
                  <label htmlFor="message" className="mb-1.5 block text-xs text-muted">
                    What are we building?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="field resize-none"
                    value={form.message}
                    onChange={(event) => update("message")(event.target.value)}
                    aria-invalid={Boolean(errors.message)}
                    placeholder="A store directory, an internal dashboard, an AI assistant for your team…"
                  />
                  {fieldError("message")}
                </div>

                <div className="hidden" aria-hidden="true">
                  <label htmlFor="company">Company</label>
                  <input
                    id="company"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.company}
                    onChange={(event) => update("company")(event.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60"
                  data-cursor
                >
                  {status === "sending" ? (
                    "Sending…"
                  ) : (
                    <>
                      {ACCESS_KEY ? "Send message" : "Compose email"}
                      <Send size={15} />
                    </>
                  )}
                </button>

                {status === "error" && (
                  <p className="mt-3 text-center text-[11px] text-danger" role="alert">
                    Something went wrong. Email{" "}
                    <a href={`mailto:${profile.email}`} className="underline">
                      {profile.email}
                    </a>{" "}
                    directly.
                  </p>
                )}

                <p className="mt-4 text-center text-[10px] text-muted">
                  No newsletters, no tracking, no CRM. Just email.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
