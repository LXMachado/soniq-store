import { Link } from '@remix-run/react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link to="/" className="font-display text-2xl font-bold tracking-tight mb-4 block text-text-primary hover:text-accent transition-colors">
              SŌNIQ
            </Link>
            <p className="text-text-secondary max-w-sm leading-relaxed text-sm">
              Engineering sound. Obsessively. Premium audio equipment for those who demand perfection in every frequency.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest text-text-tertiary mb-5">Shop</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><Link to="/collections/headphones" className="hover:text-text-primary transition-colors">Headphones</Link></li>
              <li><Link to="/collections/iem" className="hover:text-text-primary transition-colors">In-Ear Monitors</Link></li>
              <li><Link to="/collections/dacs-amps" className="hover:text-text-primary transition-colors">DACs & Amps</Link></li>
              <li><Link to="/collections/cables" className="hover:text-text-primary transition-colors">Cables</Link></li>
              <li><Link to="/collections/new-arrivals" className="hover:text-text-primary transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest text-text-tertiary mb-5">Company</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><Link to="/about" className="hover:text-text-primary transition-colors">About</Link></li>
              <li><Link to="/search" className="hover:text-text-primary transition-colors">Search</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-tertiary text-xs">
            © 2024 SŌNIQ. All rights reserved.
          </p>
          <div className="flex gap-6 text-text-tertiary text-xs">
            <a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-text-primary transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
