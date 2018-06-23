//Ultra-lite service-worker, written somewhat by Levy Adams.
//**---->https://github.com/levyadams<-----**//
var staticCacheName = 'restaurantReviews-static-v2';
//for some reason passing the cache in the function no work right, so do it outside of it like a dis
var urlToCache = [
  '/',
  '/index.html',
  '/restaurant.html',
  '/css/styles.css',
  '/css/responsive.css',
  '/js/main/main.js',
  '/js/main/restaurant_info.js',
];
//we add a event listener for the "install" service worker event, triggered when the SW is installed properly.
self.addEventListener('install', function(event) {
  //we add a waitUntil event for caches.open to load completely, then with a promise add the directories we want to cache.
    event.waitUntil(
      caches.open(staticCacheName).then(function(cache) {
        return cache.addAll(urlToCache);
      })
    );
  });
  //An event listener for a SW going into the active state. https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
  //scroll down and look at the lifecycle of a service worker to understand more about these events.
  self.addEventListener('activate', function(event) {
    event.waitUntil(
      //we make a promise that brings us a list of "keys" that are associated with files in the cache. This is a really quick way of indexing
      //items without actually having to bring them up in memory or whatever, similar to a dictionary in c# and c++ I assume in some fashion.
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          //we use the almighty filter command to filter for the specific cache we are looking for. There could be other caches we don't want to delete,
          //so we run this just in that case.
          cacheNames.filter(function(cacheName) {
            return cacheName.startsWith('restaurantReviews-') &&
                   cacheName != staticCacheName;
                   //we then map those results back and delete the old cache. This is obviously because you have a new activated service worker, meaning
                   // there has been an update.
          }).map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      })
    );
  });
  //An event listener that catches all outgoing http attempts at the server, and returns those fetches 
  //items from the current skeleton framework that exist in the cache.
  self.addEventListener('fetch', function(event) {
    //we take the url request
    var requestedUrl = new URL(event.request.url);
   //if the root request is from the same origin..
    if(requestedUrl.origin===location.origin){
      //if the pathname involves anything to do with the entire directory...
      if(requestedUrl.pathname ==='/'){
        //respond with the cache data instead. Wow, magic.
        event.respondWith(caches.match('skeleton'));
      }
    }
  //If the origin is not the same as the root origin, we check the cache still, and if nothing is there
  //we fetch the request finally from the server.
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
//we use skip waiting to force the service worker to become active.
  self.addEventListener('message', function(event) {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
  });