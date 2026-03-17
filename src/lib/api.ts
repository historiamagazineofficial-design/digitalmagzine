// ── TYPE DEFINITIONS ──────────────────────────────────────────────

export interface Article {
  _id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorImage?: string;
  authorBio?: string;
  date: string;
  imageUrl: string;
  readingTime: string;
  status: string; // 'Published' | 'Draft'
  tags: string[];
  showOnHomepage?: boolean;
}

export interface Voice {
  id: string;
  contributor: string;
  role: string;
  quote: string;
  imageUrl: string;
  createdAt?: string | Date;
}

export interface ArticleComment {
  id: string;
  author: string;
  content: string;
  article: string;
  date: string;
  status: string;
  createdAt?: string | Date;
  replies?: ArticleComment[];
}

export interface Media {
  id: string;
  url: string;
  name: string;
  size: string;
  publicId?: string;
}

export interface HeroConfig {
  articleSlug: string;
  secondarySlug?: string;
  customTitle?: string;
  customExcerpt?: string;
}

export interface SiteSettings {
  siteName: string;
  description: string;
  contactEmail: string;
  socialTwitter?: string;
  socialInstagram?: string;
  primaryColor: string;
}

// MOCK_ARTICLES is kept minimal — only used as an absolute last-resort when the database
// is completely unreachable. Return empty so users see "no articles" rather than fake content.
export const MOCK_ARTICLES: Article[] = [];

// ── STRAPI CONFIG ────────────────────────────────────────────────

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

function mapStrapiToArticle(data: { attributes?: any; id?: string | number }): Article {
  const attrs = data.attributes || data;
  const id = data.id;
  
  return {
    slug: attrs.slug || `article-${id}`,
    title: attrs.title || 'Untitled',
    excerpt: attrs.excerpt || '',
    content: attrs.content || '',
    category: attrs.category || 'Articles',
    author: attrs.author || 'Anonymous',
    date: attrs.publishedAt ? new Date(attrs.publishedAt).toLocaleDateString() : 'Recent',
    imageUrl: attrs.image?.data?.attributes?.url 
      ? (`${attrs.image.data.attributes.url.startsWith('http') ? '' : STRAPI_URL}${attrs.image.data.attributes.url}`)
      : 'https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=1200&auto=format&fit=crop',
    readingTime: attrs.readingTime || '5 min read',
    status: attrs.publishedAt ? 'Published' : 'Draft',
    tags: attrs.tags ? (typeof attrs.tags === 'string' ? attrs.tags.split(',') : attrs.tags) : [],
    showOnHomepage: attrs.showOnHomepage ?? true
  };
}

async function fetchStrapi<T>(path: string, params?: Record<string, string>): Promise<T> {
  const query = params ? `?${new URLSearchParams(params).toString()}` : '';
  const url = `${STRAPI_URL}/api${path}${query}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(STRAPI_TOKEN ? { 'Authorization': `Bearer ${STRAPI_TOKEN}` } : {})
  };

  const response = await fetch(url, { headers, next: { revalidate: 60 } });
  if (!response.ok) {
    throw new Error(`Strapi Fetch Error: ${response.statusText}`);
  }
  return response.json();
}

// ── CLIENT FETCH HELPER ───────────────────────────────────────────

async function clientFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, { ...options, cache: 'no-store' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

// ── ARTICLES (Hybrid Strapi + MongoDB) ────────────────────────────

export async function getAllArticles(): Promise<Article[]> {
  // If Strapi is configured, it takes priority for Articles
  if (STRAPI_URL) {
    try {
      const result = await fetchStrapi<{ data: any[] }>('/articles', { 
        populate: '*'
      });
      return result.data.map(mapStrapiToArticle);
    } catch (error) {
      console.warn('Strapi error, falling back:', error);
    }
  }

  // Fallback to MongoDB or MOCK
  if (typeof window === 'undefined') {
    try {
      const { dbGetArticles } = await import('@/lib/server-db');
      return await dbGetArticles();
    } catch (err) {
      return MOCK_ARTICLES;
    }
  }

  try {
    const result = await clientFetch<{ success: boolean; data: Article[] }>('/api/articles');
    return result.data;
  } catch {
    return MOCK_ARTICLES;
  }
}

export async function getArticleBySlug(encodedSlug: string): Promise<Article | undefined> {
  const slug = decodeURIComponent(encodedSlug);
  if (STRAPI_URL) {
    try {
      const result = await fetchStrapi<{ data: any[] }>('/articles', { 
        'filters[slug][$eq]': slug,
        'populate': '*'
      });
      if (result.data.length > 0) return mapStrapiToArticle(result.data[0]);
    } catch (error) {
      console.warn('Strapi slug error:', error);
    }
  }

  if (typeof window === 'undefined') {
    try {
      const { dbGetArticleBySlug } = await import('@/lib/server-db');
      return await dbGetArticleBySlug(slug);
    } catch {
      return MOCK_ARTICLES.find(a => a.slug === slug);
    }
  }

  try {
    const result = await clientFetch<{ success: boolean; data: Article }>(`/api/articles/${slug}`);
    return result.data;
  } catch {
    return MOCK_ARTICLES.find(a => a.slug === slug);
  }
}

export async function getArticlesByCategory(categoryName: string): Promise<Article[]> {
  if (STRAPI_URL) {
    try {
      const result = await fetchStrapi<{ data: any[] }>('/articles', { 
        'filters[category][$equalsIgnoreCase]': categoryName,
        'populate': '*'
      });
      return result.data.map(mapStrapiToArticle);
    } catch (error) {
      console.warn('Strapi category error:', error);
    }
  }

  if (typeof window === 'undefined') {
    try {
      const { dbGetArticles } = await import('@/lib/server-db');
      return await dbGetArticles({ category: categoryName });
    } catch {
      return MOCK_ARTICLES.filter(a => a.category.toLowerCase() === categoryName.toLowerCase());
    }
  }

  try {
    const result = await clientFetch<{ success: boolean; data: Article[] }>(
      `/api/articles?category=${encodeURIComponent(categoryName)}`
    );
    return result.data;
  } catch {
    return MOCK_ARTICLES.filter(a => a.category.toLowerCase() === categoryName.toLowerCase());
  }
}

// CRUD operations remain primarily for MongoDB as CMS management
// CREATE
export async function createArticle(data: Partial<Article>): Promise<boolean> {
  // Only try Strapi if we have a token (public writes are rarely allowed)
  if (STRAPI_URL && STRAPI_TOKEN) {
    try {
      const response = await fetch(`${STRAPI_URL}/api/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${STRAPI_TOKEN}`
        },
        body: JSON.stringify({ data }),
      });
      if (response.ok) return true;
      console.warn('Strapi Save Status:', response.status);
    } catch (error) {
      console.warn('Strapi connection failed, falling back to MongoDB:', error);
    }
  }

  // Fallback: MongoDB via API route
  try {
    const res = await clientFetch<{ success: boolean; data?: any; error?: string }>('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.success;
  } catch (err: any) {
    console.error('MongoDB Save Error:', err.message);
    return false;
  }
}

// UPDATE
export async function updateArticle(encodedSlug: string, data: Partial<Article>): Promise<boolean> {
  const slug = decodeURIComponent(encodedSlug);
  if (STRAPI_URL && STRAPI_TOKEN) {
    try {
      const search = await fetchStrapi<{ data: any[] }>('/articles', { 
        'filters[slug][$eq]': slug
      });
      
      if (search?.data?.length > 0) {
        const id = search.data[0].id;
        const response = await fetch(`${STRAPI_URL}/api/articles/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${STRAPI_TOKEN}`
          },
          body: JSON.stringify({ data }),
        });
        if (response.ok) return true;
      }
    } catch (error) {
      console.warn('Strapi update failed:', error);
    }
  }

  try {
    const res = await clientFetch<{ success: boolean }>(`/api/articles/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.success;
  } catch (err) {
    console.error('MongoDB Update Error:', err);
    return false;
  }
}

// DELETE
export async function deleteArticle(encodedSlug: string): Promise<boolean> {
  const slug = decodeURIComponent(encodedSlug);
  if (STRAPI_URL) {
    try {
      const result = await fetchStrapi<{ data: any[] }>('/articles', { 
        'filters[slug][$eq]': slug
      });
      
      if (result?.data?.length > 0) {
        const id = result.data[0].id;
        const response = await fetch(`${STRAPI_URL}/api/articles/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...(STRAPI_TOKEN ? { 'Authorization': `Bearer ${STRAPI_TOKEN}` } : {})
          }
        });
        if (response.ok) return true;
      }
    } catch (error) {
      console.warn('Strapi delete failed:', error);
    }
  }

  try {
    await clientFetch(`/api/articles/${slug}`, { method: 'DELETE' });
    return true;
  } catch (err) {
    console.error('deleteArticle (MongoDB) error:', err);
    return false;
  }
}

// ── VOICES, TAGS, SETTINGS, HERO (Always MongoDB) ─────────────────

export async function getVoices(): Promise<Voice[]> {
  if (typeof window === 'undefined') {
    try {
      const { dbGetVoices } = await import('@/lib/server-db');
      return await dbGetVoices();
    } catch {
      return [];
    }
  }
  try {
    const result = await clientFetch<{ success: boolean; data: Voice[] }>('/api/voices');
    return result.data;
  } catch {
    return [];
  }
}

export async function saveVoice(voice: Partial<Voice>): Promise<boolean> {
  try {
    await clientFetch('/api/voices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(voice),
    });
    return true;
  } catch {
    return false;
  }
}

export async function updateVoice(id: string, voice: Partial<Voice>): Promise<boolean> {
  try {
    await clientFetch(`/api/voices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(voice),
    });
    return true;
  } catch {
    return false;
  }
}

export async function deleteVoice(id: string): Promise<boolean> {
  try {
    await clientFetch(`/api/voices/${id}`, { method: 'DELETE' });
    return true;
  } catch {
    return false;
  }
}

export async function getTags(): Promise<string[]> {
  if (typeof window === 'undefined') {
    try {
      const { dbGetTags } = await import('@/lib/server-db');
      return await dbGetTags(['#History', '#Theology']);
    } catch {
      return [];
    }
  }
  try {
    const result = await clientFetch<{ success: boolean; data: string[] }>('/api/tags');
    return result.data;
  } catch {
    return [];
  }
}

export async function saveTags(tags: string[]): Promise<boolean> {
  try {
    await clientFetch('/api/tags', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tags }),
    });
    return true;
  } catch {
    return false;
  }
}

export async function getHeroConfig(): Promise<HeroConfig> {
  if (typeof window === 'undefined') {
    try {
      const { unstable_noStore } = await import('next/cache');
      unstable_noStore(); // prevent Next.js from caching this fetch
      const { dbGetHeroConfig } = await import('@/lib/server-db');
      return await dbGetHeroConfig({ 
        articleSlug: 'the-girls-we-forgot-a-reckoning-with-selective-empathy',
        secondarySlug: 'twenty-five-held-breaths',
      });
    } catch {
      return { articleSlug: '' };
    }
  }
  try {
    const result = await clientFetch<{ success: boolean; data: HeroConfig }>('/api/hero-config');
    return result.data;
  } catch {
    return { articleSlug: '' };
  }
}

export async function saveHeroConfig(config: HeroConfig): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await clientFetch<{ success: boolean; error?: string }>('/api/hero-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    return res;
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' };
  }
}

export async function getSiteSettings(): Promise<SiteSettings | Record<string, never>> {
  if (typeof window === 'undefined') {
    try {
      const { dbGetSiteSettings } = await import('@/lib/server-db');
      return await dbGetSiteSettings();
    } catch {
      return {};
    }
  }
  try {
    const result = await clientFetch<{ success: boolean; data: SiteSettings }>('/api/settings');
    return result.data;
  } catch {
    return {};
  }
}

export async function saveSiteSettings(settings: SiteSettings): Promise<boolean> {
  try {
    await clientFetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return true;
  } catch {
    return false;
  }
}

export async function getFlaggedComments(): Promise<ArticleComment[]> {
  if (typeof window === 'undefined') {
    try {
      const { dbGetPendingComments } = await import('@/lib/server-db');
      return await dbGetPendingComments([]);
    } catch {
      return [];
    }
  }
  try {
    const result = await clientFetch<{ success: boolean; data: ArticleComment[] }>('/api/comments');
    return result.data;
  } catch {
    return [];
  }
}

export async function approveComment(id: string): Promise<boolean> {
  try {
    await clientFetch(`/api/comments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Approved' }),
    });
    return true;
  } catch {
    return false;
  }
}

export async function deleteComment(id: string): Promise<boolean> {
  try {
    await clientFetch(`/api/comments/${id}`, { method: 'DELETE' });
    return true;
  } catch {
    return false;
  }
}

// Media Management
export async function getMedia(): Promise<Media[]> {
  try {
    const result = await clientFetch<{ success: boolean; data: Media[] }>('/api/media');
    return result.data;
  } catch {
    return [];
  }
}

export async function saveMedia(item: Partial<Media>): Promise<boolean> {
  try {
    await clientFetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return true;
  } catch {
    return false;
  }
}

export async function deleteMedia(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/media?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    return data.success;
  } catch (err) {
    console.error('deleteMedia error:', err);
    return false;
  }
}
