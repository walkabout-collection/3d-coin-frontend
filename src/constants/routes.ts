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
    title: "SIGN IN",
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
  DESIGN_SUMMARY: {
    title: "Design Summary",
    path: "/design-summary",
    metaTitle: "Legacy Forge | Design Summary",
    description:
      "Review and manage your custom coin designs with Legacy Forge.",
  },
  DASHBOARD : {
    title: "Dashboard",
    path: "/dashboard",
    metaTitle: "Legacy Forge | Dashboard",
    description:
      "Access your account dashboard to manage your custom coin designs and orders.",
  },
  ORDERS : {
    title: "Orders",
    path: "/dashboard/orders",
    metaTitle: "Legacy Forge | Orders",
    description:
      "Review and manage your custom coin orders with Legacy Forge.",
  },
  QUOTES : {
    title: "Quotes",
    path: "/dashboard/quotes",
    metaTitle: "Legacy Forge | Quotes",
    description:
      "Review and manage your custom coin quotes with Legacy Forge.",
  },
  PAYMENT_METHOD : {
    title: "Payment Method",
    path: "/dashboard/payment-method",
    metaTitle: "Legacy Forge | Payment Method",
    description:
      "Manage your payment methods with Legacy Forge.",
  },
  PAYMENT_HISTORY : {
    title: "Payment History",
    path: "/dashboard/payment-history",
    metaTitle: "Legacy Forge | Payment History",
    description:
      "Review your payment history with Legacy Forge.",
  },
  ACCOUNT_SETTING : {
    title: "Account Setting",
    path: "/dashboard/account-setting",
    metaTitle: "Legacy Forge | Account Setting",
    description:
      "Manage your account settings with Legacy Forge.",    
  },
  TRACKING : {
    title: "Tracking",
    path: "/dashboard/tracking",
    metaTitle: "Legacy Forge | Tracking",
    description:
      "Track your custom coin orders with Legacy Forge.",
  },
    STANDARD: {
    title: "Standard Builder",
    path: "/standard-builder",
    metaTitle: "Legacy Forge | Standard 3D Coin Builder",
    description:
      "Build a classic round coin with Legacy Forge’s Standard 3D Builder and real-time previews.",
    },
      DIMENSIONS: {
        title: "Dimensions",
        path: "/standard-builder/dimensions",
        metaTitle: "Legacy Forge | Coin Dimensions",
        description:
          "Choose coin diameter and thickness for your custom coin design.",
      },
      MATERIAL: {
        title: "Material",
        path: "/standard-builder/material",
        metaTitle: "Legacy Forge | Coin Materials",
        description:
          "Select from premium materials to craft your custom coin.",
      },
      EDGE_TYPE: {
        title: "Edge Type",
        path: "/standard-builder/edge-type",
        metaTitle: "Legacy Forge | Coin Edge Types",
        description:
          "Pick the perfect edge style to enhance your coin’s design.",
      },
      TEXT_RINGS: {
        title: "Text Rings",
        path: "/standard-builder/text-rings",
        metaTitle: "Legacy Forge | Coin Text Rings",
        description:
          "Add custom text rings around your coin for personalization.",
      },
      ARTWORK: {
        title: "Artwork",
        path: "/standard-builder/artwork",
        metaTitle: "Legacy Forge | Coin Artwork",
        description:
          "Upload or choose artwork to be engraved on your coin.",
      },
  

} as const;

export const adminRoutes = {
  DASHBOARD: {
    title: "Dashboard",
    path: "/admin/dashboard",
    metaTitle: "Legacy Forge | Dashboard",
    description:
      "Access your account dashboard to manage your custom coin designs and orders.",
  },
  ORDERS: {
    title: "Orders",
    path: "/admin/orders",
    metaTitle: "Legacy Forge | Orders",
    description:
      "Review and manage your custom coin orders with Legacy Forge.",
  },
  QUOTES: {
    title: "Quotes",
    path: "/admin/quotes",
    metaTitle: "Legacy Forge | Quotes",
    description:
      "Review and manage your custom coin quotes with Legacy Forge.",
  },
  PAYMENT_METHOD: {
    title: "Payment Method",
    path: "/admin/payment-method",
    metaTitle: "Legacy Forge | Payment Method",
    description:
      "Manage your payment methods with Legacy Forge.",
  },
  PAYMENT_HISTORY: {
    title: "Payment History",
    path: "/admin/payment-history",
    metaTitle: "Legacy Forge | Payment History",
    description:
      "Review your payment history with Legacy Forge.",
  },
  ACCOUNT_SETTING: {
    title: "Account Setting",
    path: "/admin/account-setting",
    metaTitle: "Legacy Forge | Account Setting",
    description:
      "Manage your account settings with Legacy Forge.",
  },
  TRACKING: {
    title: "Tracking",
    path: "/admin/tracking",
    metaTitle: "Legacy Forge | Tracking",
    description:
      "Track your custom coin orders with Legacy Forge.",
  },
} as const;



