
  document.addEventListener("DOMContentLoaded", function() {
    var script = document.createElement("script");
    script.src = "https://plausible.pizzaedition.one/js/script.js";
    script.defer = true;
    script.setAttribute("data-domain", "pizzaedition.one");
    document.head.appendChild(script);
});


// ads.js
(function() {
  var adsScript = document.createElement('script');
  adsScript.async = true;
  adsScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2550143154036518";
  adsScript.setAttribute('data-overlays', 'bottom'); 
  adsScript.crossOrigin = "anonymous";
  document.head.appendChild(adsScript);
})();





// Abd
const allowedDomains = [
  "pizzaedition.one",
  "mathmasterz.com",
  "pizzaedition.site",
  "pizzaedition.win",
  "learncodingdaily.com",
  "tpeofficial.com"

];

const redirectTargets = [
  "https://pizzaedition.one/",
  "https://mathmasterz.com/",
  "https://pizzaedition.site/",
  "https://pizzaedition.win/",
  "https://learncodingdaily.com",
  "https://tpeofficial.com/"
];

const currentDomain = window.location.hostname;

const isAllowed = allowedDomains.some(domain => 
  currentDomain === domain || currentDomain.endsWith(`.${domain}`)
);

if (!isAllowed) {
  const randomRedirect = redirectTargets[Math.floor(Math.random() * redirectTargets.length)];
  window.location.href = randomRedirect;
}

