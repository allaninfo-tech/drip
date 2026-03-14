export function SkeletonCard() {
  return (
    <div style={{ width: 160, flexShrink: 0 }}>
      <div className="skeleton" style={{ width: '100%', aspectRatio: '2/3', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 14, width: '80%', marginBottom: 6 }} />
      <div className="skeleton" style={{ height: 11, width: '50%' }} />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <section className="media-section">
      <div className="section-header">
        <div className="skeleton" style={{ height: 22, width: 180 }} />
      </div>
      <div className="row-scroll" style={{ overflow: 'hidden' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </section>
  );
}

export function SkeletonHero() {
  return (
    <div className="skeleton" style={{ width: '100%', height: '92vh', minHeight: 600 }} />
  );
}
