const MESSAGES = [
  'Free worldwide shipping on orders over $500',
  'Engineering sound. Obsessively.',
  'New arrival: SŌNIQ H1 Pro — Beryllium driver technology',
  'SŌNIQ E3 Reference · Limited availability',
  'Free worldwide shipping on orders over $500',
  'Engineering sound. Obsessively.',
  'New arrival: SŌNIQ H1 Pro — Beryllium driver technology',
  'SŌNIQ E3 Reference · Limited availability',
];

export function AnnouncementBar() {
  return (
    <div className="bg-accent/10 border-b border-accent/20 overflow-hidden" style={{ height: '36px' }}>
      <div className="flex items-center h-full">
        <div className="animate-marquee flex whitespace-nowrap">
          {MESSAGES.map((msg, i) => (
            <span key={i} className="inline-flex items-center gap-3 px-8 text-xs uppercase tracking-widest text-text-secondary">
              <span className="text-accent">·</span>
              {msg}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
