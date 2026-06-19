import { Facebook, Linkedin, Twitter, Youtube } from "lucide-react";
import FooterSections from "../Components/FooterSections";
const footerData = [
  {
    heading: "Popular Courses",
    links: [
      { title: "Web Development", href: "#" },
      { title: "Data Science", href: "#" },
      { title: "Graphic Design", href: "#" },
      { title: "Digital Marketing", href: "#" },
    ],
  },
  {
    heading: "Quick Links",
    links: [
      { title: "About Us", href: "/about" },
      { title: "Pricing", href: "/pricing" },
      { title: "FAQ", href: "/faq" },
      { title: "Contact", href: "/contactUs" },
    ],
  },
  {
    heading: "Follow Us",
    icons: [
      <Facebook key="fb" />,
      <Twitter key="tw" />,
      <Youtube key="yt" />,
      <Linkedin key="in" />,
    ],
  },
];
function Footer() {
  return (
    <FooterSections
      sections={footerData}
      copyright={`© ${new Date().getFullYear()} EduNext. All rights reserved.`}
    />
  );
}

export default Footer;
