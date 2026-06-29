import { useEffect, useState } from 'react';
import { filterSuggestionItems } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/mantine';
import { SuggestionMenuController, getDefaultReactSlashMenuItems, useCreateBlockNote } from '@blocknote/react';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import { schema } from './blocks/schema';
import { documentToLean } from './convert/toLean';
import { Preview } from './preview/Preview';
import type { ContentBlock } from '@/types/content';

const INITIAL: any[] = [
  { type: 'heading', props: { level: 2 }, content: 'Bitcoin atinge novo topo histórico' },
  {
    type: 'paragraph',
    content: [
      { type: 'text', text: 'O ', styles: {} },
      { type: 'text', text: 'Bitcoin', styles: { bold: true } },
      { type: 'text', text: ' rompeu sua máxima — veja a ', styles: {} },
      { type: 'link', href: 'https://example.com', content: [{ type: 'text', text: 'análise completa', styles: {} }] },
      { type: 'text', text: '.', styles: {} },
    ],
  },
  { type: 'bulletListItem', content: 'Fluxo institucional via ETFs' },
  { type: 'bulletListItem', content: 'Oferta líquida em queda' },
  { type: 'chart', props: { asset: 'BTC', chartType: 'line', date: 'now', timeRange: '6m' } },
  { type: 'callout', props: { icon: '💡', color: 'blue_background' }, content: 'Dica: cuidado ao comprar no topo.' },
  { type: 'divider' },
  { type: 'paragraph', content: 'Conteúdo completo após o corte da prévia.' },
];

function customSlashItems(editor: any) {
  const cb = (type: string, props?: any) => () => {
    const ref = editor.getTextCursorPosition().block;
    editor.insertBlocks([{ type, ...(props ? { props } : {}) }], ref, 'after');
  };
  return [
    {
      title: 'Chart', group: 'Crypto Bros', subtext: 'Gráfico de cripto', aliases: ['chart', 'grafico', 'gráfico'],
      onItemClick: cb('chart', { asset: 'BTC', chartType: 'line', date: 'now', timeRange: '6m' }),
    },
    {
      title: 'Divider (corte da prévia)', group: 'Crypto Bros', subtext: 'Onde o feed corta', aliases: ['divider', 'corte'],
      onItemClick: cb('divider'),
    },
    {
      title: 'Callout', group: 'Crypto Bros', subtext: 'Destaque com ícone', aliases: ['callout', 'destaque'],
      onItemClick: cb('callout', { icon: '💡', color: 'blue_background' }),
    },
  ];
}

export function App() {
  const editor = useCreateBlockNote({ schema, initialContent: INITIAL });
  const [lean, setLean] = useState<ContentBlock[]>([]);

  const refresh = () => setLean(documentToLean(editor.document as any));
  useEffect(refresh, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', color: '#eee' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: '1px solid #333', background: '#1b1b1f' }}>
        <strong style={{ color: '#F7931A' }}>Crypto Bros Studio</strong>
        <span style={{ fontSize: 12, color: '#888' }}>editor completo (BlockNote) + preview 1:1</span>
        <div style={{ flex: 1 }} />
        <button style={{ background: '#F7931A', color: '#111', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 600, cursor: 'pointer' }}>
          Publicar
        </button>
      </header>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Editor */}
        <div style={{ flex: 1, overflow: 'auto', background: '#1b1b1f' }}>
          <BlockNoteView editor={editor} theme="dark" slashMenu={false} onChange={refresh}>
            <SuggestionMenuController
              triggerCharacter="/"
              getItems={async (query) =>
                filterSuggestionItems([...getDefaultReactSlashMenuItems(editor), ...customSlashItems(editor)], query)
              }
            />
          </BlockNoteView>
        </div>
        {/* Live 1:1 preview (real app renderer) */}
        <div style={{ width: 480, overflow: 'auto', borderLeft: '1px solid #333', background: '#2a2a2e' }}>
          <Preview blocks={lean} />
        </div>
      </div>
    </div>
  );
}
