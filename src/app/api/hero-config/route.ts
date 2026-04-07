import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    let config = await prisma.heroConfig.findFirst();
    if (!config) {
      config = await prisma.heroConfig.create({
        data: { 
          articleSlug: 'the-girls-we-forgot-a-reckoning-with-selective-empathy',
          secondarySlugs: ['twenty-five-held-breaths'],
          featuredSlugs: [],
          perspectiveSlugs: [],
          fictionSlugs: [],
          articleSlugs: [],
          mythosSlugs: [],
        } as any,
      });
    }
    return NextResponse.json({ success: true, data: config });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    let config = await prisma.heroConfig.findFirst();

    // Helper to resolve a string (either slug or title) to a valid slug
    const resolveToSlug = async (input: string) => {
      if (!input) return '';
      // If user pasted a comma-separated list, take the first one
      const items = input.split(',').map(s => s.trim().replace(/^\//, '')).filter(Boolean);
      if (items.length === 0) return '';
      
      const firstInput = items[0];
      const art = await prisma.article.findFirst({
        where: {
          OR: [
            { slug: firstInput },
            { title: { equals: firstInput, mode: 'insensitive' } }
          ]
        }
      });
      return art ? art.slug : null; 
    };

    // Helper for arrays
    const resolveArrayToSlugs = async (inputs: any) => {
      // Handle either array or comma-separated string
      let rawItems: string[] = [];
      if (Array.isArray(inputs)) {
        rawItems = inputs;
      } else if (typeof inputs === 'string') {
        rawItems = inputs.split(',').map(s => s.trim().replace(/^\//, '')).filter(Boolean);
      }
      
      if (rawItems.length === 0) return [];
      const resolved = await Promise.all(rawItems.map(async (s) => {
          const art = await prisma.article.findFirst({
            where: {
              OR: [
                { slug: s },
                { title: { equals: s, mode: 'insensitive' } }
              ]
            }
          });
          return art ? art.slug : null;
      }));
      return resolved.filter(Boolean) as string[]; 
    };

    // Resolve primary feature
    const articleSlug = await resolveToSlug(body.articleSlug);
    const secondarySlugs = await resolveArrayToSlugs(body.secondarySlugs || body.secondarySlug); // Support both during migration

    // If they provided a value but it couldn't be resolved, that's an error
    if (body.articleSlug && !articleSlug) {
      return NextResponse.json({ success: false, error: `Article "${body.articleSlug}" not found.` }, { status: 404 });
    }

    const validData = {
      articleSlug: articleSlug || 'architecture-of-silence', // Default fallback
      secondarySlugs: secondarySlugs,
      customTitle: body.customTitle || '',
      customExcerpt: body.customExcerpt || '',
      featuredSlugs: await resolveArrayToSlugs(body.featuredSlugs),
      perspectiveSlugs: await resolveArrayToSlugs(body.perspectiveSlugs),
      fictionSlugs: await resolveArrayToSlugs(body.fictionSlugs),
      articleSlugs: await resolveArrayToSlugs(body.articleSlugs),
      mythosSlugs: await resolveArrayToSlugs(body.mythosSlugs),
    };

    if (config) {
      config = await prisma.heroConfig.update({
        where: { id: config.id },
        data: validData,
      });
    } else {
      config = await prisma.heroConfig.create({
        data: validData,
      });
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, data: config });
  } catch (err: any) {
    console.error('HeroConfig Update Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
