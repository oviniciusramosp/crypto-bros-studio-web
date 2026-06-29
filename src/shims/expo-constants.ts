// app reads Constants.expoConfig?.extra?.* — provide the content base URL so the
// Studio can fetch published content if needed.
const Constants: any = {
  expoConfig: {
    extra: {
      contentBaseUrl: 'https://raw.githubusercontent.com/oviniciusramosp/crypto-bros-content/main',
      useStaticFeed: true,
      notionProxyUrl: 'https://crypto-bros-notion-proxy.crypto-bros.workers.dev',
    },
  },
};
export default Constants;
