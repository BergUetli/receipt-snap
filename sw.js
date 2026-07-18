const C="rsnap-v3";
const CORE=["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png"];
const CACHEABLE=/(cdn\.jsdelivr\.net|raw\.githubusercontent\.com|media\.githubusercontent\.com)/;
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener("fetch",e=>{
  var isPage=e.request.mode==="navigate"||/index\.html$/.test(e.request.url);
  if(isPage){
    e.respondWith(fetch(e.request).then(r=>{var cl=r.clone();caches.open(C).then(c=>c.put(e.request,cl));return r;})
      .catch(()=>caches.match(e.request).then(h=>h||caches.match("./index.html"))));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{
      if(e.request.method==="GET"&&r.ok&&(e.request.url.startsWith(self.location.origin)||CACHEABLE.test(e.request.url))){
        const cl=r.clone(); caches.open(C).then(c=>c.put(e.request,cl));
      }
      return r;
    }).catch(()=>caches.match("./index.html")))
  );
});
