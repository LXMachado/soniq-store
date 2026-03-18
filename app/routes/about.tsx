import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { AnimateIn, StaggerContainer, StaggerItem } from '~/components/motion/AnimateIn';

export const meta: MetaFunction = () => {
  return [
    { title: 'About — SŌNIQ' },
    { name: 'description', content: 'Learn about SŌNIQ - premium audio equipment for audiophiles.' },
  ];
};

export default function About() {
  return (
    <div className="min-h-screen bg-bg-primary pt-[76px]">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-30" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <AnimateIn>
            <p className="text-xs uppercase tracking-[0.25em] text-text-tertiary mb-4">About SŌNIQ</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Engineering sound.<br />
              <span className="text-accent">Obsessively.</span>
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
              We don't design for specifications. We design for the moment when you close
              your eyes and forget you're listening to recordings. That is our only metric.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimateIn>
              <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=1000&fit=crop"
                  alt="SŌNIQ Manufacturing"
                  className="w-full h-full object-cover"
                />
              </div>
            </AnimateIn>
            <AnimateIn delay={0.1}>
              <div className="space-y-6">
                <h2 className="font-display text-3xl font-bold">Our Philosophy</h2>
                <div className="space-y-4 text-text-secondary leading-relaxed">
                  <p>
                    Founded by a team of audio engineers and musicians, SŌNIQ was born from
                    a simple frustration: the gap between what recordings contain and what
                    most headphones reproduce.
                  </p>
                  <p>
                    We spent three years in our labs, not chasing larger drivers or lower
                    impedance, but understanding how sound actually works. How a voice
                    should feel present. How a bass note should have texture, not just volume.
                  </p>
                  <p>
                    Every SŌNIQ product undergoes 127 individual measurements before leaving
                    our facility. But here's the thing — we don't publish those numbers.
                    We'd rather you listened.
                  </p>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-bg-secondary">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimateIn>
            <h2 className="font-display text-3xl font-bold text-center mb-16">Our Values</h2>
          </AnimateIn>
          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            <StaggerItem>
              <div className="p-8 rounded-2xl bg-bg-tertiary border border-border/50">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">Sound First</h3>
                <p className="text-text-secondary">
                  Specifications are a starting point, not an end goal. Every decision we make
                  is guided by how it affects the listening experience.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="p-8 rounded-2xl bg-bg-tertiary border border-border/50">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">Precision Engineering</h3>
                <p className="text-text-secondary">
                  Every component is selected for its acoustic properties. Our beryllium
                  drivers and OCC cables aren't marketing — they're math.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="p-8 rounded-2xl bg-bg-tertiary border border-border/50">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">Built to Last</h3>
                <p className="text-text-secondary">
                  We design products that become heirlooms. Replaceable cables, modular
                  components, and five-year warranties are our standard.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-accent/5 to-bg-primary" />
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <AnimateIn>
            <h2 className="font-display text-3xl font-bold mb-4">Hear the Difference</h2>
            <p className="text-text-secondary mb-8 max-w-lg mx-auto">
              Experience SŌNIQ in person at one of our authorized dealers, or shop online
              with our 30-day listening guarantee.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/collections/headphones"
                className="inline-flex items-center justify-center px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors"
              >
                Shop Now
              </Link>
              <Link
                to="/collections"
                className="inline-flex items-center justify-center px-6 py-3 border border-border text-text-primary font-medium rounded-lg hover:border-border-hover transition-colors"
              >
                View All Products
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}