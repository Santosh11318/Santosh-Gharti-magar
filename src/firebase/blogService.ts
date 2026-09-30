import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType, ADMIN_EMAIL } from './config';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: 'AI & Tech' | 'Web Development' | 'SEO & Marketing' | 'Business & Growth' | 'Tutorials';
  excerpt: string;
  content: string;
  coverImage?: string;
  authorName: string;
  authorEmail: string;
  authorId: string;
  tags: string[];
  readTime: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export type BlogPostInput = Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'authorEmail' | 'authorName'>;

const POSTS_PATH = 'posts';

export function isUserAdmin(email?: string | null): boolean {
  if (!email) return false;
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

// Subscribe to published posts in real-time
export function subscribeToPublishedPosts(
  callback: (posts: BlogPost[]) => void,
  onError?: (error: Error) => void
): () => void {
  const postsRef = collection(db, POSTS_PATH);
  const q = query(postsRef, where('status', '==', 'published'));

  return onSnapshot(
    q,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const posts: BlogPost[] = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<BlogPost, 'id'>)
      }));
      // Sort newest first
      posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(posts);
    },
    (error) => {
      if (onError) {
        try {
          handleFirestoreError(error, OperationType.GET, POSTS_PATH);
        } catch (e) {
          onError(e as Error);
        }
      } else {
        handleFirestoreError(error, OperationType.GET, POSTS_PATH);
      }
    }
  );
}

// Fetch all posts (for admin view)
export async function fetchAllPostsAdmin(): Promise<BlogPost[]> {
  try {
    const postsRef = collection(db, POSTS_PATH);
    const snapshot = await getDocs(postsRef);
    const posts: BlogPost[] = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<BlogPost, 'id'>)
    }));
    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return posts;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, POSTS_PATH);
  }
}

// Create a new post
export async function createPost(input: BlogPostInput): Promise<string> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('You must be signed in to create a post.');
  }

  const postId = input.slug || `post-${Date.now()}`;
  const now = new Date().toISOString();

  const newPostData = {
    title: input.title.trim(),
    slug: (input.slug || postId).toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    category: input.category,
    excerpt: input.excerpt.trim(),
    content: input.content.trim(),
    coverImage: input.coverImage?.trim() || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    authorName: currentUser.displayName || 'Santosh Gharti Magar',
    authorEmail: currentUser.email || ADMIN_EMAIL,
    authorId: currentUser.uid,
    tags: input.tags && input.tags.length > 0 ? input.tags.slice(0, 10) : ['AI', 'Tech'],
    readTime: input.readTime || '4 min read',
    status: input.status,
    createdAt: now,
    updatedAt: now,
  };

  const docPath = `${POSTS_PATH}/${postId}`;
  try {
    await setDoc(doc(db, POSTS_PATH, postId), newPostData);
    return postId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, docPath);
  }
}

// Update existing post
export async function updatePost(postId: string, input: Partial<BlogPostInput>, createdAt: string): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('You must be signed in to update a post.');
  }

  const docPath = `${POSTS_PATH}/${postId}`;
  const updateData: Record<string, any> = {
    updatedAt: new Date().toISOString(),
    createdAt,
    authorId: currentUser.uid
  };

  if (input.title) updateData.title = input.title.trim();
  if (input.slug) updateData.slug = input.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  if (input.category) updateData.category = input.category;
  if (input.excerpt) updateData.excerpt = input.excerpt.trim();
  if (input.content) updateData.content = input.content.trim();
  if (input.coverImage) updateData.coverImage = input.coverImage.trim();
  if (input.tags) updateData.tags = input.tags.slice(0, 10);
  if (input.readTime) updateData.readTime = input.readTime;
  if (input.status) updateData.status = input.status;

  try {
    await updateDoc(doc(db, POSTS_PATH, postId), updateData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

// Delete post
export async function deletePost(postId: string): Promise<void> {
  const docPath = `${POSTS_PATH}/${postId}`;
  try {
    await deleteDoc(doc(db, POSTS_PATH, postId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

// Seed starter demo posts if collection is currently empty
export const SAMPLE_POSTS: BlogPost[] = [
  {
    id: 'how-ai-is-revolutionizing-web-development',
    title: 'How AI is Revolutionizing Modern Web Development in 2026',
    slug: 'how-ai-is-revolutionizing-web-development',
    category: 'AI & Tech',
    excerpt: 'Explore how artificial intelligence is shifting web engineering from static coding to autonomous UI generation, intelligent APIs, and personalized user journeys.',
    content: `Artificial intelligence is no longer just a futuristic concept—it is actively transforming how modern websites and digital platforms are conceptualized, built, and optimized.

### The Shift to Autonomous UI and Intelligent Architectures
Traditional web development relied heavily on rigid templates and handcrafted layouts. Today, cutting-edge websites integrate AI models to deliver dynamic, adaptive user interfaces tailored in real-time to visitor intent and behavior.

Key breakthroughs in AI-powered web development:
- **Instant Code & Component Generation**: Speeding up development cycles by 400% without sacrificing architectural elegance.
- **Predictive Performance & SEO**: Automated asset optimization and continuous SEO fine-tuning that keeps businesses at the top of Google searches.
- **Intelligent Customer Journeys**: Real-time personalized recommendations and AI-driven conversion funnels that maximize business revenue.

### Why Businesses Need AI-Ready Websites
A static website is like a digital business card that nobody looks at. In contrast, an AI-ready web application engages prospective clients, answers their questions instantly, and guides them directly into paying customers.

Ready to upgrade your web presence with cutting-edge AI? Let's connect and build something phenomenal together!`,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Santosh Gharti Magar',
    authorEmail: 'santoshghartimagar918@gmail.com',
    authorId: 'admin-seed-santosh',
    tags: ['AI', 'Next.js', 'Web Dev', 'Innovation'],
    readTime: '4 min read',
    status: 'published',
    createdAt: '2026-03-28T09:00:00.000Z',
    updatedAt: '2026-03-28T09:00:00.000Z'
  },
  {
    id: 'seo-secrets-for-10x-organic-growth',
    title: 'SEO Secrets for 10x Organic Traffic & Higher Conversions',
    slug: 'seo-secrets-for-10x-organic-growth',
    category: 'SEO & Marketing',
    excerpt: 'Proven digital marketing and technical SEO tactics that propel local businesses and digital brands to rank #1 on Google and convert visitors into buyers.',
    content: `Search Engine Optimization (SEO) in 2026 requires much more than just stuffing keywords into metadata. Google's algorithms now prioritize lightning-fast load speeds, authoritative content, clean semantic HTML, and intuitive UX.

### 1. Ultra-Fast Core Web Vitals
If your website takes more than 1.5 seconds to load, over 50% of your visitors bounce before seeing your pitch. By utilizing modern frameworks like Vite, React, and efficient CDN delivery, we achieve near-instantaneous load times.

### 2. High-Intent Content Marketing
Focus on solving specific problems your target clients face. When your content addresses exact pain points, organic rankings rise and visitors perceive your brand as the definitive authority in your niche.

### 3. High-Converting Landing Page Design
Traffic without conversions is a vanity metric. Every page must have a crystal-clear call-to-action (CTA), social proof, and streamlined contact funnels.

Implement these strategies today to watch your organic metrics soar!`,
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Santosh Gharti Magar',
    authorEmail: 'santoshghartimagar918@gmail.com',
    authorId: 'admin-seed-santosh',
    tags: ['SEO', 'Digital Marketing', 'Growth', 'Traffic'],
    readTime: '5 min read',
    status: 'published',
    createdAt: '2026-03-25T11:30:00.000Z',
    updatedAt: '2026-03-25T11:30:00.000Z'
  },
  {
    id: 'building-high-performance-websites-guide',
    title: 'Building High-Performance Websites: The Ultimate Modern Tech Stack',
    slug: 'building-high-performance-websites-guide',
    category: 'Web Development',
    excerpt: 'A comprehensive deep-dive into modern frontend development with React, Tailwind CSS, TypeScript, and serverless backends for scalable business applications.',
    content: `Choosing the right technology stack is the most important architectural decision for any digital brand. In this guide, we break down why modern frameworks deliver unparalleled advantages over legacy WordPress sites.

### The Modern Frontier: React, Tailwind & Cloud Datastores
- **React & TypeScript**: Type-safe, modular, and easy to maintain without runtime bugs.
- **Tailwind CSS**: Micro-optimized styles that produce minimal bundle sizes and blazing performance.
- **Firebase Firestore**: Real-time data synchronization that scales effortlessly from 10 users to millions of global hits.

Whether you're launching a SaaS startup or a local services company, your web architecture should be built to scale effortlessly.`,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Santosh Gharti Magar',
    authorEmail: 'santoshghartimagar918@gmail.com',
    authorId: 'admin-seed-santosh',
    tags: ['React', 'TypeScript', 'Tailwind', 'Performance'],
    readTime: '6 min read',
    status: 'published',
    createdAt: '2026-03-20T14:15:00.000Z',
    updatedAt: '2026-03-20T14:15:00.000Z'
  }
];
