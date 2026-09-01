import type { SVGProps } from "react";

export type IconName =
  | "search"
  | "heart"
  | "bag"
  | "menu"
  | "close"
  | "chevron-down"
  | "chevron-right"
  | "arrow-right"
  | "arrow-up-right"
  | "plus"
  | "minus"
  | "compare"
  | "check"
  | "star"
  | "phone"
  | "mail"
  | "location"
  | "instagram"
  | "pinterest"
  | "facebook"
  | "filter"
  | "eye";

const PATHS: Record<IconName, React.ReactNode> = {
  search: (
    <path d="M21 21l-4.35-4.35m2.85-6.15A9 9 0 1 1 5 5.5a9 9 0 0 1 16.5 5Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  ),
  heart: (
    <path d="M12 20.5C7 16.2 3.5 13 3.5 9.2 3.5 6.6 5.4 5 7.8 5c1.7 0 3.3.9 4.2 2.3C12.9 5.9 14.5 5 16.2 5c2.4 0 4.3 1.6 4.3 4.2 0 3.8-3.5 7-8.5 11.3Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  ),
  bag: (
    <path d="M6 8h12l1 12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1L6 8Zm1 0a5 5 0 0 1 10 0" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  ),
  menu: (
    <path d="M4 8h16M4 16h16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  ),
  close: (
    <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  ),
  "chevron-down": (
    <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  ),
  "chevron-right": (
    <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  ),
  "arrow-right": (
    <path d="M4 12h16m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  ),
  "arrow-up-right": (
    <path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  ),
  plus: (
    <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  ),
  minus: (
    <path d="M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  ),
  compare: (
    <path d="M12 3a9 9 0 1 0 9 9M12 3v9h9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  ),
  check: (
    <path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  star: (
    <path d="M12 3.5 14.6 9l6 .7-4.5 4 1.3 6-5.4-3-5.4 3 1.3-6-4.5-4 6-.7L12 3.5Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  ),
  phone: (
    <path d="M5 4h4l1.5 4.5-2 1.5a12 12 0 0 0 6 6l1.5-2L20 15v4a1.5 1.5 0 0 1-1.6 1.5C10.3 20 4 13.7 3.5 5.6A1.5 1.5 0 0 1 5 4Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  ),
  mail: (
    <path d="M4 7h16v10H4V7Zm0 0 8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  ),
  location: (
    <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Zm0-8.5a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  ),
  instagram: (
    <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm6.5 5.5A3.7 3.7 0 1 0 12 15.6 3.7 3.7 0 0 0 13.5 8.5ZM17 6.8h.01" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  ),
  pinterest: (
    <path d="M12 3a9 9 0 0 0-3.2 17.4c-.08-.7-.15-1.8 0-2.6l1.3-5.3s-.3-.7-.3-1.6c0-1.5.9-2.6 2-2.6.9 0 1.4.7 1.4 1.5 0 .9-.6 2.3-.9 3.6-.2.9.6 1.8 1.6 1.8 1.9 0 3.3-2 3.3-4.9 0-2.5-1.8-4.3-4.4-4.3a4.6 4.6 0 0 0-4.8 4.6c0 .9.3 1.9.8 2.4l.1.1-.3 1.2c0 .2-.2.3-.4.2-1.3-.6-2.1-2.5-2.1-4 0-3.2 2.4-6.2 6.8-6.2 3.6 0 6.3 2.5 6.3 6 0 3.5-2.2 6.4-5.3 6.4-1 0-2-.5-2.4-1.2l-.6 2.5c-.2.8-.8 1.9-1.2 2.5A9 9 0 1 0 12 3Z" fill="currentColor" />
  ),
  facebook: (
    <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.6 1.6-1.6h1.3V4.8c-.2 0-1-.1-1.9-.1-1.9 0-3.2 1.2-3.2 3.3V11H8.5v3h2.8v7h2.2Z" fill="currentColor" />
  ),
  filter: (
    <path d="M4 6h16M7 12h10M10 18h4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  ),
  eye: (
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Zm9.5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  ),
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {PATHS[name]}
    </svg>
  );
}