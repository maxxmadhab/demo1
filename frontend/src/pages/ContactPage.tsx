import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";

interface FormState {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
}

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  interest: "",
  message: "",
};

const INTERESTS = [
  "Bridal & bespoke",
  "Rings",
  "Necklaces",
  "Earrings",
  "Bracelets & more",
  "Private appointment",
];

const CONTACT_CARDS: { icon: IconName; title: string; lines: string[]; href?: string }[] = [
  {
    icon: "phone",
    title: "Call the maison",
    lines: [siteConfig.phone],
    href: `tel:${siteConfig.phone}`,
  },
  {
    icon: "mail",
    title: "Write to us",
    lines: [siteConfig.email],
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: "location",
    title: "Visit the atelier",
    lines: [siteConfig.address, siteConfig.city, siteConfig.hours],
  },
];

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const enquiryProduct = searchParams.get("product")?.trim() ?? "";

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!enquiryProduct) return;
    setForm((f) => ({
      ...f,
      message: `Hi, I'd like to enquire about the ${enquiryProduct}. Could you share more details on availability and pricing?`,
    }));
  }, [enquiryProduct]);

  const update = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-16 lg:pt-20">
      {/* Header */}
      <section className="container-jwel pb-10 pt-10 sm:pt-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-body text-[0.65rem] font-medium uppercase tracking-[0.28em] text-gold-deep">
            Client services
          </p>
          <h1 className="mt-2 font-display text-4xl font-medium leading-[1.05] text-charcoal sm:text-5xl lg:text-6xl">
            Contact
          </h1>
          <p className="mt-4 max-w-xl font-body text-[0.92rem] font-light leading-relaxed text-stone">
            For appointments, bridal consultations, bespoke commissions and aftercare,
            our atelier team would be delighted to hear from you.
          </p>
        </motion.div>
      </section>

      {/* Enquiry context banner */}
      {enquiryProduct && (
        <section className="container-jwel pb-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center justify-between gap-4 border border-gold/40 bg-gold/10 px-6 py-5"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold-deep">
                <Icon name="mail" size={18} />
              </span>
              <div>
                <p className="font-body text-[0.62rem] font-medium uppercase tracking-[0.22em] text-gold-deep">
                  Product enquiry
                </p>
                <p className="font-display text-lg font-medium leading-snug text-charcoal">
                  Enquiring about “{enquiryProduct}”
                </p>
              </div>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 font-body text-[0.65rem] font-medium uppercase tracking-[0.18em] text-stone underline underline-offset-4 transition-colors hover:text-charcoal"
            >
              <Icon name="close" size={12} /> Clear enquiry
            </Link>
          </motion.div>
        </section>
      )}

      {/* Contact cards */}
      <section className="container-jwel grid grid-cols-1 gap-4 pb-14 sm:grid-cols-3">
        {CONTACT_CARDS.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
            className="border border-charcoal/10 bg-white/40 p-7"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/35 text-gold-deep">
              <Icon name={card.icon} size={18} />
            </span>
            <h2 className="mt-5 font-display text-xl font-medium text-charcoal">{card.title}</h2>
            <div className="mt-2 space-y-1">
              {card.lines.map((line) =>
                card.href ? (
                  <a
                    key={line}
                    href={card.href}
                    className="block font-body text-sm font-light text-charcoal/75 underline-offset-4 transition-colors hover:text-gold-deep hover:underline"
                  >
                    {line}
                  </a>
                ) : (
                  <p key={line} className="font-body text-sm font-light text-charcoal/75">
                    {line}
                  </p>
                )
              )}
            </div>
          </motion.div>
        ))}
      </section>

      {/* Form + social */}
      <section className="container-jwel grid grid-cols-1 gap-12 pb-24 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="border border-charcoal/10 bg-white/40 p-7 sm:p-10"
          >
            <h2 className="font-display text-2xl font-medium text-charcoal">
              Send us a note
            </h2>
            <p className="mt-2 font-body text-sm font-light text-stone">
              A member of our atelier will respond within one working day.
            </p>

            {submitted ? (
              <div className="mt-10 flex flex-col items-center gap-4 py-10 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/20 text-gold-deep">
                  <Icon name="check" size={22} />
                </span>
                <h3 className="font-display text-2xl font-medium text-charcoal">Thank you, {form.name.split(" ")[0] || "friend"}.</h3>
                <p className="max-w-sm font-body text-sm font-light text-stone">
                  Your note has been received. We'll be in touch at {form.email || siteConfig.email}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForm(INITIAL_FORM);
                    setSubmitted(false);
                  }}
                  className="mt-2 font-body text-[0.68rem] font-medium uppercase tracking-[0.18em] text-gold-deep underline underline-offset-4"
                >
                  Send another note
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Full name" htmlFor="contact-name">
                    <input
                      id="contact-name"
                      required
                      value={form.name}
                      onChange={update("name")}
                      className={inputCls}
                      placeholder="Jane Doe"
                      autoComplete="name"
                    />
                  </Field>
                  <Field label="Email" htmlFor="contact-email">
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={update("email")}
                      className={inputCls}
                      placeholder="you@email.com"
                      autoComplete="email"
                    />
                  </Field>
                </div>

                <Field label="Phone (optional)" htmlFor="contact-phone">
                  <input
                    id="contact-phone"
                    type="tel"
                    value={form.phone}
                    onChange={update("phone")}
                    className={inputCls}
                    placeholder="+91 …"
                    autoComplete="tel"
                  />
                </Field>

                <Field label="I'm interested in" htmlFor="contact-interest">
                  <select
                    id="contact-interest"
                    value={form.interest}
                    onChange={update("interest")}
                    className={inputCls}
                  >
                    <option value="">Select a topic</option>
                    {INTERESTS.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Your message" htmlFor="contact-message">
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={update("message")}
                    className={`${inputCls} resize-none`}
                    placeholder="Tell us about the moment you have in mind…"
                  />
                </Field>

                <div className="flex flex-col items-start gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
                  <Button type="submit" variant="primary">
                    {enquiryProduct ? "Send enquiry" : "Send message"} <Icon name="arrow-right" size={14} />
                  </Button>
                  <p className="font-body text-[0.68rem] font-light text-stone">
                    Frontend demo — no email is sent yet.
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>

        {/* Side column — social + map placeholder */}
        <div className="space-y-6 lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="border border-charcoal/10 bg-white/40 p-7"
          >
            <h2 className="font-display text-xl font-medium text-charcoal">Follow the maison</h2>
            <p className="mt-2 font-body text-sm font-light text-stone">
              Private previews, atelier stories and the occasional behind-the-scenes.
            </p>
            <div className="mt-5 flex gap-3">
              {(
                [
                  ["instagram", siteConfig.social.instagram, "Instagram"],
                  ["pinterest", siteConfig.social.pinterest, "Pinterest"],
                  ["facebook", siteConfig.social.facebook, "Facebook"],
                ] as const
              ).map(([icon, href, label]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/20 text-charcoal/75 transition-all duration-300 hover:border-gold-deep hover:text-gold-deep"
                >
                  <Icon name={icon} size={17} />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="relative aspect-[4/3] border border-charcoal/10 bg-sand"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_center,rgba(217,198,165,0.35),transparent_65%)] text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-gold-deep">
                <Icon name="location" size={19} />
              </span>
              <p className="px-8 font-display text-lg font-medium text-charcoal">
                {siteConfig.city}
              </p>
              <p className="px-8 font-body text-xs font-light text-stone">
                Atelier map — coming soon
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

const inputCls =
  "w-full border-b border-charcoal/20 bg-transparent py-3 font-body text-sm font-light text-charcoal placeholder:text-stone/45 transition-colors duration-300 focus:border-gold-deep focus:outline-none";

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block font-body text-[0.66rem] font-medium uppercase tracking-[0.18em] text-stone">
        {label}
      </label>
      {children}
    </div>
  );
}