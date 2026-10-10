import { categoryStyle, tileGradient, type GlyphMode } from '@/domain/categories';

function pathPaint(mode: GlyphMode) {
  return {
    fill: mode === 'f' ? '#fff' : mode === 'l' ? 'rgba(255,255,255,.55)' : mode === 'd' ? 'rgba(0,0,0,.28)' : 'none',
    stroke: mode === 's' ? '#fff' : mode === 'ds' ? 'rgba(0,0,0,.3)' : 'none',
  };
}

export function CategoryGlyph({ name, size }: { name: string; size: number }) {
  const style = categoryStyle(name);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {style.glyphs.map((glyph, index) => {
        const paint = pathPaint(glyph.mode);
        return (
          <path
            key={index}
            d={glyph.d}
            fill={paint.fill}
            stroke={paint.stroke}
            strokeWidth="2"
          />
        );
      })}
    </svg>
  );
}

export function Tile({ category, size = 22 }: { category: string; size?: number }) {
  const style = categoryStyle(category);
  return (
    <div className="tile" style={{ background: tileGradient(style.color) }}>
      <CategoryGlyph name={category} size={size + 2} />
    </div>
  );
}
