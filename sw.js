const C="rsnap-v1";
const CORE=["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener("fetch",e=>{
  e.respondWith(
    caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{
      if(e.request.method==="GET"&&r.ok&&(e.request.url.startsWith(self.location.origin)||/cdn\.jsdelivr\.net/.test(e.request.url))){
        const cl=r.clone(); caches.open(C).then(c=>c.put(e.request,cl));
      }
      return r;
    }).catch(()=>caches.match("./index.html")))
  );
});
