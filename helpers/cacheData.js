import { config } from '@/config/index';
const url = config.nodeEnv === 'development' ? config.devUrl : config.clientSiteUrl;

export const clearAllCacheData = () => {
  if ('caches' in window) {
    caches.keys().then((names) => {
      // Delete all the cache files
      names.forEach((name) => {
        caches.delete(name);
      });
    });
  }
};

// Function to get all cache data
export const getAllCacheData = async () => {
  // List of all caches present in browser
  const names = await caches.keys();
  const cacheDataArray = [];

  // Iterating over the list of caches
  names.forEach(async (name) => {
    // Opening that particular cache
    const cacheStorage = await caches.open(name);

    // Fetching that particular cache data
    const cachedResponse = await cacheStorage.match(url);
    const data = await cachedResponse.json();

    // Pushing fetched data into our cacheDataArray
    cacheDataArray.push(data);
  });

  const result = cacheDataArray.join(', ');
  return result;
};

// Function to add our give data into cache
export const addDataIntoCache = (cacheName, response) => {
  // Converting our response into Actual Response form
  const data = new Response(JSON.stringify(response));

  if ('caches' in window) {
    // Opening given cache and putting our data into it
    caches.open(cacheName).then((cache) => {
      cache.put(url, data);
      alert('Data Added into cache!');
    });
  }
};
