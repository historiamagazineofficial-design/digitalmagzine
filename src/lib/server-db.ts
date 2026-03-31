/**
 * server-db.ts — POSTGRES VERSION
 * Direct PostgreSQL queries via Prisma.
 */
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export interface ArticleFilter {
  category?: string;
  status?: string; // 'Published' | 'Draft' | 'all'
}

// ── ARTICLES ──────────────────────────────────────────────────────


export async function dbGetArticles(filter: ArticleFilter = {}) {
  // Map simple filter like {category: '...'} to Prisma where
  const where: Prisma.ArticleWhereInput = {};
  if (filter.category) {
    where.category = { equals: filter.category, mode: 'insensitive' };
  }
  
  // Default to only showing Published unless 'all' or 'Draft' is specifically requested
  if (filter.status && filter.status !== 'all') {
    where.status = filter.status;
  } else if (!filter.status) {
    where.status = 'Published';
  }

  const articles = await prisma.article.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });



  return articles;
}

export async function dbGetArticleBySlug(slug: string, onlyPublished = false) {
  const where: Prisma.ArticleWhereInput = { slug };
  if (onlyPublished) {
    where.status = 'Published';
  }
  
  const article = await prisma.article.findFirst({
    where,
  });
  return article || undefined;
}

export async function dbCreateArticle(data: Prisma.ArticleCreateInput) {
  return await prisma.article.create({
    data,
  });
}

export async function dbUpdateArticle(slug: string, data: Prisma.ArticleUpdateInput) {
  return await prisma.article.update({
    where: { slug },
    data,
  });
}

export async function dbDeleteArticle(slug: string) {
  return await prisma.article.delete({
    where: { slug },
  });
}



// ── VOICES ────────────────────────────────────────────────────────

export async function dbGetVoices() {
  return await prisma.voice.findMany({
    orderBy: { createdAt: 'desc' },
  });
}



// ── TAGS ──────────────────────────────────────────────────────────

export async function dbGetTags(defaults: string[]) {
  const store = await prisma.tagStore.findFirst();
  if (!store) {
    await prisma.tagStore.create({ data: { tags: defaults } });
    return defaults;
  }
  return store.tags;
}

export async function dbUpdateTags(tags: string[]) {
  const store = await prisma.tagStore.findFirst();
  if (store) {
    return await prisma.tagStore.update({
      where: { id: store.id },
      data: { tags },
    });
  } else {
    return await prisma.tagStore.create({ data: { tags } });
  }
}

// ── SITE SETTINGS ─────────────────────────────────────────────────

export async function dbGetSiteSettings(defaults?: Prisma.SiteSettingsCreateInput) {
  const settings = await prisma.siteSettings.findFirst();
  if (!settings) {
    return await prisma.siteSettings.create({ data: defaults || {} });
  }
  return settings;
}

export async function dbUpdateSiteSettings(data: Prisma.SiteSettingsUpdateInput) {
  const settings = await prisma.siteSettings.findFirst();
  if (settings) {
    return await prisma.siteSettings.update({
      where: { id: settings.id },
      data,
    });
  } else {
    return await prisma.siteSettings.create({ data: data as Prisma.SiteSettingsCreateInput });
  }
}

// ── HERO CONFIG ───────────────────────────────────────────────────

export async function dbGetHeroConfig(defaults?: Prisma.HeroConfigCreateInput) {
  const config = await prisma.heroConfig.findFirst();
  if (!config) {
    return await prisma.heroConfig.create({ data: defaults || { articleSlug: '' } });
  }
  return config;
}

export async function dbUpdateHeroConfig(data: Prisma.HeroConfigUpdateInput) {
  const config = await prisma.heroConfig.findFirst();
  if (config) {
    return await prisma.heroConfig.update({
      where: { id: config.id },
      data,
    });
  } else {
    return await prisma.heroConfig.create({ data: data as Prisma.HeroConfigCreateInput });
  }
}

// ── COMMENTS ──────────────────────────────────────────────────────

export async function dbGetPendingComments(seeds: Prisma.CommentCreateInput[] = []) {
  const count = await prisma.comment.count();
  if (count === 0 && seeds.length > 0) {
    for (const s of seeds) await prisma.comment.create({ data: s });
  }
  return await prisma.comment.findMany({
    where: { status: 'Pending' },
    orderBy: { createdAt: 'desc' },
  });
}

export async function dbUpdateCommentStatus(id: string, status: string) {
  return await prisma.comment.update({
    where: { id },
    data: { status },
  });
}

export async function dbDeleteComment(id: string) {
  return await prisma.comment.delete({
    where: { id },
  });
}
