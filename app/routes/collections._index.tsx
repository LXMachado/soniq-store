import { Link } from '@remix-run/react';
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { storefront } from '~/lib/storefront';
import { AnimateIn, StaggerContainer, StaggerItem } from '~/components/motion/AnimateIn';

export const meta: MetaFunction = () => {
  return [
    { title: 'Shop All — SŌNIQ' },
    { name: 'description', content: 'Browse our complete collection of premium audio equipment.' },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const query = `
    query Collections {
      collections(first: 20) {
        nodes {
          id
          handle
          title
          description
          image {
            url
            altText
          }
        }
      }
    }
  `;

  type CollectionsData = {
    collections: {
      nodes: Array<{
        id: string;
        handle: string;
        title: string;
        description: string;
        image: { url: string; altText: string } | null;
      }>;
    };
  };

  const data = await storefront<CollectionsData>(query);

  return json({ collections: data.collections?.nodes ?? [] });
}

const COLLECTION_CARDS = [
  {
    handle: 'headphones',
    title: 'Headphones',
    subtitle: 'Over-ear & On-ear',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=750&fit=crop',
  },
  {
    handle: 'iem',
    title: 'In-Ear Monitors',
    subtitle: 'IEMs & Custom',
    img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=750&fit=crop',
  },
  {
    handle: 'dacs-amps',
    title: 'DACs & Amps',
    subtitle: 'Desktop & Portable',
    img: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=600&h=750&fit=crop',
  },
  {
    handle: 'cables',
    title: 'Cables',
    subtitle: 'Premium Upgrades',
    img: 'https://images.unsplash.com/photo-1601944179066-29786cb9d32a?w=600&h=750&fit=crop',
  },
  {
    handle: 'new-arrivals',
    title: 'New Arrivals',
    subtitle: 'Latest Additions',
    img: 'https://images.unsplash.com/photo-1519810755548-39cd217da494?w=600&h=750&fit=crop',
  },
];

export default function Collections() {
  const { collections } = useLoaderData<typeof loader>();

  // Use mock collections if API returns empty
  const displayCollections = collections.length > 0 ? collections : COLLECTION_CARDS;

  return (
    <div className="min-h-screen bg-bg-primary pt-[76px]">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-20" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <AnimateIn>
            <p className="text-xs uppercase tracking-[0.25em] text-text-tertiary mb-4">Collections</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Shop by Category</h1>
            <p className="text-lg text-text-secondary max-w-2xl">
              Explore our complete range of premium audio equipment, from flagship
              headphones to precision IEMs and desktop amplification.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCollections.map((collection: any, index: number) => {
              // For mock data, get from static array
              const mockData = COLLECTION_CARDS.find(c => c.handle === collection.handle) || collection;
              
              return (
                <StaggerItem key={collection.handle || index}>
                  <Link
                    to={`/collections/${collection.handle}`}
                    className="group relative block aspect-[4/5] rounded-xl overflow-hidden border border-border/50 hover:border-accent/30 transition-colors duration-300"
                  >
                    <img
                      src={mockData.image?.url || mockData.img}
                      alt={mockData.image?.altText || collection.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-107 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h2 className="font-display text-2xl font-semibold text-white mb-1">
                        {collection.title || mockData.title}
                      </h2>
                      <p className="text-white/60 text-sm">
                        {collection.description || mockData.subtitle}
                      </p>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}