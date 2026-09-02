export interface ContactConfig {
  brandName: string;
  tagline: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  address: string;
  city: string;
  social: {
    instagram: string;
    pinterest: string;
    facebook: string;
  };
  hours: string;
}

/**
 * Central brand + contact configuration.
 * Update business contact details here so they propagate everywhere.
 */
export const siteConfig = {
  brandName: "Budhram",
  tagline: "Fine Jewelry Maison",
  phone: "7489872020",
  phoneDisplay: "7489872020",
  email: "om@gmail.com",
  address: "12, Heritage Lane, Connaught Place",
  city: "New Delhi, India 110001",
  social: {
    instagram: "https://instagram.com/budhram",
    pinterest: "https://pinterest.com/budhram",
    facebook: "https://facebook.com/budhram",
  },
  hours: "Mon – Sat · 10:00 AM – 8:00 PM",
} satisfies ContactConfig;
