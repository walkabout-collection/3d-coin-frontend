import { routes } from "@/src/constants/routes";

export const navLinks = [
  // {
  //   title: routes.ABOUT_US.title,
  //   href: routes.ABOUT_US.path,
  // },
  {
    title: routes.CONTACT_US.title,
    href: routes.CONTACT_US.path,
  },
  {
    title: routes.SERVICES.title,
    href: routes.SERVICES.path,
  },
  // {
  //   title: routes.BLOGS.title,
  //   href: routes.BLOGS.path,
  // },
  // {
  //   title: routes.PRICING.title,
  //   href: routes.PRICING.path,
  // },
];

export const navLinksAuth = [
  {
    title: routes.SIGNUP.title,
    href: routes.SIGNUP.path,
    variant: "primary",
    size: "sm",
  },
  {
    title: routes.LOGIN.title,
    href: routes.LOGIN.path,
    variant: "secondary",
    size: "sm",
  },
];
