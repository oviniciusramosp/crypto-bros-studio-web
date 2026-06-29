// Lean format → BlockNote document (for loading existing posts into the editor).
import type { ContentBlock, ContentSpan } from '@/types/content';

function spanToInline(s: ContentSpan): any {
  const styles: any = {};
  if (s.bold) styles.bold = true;
  if (s.italic) styles.italic = true;
  if (s.underline) styles.underline = true;
  if (s.strikethrough) styles.strike = true;
  if (s.code) styles.code = true;
  if (s.color) styles.textColor = s.color;
  const text = { type: 'text', text: s.text ?? '', styles };
  if (s.href) return { type: 'link', href: s.href, content: [text] };
  return text;
}

const spansToInline = (spans?: ContentSpan[]) => (spans ?? []).map(spanToInline);

function leanBlockToBN(b: ContentBlock): any | any[] | null {
  switch (b.type) {
    case 'p':
      return { type: 'paragraph', content: spansToInline(b.spans) };
    case 'h':
      return { type: 'heading', props: { level: b.level }, content: spansToInline(b.spans) };
    case 'list':
      return b.items.map((item) => ({ type: b.ordered ? 'numberedListItem' : 'bulletListItem', content: spansToInline(item) }));
    case 'todo':
      return { type: 'checkListItem', props: { checked: b.checked }, content: spansToInline(b.spans) };
    case 'quote':
      return { type: 'quote', content: spansToInline(b.spans) };
    case 'code':
      return { type: 'codeBlock', props: b.lang ? { language: b.lang } : {}, content: b.text ? [{ type: 'text', text: b.text, styles: {} }] : [] };
    case 'image':
      return { type: 'image', props: { url: b.src } };
    case 'video':
      return { type: 'video', props: { url: b.src } };
    case 'divider':
      return { type: 'divider' };
    case 'callout': {
      const firstP = b.blocks.find((x) => x.type === 'p') as any;
      return { type: 'callout', props: { icon: b.icon || '💡', color: b.color || 'blue_background' }, content: spansToInline(firstP?.spans) };
    }
    case 'chart':
      return { type: 'chart', props: { ...b.chart } };
    case 'price':
      return { type: 'price', props: { ...b.price } };
    default:
      return { type: 'paragraph', content: [] };
  }
}

export function documentFromLean(blocks: ContentBlock[]): any[] {
  const out: any[] = [];
  for (const b of blocks ?? []) {
    const bn = leanBlockToBN(b);
    if (Array.isArray(bn)) out.push(...bn);
    else if (bn) out.push(bn);
  }
  return out.length ? out : [{ type: 'paragraph' }];
}
