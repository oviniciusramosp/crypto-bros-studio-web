import React from 'react';
import { View, Text } from 'react-native-web';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from '@/theme/ThemeContext';
import { DevModeProvider } from '@/contexts/DevModeContext';
import { VideoPlaybackProvider } from '@/contexts/VideoPlaybackContext';
import { ChartFullscreenProvider } from '@/contexts/ChartFullscreenContext';
import { NotionRenderer } from '@/components/notion/NotionRenderer';
import { leanToRenderBlocks } from '@/services/content/bridge';
import { SCREEN_HORIZONTAL_PADDING } from '@/theme/layout';
import type { ContentBlock } from '@/types/content';

const PHONE_WIDTH = 393; // iPhone 17 logical width
const queryClient = new QueryClient();

class EB extends React.Component<{ children: React.ReactNode }, { e: any }> {
  state = { e: null as any };
  static getDerivedStateFromError(e: any) { return { e }; }
  render() {
    if (this.state.e) return <Text style={{ color: 'red' }}>{'Preview error: ' + (this.state.e?.message || String(this.state.e))}</Text>;
    return this.props.children as any;
  }
}

function Frame({ blocks }: { blocks: ContentBlock[] }) {
  const { colors } = useTheme();
  const rendered = leanToRenderBlocks(blocks);
  return (
    <View style={{ alignItems: 'center', paddingVertical: 32 }}>
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
          <NotionRenderer blocks={rendered} />
        </EB>
      </View>
    </View>
  );
}

/** 1:1 preview using the app's REAL renderer + theme. */
export function Preview({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <DevModeProvider>
          <VideoPlaybackProvider>
            <ChartFullscreenProvider>
              <Frame blocks={blocks} />
            </ChartFullscreenProvider>
          </VideoPlaybackProvider>
        </DevModeProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
