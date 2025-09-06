export const routes = {
  HOME: {
    title: "Home",
    path: "/",
    metaTitle: "Legacy Forge | Custom 3D Coins",
    description:
      "Design and build your coins with Legacy Forge’s 3D builder. Preserve your legacy forever with custom-crafted coins.",
    ogImage: "/images/homepage/opengraph-image.png",
    twitter: {
      card: "summary_large_image",
      title: "Legacy Forge | Custom 3D Coins",
      description:
        "Create personalized 3D coins with Legacy Forge’s online builder. Unique designs, premium materials, built to last.",
      image: "/images/homepage/twitter-image.png",
    },
  },
  PRICING: {
    title: "Pricing",
    path: "/pricing",
    metaTitle: "Legacy Forge | Affordable Custom Coin Pricing Plans",
    description:
      "Explore Legacy Forge’s transparent pricing plans for custom coins. Choose dimensions, materials, and finishes that fit your needs.",
  },
  CONTACT_US: {
    title: "Contact Us",
    path: "/contact-us",
    metaTitle: "Legacy Forge | Contact Our Team",
    description:
      "Have questions about designing your coin? Get in touch with Legacy Forge for expert support and design assistance.",
  },
  SIGNUP: {
    title: "REGISTER",
    path: "/signup",
    metaTitle: "Legacy Forge | Create Your Account",
    description:
      "Sign up to start designing your custom coin with Legacy Forge’s 3D builder.",
  },
  LOGIN: {
    title: "SIGN In",
    path: "/login",
    metaTitle: "Legacy Forge | Login to Your Account",
    description:
      "Log in to your Legacy Forge account to access your saved coin designs and continue your custom orders.",
  },
  DESIGN_TEAM: {
    title: "Go Direct with Design Team",
    path: "/design-team",
    metaTitle: "Legacy Forge | Collaborate with Our Design Team",
    description:
      "Work directly with Legacy Forge’s expert designers to create 100% custom coins tailored to your vision.",
  },
  STANDARD: {
    title: "Standard Builder",
    path: "/standard-builder",
    metaTitle: "Legacy Forge | Standard 3D Coin Builder",
    description:
      "Build a classic round coin with Legacy Forge’s Standard 3D Builder and real-time previews.",
  },
  CUSTOM_SHAPES: {
    title: "Custom Shapes",
    path: "/custom-shapes",
    metaTitle: "Legacy Forge | AI-Powered Custom Shape Coin Generator",
    description:
      "Generate unique coin shapes and styles with Legacy Forge’s AI-powered Custom Shape Builder.",
  },
  BLOGS: {
    title: "Blogs",
    path: "/blogs",
    metaTitle: "Legacy Forge | Blog",
    description:
      "Read the latest articles on coin design, industry trends, and tips from the Legacy Forge team.",
  },    
  ABOUT_US: {
    title: "About Us",
    path: "/about-us",
    metaTitle: "Legacy Forge | About Us",
    description:
      "Learn more about Legacy Forge’s mission to provide high-quality custom coins and exceptional customer service.",
  },
  SERVICES: {
    title: "Services",
    path: "/services",
    metaTitle: "Legacy Forge | Our Services",
    description:
      "Discover the range of services offered by Legacy Forge, including custom coin design, manufacturing, and more.",
  },

} as const;
