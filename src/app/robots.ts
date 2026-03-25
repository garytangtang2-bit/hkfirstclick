import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/my-trips', '/auth/', '/login', '/share'],
      },
      // Google AI (Gemini training & Search Generative Experience)
      { userAgent: 'Google-Extended', allow: '/' },
      // OpenAI / ChatGPT
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      // Anthropic / Claude
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Claude-Web', allow: '/' },
      // Perplexity AI
      { userAgent: 'PerplexityBot', allow: '/' },
      // Meta AI
      { userAgent: 'FacebookBot', allow: '/' },
      // Microsoft Bing / Copilot
      { userAgent: 'bingbot', allow: '/' },
      // Apple
      { userAgent: 'Applebot', allow: '/' },
      // ByteDance / TikTok AI
      { userAgent: 'Bytespider', allow: '/' },
      // Amazon Alexa / Rufus AI
      { userAgent: 'Amazonbot', allow: '/' },
      // Common AI research crawlers
      { userAgent: 'cohere-ai', allow: '/' },
      { userAgent: 'YouBot', allow: '/' },
    ],
    sitemap: 'https://www.hkfirstclick.com/sitemap.xml',
  }
}
