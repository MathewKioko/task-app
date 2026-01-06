import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

export default {
  async fetch(request, env) {
    // Handle API routes
    if (request.url.includes('/api/')) {
      // For API routes, you would need to proxy to your backend server
      // This is a placeholder - you'd need to deploy your backend separately
      return new Response('API endpoint not available in this deployment', {
        status: 503,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    try {
      return await getAssetFromKV({
        request,
        waitUntil(promise) {
          return promise
        },
      }, {
        ASSET_NAMESPACE: env.__STATIC_CONTENT,
        ASSET_MANIFEST: JSON.parse(env.__STATIC_CONTENT_MANIFEST),
      });
    } catch (e) {
      // Fallback to index.html for SPA routing
      const notFoundResponse = await getAssetFromKV({
        request: new Request(new URL('/index.html', request.url)),
        waitUntil(promise) {
          return promise
        },
      }, {
        ASSET_NAMESPACE: env.__STATIC_CONTENT,
        ASSET_MANIFEST: JSON.parse(env.__STATIC_CONTENT_MANIFEST),
      });
      
      return new Response(notFoundResponse.body, {
        ...notFoundResponse,
        status: 200,
      });
    }
  },
};