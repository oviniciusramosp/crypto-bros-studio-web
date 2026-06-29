import { useEffect, useState } from 'react';
import { filterSuggestionItems } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/mantine';
import { SuggestionMenuController, getDefaultReactSlashMenuItems, useCreateBlockNote } from '@blocknote/react';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import { schema } from './blocks/schema';
import { documentToLean } from './convert/toLean';
import { documentFromLean } from './convert/fromLean';
import { Preview } from './preview/Preview';
import { fetchIndex, fetchPostDoc, publishPost, getToken, setToken, type PostMeta } from './publish/github';
import type { ContentBlock, FeedIndex } from '@/types/content';

const CATEGORIES = ['Mercado', 'Estudos', 'Altcoins', 'Trade', 'Video', 'ATH', 'Mais'];
const ORANGE = '#F7931A';

const INITIAL: any[] = [
  { type: 'heading', props: { level: 2 }, content: 'Novo post' },
  { type: 'paragraph', content: 'Escreva aqui. Use "/" para inserir blocos (chart, callout, divider…).' },
];

const blankMeta = (): PostMeta => ({
  id: '', locale: 'pt', slug: '', title: '', excerpt: '',
  categories: ['Mercado'], tags: [], cover: null, thumbnail: null, icon: null,
});

function customSlashItems(editor: any) {
  const cb = (type: string, props?: any) => () => {
    const ref = editor.getTextCursorPosition().block;
    editor.insertBlocks([{ type, ...(props ? { props } : {}) }], ref, 'after');
  };
  return [
    { title: 'Chart', group: 'Crypto Bros', subtext: 'Gráfico de cripto', aliases: ['chart', 'grafico'], onItemClick: cb('chart', { asset: 'BTC', chartType: 'line', date: 'now', timeRange: '6m' }) },
    { title: 'Divider (corte da prévia)', group: 'Crypto Bros', subtext: 'Onde o feed corta', aliases: ['divider', 'corte'], onItemClick: cb('divider') },
    { title: 'Callout', group: 'Crypto Bros', subtext: 'Destaque com ícone', aliases: ['callout', 'destaque'], onItemClick: cb('callout', { icon: '💡', color: 'blue_background' }) },
  ];
}

const fieldStyle: React.CSSProperties = { background: '#2a2a2e', border: '1px solid #444', color: '#eee', borderRadius: 6, padding: '6px 8px', fontSize: 13, outline: 'none' };

export function App() {
  const editor = useCreateBlockNote({ schema, initialContent: INITIAL });
  const [lean, setLean] = useState<ContentBlock[]>([]);
  const [meta, setMeta] = useState<PostMeta>(blankMeta());
  const [index, setIndex] = useState<FeedIndex | null>(null);
  const [busy, setBusy] = useState('');

  const refresh = () => setLean(documentToLean(editor.document as any));
  useEffect(refresh, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { fetchIndex().then(setIndex).catch(() => {}); }, []);

  const patch = (p: Partial<PostMeta>) => setMeta((m) => ({ ...m, ...p }));

  async function loadPost(id: string, locale: string) {
    if (!id) return;
    setBusy('Carregando…');
    try {
      const doc = await fetchPostDoc(id, locale);
      editor.replaceBlocks(editor.document, documentFromLean(doc.blocks) as any);
      setMeta({
        id: doc.id, locale: doc.locale, slug: doc.slug,
        title: (doc.title || []).map((s) => s.text ?? '').join(''),
        excerpt: doc.excerpt, categories: doc.categories as string[],
        tags: (doc.tags || []).map((t) => t.name), cover: doc.cover, thumbnail: doc.thumbnail, icon: null,
      });
      setTimeout(refresh, 0);
    } catch (e: any) {
      alert('Erro ao carregar: ' + e.message);
    } finally {
      setBusy('');
    }
  }

  async function doPublish() {
    let token = getToken();
    if (!token) {
      token = window.prompt('GitHub token (fine-grained, Contents: read & write em crypto-bros-content):') || '';
      if (!token) return;
      setToken(token);
    }
    const finalMeta: PostMeta = { ...meta, id: meta.id || meta.slug };
    if (!finalMeta.slug) { alert('Defina um slug.'); return; }
    setBusy('Publicando…');
    try {
      await publishPost(finalMeta, documentToLean(editor.document as any), token);
      setIndex(await fetchIndex());
      alert(`Publicado: ${finalMeta.slug} (${finalMeta.locale}) ✓`);
    } catch (e: any) {
      alert('Erro ao publicar: ' + e.message);
    } finally {
      setBusy('');
    }
  }

  function newPost() {
    editor.replaceBlocks(editor.document, INITIAL as any);
    setMeta(blankMeta());
    setTimeout(refresh, 0);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', color: '#eee', fontFamily: 'Inter Variable, system-ui, sans-serif' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: '1px solid #333', background: '#1b1b1f' }}>
        <strong style={{ color: ORANGE }}>Crypto Bros Studio</strong>
        <select style={fieldStyle} value={`${meta.id}|${meta.locale}`} onChange={(e) => { const [id, loc] = e.target.value.split('|'); loadPost(id, loc); }}>
          <option value="|">— abrir post —</option>
          {(index?.posts || []).map((p) => (
            <option key={`${p.id}|${p.locale}`} value={`${p.id}|${p.locale}`}>
              [{p.locale}] {(p.title || []).map((s) => s.text).join('') || p.slug}
            </option>
          ))}
        </select>
        <button style={{ ...fieldStyle, cursor: 'pointer' }} onClick={newPost}>+ Novo</button>
        <div style={{ flex: 1 }} />
        {busy && <span style={{ fontSize: 12, color: '#888' }}>{busy}</span>}
        <button onClick={doPublish} style={{ background: ORANGE, color: '#111', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 600, cursor: 'pointer' }}>
          Publicar
        </button>
      </header>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Editor + metadata */}
        <div style={{ flex: 1, overflow: 'auto', background: '#1b1b1f', display: 'flex', flexDirection: 'column' }}>
          {/* Metadata panel */}
          <div style={{ padding: 16, borderBottom: '1px solid #2a2a2e', display: 'grid', gap: 8 }}>
            <input style={{ ...fieldStyle, fontSize: 18, fontWeight: 600 }} placeholder="Título do post" value={meta.title} onChange={(e) => patch({ title: e.target.value })} />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input style={{ ...fieldStyle, flex: 1, minWidth: 120 }} placeholder="slug (ex: bitcoin-novo-topo)" value={meta.slug} onChange={(e) => patch({ slug: e.target.value })} />
              <select style={fieldStyle} value={meta.locale} onChange={(e) => patch({ locale: e.target.value as 'pt' | 'en' })}>
                <option value="pt">PT</option><option value="en">EN</option>
              </select>
              <select style={fieldStyle} value={meta.categories[0]} onChange={(e) => patch({ categories: [e.target.value] })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input style={{ ...fieldStyle, width: 60 }} placeholder="ícone 💡" value={meta.icon || ''} onChange={(e) => patch({ icon: e.target.value || null })} />
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input style={{ ...fieldStyle, flex: 1, minWidth: 140 }} placeholder="URL da capa" value={meta.cover || ''} onChange={(e) => patch({ cover: e.target.value || null })} />
              <input style={{ ...fieldStyle, flex: 1, minWidth: 140 }} placeholder="URL do thumbnail (vídeo)" value={meta.thumbnail || ''} onChange={(e) => patch({ thumbnail: e.target.value || null })} />
            </div>
            <input style={fieldStyle} placeholder="tags (separadas por vírgula)" value={meta.tags.join(', ')} onChange={(e) => patch({ tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} />
            <input style={fieldStyle} placeholder="resumo (excerpt)" value={meta.excerpt} onChange={(e) => patch({ excerpt: e.target.value })} />
          </div>
          {/* Editor */}
          <BlockNoteView editor={editor} theme="dark" slashMenu={false} onChange={refresh}>
            <SuggestionMenuController
              triggerCharacter="/"
              getItems={async (query) => filterSuggestionItems([...getDefaultReactSlashMenuItems(editor), ...customSlashItems(editor)], query)}
            />
          </BlockNoteView>
        </div>

        {/* Live 1:1 preview */}
        <div style={{ width: 480, overflow: 'auto', borderLeft: '1px solid #333', background: '#2a2a2e' }}>
          <Preview blocks={lean} />
        </div>
      </div>
    </div>
  );
}
