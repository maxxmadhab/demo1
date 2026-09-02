import { useState } from "react";
import { Link } from "react-router-dom";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";

const EXPLORE_COLS = [
  { label: "Collections", to: "/catalog" },
  { label: "New Arrivals", to: "/catalog?sort=newest" },
  { label: "Best Sellers", to: "/catalog?sort=popular" },
  { label: "Rings", to: "/catalog?category=Rings" },
  { label: "Necklaces", to: "/catalog?category=Necklaces" },
  { label: "Bridal Jewelry", to: "/catalog?category=Bridal%20Jewelry" },
];

const CARE_COLS = [
  { label: "Contact", to: "/contact" },
  { label: "Shipping", to: "/contact" },
  { label: "Returns", to: "/contact" },
  { label: "FAQs", to: "/contact" },
];

const BRAND_COLS = [
  { label: "About", to: "/contact" },
  { label: "Craftsmanship", to: "/" },
  { label: "Journal", to: "/" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-charcoal text-ivory">
      {/* Newsletter */}
      <div className="border-b border-ivory/10">
        <div className="container-jwel py-16 lg:flex lg:items-end lg:justify-between lg:py-20">
          <div className="max-w-xl">
            <p className="font-body text-[0.68rem] font-medium uppercase tracking-[0.28em] text-champagne">
              The Editor's Letter
            </p>
            <h2 className="mt-3 font-display text-3xl font-medium leading-tight sm:text-4xl">
              Join the world of Budhram
            </h2>
            <p className="mt-3 font-body text-sm font-light leading-relaxed text-ivory/60">
              Receive private previews, stories from the atelier, and invitations to
              collections before they are released.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 lg:mt-0 lg:w-[26rem]">
            <div className="flex border-b border-ivory/25 pb-2 transition-colors duration-300 focus-within:border-champagne">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-transparent font-body text-sm font-light text-ivory placeholder:text-ivory/40 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="flex items-center gap-2 font-body text-[0.68rem] font-medium uppercase tracking-[0.2em] text-champagne transition-colors duration-300 hover:text-ivory"
              >
                {subscribed ? (
                  <>
                    <Icon name="check" size={15} /> Subscribed
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>
            </div>
            {subscribed && (
              <p className="mt-3 font-body text-xs font-light text-champagne" role="status">
                Thank you — welcome to the maison.
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Link columns */}
      <div className="container-jwel grid grid-cols-2 gap-10 py-14 sm:grid-cols-4 lg:grid-cols-5 lg:py-16">
        <div className="col-span-2 !mb-0 sm:col-span-4 lg:col-span-1">
          <Logo className="[&_span]:!text-ivory" />
          <p className="mt-4 font-body text-xs font-light leading-relaxed text-ivory/55">
            A maison of fine jewellery, crafted for moments that matter.
          </p>
          <div className="mt-6 flex items-center gap-3">
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
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory/15 text-ivory/70 transition-all duration-300 hover:border-champagne hover:text-champagne"
              >
                <Icon name={icon} size={15} />
              </a>
            ))}
          </div>
        </div>

        <FooterColumn title="Explore" links={EXPLORE_COLS} />
        <FooterColumn title="Customer Care" links={CARE_COLS} />
        <FooterColumn title="Brand" links={BRAND_COLS} />

        <div className="col-span-2 sm:col-span-4 lg:col-span-1">
          <h3 className="font-body text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-ivory/70">
            Client services
          </h3>
          <ul className="mt-5 space-y-3 font-body text-xs font-light text-ivory/60">
            <li>
              <a href={`tel:${siteConfig.phone}`} className="transition-colors hover:text-champagne">
                {siteConfig.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-champagne">
                {siteConfig.email}
              </a>
            </li>
            <li className="leading-relaxed">
              {siteConfig.address}
              <br />
              {siteConfig.city}
            </li>
            <li className="pt-1">{siteConfig.hours}</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ivory/10">
        <div className="container-jwel flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <p className="font-body text-[0.65rem] font-light text-ivory/40">
            © {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved.
          </p>
          <p className="font-body text-[0.65rem] font-light text-ivory/40">
            Fine jewellery · {siteConfig.city}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h3 className="font-body text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-ivory/70">
        {title}
      </h3>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              className="font-body text-xs font-light text-ivory/60 transition-colors duration-300 hover:text-champagne"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
