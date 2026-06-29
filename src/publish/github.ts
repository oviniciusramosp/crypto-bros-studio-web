// GitHub Contents API publish + read for the crypto-bros-content repo.
import type { ContentBlock, ContentSpan, FeedIndex, PostDoc, PostSummary } from '@/types/content';
import { SCHEMA_VERSION } from '@/types/content';

const OWNER = 'oviniciusramosp';
const REPO = 'crypto-bros-content';
const BRANCH = 'main';
const RAW = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}`;
const TOKEN_KEY = 'cbros_gh_pat';

export const getToken = () => localStorage.getItem(TOKEN_KEY) || '';
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);

export interface PostMeta {
  id: string;
  locale: 'pt' | 'en';
  slug: string;
  title: string;
  excerpt: string;
  categories: string[];
  tags: string[];
  cover: string | null;
  thumbnail: string | null;
  icon: string | null;
}

export async function fetchIndex(): Promise<FeedIndex> {
  const res = await fetch(`${RAW}/index.json?t=${Date.now()}`);
  if (!res.ok) return { schemaVersion: SCHEMA_VERSION, generatedAt: '', posts: [] };
  return res.json();
}

export async function fetchPostDoc(id: string, locale: string): Promise<PostDoc> {
  const res = await fetch(`${RAW}/posts/${id}.${locale}.json?t=${Date.now()}`);
  if (!res.ok) throw new Error(`Post ${id}.${locale} não encontrado (${res.status})`);
  return res.json();
}

const ghHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
});

async function putFile(path: string, content: string, message: string, token: string) {
  let sha: string | undefined;
  const get = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`, { headers: ghHeaders(token) });
  if (get.ok) sha = (await get.json()).sha;
  const put = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: ghHeaders(token),
    body: JSON.stringify({
      message,
      content: btoa(unescape(encodeURIComponent(content))), // utf-8 safe base64
      branch: BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!put.ok) throw new Error(`${put.status} ${await put.text()}`);
}

function splitPreview(blocks: ContentBlock[]): { preview: ContentBlock[]; hasMore: boolean } {
  const idx = blocks.findIndex((b) => b.type === 'divider');
  return idx < 0 ? { preview: blocks, hasMore: false } : { preview: blocks.slice(0, idx), hasMore: true };
}

function titleSpans(title: string): ContentSpan[] {
  return [{ text: title }];
}

export async function publishPost(meta: PostMeta, blocks: ContentBlock[], token: string): Promise<void> {
  const { preview, hasMore } = splitPreview(blocks);
  const now = new Date().toISOString();
  const common = {
    id: meta.id,
    locale: meta.locale,
    slug: meta.slug,
    date: now,
    updated: now,
    categories: meta.categories as any,
    tags: meta.tags.map((name) => ({ name, color: 'blue' as const })),
    author: { id: 'studio', name: 'Crypto Bros', avatar: null },
    cover: meta.cover,
    thumbnail: meta.thumbnail,
    title: titleSpans(meta.title),
    excerpt: meta.excerpt,
  };
  const doc: PostDoc = { schemaVersion: SCHEMA_VERSION, ...common, blocks };
  const summary: PostSummary = { ...common, hasMore, preview };

  await putFile(`posts/${meta.id}.${meta.locale}.json`, JSON.stringify(doc, null, 2), `Publish ${meta.slug} (${meta.locale})`, token);

  const index = await fetchIndex();
  const posts = index.posts.filter((p) => !(p.id === meta.id && p.locale === meta.locale));
  posts.push(summary);
  const newIndex: FeedIndex = { schemaVersion: SCHEMA_VERSION, generatedAt: now, posts };
  await putFile('index.json', JSON.stringify(newIndex, null, 2), `Update index for ${meta.slug} (${meta.locale})`, token);
}
