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
}

// ── SEED DATA ─────────────────────────────────────────────────────

export const MOCK_ARTICLES: Article[] = [
  {
    slug: 'architecture-of-silence',
    title: 'The Architecture of Silence: Finding Stillness in the Modern Age',
    excerpt: 'An exploration into how traditional Islamic geometric patterns invoke a sense of contemplation and inner peace amidst relentless digital noise.',
    content: `<p class="mb-8"><span class="float-left text-7xl leading-none pr-3 pt-2 font-serif font-bold" style="color:#ec5b13">I</span>n the relentless cadence of modernity, silence is often misconstrued as an absence...</p>`,
    category: 'Articles',
    author: 'Dr. Ayesha Rahman',
    date: 'March 15, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=2574&auto=format&fit=crop',
    readingTime: '5 min read',
    status: 'Published',
    tags: ['#Theology', '#Sufism'],
  },
  // ... (keeping MOCK_ARTICLES for fallback)
];

// ── STRAPI CONFIG ────────────────────────────────────────────────

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

function mapStrapiToArticle(data: any): Article {
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
    tags: attrs.tags ? (typeof attrs.tags === 'string' ? attrs.tags.split(',') : attrs.tags) : []
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

export async function getAllArticles(locale?: string): Promise<Article[]> {
  // If Strapi is configured, it takes priority for Articles
  if (STRAPI_URL) {
    try {
      const result = await fetchStrapi<{ data: any[] }>('/articles', { 
        populate: '*',
        locale: locale || 'en'
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

export async function getArticleBySlug(slug: string, locale?: string): Promise<Article | undefined> {
  if (STRAPI_URL) {
    try {
      const result = await fetchStrapi<{ data: any[] }>('/articles', { 
        'filters[slug][$eq]': slug,
        'populate': '*',
        'locale': locale || 'en'
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

export async function getArticlesByCategory(categoryName: string, locale?: string): Promise<Article[]> {
  if (STRAPI_URL) {
    try {
      const result = await fetchStrapi<{ data: any[] }>('/articles', { 
        'filters[category][$equalsIgnoreCase]': categoryName,
        'populate': '*',
        'locale': locale || 'en'
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
export async function updateArticle(slug: string, data: Partial<Article>): Promise<boolean> {
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
export async function deleteArticle(slug: string): Promise<boolean> {
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

export async function getVoices(): Promise<any[]> {
  if (typeof window === 'undefined') {
    try {
      const { dbGetVoices } = await import('@/lib/server-db');
      return await dbGetVoices();
    } catch {
      return [];
    }
  }
  try {
    const result = await clientFetch<{ success: boolean; data: any[] }>('/api/voices');
    return result.data;
  } catch {
    return [];
  }
}

export async function saveVoice(voice: any): Promise<boolean> {
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

export async function deleteVoice(id: any): Promise<boolean> {
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

export async function getHeroConfig(): Promise<any> {
  if (typeof window === 'undefined') {
    try {
      const { dbGetHeroConfig } = await import('@/lib/server-db');
      return await dbGetHeroConfig({ articleSlug: 'architecture-of-silence' });
    } catch {
      return { articleSlug: 'architecture-of-silence' };
    }
  }
  try {
    const result = await clientFetch<{ success: boolean; data: any }>('/api/hero-config');
    return result.data;
  } catch {
    return { articleSlug: 'architecture-of-silence' };
  }
}

export async function saveHeroConfig(config: any): Promise<boolean> {
  try {
    await clientFetch('/api/hero-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    return true;
  } catch {
    return false;
  }
}

export async function getSiteSettings(): Promise<any> {
  if (typeof window === 'undefined') {
    try {
      const { dbGetSiteSettings } = await import('@/lib/server-db');
      return await dbGetSiteSettings({});
    } catch {
      return {};
    }
  }
  try {
    const result = await clientFetch<{ success: boolean; data: any }>('/api/settings');
    return result.data;
  } catch {
    return {};
  }
}

export async function saveSiteSettings(settings: any): Promise<boolean> {
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

export async function getFlaggedComments(): Promise<any[]> {
  if (typeof window === 'undefined') {
    try {
      const { dbGetPendingComments } = await import('@/lib/server-db');
      return await dbGetPendingComments([]);
    } catch {
      return [];
    }
  }
  try {
    const result = await clientFetch<{ success: boolean; data: any[] }>('/api/comments');
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
export async function getMedia(): Promise<any[]> {
  try {
    const result = await clientFetch<{ success: boolean; data: any[] }>('/api/media');
    return result.data;
  } catch {
    return [];
  }
}

export async function saveMedia(item: any): Promise<boolean> {
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
    await clientFetch(`/api/media/${id}`, { method: 'DELETE' });
    return true;
  } catch {
    return false;
  }
}
