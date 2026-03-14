/**
 * server-db.ts — POSTGRES VERSION
 * Direct PostgreSQL queries via Prisma.
 */
import { prisma } from '@/lib/prisma';
import type { Article } from '@/lib/api';

// ── ARTICLES ──────────────────────────────────────────────────────

import { MOCK_ARTICLES } from './api';

export async function dbGetArticles(filter = {}) {
  // Map simple filter like {category: '...'} to Prisma where
  const where: any = {};
  if ((filter as any).category) {
    where.category = { equals: (filter as any).category, mode: 'insensitive' };
  }

  const articles = await prisma.article.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  // Auto-seed if empty
  if (articles.length === 0 && !Object.keys(where).length) {
    await dbSeedArticlesIfEmpty(MOCK_ARTICLES);
    return await prisma.article.findMany({ orderBy: { createdAt: 'desc' } });
  }

  return articles;
}

export async function dbGetArticleBySlug(slug: string) {
  const article = await prisma.article.findUnique({
    where: { slug },
  });
  return article || undefined;
}

export async function dbCreateArticle(data: any) {
  return await prisma.article.create({
    data,
  });
}

export async function dbUpdateArticle(slug: string, data: any) {
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

export async function dbSeedArticlesIfEmpty(mockArticles: Article[]) {
  const count = await prisma.article.count();
  if (count === 0) {
    console.log('Seeding articles into Postgres...');
    for (const art of mockArticles) {
      // Remove _id from mock if exists
      const { _id, ...rest } = art as any;
      await prisma.article.create({ data: rest });
    }
  }
}

// ── VOICES ────────────────────────────────────────────────────────

export async function dbGetVoices() {
  return await prisma.voice.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function dbSeedVoicesIfEmpty(mockVoices: any[]) {
  const count = await prisma.voice.count();
  if (count === 0) {
    console.log('Seeding voices into Postgres...');
    for (const v of mockVoices) {
      await prisma.voice.create({ data: v });
    }
  }
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

export async function dbGetSiteSettings(defaults: any) {
  const settings = await prisma.siteSettings.findFirst();
  if (!settings) {
    return await prisma.siteSettings.create({ data: defaults });
  }
  return settings;
}

export async function dbUpdateSiteSettings(data: any) {
  const settings = await prisma.siteSettings.findFirst();
  if (settings) {
    return await prisma.siteSettings.update({
      where: { id: settings.id },
      data,
    });
  } else {
    return await prisma.siteSettings.create({ data });
  }
}

// ── HERO CONFIG ───────────────────────────────────────────────────

export async function dbGetHeroConfig(defaults: any) {
  const config = await prisma.heroConfig.findFirst();
  if (!config) {
    return await prisma.heroConfig.create({ data: defaults });
  }
  return config;
}

export async function dbUpdateHeroConfig(data: any) {
  const config = await prisma.heroConfig.findFirst();
  if (config) {
    return await prisma.heroConfig.update({
      where: { id: config.id },
      data,
    });
  } else {
    return await prisma.heroConfig.create({ data });
  }
}

// ── COMMENTS ──────────────────────────────────────────────────────

export async function dbGetPendingComments(seeds: any[] = []) {
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
