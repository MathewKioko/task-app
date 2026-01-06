import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Handle API routes - proxy to backend
    if (url.pathname.startsWith('/api/')) {
      // You need to deploy your backend to a service like Railway
      // and replace this URL with your actual backend URL
      const backendUrl = env.BACKEND_URL || 'https://your-backend-url.com';
      
      if (!backendUrl || backendUrl === 'https://your-backend-url.com') {
        return new Response('Backend URL not configured. Please deploy your backend first.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
      
      // Proxy the request to the backend
      const backendRequest = new Request(`${backendUrl}${url.pathname}${url.search}`, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });
      
      try {
        const response = await fetch(backendRequest);
        return response;
      } catch (error) {
        return new Response('Backend service unavailable', {
          status: 503,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    }

    // Serve static files for all other routes
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