// BlockNote document → app-native lean format (src/types/content.ts via @ alias).
import type { ContentBlock, ContentSpan } from '@/types/content';

type AnyBlock = { type: string; props?: any; content?: any; children?: AnyBlock[] };

function styleSpan(text: string, styles: any, href?: string): ContentSpan {
  const s: ContentSpan = { text };
  if (styles?.bold) s.bold = true;
  if (styles?.italic) s.italic = true;
  if (styles?.underline) s.underline = true;
  if (styles?.strike) s.strikethrough = true;
  if (styles?.code) s.code = true;
  if (styles?.textColor && styles.textColor !== 'default') s.color = styles.textColor;
  if (href) s.href = href;
  return s;
}

function inlineToSpans(content: any): ContentSpan[] {
  if (!Array.isArray(content)) return [];
  const spans: ContentSpan[] = [];
  for (const item of content) {
    if (item.type === 'text') spans.push(styleSpan(item.text ?? '', item.styles));
    else if (item.type === 'link') {
      for (const sub of item.content ?? []) spans.push(styleSpan(sub.text ?? '', sub.styles, item.href));
    }
  }
  return spans;
}

function plainText(content: any): string {
  return inlineToSpans(content).map((s) => s.text ?? '').join('');
}

function blockToLean(b: AnyBlock): ContentBlock | null {
  switch (b.type) {
    case 'paragraph':
      return { type: 'p', spans: inlineToSpans(b.content) };
    case 'heading': {
      const level = Math.min(3, Math.max(1, (b.props?.level as number) ?? 1)) as 1 | 2 | 3;
      return { type: 'h', level, spans: inlineToSpans(b.content) };
    }
    case 'quote':
      return { type: 'quote', spans: inlineToSpans(b.content) };
    case 'checkListItem':
      return { type: 'todo', checked: !!b.props?.checked, spans: inlineToSpans(b.content) };
    case 'codeBlock':
      return { type: 'code', lang: b.props?.language || undefined, text: plainText(b.content) };
    case 'image':
      return b.props?.url ? { type: 'image', src: b.props.url, caption: b.props?.caption ? [{ text: b.props.caption }] : undefined } : null;
    case 'video':
      return b.props?.url ? { type: 'video', src: b.props.url } : null;
    case 'divider':
      return { type: 'divider' };
    case 'callout':
      return { type: 'callout', icon: b.props?.icon || '💡', color: b.props?.color, blocks: [{ type: 'p', spans: inlineToSpans(b.content) }] };
    case 'chart':
      return {
        type: 'chart',
        chart: {
          asset: (b.props?.asset || 'BTC').toUpperCase(),
          date: b.props?.date || 'now',
          chartType: b.props?.chartType || 'line',
          ...(b.props?.timeRange ? { timeRange: b.props.timeRange } : {}),
          ...(b.props?.candleInterval ? { candleInterval: b.props.candleInterval } : {}),
        } as any,
      };
    case 'price':
      return { type: 'price', price: { asset: (b.props?.asset || 'BTC').toUpperCase(), date: b.props?.date || 'now' } };
    default:
      return { type: 'unknown', original: b.type };
  }
}

/** Convert a BlockNote document into lean blocks, grouping consecutive list items. */
export function documentToLean(blocks: AnyBlock[]): ContentBlock[] {
  const out: ContentBlock[] = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b.type === 'bulletListItem' || b.type === 'numberedListItem') {
      const ordered = b.type === 'numberedListItem';
      const items: ContentSpan[][] = [];
      while (i < blocks.length && blocks[i].type === b.type) {
        items.push(inlineToSpans(blocks[i].content));
        i++;
      }
      out.push({ type: 'list', ordered, items });
      continue;
    }
    const lean = blockToLean(b);
    if (lean) out.push(lean);
    i++;
  }
  return out;
}
