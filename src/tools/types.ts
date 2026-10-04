export type ToolCategory = 'seo' | 'website' | 'social' | 'business';

export interface ToolMeta {
  id: string;
  name: string;
  slug: string;
  path: string;
  category: ToolCategory;
  categoryName: string;
  shortDescription: string;
  longDescription: string;
  iconName: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  estimatedTime: string;
  featured?: boolean;
  relatedToolIds: string[];
  faqs: { question: string; answer: string }[];
  howItWorks: { step: string; title: string; description: string }[];
  whyUse: { title: string; description: string }[];
  targetBlogSlug?: string;
  targetBlogTitle?: string;
}

export interface ToolAnalyticsEvent {
  eventName: 'tool_opened' | 'tool_used' | 'tool_result_generated' | 'copy_clicked' | 'download_clicked' | 'whatsapp_clicked' | 'contact_clicked';
  toolId: string;
  details?: Record<string, any>;
}
