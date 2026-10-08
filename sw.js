const CACHE="opalsign-shell-v6";
const SHELL=["./","./index.html","./admin.html","./driver.html","./css/styles.css","./css/admin.css","./css/flyer.css","./css/storefront.css","./js/app.js","./js/admin.js","./js/driver.js","./js/config.js","./js/catalog-admin.js","./js/demo-ops.js","./js/payment.js","./manifest.json","./offline.html","./assets/opalsign-logo.jpe"];

self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL))));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))));
self.addEventListener("fetch",event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=="GET"||url.pathname.includes("/functions/")||url.pathname.includes("/rest/v1/")||url.pathname.includes("/auth/"))return;
  if(url.origin!==location.origin)return;
  event.respondWith(fetch(event.request).then(response=>{
    if(response.ok){
      const copy=response.clone();
      caches.open(CACHE).then(cache=>cache.put(event.request,copy));
    }
    return response;
  }).catch(()=>caches.match(event.request).then(response=>response||caches.match("./offline.html"))));
});