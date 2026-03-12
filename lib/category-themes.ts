export type CategoryTheme = {
  name: string
  description: string
  defaultColors: {
    primary: string
    secondary: string
  }
  heroStyle: "gradient" | "image" | "solid"
  features: {
    icon: string
    title: string
    description: string
  }[]
}

export const categoryThemes: Record<string, CategoryTheme> = {
  beauty: {
    name: "Beauty & Cosmetics",
    description: "Elegant and luxurious designs for beauty products",
    defaultColors: {
      primary: "#E91E63",
      secondary: "#FF4081",
    },
    heroStyle: "gradient",
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
  },
  electronics: {
    name: "Electronics",
    description: "Modern and tech-focused design",
    defaultColors: {
      primary: "#2196F3",
      secondary: "#00BCD4",
    },
    heroStyle: "gradient",
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
  },
  pharmacy: {
    name: "Pharmacy & Healthcare",
    description: "Clean and trustworthy medical theme",
    defaultColors: {
      primary: "#4CAF50",
      secondary: "#8BC34A",
    },
    heroStyle: "solid",
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
  },
  clothes: {
    name: "Fashion & Clothing",
    description: "Stylish and trendy fashion designs",
    defaultColors: {
      primary: "#9C27B0",
      secondary: "#E040FB",
    },
    heroStyle: "image",
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
  },
  books: {
    name: "Books & Literature",
    description: "Classic and readable bookstore design",
    defaultColors: {
      primary: "#795548",
      secondary: "#FF6F00",
    },
    heroStyle: "solid",
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
  },
  general: {
    name: "General Store",
    description: "Versatile design for any product type",
    defaultColors: {
      primary: "#3F51B5",
      secondary: "#FF5722",
    },
    heroStyle: "gradient",
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
  },
}

export function getCategoryTheme(category?: string): CategoryTheme {
  return categoryThemes[category || "general"] || categoryThemes.general
}
