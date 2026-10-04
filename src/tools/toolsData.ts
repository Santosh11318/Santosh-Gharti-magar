import { ToolMeta } from './types';

export const ALL_TOOLS: ToolMeta[] = [
  // 1. SEO Score Checker
  {
    id: 'seo-score-checker',
    name: 'SEO Score Checker',
    slug: 'seo-score-checker',
    path: '/free-tools/seo-score-checker',
    category: 'seo',
    categoryName: 'SEO Tools',
    shortDescription: 'Analyze your website URL for technical SEO, on-page factors, Open Graph tags, and mobile readiness.',
    longDescription: 'Get an instant, client-side SEO evaluation of your website with actionable recommendations to improve rankings and organic traffic.',
    iconName: 'Search',
    metaTitle: 'Free Website SEO Score Checker & Audit Tool | Santosh Gharti Magar',
    metaDescription: 'Free online SEO checker to test your website URL for technical health, mobile meta, social Open Graph, and on-page optimization. No signup needed.',
    keywords: ['free SEO checker', 'website SEO audit', 'SEO score calculator', 'on-page SEO test', 'technical SEO analyzer'],
    estimatedTime: '15 seconds',
    featured: true,
    relatedToolIds: ['meta-tag-generator', 'image-compressor', 'website-cost-calculator'],
    targetBlogSlug: 'mastering-local-seo-rank-1-google-maps-nepal',
    targetBlogTitle: 'How to Improve Your Website SEO for High Rankings',
    whyUse: [
      {
        title: 'Instant Diagnostic Without Signing Up',
        description: 'Check critical web tags, HTTPS security, canonical links, and viewport responsiveness in real time.'
      },
      {
        title: 'Clear Categorized Scoring',
        description: 'See exactly where your website excels and where errors are hurting your Google search visibility.'
      },
      {
        title: 'Actionable Fixes for Higher Rankings',
        description: 'Every warning includes practical advice on how to optimize your code, meta tags, and structured data.'
      }
    ],
    howItWorks: [
      {
        step: '1',
        title: 'Enter Your Website URL',
        description: 'Type or paste your full domain (e.g., https://yourbrand.com).'
      },
      {
        step: '2',
        title: 'Run Real-Time Audit',
        description: 'Our engine inspects URL security, canonical patterns, mobile meta, headers, and social sharing cards.'
      },
      {
        step: '3',
        title: 'Review Score & Recommendations',
        description: 'Check your overall 0–100 score with passed, improvement, and missing checklist items.'
      }
    ],
    faqs: [
      {
        question: 'How accurate is this browser-based SEO checker?',
        answer: 'This tool performs real checks on URL protocols, domain patterns, structural tags, and accessible assets. Due to browser security (CORS), cross-origin websites that forbid scraping are analyzed via simulated technical heuristics and structural patterns.'
      },
      {
        question: 'Do I need to install any plugin or provide login details?',
        answer: 'No. The tool runs 100% in your browser without requiring account creation, login, or any sensitive credentials.'
      },
      {
        question: 'Can you help fix the issues found in the audit?',
        answer: 'Yes! Santosh Gharti Magar offers professional full-stack website development and SEO optimization to resolve every technical and on-page issue.'
      }
    ]
  },

  // 2. Website Cost Calculator
  {
    id: 'website-cost-calculator',
    name: 'Website Cost Calculator',
    slug: 'website-cost-calculator',
    path: '/free-tools/website-cost-calculator',
    category: 'website',
    categoryName: 'Website Tools',
    shortDescription: 'Estimate the cost and delivery timeline for building a custom, business-ready website based on your exact requirements.',
    longDescription: 'Select your industry, number of pages, and required features to get an instant realistic quote and timeline for your web project.',
    iconName: 'Calculator',
    metaTitle: 'Website Cost Calculator | Estimate Web Design Pricing & Timeline',
    metaDescription: 'Calculate the estimated development cost for your business website. Select pages, features, and business type for instant transparent pricing.',
    keywords: ['website cost calculator', 'website development price estimator', 'how much does a website cost', 'web design pricing'],
    estimatedTime: '30 seconds',
    featured: true,
    relatedToolIds: ['seo-score-checker', 'meta-tag-generator', 'profit-margin-calculator'],
    targetBlogSlug: '5-signs-your-business-needs-custom-website',
    targetBlogTitle: 'How Much Does a Business Website Cost in 2026?',
    whyUse: [
      {
        title: 'Transparent, No-Surprise Estimates',
        description: 'Understand realistic market pricing based on your industry needs, page volume, and specific features.'
      },
      {
        title: 'Configurable Feature Breakdown',
        description: 'Add or remove WhatsApp widgets, booking forms, payment gateways, and admin dashboards to suit your budget.'
      },
      {
        title: 'Direct WhatsApp Quotation',
        description: 'Send your customized configuration directly to our team for a fast, guaranteed fixed-price quote.'
      }
    ],
    howItWorks: [
      {
        step: '1',
        title: 'Choose Your Industry',
        description: 'Select whether you run a restaurant, clinic, hotel, ecommerce store, agency, or local business.'
      },
      {
        step: '2',
        title: 'Pick Page Count & Features',
        description: 'Select 1 page landing, 3–5 pages, or 10+ pages, and check the features your business needs.'
      },
      {
        step: '3',
        title: 'Get Instant Price & Timeline',
        description: 'View the estimated price range, delivery days, and recommended package instantly.'
      }
    ],
    faqs: [
      {
        question: 'Are these prices fixed or negotiable?',
        answer: 'The calculator provides a realistic baseline estimate based on standard industry requirements. We offer flexible packages and payment milestones tailored to your specific scope.'
      },
      {
        question: 'What is included in the estimated package?',
        answer: 'Every website includes mobile-responsive design, fast performance, on-page SEO foundation, secure hosting setup, and direct WhatsApp / contact lead generation.'
      },
      {
        question: 'How fast can my website be launched?',
        answer: 'Standard 1–5 page business websites are typically delivered within 3 to 7 business days, depending on feature complexity.'
      }
    ]
  },

  // 3. Meta Title & Description Generator
  {
    id: 'meta-tag-generator',
    name: 'Meta Title & Description Generator',
    slug: 'meta-tag-generator',
    path: '/free-tools/meta-tag-generator',
    category: 'seo',
    categoryName: 'SEO Tools',
    shortDescription: 'Generate high-CTR, Google-optimized SEO meta titles, meta descriptions, and URL slugs with real-time character counters.',
    longDescription: 'Craft perfectly formatted SEO title tags (50–60 characters) and meta descriptions (140–160 characters) with live Google SERP preview.',
    iconName: 'FileCode',
    metaTitle: 'Free Meta Title & Description Generator with Google Preview',
    metaDescription: 'Generate high-converting SEO meta titles, meta descriptions and clean URL slugs. Live Google SERP snippet preview with character counter.',
    keywords: ['meta title generator', 'meta description generator', 'SERP preview tool', 'SEO snippet generator', 'URL slug generator'],
    estimatedTime: '20 seconds',
    featured: true,
    relatedToolIds: ['seo-score-checker', 'blog-title-generator', 'hashtag-generator'],
    targetBlogSlug: 'mastering-local-seo-rank-1-google-maps-nepal',
    targetBlogTitle: 'How to Write Clickable SEO Meta Titles & Descriptions',
    whyUse: [
      {
        title: 'Prevent Google Snippet Truncation',
        description: 'Real-time character counters ensure your title tags stay under 60 characters and descriptions under 160 characters.'
      },
      {
        title: 'Visual Desktop & Mobile SERP Preview',
        description: 'Preview exactly how your website link will appear on Google search results before publishing.'
      },
      {
        title: 'One-Click HTML Tag Copy',
        description: 'Instantly copy clean <title> and <meta name="description"> tags directly into your HTML or WordPress site.'
      }
    ],
    howItWorks: [
      {
        step: '1',
        title: 'Enter Business & Keyword Info',
        description: 'Provide your business name, primary keyword, target location, and a brief description.'
      },
      {
        step: '2',
        title: 'Review Generated Variations',
        description: 'Our engine generates high-CTR commercial, local, and authoritative title & description combinations.'
      },
      {
        step: '3',
        title: 'Copy & Paste',
        description: 'Copy the ready-to-use HTML meta tags or clean slug with a single click.'
      }
    ],
    faqs: [
      {
        question: 'Why are title tag character counts important?',
        answer: 'Google displays approximately 50–60 characters (or ~600px width). Titles longer than this get truncated with an ellipsis (...), lowering click-through rates.'
      },
      {
        question: 'Does meta description directly affect Google ranking?',
        answer: 'While meta descriptions are not a direct algorithmic ranking factor, they significantly impact Click-Through Rate (CTR), which is a key organic performance signal.'
      },
      {
        question: 'Can I use this for WordPress or Shopify?',
        answer: 'Yes! The generated text works seamlessly with Yoast SEO, Rank Math, Shopify SEO settings, or custom React/HTML head tags.'
      }
    ]
  },

  // 4. Blog Title Generator
  {
    id: 'blog-title-generator',
    name: 'Blog Title Generator',
    slug: 'blog-title-generator',
    path: '/free-tools/blog-title-generator',
    category: 'website',
    categoryName: 'Website Tools',
    shortDescription: 'Generate catchy, click-worthy blog headlines across listicles, how-tos, beginner guides, problem-solvers, and local SEO.',
    longDescription: 'Turn any keyword or topic into dozens of viral, SEO-friendly headline ideas designed to maximize clicks and search visibility.',
    iconName: 'BookOpen',
    metaTitle: 'Free Blog Title & Headline Generator for High CTR | Santosh Gharti Magar',
    metaDescription: 'Generate dozens of catchy, SEO-optimized blog titles in seconds. Categorized by listicles, how-tos, comparison, and local SEO with one-click copy.',
    keywords: ['blog title generator', 'catchy headline generator', 'article title ideas', 'SEO blog headlines', 'content title generator'],
    estimatedTime: '10 seconds',
    relatedToolIds: ['meta-tag-generator', 'hashtag-generator', 'social-bio-generator'],
    targetBlogSlug: 'mastering-local-seo-rank-1-google-maps-nepal',
    targetBlogTitle: 'How to Write Engaging Blog Posts That Drive Sales',
    whyUse: [
      {
        title: 'Never Run Out of Content Ideas',
        description: 'Instantly generate angles tailored to your industry, target audience, and primary search keywords.'
      },
      {
        title: '8 Proven Headline Frameworks',
        description: 'Formulas based on viral listicles, step-by-step how-tos, beginner guides, problem-solvers, and local queries.'
      },
      {
        title: 'Fresh Regenerations on Demand',
        description: 'Click regenerate to discover new angles, power words, and hooks with zero latency.'
      }
    ],
    howItWorks: [
      {
        step: '1',
        title: 'Input Your Topic & Keyword',
        description: 'Enter your core subject (e.g. Website Redesign, Dental Marketing, Coffee Roasting).'
      },
      {
        step: '2',
        title: 'Specify Industry & Audience',
        description: 'Choose who you are writing for (e.g. small business owners, tourists, tech founders).'
      },
      {
        step: '3',
        title: 'Copy Your Favorite Titles',
        description: 'Browse categorized headlines and copy the best options directly to your draft.'
      }
    ],
    faqs: [
      {
        question: 'Are these headline formulas tested for SEO?',
        answer: 'Yes. They follow high-performing search intent patterns (informational, transactional, and comparative) that perform best on Google SERPs.'
      },
      {
        question: 'Can I regenerate more titles if I want different ideas?',
        answer: 'Yes! Click the "Regenerate Ideas" button anytime to shuffle hooks, power adjectives, and numbers.'
      },
      {
        question: 'Is this tool completely free to use?',
        answer: '100% free with unlimited generations and no daily limits.'
      }
    ]
  },

  // 5. Social Media Bio Generator
  {
    id: 'social-bio-generator',
    name: 'Social Media Bio Generator',
    slug: 'social-bio-generator',
    path: '/free-tools/social-bio-generator',
    category: 'social',
    categoryName: 'Social Media Tools',
    shortDescription: 'Craft professional, engaging bios for Instagram, Facebook, LinkedIn, and YouTube with character counters and copy buttons.',
    longDescription: 'Stand out across social networks with custom-tailored bios highlighting your value proposition, primary service, and clear call-to-action.',
    iconName: 'UserCheck',
    metaTitle: 'Free Social Media Bio Generator for Instagram, LinkedIn & Facebook',
    metaDescription: 'Generate professional, high-converting social media bios for Instagram, LinkedIn, Facebook, and YouTube. Instant character counts & copy buttons.',
    keywords: ['social media bio generator', 'Instagram bio generator', 'LinkedIn headline creator', 'professional bio maker'],
    estimatedTime: '25 seconds',
    relatedToolIds: ['hashtag-generator', 'qr-code-generator', 'meta-tag-generator'],
    targetBlogSlug: '5-signs-your-business-needs-custom-website',
    targetBlogTitle: 'How Social Media & Websites Work Together for Growth',
    whyUse: [
      {
        title: 'Platform-Specific Character Limits',
        description: 'Strict character counter checks for Instagram (150 chars), LinkedIn headline, Facebook About, and YouTube.'
      },
      {
        title: 'Value Proposition + Clear CTA',
        description: 'Combines your industry, core expertise, unique selling proposition (USP), and a link-in-bio prompt.'
      },
      {
        title: 'Emoji & Clean Formatting Toggles',
        description: 'Switch between modern emoji bullet points or sleek minimalist formatting for corporate profiles.'
      }
    ],
    howItWorks: [
      {
        step: '1',
        title: 'Enter Profile Details',
        description: 'Type your name/brand, main service, industry, location, and your unique differentiator.'
      },
      {
        step: '2',
        title: 'Choose Your CTA',
        description: 'Select your preferred action (e.g., Book a Call, Visit Website, Order Now, DM for Inquiries).'
      },
      {
        step: '3',
        title: 'Copy Tailored Bios',
        description: 'Get custom versions ready for Instagram, LinkedIn, Facebook, and YouTube.'
      }
    ],
    faqs: [
      {
        question: 'What is the character limit for Instagram bio?',
        answer: 'Instagram allows a maximum of 150 characters in your bio. Our generator guarantees your Instagram variation fits within this limit.'
      },
      {
        question: 'Can I use these bios for personal or agency brands?',
        answer: 'Both! You can toggle between personal creator mode and company/business branding.'
      },
      {
        question: 'How do I add line breaks in Instagram bio?',
        answer: 'When you click "Copy Bio", the line breaks are preserved so you can paste directly into Instagram without formatting issues.'
      }
    ]
  },

  // 6. Hashtag Generator
  {
    id: 'hashtag-generator',
    name: 'Hashtag Generator',
    slug: 'hashtag-generator',
    path: '/free-tools/hashtag-generator',
    category: 'social',
    categoryName: 'Social Media Tools',
    shortDescription: 'Generate targeted, non-spammy hashtags organized by broad reach, niche focus, location, and branded tags.',
    longDescription: 'Boost your social media discoverability on Instagram, LinkedIn, and YouTube with curated hashtag bundles that match your niche.',
    iconName: 'Hash',
    metaTitle: 'Free Hashtag Generator for Instagram & LinkedIn | Santosh Gharti Magar',
    metaDescription: 'Generate relevant, non-spammy hashtag groups for your business. Organized into broad, niche, industry, and local tags with one-click copy.',
    keywords: ['hashtag generator', 'Instagram hashtags', 'LinkedIn hashtags', 'best hashtags for business', 'local hashtags'],
    estimatedTime: '15 seconds',
    relatedToolIds: ['social-bio-generator', 'blog-title-generator', 'qr-code-generator'],
    targetBlogSlug: 'mastering-local-seo-rank-1-google-maps-nepal',
    targetBlogTitle: 'How to Build an Organic Social Following Without Paid Ads',
    whyUse: [
      {
        title: 'Curated Anti-Spam Tag Groups',
        description: 'Avoid banned or ultra-saturated spam hashtags that hurt your account reach.'
      },
      {
        title: 'Balanced Reach Strategy',
        description: 'Combines broad volume tags with high-intent niche and localized search keywords.'
      },
      {
        title: 'One-Click Group Copy',
        description: 'Copy individual clusters or grab the entire optimized bundle ready to paste into your caption or first comment.'
      }
    ],
    howItWorks: [
      {
        step: '1',
        title: 'Enter Your Niche & Topic',
        description: 'Specify your core subject (e.g. Web Development, Specialty Coffee, Luxury Travel).'
      },
      {
        step: '2',
        title: 'Select Platform & Location',
        description: 'Choose Instagram, LinkedIn, or YouTube, and optionally add your city/country.'
      },
      {
        step: '3',
        title: 'Copy Clean Hashtags',
        description: 'Review broad, niche, industry, and local sets, and copy with one click.'
      }
    ],
    faqs: [
      {
        question: 'How many hashtags should I use on Instagram?',
        answer: 'Instagram officially recommends between 3 to 5 highly relevant hashtags, while many creators find success with 8 to 15 focused niche tags. Our tool lets you choose.'
      },
      {
        question: 'Should I put hashtags in the caption or first comment?',
        answer: 'Instagram indexes both caption and first-comment hashtags equally. Putting them in the caption is generally faster and equally effective.'
      },
      {
        question: 'Do hashtags work on LinkedIn?',
        answer: 'Yes, 3 to 5 industry-specific hashtags help LinkedIn categorize your post into topic feeds and discover pages.'
      }
    ]
  },

  // 7. QR Code Generator
  {
    id: 'qr-code-generator',
    name: 'High-Resolution QR Code Generator',
    slug: 'qr-code-generator',
    path: '/free-tools/qr-code-generator',
    category: 'business',
    categoryName: 'Business Tools',
    shortDescription: 'Generate custom, downloadable QR codes for websites, plain text, direct WhatsApp chats, and Google Maps locations.',
    longDescription: 'Create high-resolution, instant QR codes for your marketing flyers, business cards, restaurant menus, or storefront displays.',
    iconName: 'QrCode',
    metaTitle: 'Free QR Code Generator | Download High-Res PNG | Santosh Gharti Magar',
    metaDescription: 'Free online QR code generator for URLs, text, WhatsApp chat links, and Google Maps. Download crisp PNG without signup or expiry dates.',
    keywords: ['free QR code generator', 'QR code maker', 'WhatsApp QR code', 'Google Maps QR code', 'download QR code PNG'],
    estimatedTime: '10 seconds',
    featured: true,
    relatedToolIds: ['website-cost-calculator', 'social-bio-generator', 'image-compressor'],
    targetBlogSlug: '5-signs-your-business-needs-custom-website',
    targetBlogTitle: 'How Offline QR Codes Connect Customers Directly to Your Website',
    whyUse: [
      {
        title: '100% Client-Side & Never Expires',
        description: 'Static QR codes generated directly in your browser. No redirects, no accounts, and no monthly fees.'
      },
      {
        title: 'Multiple Business Formats',
        description: 'Easily encode Website URLs, direct prefilled WhatsApp chats, Google Maps locations, or WiFi credentials.'
      },
      {
        title: 'Crisp High-Res PNG Download',
        description: 'Download high-definition PNG images ready for print materials, business cards, table tents, and brochures.'
      }
    ],
    howItWorks: [
      {
        step: '1',
        title: 'Select Data Type',
        description: 'Choose Website URL, Text, WhatsApp Link, or Google Maps Pin.'
      },
      {
        step: '2',
        title: 'Enter Your Information',
        description: 'Type your link or phone number with an optional prefilled message.'
      },
      {
        step: '3',
        title: 'Download High-Res PNG',
        description: 'Click "Download QR Code" to save the high-resolution file to your device.'
      }
    ],
    faqs: [
      {
        question: 'Do these QR codes have a scan limit or expiration date?',
        answer: 'No! These are standard static QR codes. They will work indefinitely as long as your destination website URL remains active.'
      },
      {
        question: 'Can I print these on physical business cards or banners?',
        answer: 'Yes! The downloaded PNG is rendered at high resolution (1000x1000px) ensuring sharp print quality on paper, vinyl, or acrylic.'
      },
      {
        question: 'Is my data tracked or stored on a server?',
        answer: 'No. The QR matrix is generated directly on your device using client-side JavaScript. Nothing is sent to an external server.'
      }
    ]
  },

  // 8. Profit Margin Calculator
  {
    id: 'profit-margin-calculator',
    name: 'Profit Margin & Markup Calculator',
    slug: 'profit-margin-calculator',
    path: '/free-tools/profit-margin-calculator',
    category: 'business',
    categoryName: 'Business Tools',
    shortDescription: 'Calculate gross profit, profit margin percentage, markup percentage, and per-unit earnings with interactive sliders.',
    longDescription: 'Accurately price your products and services by calculating the exact difference between gross profit margin and markup percentage.',
    iconName: 'TrendingUp',
    metaTitle: 'Free Profit Margin & Markup Calculator for Businesses | SGM',
    metaDescription: 'Calculate profit margin percentage, markup percentage, and gross profit per unit with clear visual breakdowns and formulas.',
    keywords: ['profit margin calculator', 'markup calculator', 'gross profit calculator', 'how to calculate profit margin', 'retail pricing calculator'],
    estimatedTime: '20 seconds',
    relatedToolIds: ['gst-calculator', 'website-cost-calculator', 'seo-score-checker'],
    targetBlogSlug: '5-signs-your-business-needs-custom-website',
    targetBlogTitle: 'How to Price Your Services for Maximum Profitability',
    whyUse: [
      {
        title: 'Clear Difference Between Margin vs Markup',
        description: 'Avoid the common pricing mistake of confusing markup with margin percentage.'
      },
      {
        title: 'Instant Visual Ratio Bar',
        description: 'See the exact breakdown of cost of goods sold (COGS) vs gross profit share in real time.'
      },
      {
        title: 'Formulas & Practical Examples',
        description: 'Beginner-friendly step-by-step explanations so you can master your business unit economics.'
      }
    ],
    howItWorks: [
      {
        step: '1',
        title: 'Enter Cost Price',
        description: 'Type the cost to manufacture, purchase, or deliver one unit of your product/service.'
      },
      {
        step: '2',
        title: 'Enter Selling Price',
        description: 'Enter the price you charge or intend to charge your customer.'
      },
      {
        step: '3',
        title: 'Inspect Margin & Markup',
        description: 'View gross profit, margin percentage, markup percentage, and actionable pricing advice.'
      }
    ],
    faqs: [
      {
        question: 'What is the difference between Margin and Markup?',
        answer: 'Profit Margin is the percentage of the selling price that is profit (Profit / Selling Price). Markup is the percentage added on top of the cost price (Profit / Cost Price).'
      },
      {
        question: 'What is considered a healthy profit margin for small businesses?',
        answer: 'In general, a 10% net profit margin is considered average, a 20% margin is good, and 30%+ is high. For digital agencies and SaaS, gross margins often exceed 60%.'
      },
      {
        question: 'Can I use this for service-based businesses?',
        answer: 'Yes! Simply use your hourly cost (labor + overhead) as the cost price and your billed client fee as the selling price.'
      }
    ]
  },

  // 9. GST Calculator
  {
    id: 'gst-calculator',
    name: 'GST Tax Calculator (Inclusive / Exclusive)',
    slug: 'gst-calculator',
    path: '/free-tools/gst-calculator',
    category: 'business',
    categoryName: 'Business Tools',
    shortDescription: 'Calculate Goods and Services Tax (GST) amounts for standard rates (5%, 12%, 18%, 28%) with CGST and SGST breakdowns.',
    longDescription: 'Quickly calculate GST-inclusive and GST-exclusive amounts with customizable tax slabs and a detailed base amount breakdown.',
    iconName: 'Receipt',
    metaTitle: 'Free GST Calculator Online | Inclusive & Exclusive Tax Calculator',
    metaDescription: 'Calculate GST amounts for 5%, 12%, 18%, and 28% tax slabs with inclusive and exclusive options. Simple, fast, and 100% free.',
    keywords: ['GST calculator', 'GST inclusive calculator', 'GST exclusive calculator', '18 percent GST calculation', 'tax calculator'],
    estimatedTime: '15 seconds',
    relatedToolIds: ['profit-margin-calculator', 'website-cost-calculator', 'qr-code-generator'],
    targetBlogSlug: '5-signs-your-business-needs-custom-website',
    targetBlogTitle: 'How Transparent Pricing & Invoicing Builds Customer Trust',
    whyUse: [
      {
        title: 'Both Inclusive & Exclusive Modes',
        description: 'Calculate tax to add to a base price, or extract the base amount from a final MRP bill.'
      },
      {
        title: 'Standard Tax Slabs (5%, 12%, 18%, 28%)',
        description: 'One-click buttons for standard commercial GST rates, plus custom percentage input.'
      },
      {
        title: 'CGST + SGST Split Breakdown',
        description: 'See the exact 50/50 division between Central and State GST for official invoicing.'
      }
    ],
    howItWorks: [
      {
        step: '1',
        title: 'Enter Amount',
        description: 'Type the transaction amount in your local currency.'
      },
      {
        step: '2',
        title: 'Choose Tax Rate & Mode',
        description: 'Select 5%, 12%, 18%, or 28%, and toggle between GST Inclusive or GST Exclusive.'
      },
      {
        step: '3',
        title: 'View Breakdown',
        description: 'Review the base amount, total tax amount, and final price immediately.'
      }
    ],
    faqs: [
      {
        question: 'What is the formula for GST Inclusive calculation?',
        answer: 'GST Amount = Total Amount - [Total Amount * (100 / (100 + GST Rate))]. Base Amount = Total Amount - GST Amount.'
      },
      {
        question: 'What is the formula for GST Exclusive calculation?',
        answer: 'GST Amount = (Base Amount * GST Rate) / 100. Final Amount = Base Amount + GST Amount.'
      },
      {
        question: 'Is this calculation valid for official tax returns?',
        answer: 'This calculator is for estimation and quotation purposes. Always verify tax filings and specific item exemptions with a certified tax accountant.'
      }
    ]
  },

  // 10. Image Compressor
  {
    id: 'image-compressor',
    name: 'Browser-Based Image Compressor',
    slug: 'image-compressor',
    path: '/free-tools/image-compressor',
    category: 'website',
    categoryName: 'Website Tools',
    shortDescription: 'Compress JPG, PNG, and WebP images directly in your browser with zero server uploads, privacy preservation, and size savings.',
    longDescription: 'Reduce image file sizes by up to 80% without losing visible quality using client-side canvas optimization. Fast, private, and unlimited.',
    iconName: 'Image',
    metaTitle: 'Free Client-Side Image Compressor (JPG, PNG, WebP) | Santosh Gharti Magar',
    metaDescription: 'Compress JPG, PNG, and WebP images directly in your browser. 100% private, zero server upload, quality slider, and instant download.',
    keywords: ['image compressor', 'compress JPG online', 'reduce image size', 'free web image optimizer', 'browser image compressor'],
    estimatedTime: '10 seconds',
    featured: true,
    relatedToolIds: ['seo-score-checker', 'website-cost-calculator', 'qr-code-generator'],
    targetBlogSlug: '5-signs-your-business-needs-custom-website',
    targetBlogTitle: 'How Image Optimization Improves Website Speed and Google Rankings',
    whyUse: [
      {
        title: '100% Client-Side Privacy',
        description: 'Images never leave your browser and are never uploaded to any remote server or cloud database.'
      },
      {
        title: 'Speed Up Your Website Loading',
        description: 'Lighter images improve Google Core Web Vitals (LCP), reduce bounce rates, and save mobile bandwidth.'
      },
      {
        title: 'Interactive Quality Slider',
        description: 'Adjust compression strength from 10% to 100% with live file size comparison and side-by-side preview.'
      }
    ],
    howItWorks: [
      {
        step: '1',
        title: 'Upload Image',
        description: 'Drag and drop or select any JPG, PNG, or WebP photo from your device.'
      },
      {
        step: '2',
        title: 'Adjust Quality Slider',
        description: 'Slide to balance image clarity with maximum percentage file size reduction.'
      },
      {
        step: '3',
        title: 'Download Optimized File',
        description: 'Click "Download Compressed Image" to immediately save the lightweight version.'
      }
    ],
    faqs: [
      {
        question: 'Are my photos uploaded to your server?',
        answer: 'No. All processing happens entirely within your browser using the HTML5 Canvas API. Your images never leave your computer or phone.'
      },
      {
        question: 'What image formats are supported?',
        answer: 'The tool supports JPEG, JPG, PNG, and WebP images up to 25MB.'
      },
      {
        question: 'What is the recommended compression quality for websites?',
        answer: 'A quality level between 75% and 85% typically reduces file size by 60%–80% with virtually zero perceptible loss in visual quality.'
      }
    ]
  }
];

export const TOOL_CATEGORIES = [
  { id: 'all', name: 'All Free Tools', icon: 'Sparkles', count: 10 },
  { id: 'seo', name: 'SEO Tools', icon: 'Search', count: 2 },
  { id: 'website', name: 'Website Tools', icon: 'Layout', count: 3 },
  { id: 'social', name: 'Social Media Tools', icon: 'Share2', count: 2 },
  { id: 'business', name: 'Business Tools', icon: 'Briefcase', count: 3 }
];
