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

    // Serve static files from the dist directory
    const url = new URL(request.url);
    let pathname = url.pathname;

    // Serve index.html for all non-file routes (SPA routing)
    if (!pathname.includes('.') && pathname !== '/') {
      pathname = '/index.html';
    }

    try {
      const filePath = pathname === '/' ? '/index.html' : pathname;
      const file = await env.ASSETS.fetch(new Request(new URL(filePath, request.url)));
      
      // Set appropriate headers for SPA
      if (pathname === '/' || !pathname.includes('.')) {
        const response = new Response(file.body, file);
        response.headers.set('Cache-Control', 'no-cache');
        return response;
      }
      
      return file;
    } catch (error) {
      // Fallback to index.html for SPA routing
      const index = await env.ASSETS.fetch(new Request(new URL('/index.html', request.url)));
      return new Response(index.body, index);
    }
  }
};