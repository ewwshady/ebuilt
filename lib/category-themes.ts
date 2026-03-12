export type CategoryTheme = {
  id: string
  name: string
  description: string
  category: string
  defaultColors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  heroStyle: "gradient" | "image" | "solid"
  layout: "modern" | "classic" | "minimal"
  typography: {
    headingFont: string
    bodyFont: string
  }
  features: {
    icon: string
    title: string
    description: string
  }[]
  showcase?: {
    style: "grid" | "carousel" | "list"
    itemsPerRow: number
  }
}

export const categoryThemes: Record<string, CategoryTheme> = {
  beauty: {
    id: "beauty",
    name: "Beauty & Cosmetics",
    description: "Elegant and luxurious designs for beauty products",
    category: "beauty",
    defaultColors: {
      primary: "#E91E63",
      secondary: "#FF4081",
      accent: "#FCE4EC",
      background: "#FAFAFA",
      text: "#212121",
    },
    heroStyle: "gradient",
    layout: "modern",
    typography: {
      headingFont: "Playfair Display, serif",
      bodyFont: "Inter, sans-serif",
    },
    features: [
      {
        icon: "sparkles",
        title: "Premium Quality",
        description: "Carefully selected beauty products",
      },
      {
        icon: "shield",
        title: "Authentic Products",
        description: "100% genuine and certified items",
      },
      {
        icon: "truck",
        title: "Fast Delivery",
        description: "Quick and secure shipping",
      },
    ],
    showcase: {
      style: "grid",
      itemsPerRow: 3,
    },
  },
  electronics: {
    id: "electronics",
    name: "Electronics",
    description: "Modern and tech-focused design",
    category: "electronics",
    defaultColors: {
      primary: "#2196F3",
      secondary: "#00BCD4",
      accent: "#B3E5FC",
      background: "#F5F5F5",
      text: "#1A1A1A",
    },
    heroStyle: "gradient",
    layout: "modern",
    typography: {
      headingFont: "Roboto, sans-serif",
      bodyFont: "Roboto, sans-serif",
    },
    features: [
      {
        icon: "zap",
        title: "Latest Technology",
        description: "Cutting-edge electronics and gadgets",
      },
      {
        icon: "award",
        title: "Warranty Included",
        description: "All products come with manufacturer warranty",
      },
      {
        icon: "headphones",
        title: "Expert Support",
        description: "Technical assistance available 24/7",
      },
    ],
    showcase: {
      style: "grid",
      itemsPerRow: 4,
    },
  },
  pharmacy: {
    id: "pharmacy",
    name: "Pharmacy & Healthcare",
    description: "Clean and trustworthy medical theme",
    category: "pharmacy",
    defaultColors: {
      primary: "#4CAF50",
      secondary: "#8BC34A",
      accent: "#C8E6C9",
      background: "#FAFAFA",
      text: "#1B5E20",
    },
    heroStyle: "solid",
    layout: "classic",
    typography: {
      headingFont: "Lora, serif",
      bodyFont: "Open Sans, sans-serif",
    },
    features: [
      {
        icon: "shield-check",
        title: "Licensed Pharmacy",
        description: "Certified and regulated medications",
      },
      {
        icon: "clock",
        title: "24/7 Available",
        description: "Round-the-clock service and support",
      },
      {
        icon: "user-check",
        title: "Expert Consultation",
        description: "Professional healthcare advice",
      },
    ],
    showcase: {
      style: "grid",
      itemsPerRow: 3,
    },
  },
  clothes: {
    id: "clothes",
    name: "Fashion & Clothing",
    description: "Stylish and trendy fashion designs",
    category: "clothes",
    defaultColors: {
      primary: "#9C27B0",
      secondary: "#E040FB",
      accent: "#E1BEE7",
      background: "#FAFAFA",
      text: "#2C1A4A",
    },
    heroStyle: "image",
    layout: "modern",
    typography: {
      headingFont: "Poppins, sans-serif",
      bodyFont: "Inter, sans-serif",
    },
    features: [
      {
        icon: "shirt",
        title: "Latest Trends",
        description: "Fashion-forward clothing collection",
      },
      {
        icon: "refresh",
        title: "Easy Returns",
        description: "30-day hassle-free return policy",
      },
      {
        icon: "percent",
        title: "Seasonal Sales",
        description: "Regular discounts and special offers",
      },
    ],
    showcase: {
      style: "carousel",
      itemsPerRow: 2,
    },
  },
  books: {
    id: "books",
    name: "Books & Literature",
    description: "Classic and readable bookstore design",
    category: "books",
    defaultColors: {
      primary: "#795548",
      secondary: "#FF6F00",
      accent: "#FFCC80",
      background: "#F5F5F5",
      text: "#3E2723",
    },
    heroStyle: "solid",
    layout: "classic",
    typography: {
      headingFont: "Georgia, serif",
      bodyFont: "Merriweather, serif",
    },
    features: [
      {
        icon: "book-open",
        title: "Vast Collection",
        description: "Thousands of titles across all genres",
      },
      {
        icon: "bookmark",
        title: "Curated Selection",
        description: "Expert-picked recommendations",
      },
      {
        icon: "gift",
        title: "Gift Wrapping",
        description: "Complimentary gift wrap service",
      },
    ],
    showcase: {
      style: "grid",
      itemsPerRow: 3,
    },
  },
  general: {
    id: "general",
    name: "General Store",
    description: "Versatile design for any product type",
    category: "general",
    defaultColors: {
      primary: "#3F51B5",
      secondary: "#FF5722",
      accent: "#E8EAF6",
      background: "#FAFAFA",
      text: "#212121",
    },
    heroStyle: "gradient",
    layout: "modern",
    typography: {
      headingFont: "Montserrat, sans-serif",
      bodyFont: "Lato, sans-serif",
    },
    features: [
      {
        icon: "shopping-bag",
        title: "Wide Selection",
        description: "Diverse range of quality products",
      },
      {
        icon: "dollar-sign",
        title: "Best Prices",
        description: "Competitive pricing guaranteed",
      },
      {
        icon: "truck",
        title: "Fast Shipping",
        description: "Quick delivery to your door",
      },
    ],
    showcase: {
      style: "grid",
      itemsPerRow: 4,
    },
  },
}

export function getCategoryTheme(category?: string): CategoryTheme {
  return categoryThemes[category || "general"] || categoryThemes.general
}
