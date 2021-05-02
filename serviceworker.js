// Import Workbox (https://developers.google.com/web/tools/workbox/)
importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js"
  );
  
  /*
    Precache Manifest
    Change revision as soon as file content changed
  */
  self.addEventListener("install", async (event) => {
    console.log("install event");
  });
  
  self.addEventListener("fetch", async (event) => {
    console.log("fetch event");
  });
  const cacheName = "vaccinecache";
  const staticAssets = [    
    "/index.html",
    "/js/vaccinetrack.js",
    "/js/jquery-3.6.0.min.js", 
    "/audio/notification.mp3",  
    "/audio/notification.ogg", 
  ]
  /*
    Enable precaching
    It is better to comment next line during development
  */
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);