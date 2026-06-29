import { createReactBlockSpec } from '@blocknote/react';

// Divider = the preview/full split point. Everything above the first divider is
// the feed preview; the whole doc is the full body.
export const dividerBlock = createReactBlockSpec(
  { type: 'divider', content: 'none', propSchema: {} },
  {
    render: () => (
      <div contentEditable={false} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 0' }}>
        <div style={{ flex: 1, height: 1, background: '#888' }} />
        <span style={{ fontSize: 11, color: '#888', whiteSpace: 'nowrap' }}>corte da prévia</span>
        <div style={{ flex: 1, height: 1, background: '#888' }} />
      </div>
    ),
  },
);
