import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { AnimateIn, StaggerContainer, StaggerItem } from '~/components/motion/AnimateIn';
import { ScrollReveal } from '~/components/motion/ScrollReveal';
import { Button } from '~/components/ui/Button';

const VALUES = [
  {
    title: 'Sound First',
    copy:
      'Specifications are a starting point, not an end goal. Every decision we make is guided by how it changes the listening experience.',
    icon: (
      <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: 'Precision Engineering',
    copy:
      "Every component is selected for its acoustic behavior. Our drivers, housings, and cable geometry are engineering choices, not merchandising language.",
    icon: (
      <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Built to Last',
    copy:
      'We design products that age with their owners. Replaceable cables, serviceable parts, and long warranty windows are standard, not premium extras.',
    icon: (
      <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
];

export const meta: MetaFunction = () => {
  return [
    { title: 'About — SŌNIQ' },
    { name: 'description', content: 'Learn about SŌNIQ - premium audio equipment for audiophiles.' },
  ];
};

function ParallaxImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-40, 40]);

  return (
    <div ref={ref} className={className}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y }}
        className="h-[112%] w-full object-cover"
      />
    </div>
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-bg-primary pt-[76px]">
      <section className="relative overflow-hidden border-b border-border/30 pb-24 pt-24">
        <div className="absolute inset-0 hero-glow opacity-30" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)', backgroundSize: '72px 72px' }} />
        <div className="container relative z-10 mx-auto px-4 sm:px-6">
          <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <AnimateIn>
              <p className="mb-4 text-xs uppercase tracking-[0.25em] text-text-tertiary">About SŌNIQ</p>
              <h1 className="font-display text-5xl font-bold leading-[0.95] md:text-6xl xl:text-7xl">
                We tune for the moment
                <br />
                <span className="text-accent">the recording disappears.</span>
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-text-secondary">
                SŌNIQ was founded by engineers, musicians, and obsessive listeners who wanted
                equipment that preserved texture, space, and timing instead of flattening them
                into specs on a box.
              </p>
            </AnimateIn>

            <ScrollReveal className="lg:pl-8">
              <div className="rounded-3xl border border-border/40 bg-bg-secondary/80 p-6 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-widest text-text-tertiary">Manifesto</p>
                <p className="mt-4 font-display text-2xl leading-tight text-text-primary">
                  “If the gear calls attention to itself, we are not finished.”
                </p>
                <p className="mt-5 text-sm leading-relaxed text-text-secondary">
                  Our benchmark is not a graph. It is the instant a voice feels embodied,
                  a room sounds dimensional, and a mix stops feeling like a file.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <ScrollReveal>
              <div className="about-parallax-frame rounded-[2rem] border border-border/40">
                <ParallaxImage
                  src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=900&h=1200&fit=crop"
                  alt="SŌNIQ listening room"
                  className="h-[34rem] overflow-hidden"
                />
              </div>
            </ScrollReveal>

            <div className="space-y-10">
              <ScrollReveal>
                <p className="text-xs uppercase tracking-[0.25em] text-text-tertiary">Origin</p>
                <h2 className="font-display text-3xl font-semibold md:text-5xl">
                  Born from frustration with gear that measured well and felt lifeless.
                </h2>
              </ScrollReveal>

              <div className="grid gap-8 md:grid-cols-2">
                <ScrollReveal delay={0.05}>
                  <p className="leading-relaxed text-text-secondary">
                    We started with a simple question: why did so much modern audio equipment
                    feel technically competent yet emotionally flat? The answer was rarely one
                    dramatic flaw. It was the accumulation of small decisions that robbed recordings
                    of air, weight, and pace.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={0.1}>
                  <p className="leading-relaxed text-text-secondary">
                    SŌNIQ spent three years prototyping transducers, damping systems, and housings
                    around one priority: preserving believable tone and spatial coherence. Every
                    product we ship is tuned to disappear between the listener and the music.
                  </p>
                </ScrollReveal>
              </div>

              <ScrollReveal delay={0.15}>
                <blockquote className="rounded-3xl border border-accent/20 bg-accent/8 p-8">
                  <p className="font-display text-2xl leading-tight text-text-primary md:text-3xl">
                    “We are not chasing brightness, bass, or drama. We are chasing conviction.”
                  </p>
                  <footer className="mt-4 text-sm uppercase tracking-widest text-text-tertiary">
                    Studio Notes, Brisbane Lab
                  </footer>
                </blockquote>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-bg-secondary py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-14 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-end">
            <ScrollReveal>
              <div>
                <p className="mb-4 text-xs uppercase tracking-[0.25em] text-text-tertiary">Editorial</p>
                <h2 className="font-display text-3xl font-semibold md:text-5xl">How we build</h2>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <p className="max-w-xl leading-relaxed text-text-secondary">
                The process is deliberately slow. We tune by ear, validate by measurement,
                then return to listening. If a product cannot survive both rooms, it does not ship.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            <ScrollReveal className="lg:col-span-5">
              <div className="space-y-5 rounded-3xl border border-border/40 bg-bg-primary/50 p-8">
                <span className="text-xs uppercase tracking-widest text-text-tertiary">01</span>
                <h3 className="font-display text-2xl font-semibold">Prototype until the color disappears</h3>
                <p className="leading-relaxed text-text-secondary">
                  We iterate housings, pad geometry, venting, and crossover points until a product
                  stops sounding like “a tuning” and starts sounding like a believable instrument
                  in space.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal className="lg:col-span-7">
              <div className="about-parallax-frame rounded-3xl border border-border/40">
                <ParallaxImage
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1400&h=900&fit=crop"
                  alt="SŌNIQ workbench and tuning station"
                  className="h-[24rem] overflow-hidden"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal className="lg:col-span-7">
              <div className="about-parallax-frame rounded-3xl border border-border/40">
                <ParallaxImage
                  src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1400&h=900&fit=crop"
                  alt="Studio session with reference listening"
                  className="h-[24rem] overflow-hidden"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal className="lg:col-span-5">
              <div className="flex h-full flex-col justify-between rounded-3xl border border-border/40 bg-bg-tertiary/70 p-8">
                <div>
                  <span className="text-xs uppercase tracking-widest text-text-tertiary">02</span>
                  <h3 className="mt-5 font-display text-2xl font-semibold">Measure what matters</h3>
                  <p className="mt-4 leading-relaxed text-text-secondary">
                    Every finished unit is checked across channel matching, distortion behavior,
                    assembly tolerances, and final listening. We keep the discipline, not the vanity.
                  </p>
                </div>
                <p className="mt-8 font-display text-xl leading-tight text-text-primary">
                  “The graph is evidence. It is not the experience.”
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-4 text-xs uppercase tracking-[0.25em] text-text-tertiary">Values</p>
                <h2 className="font-display text-3xl font-semibold md:text-5xl">What stays constant</h2>
              </div>
              <p className="max-w-lg leading-relaxed text-text-secondary">
                These are the non-negotiables behind every launch, revision, and listening session.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid gap-6 md:grid-cols-3">
            {VALUES.map((value) => (
              <StaggerItem key={value.title}>
                <div className="h-full rounded-3xl border border-border/40 bg-bg-secondary p-8">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10">
                    {value.icon}
                  </div>
                  <h3 className="font-display text-2xl font-semibold">{value.title}</h3>
                  <p className="mt-4 leading-relaxed text-text-secondary">{value.copy}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-accent/5 to-bg-primary" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-4 text-xs uppercase tracking-[0.25em] text-text-tertiary">Next Step</p>
              <h2 className="font-display text-3xl font-semibold md:text-5xl">Hear the result, not the pitch.</h2>
              <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-text-secondary">
                Start with our flagship headphones, browse the full collection, or compare product
                families to find the tuning that matches your listening habits.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button as={Link} to="/collections/headphones" variant="primary" size="lg">
                  Shop Headphones
                </Button>
                <Button as={Link} to="/collections" variant="secondary" size="lg">
                  View All Products
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
