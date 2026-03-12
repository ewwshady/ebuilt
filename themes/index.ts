// Central theme registry - import themes here
import * as beautyTest from './beauty-test';

import * as bookshop from './bookshop';
import * as electronics from './electronics';

export type ThemeId = 'beauty-test' | 'xosmetics' | 'bookshop' | 'electronics';

export interface ThemeMetadata {
  id: ThemeId;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  version: string;
}

export interface ThemeComponents {
  Header: React.ComponentType<any>;
  ProductCard: React.ComponentType<any>;
  Footer: React.ComponentType<any>;
  CartSidebar: React.ComponentType<any>;
  CheckoutForm: React.ComponentType<any>;
  ThemeLayout: React.ComponentType<any>;
}

// Theme registry mapping
const themeRegistry: Record<ThemeId, { metadata: ThemeMetadata; components: ThemeComponents }> = {
  'beauty-test': {
    metadata: beautyTest.themeMetadata,
    components: {
      Header: beautyTest.Header,
      ProductCard: beautyTest.ProductCard,
      Footer: beautyTest.Footer,
      CartSidebar: beautyTest.CartSidebar,
      CheckoutForm: beautyTest.CheckoutForm,
      ThemeLayout: beautyTest.ThemeLayout,
    },
  },

  'bookshop': {
    metadata: bookshop.themeMetadata,
    components: {
      Header: bookshop.Header,
      ProductCard: bookshop.ProductCard,
      Footer: bookshop.Footer,
      CartSidebar: bookshop.CartSidebar,
      CheckoutForm: bookshop.CheckoutForm,
      ThemeLayout: bookshop.ThemeLayout,
    },
  },

  'electronics': {
    metadata: electronics.themeMetadata,
    components: {
      Header: electronics.Header,
      ProductCard: electronics.ProductCard,
      Footer: electronics.Footer,
      CartSidebar: electronics.CartSidebar,
      CheckoutForm: electronics.CheckoutForm,
      ThemeLayout: electronics.ThemeLayout,
    },
  },
};

/**
 * Get theme components by theme ID
 * Usage: const theme = getTheme('beauty-test')
 */
export function getTheme(themeId: ThemeId | string) {
  const theme = themeRegistry[themeId as ThemeId];
  if (!theme) {
    throw new Error(`Theme "${themeId}" not found in registry`);
  }
  return theme;
}

/**
 * Get all available themes
 */
export function getAllThemes() {
  return Object.entries(themeRegistry).map(([id, { metadata }]) => ({
    id,
    ...metadata,
  }));
}

/**
 * Check if a theme exists
 */
export function themeExists(themeId: string): themeId is ThemeId {
  return themeId in themeRegistry;
}

export { themeRegistry };
export default themeRegistry;
