import type { Metadata } from 'next';
import { getCurrentDictionary } from '@/lib/i18n-server';
import { generateWebsiteJsonLd } from '@/lib/seo';
import { incidentStore } from '@/lib/incidents/store';
import { SpbeBanner } from './_components/spbe-banner';
import { HomeContainer } from './_components/home-container';
import { SpbeFooter } from './_components/spbe-footer';

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getCurrentDictionary();
  return {
    title: `${dict.metadata.title}`,
    description: dict.metadata.description,
    openGraph: {
      title: dict.metadata.title,
      description: dict.metadata.description,
      type: 'website',
    },
  };
}

export default async function HomePage() {
  const { locale } = await getCurrentDictionary();
  const websiteJsonLd = generateWebsiteJsonLd(locale);

  // Initial SSR data from incident store
  const { incidents } = incidentStore.getAll({ limit: 20 });
  const stats = incidentStore.getStats();

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-black font-sans text-zinc-900 dark:text-zinc-50 transition-colors">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd),
        }}
      />

      {/* Official SPBE Top Red Banner Bar */}
      <SpbeBanner />

      {/* Interactive Main Container (Header, KPI Cards, Filter, Table, Modals) */}
      <HomeContainer initialIncidents={incidents} initialStats={stats} />

      {/* Official SPBE Footer */}
      <SpbeFooter />
    </div>
  );
}
