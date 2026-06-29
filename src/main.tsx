import React from 'react';
import { createRoot } from 'react-dom/client';
import { View, Text } from 'react-native-web';
import { ThemeProvider, useTheme } from '@/theme/ThemeContext';
import { NotionRenderer } from '@/components/notion/NotionRenderer';
import { leanToRenderBlocks } from '@/services/content/bridge';
import { SCREEN_HORIZONTAL_PADDING } from '@/theme/layout';
import type { ContentBlock } from '@/types/content';

// iPhone 17 logical width.
const PHONE_WIDTH = 393;

class EB extends React.Component<{ children: React.ReactNode }, { e: any }> {
  state = { e: null as any };
  static getDerivedStateFromError(e: any) { return { e }; }
  render() {
    if (this.state.e) return <Text style={{ color: 'red' }}>{'ERR: ' + (this.state.e?.message || String(this.state.e))}</Text>;
    return this.props.children as any;
  }
}

// Proof: render a post with the app's REAL renderer + theme on the web.
const fixture: ContentBlock[] = [
  { type: 'h', level: 2, spans: [{ text: 'Bitcoin atinge novo topo histórico' }] },
  {
    type: 'p',
    spans: [
      { text: 'O ' },
      { text: 'Bitcoin', bold: true },
      { text: ' rompeu sua máxima — veja a ' },
      { text: 'análise completa', href: 'https://example.com' },
      { text: '. Texto em ' },
      { text: 'itálico', italic: true },
      { text: ' e ' },
      { text: 'código', code: true },
      { text: '.' },
    ],
  },
  {
    type: 'list',
    ordered: false,
    items: [[{ text: 'Fluxo institucional via ETFs' }], [{ text: 'Oferta líquida em queda' }], [{ text: 'Sentimento otimista' }]],
  },
  { type: 'quote', spans: [{ text: 'Topos históricos vêm acompanhados de alta volatilidade.', italic: true }] },
  { type: 'callout', icon: '💡', color: 'blue_background', blocks: [{ type: 'p', spans: [{ text: 'Dica: cuidado ao comprar no topo.' }] }] },
  { type: 'code', lang: 'ts', text: 'const ath = 100000;\nconsole.log(ath);' },
  { type: 'divider' },
  { type: 'p', spans: [{ text: 'Conteúdo após o divider (corpo completo do post).' }] },
];

const blocks = leanToRenderBlocks(fixture);

function Frame() {
  const { colors } = useTheme();
  return (
    <View style={{ alignItems: 'center', paddingVertical: 32 }}>
      {/* Phone-width column with the app's real background + horizontal padding */}
      <View
        style={{
          width: PHONE_WIDTH,
          backgroundColor: colors.background,
          borderRadius: 28,
          overflow: 'hidden',
          paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
          paddingVertical: 24,
        }}
      >
        <EB>
          <NotionRenderer blocks={blocks} />
        </EB>
      </View>
    </View>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Frame />
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
