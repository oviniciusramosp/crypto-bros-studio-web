import { createReactBlockSpec } from '@blocknote/react';

// Callout with an editable icon + inline text (maps to the app's CalloutBlock).
export const calloutBlock = createReactBlockSpec(
  {
    type: 'callout',
    content: 'inline',
    propSchema: {
      icon: { default: '💡' },
      color: { default: 'blue_background' },
    },
  },
  {
    render: ({ block, editor, contentRef }) => {
      const p = block.props as any;
      return (
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: 12, width: '100%' }}>
          <input
            contentEditable={false}
            value={p.icon}
            onChange={(e) => editor.updateBlock(block, { props: { ...p, icon: e.target.value } } as any)}
            style={{ width: 28, background: 'transparent', border: 'none', fontSize: 18, outline: 'none' }}
          />
          <div ref={contentRef} style={{ flex: 1 }} />
        </div>
      );
    },
  },
);
