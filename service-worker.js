// Cache name (change this whenever files change to update the cache)
const CACHE_NAME = 'java-ds-cache-v4';

// Files to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/manifest.json',
  '/singly.html',
  '/doubly.html',
  '/arraylist.html',
  '/hashmap.html',
  '/hashset.html',
  '/bst.html',
  '/streams.html',
  '/random.html',
  '/mouse-trail.js',
  '/diagnostic.js',
  '/solution-fix.js',
  '/external-link-handler.js',
  '/adsense.js',
  '/widget-template.json',
  '/widget-data.json',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  '/screenshots/widget.png'
];

// Install event - cache files
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[ServiceWorker] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Handle links - dedicated event listener
self.addEventListener('fetch', event => {
  // Only handle navigation requests
  if (event.request.mode !== 'navigate') {
    return;
  }

  const url = new URL(event.request.url);
  
  // Check if this is an external link that should be handled by the app
  // Only intercept URLs that are not already on our domain
  if (!url.hostname.includes('carter-112.github.io')) {
    // For Java code related URLs, especially those with code snippets
    const isJavaRelated = 
      url.pathname.includes('java') || 
      url.pathname.includes('data-structure') || 
      url.pathname.includes('algorithm') ||
      url.search.includes('java') ||
      url.search.includes('data-structure') ||
      url.search.includes('code');
    
    if (isJavaRelated) {
      console.log('[ServiceWorker] Handling external Java link:', url.href);
      
      // Intercept and fetch the content
      event.respondWith(
        fetch(event.request.url)
          .then(response => {
            // If we can fetch the external content successfully
            if (response.ok) {
              // Clone the response to use it
              const clonedResponse = response.clone();
              
              // Extract useful information from the response
              // Then redirect to our app with this information
              return clonedResponse.text().then(html => {
                // Create a URL to our app with the external URL and content excerpt
                const redirectUrl = new URL('/', self.location.origin);
                redirectUrl.searchParams.set('source', url.href);
                redirectUrl.searchParams.set('type', 'external_link');
                
                // Extract any potential code snippets (simplified approach)
                const codeMatch = html.match(/<code[^>]*>([\s\S]*?)<\/code>/i) || 
                                 html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
                
                if (codeMatch && codeMatch[1]) {
                  // If code snippet found, add it to the redirect
                  const codeSnippet = codeMatch[1].slice(0, 500); // Limit size
                  redirectUrl.searchParams.set('code', codeSnippet);
                }
                
                // Redirect to our app with this information
                return Response.redirect(redirectUrl.toString(), 302);
              });
            }
            
            // If we can't fetch it successfully, just pass through the original response
            return response;
          })
          .catch(error => {
            console.error('[ServiceWorker] Error handling external link:', error);
            
            // On error, redirect to our app with just the external URL
            const fallbackUrl = new URL('/', self.location.origin);
            fallbackUrl.searchParams.set('source', url.href);
            fallbackUrl.searchParams.set('error', 'fetch_failed');
            
            return Response.redirect(fallbackUrl.toString(), 302);
          })
      );
      return; // Important: stop further handling of this request
    }
  }
});

// Regular fetch event handler for cache/network
self.addEventListener('fetch', event => {
  // Skip if this is a navigation request (handled above)
  if (event.request.mode === 'navigate') {
    return;
  }

  console.log('[ServiceWorker] Fetch', event.request.url);
  
  // Handle fetch failures and store in IndexedDB for sync later
  if (event.request.method === 'POST' || event.request.method === 'PUT') {
    // Clone the request to use it in the background sync later
    const backgroundSyncRequest = {
      url: event.request.url,
      method: event.request.method,
      headers: Array.from(event.request.headers),
      bodyPromise: event.request.clone().text()
    };

    event.waitUntil(
      event.request.clone().text()
        .then(body => {
          return saveRequestToIndexedDB({
            ...backgroundSyncRequest,
            body,
            timestamp: Date.now()
          });
        })
    );
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request for fetch and cache
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response for cache and browser
            const responseToCache = response.clone();
            
            // Add to cache for future use
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(error => {
            // If fetch fails, try to return a fallback
            console.log('[ServiceWorker] Fetch failed; returning offline page instead.', error);
            
            // If html request, return the cached index page as fallback
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Open and initialize the IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('syncDB', 1);
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('requests')) {
        db.createObjectStore('requests', { keyPath: 'id', autoIncrement: true });
      }
    };
    
    request.onsuccess = event => resolve(event.target.result);
    request.onerror = event => reject(event.target.error);
  });
}

// Save request to IndexedDB for later sync
function saveRequestToIndexedDB(request) {
  return openDB().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['requests'], 'readwrite');
      const store = transaction.objectStore('requests');
      const addRequest = store.add(request);
      
      addRequest.onsuccess = () => resolve();
      addRequest.onerror = event => reject(event.target.error);
    });
  });
}

// Get all pending requests from IndexedDB
function getPendingRequests() {
  return openDB().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['requests'], 'readonly');
      const store = transaction.objectStore('requests');
      const getRequest = store.getAll();
      
      getRequest.onsuccess = event => resolve(event.target.result);
      getRequest.onerror = event => reject(event.target.error);
    });
  });
}

// Delete a request from IndexedDB
function deleteRequest(id) {
  return openDB().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['requests'], 'readwrite');
      const store = transaction.objectStore('requests');
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = event => reject(event.target.error);
    });
  });
}

// Background sync
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    console.log('[ServiceWorker] Background sync triggered');
    
    event.waitUntil(
      getPendingRequests().then(requests => {
        return Promise.all(
          requests.map(request => {
            // Recreate the original request
            const syncRequest = new Request(request.url, {
              method: request.method,
              headers: new Headers(request.headers),
              body: request.body,
              mode: 'cors',
              credentials: 'include'
            });
            
            // Try to send the request
            return fetch(syncRequest)
              .then(response => {
                if (response.ok) {
                  // If successful, remove from IndexedDB
                  return deleteRequest(request.id);
                }
                throw new Error('Sync failed');
              })
              .catch(err => {
                console.error('[ServiceWorker] Sync failed for request:', request, err);
                // Keep in IndexedDB to try again later
              });
          })
        );
      })
    );
  }
});

// Periodic sync (periodically sync data)
self.addEventListener('periodicsync', event => {
  if (event.tag === 'periodic-sync') {
    console.log('[ServiceWorker] Periodic sync triggered');
    
    event.waitUntil(
      getPendingRequests().then(requests => {
        if (requests.length > 0) {
          console.log(`[ServiceWorker] Syncing ${requests.length} pending requests`);
          return self.registration.sync.register('sync-data');
        }
      })
    );
  }
});

// Push notification
self.addEventListener('push', event => {
  const title = 'Java Data Structures Practice';
  const options = {
    body: event.data ? event.data.text() : 'New content available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png'
  };
  
  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click
self.addEventListener('notificationclick', event => {
  console.log('[ServiceWorker] Notification click received');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
}); 