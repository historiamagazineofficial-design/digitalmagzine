import HeroSection from '@/components/home/HeroSection';
import FeaturedRow from '@/components/home/FeaturedRow';
import ArticlesGrid from '@/components/home/ArticlesGrid';
import FictionSection from '@/components/home/FictionSection';
import VoicesSection from '@/components/home/VoicesSection';
import MythosSection from '@/components/home/MythosSection';
import RecentPerspectives from '@/components/article/RecentPerspectives';
import ScrollReveal from '@/components/layout/ScrollReveal';
import { getAllArticles, getHeroConfig } from '@/lib/api';

export default async function Home() {
  const heroConfig = await getHeroConfig();
  const articles = await getAllArticles();
  
  // Exclude the hero article and items not intended for the homepage
  const mainFeature = articles.find(a => a.slug === heroConfig.articleSlug) || articles[0];
  let secondFeature = articles.find(a => a.slug === heroConfig.secondarySlug);
  if (!secondFeature || secondFeature.slug === mainFeature?.slug) {
    secondFeature = articles.find(a => a.slug !== mainFeature?.slug) || articles[1] || articles[0];
  }

  const excludeSlugs = [mainFeature?.slug, secondFeature?.slug];
  const availableArticles = articles.filter(a => !excludeSlugs.includes(a.slug) && a.showOnHomepage !== false);

  // Fallback to avoid empty sections when the site has fewer than 7 articles in total
  const featuredRowArticles = availableArticles.length > 0 
    ? availableArticles.slice(0, 4) 
    : articles.slice(0, 4);
    
  const recentArticles = availableArticles.slice(4, 7).length > 0 
    ? availableArticles.slice(4, 7) 
    : articles.slice(0, 3);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
      <ScrollReveal threshold={0}>
        <HeroSection />
      </ScrollReveal>

      <ScrollReveal>
        <FeaturedRow articles={featuredRowArticles} />
      </ScrollReveal>

      <ScrollReveal>
        <RecentPerspectives articles={recentArticles} />
      </ScrollReveal>

      <ScrollReveal>
        <ArticlesGrid />
      </ScrollReveal>

      <ScrollReveal>
        <FictionSection />
      </ScrollReveal>
      
      <ScrollReveal>
        <MythosSection />
      </ScrollReveal>

      <ScrollReveal>
        <VoicesSection />
      </ScrollReveal>
    </main>
  );
}
