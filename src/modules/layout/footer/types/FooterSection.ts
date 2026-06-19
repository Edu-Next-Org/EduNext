export type FooterLink = {
  title: string;
  href: string;
};

export type FooterSection = {
  heading: string;
  links?: FooterLink[];
  icons?: React.ReactNode[];
};
