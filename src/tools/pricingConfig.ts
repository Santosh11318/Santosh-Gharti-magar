/**
 * Centralized Website Pricing Configuration
 * Easily update base prices, per-page rates, and feature add-on costs here.
 * Currency can be adjusted (defaults to INR ₹, with USD / NPR conversions).
 */

export interface PricingConfig {
  currencySymbol: string;
  currencyCode: string;
  businessTypeBase: Record<string, { basePrice: number; baseDays: number; recommendedPackage: string; description: string }>;
  pagePricing: Record<string, { multiplier: number; extraPrice: number; extraDays: number }>;
  featurePricing: Record<string, { price: number; extraDays: number; label: string; icon: string; category: string }>;
}

export const WEBSITE_PRICING_CONFIG: PricingConfig = {
  currencySymbol: '₹',
  currencyCode: 'INR',

  businessTypeBase: {
    'Restaurant': {
      basePrice: 4999,
      baseDays: 4,
      recommendedPackage: 'Business Growth Suite',
      description: 'Online food menu, table reservation inquiry, location map, and Instagram feed integration.'
    },
    'Clinic': {
      basePrice: 5999,
      baseDays: 5,
      recommendedPackage: 'Professional Medical Suite',
      description: 'Doctor profiles, appointment booking request system, services breakdown, and patient trust badges.'
    },
    'Hotel': {
      basePrice: 7999,
      baseDays: 6,
      recommendedPackage: 'Hospitality & Booking Tier',
      description: 'Room showcase, visual gallery, direct WhatsApp reservation, amenities list, and Google Map directions.'
    },
    'Real Estate': {
      basePrice: 8999,
      baseDays: 7,
      recommendedPackage: 'Real Estate Authority Tier',
      description: 'Property listings, high-res photo gallery, lead capture forms, and virtual tour links.'
    },
    'Ecommerce': {
      basePrice: 11999,
      baseDays: 9,
      recommendedPackage: 'Full E-Commerce Engine',
      description: 'Product catalog, shopping cart, online payment gateway (UPI/Razorpay/Stripe), and order tracking.'
    },
    'Freelancer': {
      basePrice: 3499,
      baseDays: 3,
      recommendedPackage: 'Personal Portfolio Starter',
      description: 'Sleek portfolio showcase, skills matrix, client testimonials, and WhatsApp contact link.'
    },
    'Agency': {
      basePrice: 6999,
      baseDays: 5,
      recommendedPackage: 'Digital Agency Showcase',
      description: 'Case studies, service bento grid, team member bios, pricing tiers, and lead generation funnel.'
    },
    'Local Business': {
      basePrice: 3999,
      baseDays: 3,
      recommendedPackage: 'Local SEO Business Page',
      description: 'Google Maps integration, click-to-call, service area details, and customer review showcases.'
    },
    'Other': {
      basePrice: 4499,
      baseDays: 4,
      recommendedPackage: 'Custom Tailored Solution',
      description: 'Customized web development tailored to your exact business specifications and target market.'
    }
  },

  pagePricing: {
    '1': { multiplier: 1.0, extraPrice: 0, extraDays: 0 },
    '3–5': { multiplier: 1.25, extraPrice: 1500, extraDays: 2 },
    '6–10': { multiplier: 1.6, extraPrice: 3500, extraDays: 4 },
    '10+': { multiplier: 2.1, extraPrice: 6500, extraDays: 6 }
  },

  featurePricing: {
    'whatsapp': {
      price: 0, // Free included bonus
      extraDays: 0,
      label: 'Direct WhatsApp Chat Widget',
      icon: 'MessageCircle',
      category: 'Lead Capture'
    },
    'contact_form': {
      price: 500,
      extraDays: 0,
      label: 'Custom Contact & Inquiry Form',
      icon: 'Mail',
      category: 'Lead Capture'
    },
    'booking_system': {
      price: 2000,
      extraDays: 2,
      label: 'Interactive Booking / Appointment Form',
      icon: 'Calendar',
      category: 'Automation'
    },
    'google_maps': {
      price: 400,
      extraDays: 0,
      label: 'Google Maps Interactive Location',
      icon: 'MapPin',
      category: 'Local SEO'
    },
    'gallery': {
      price: 800,
      extraDays: 1,
      label: 'High-Res Filterable Image Gallery',
      icon: 'Image',
      category: 'Visuals'
    },
    'blog': {
      price: 1800,
      extraDays: 2,
      label: 'SEO Blog System & CMS Reader',
      icon: 'FileText',
      category: 'Content'
    },
    'seo': {
      price: 1500,
      extraDays: 1,
      label: 'On-Page SEO Optimization & Schema Markup',
      icon: 'Search',
      category: 'Marketing'
    },
    'payment_gateway': {
      price: 2500,
      extraDays: 2,
      label: 'UPI / Credit Card Payment Gateway Integration',
      icon: 'CreditCard',
      category: 'E-commerce'
    },
    'ecommerce': {
      price: 4000,
      extraDays: 4,
      label: 'Product Catalog & Shopping Cart System',
      icon: 'ShoppingBag',
      category: 'E-commerce'
    },
    'admin_panel': {
      price: 3000,
      extraDays: 3,
      label: 'Private Admin Panel & Analytics Dashboard',
      icon: 'Shield',
      category: 'Management'
    },
    'social_media': {
      price: 500,
      extraDays: 0,
      label: 'Social Media Feeds & Share Integration',
      icon: 'Share2',
      category: 'Marketing'
    }
  }
};
