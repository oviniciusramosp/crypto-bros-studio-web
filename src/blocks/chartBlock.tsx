import { createReactBlockSpec } from '@blocknote/react';

const ORANGE = '#F7931A';
const CHART_TYPES = ['line', 'candle', 'rsi', 'fng', 'cycle'];

// Custom Chart block — structured (no error-prone {{chart:...}} text). Edited
// inline; serializes to { type:'chart', chart:{...} } via convert/toLean.
export const chartBlock = createReactBlockSpec(
  {
    type: 'chart',
    content: 'none',
    propSchema: {
      asset: { default: 'BTC' },
      chartType: { default: 'line', values: CHART_TYPES },
      date: { default: 'now' },
      timeRange: { default: '6m' },
    },
  },
  {
    render: ({ block, editor }) => {
      const p = block.props as any;
      const set = (patch: any) => editor.updateBlock(block, { props: { ...p, ...patch } } as any);
      const field: React.CSSProperties = {
        background: 'rgba(247,147,26,0.08)', border: `1px solid ${ORANGE}`, color: '#fff',
        borderRadius: 6, padding: '4px 8px', fontSize: 13, outline: 'none',
      };
      return (
        <div
          contentEditable={false}
          style={{
            border: `1.5px solid ${ORANGE}`, background: 'rgba(247,147,26,0.06)',
            borderRadius: 12, padding: 12, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', width: '100%',
          }}
        >
          <span style={{ fontSize: 18 }}>📈</span>
          <span style={{ color: ORANGE, fontWeight: 600 }}>Chart</span>
          <input style={{ ...field, width: 70 }} value={p.asset} onChange={(e) => set({ asset: e.target.value.toUpperCase() })} />
          <select style={field} value={p.chartType} onChange={(e) => set({ chartType: e.target.value })}>
            {CHART_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input style={{ ...field, width: 70 }} value={p.timeRange} onChange={(e) => set({ timeRange: e.target.value })} placeholder="6m" />
          <input style={{ ...field, width: 90 }} value={p.date} onChange={(e) => set({ date: e.target.value })} placeholder="now" />
        </div>
      );
    },
  },
);
