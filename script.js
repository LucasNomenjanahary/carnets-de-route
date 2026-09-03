/* ---------------------------------------------------
   Horloges du monde — mise à jour chaque seconde
--------------------------------------------------- */
const CLOCK_ZONES = [
  { id: "clock-tokyo", city: "Kyoto", tz: "Asia/Tokyo" },
  { id: "clock-reykjavik", city: "Reykjavik", tz: "Atlantic/Reykjavik" },
  { id: "clock-marrakech", city: "Marrakech", tz: "Africa/Casablanca" },
];

function updateClocks() {
  CLOCK_ZONES.forEach(({ id, tz }) => {
    const el = document.getElementById(id);
    if (!el) return;
    const now = new Date().toLocaleTimeString("fr-FR", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    el.textContent = now;
  });
}

/* ---------------------------------------------------
   "Voyageurs en ligne" — compteur simulé qui varie
--------------------------------------------------- */
function updateOnlineCount() {
  const el = document.getElementById("online-count");
  if (!el) return;
  const base = 30;
  const variation = Math.floor(Math.random() * 15);
  el.textContent = base + variation;
}

/* ---------------------------------------------------
   Fil d'activité simulé (flux quasi temps réel)
--------------------------------------------------- */
const ACTIVITY_EVENTS = [
  "vient de lire « Kyoto sous les érables »",
  "a ajouté « Road trip en Islande » à ses favoris",
  "consulte « Marché de Marrakech, mode d'emploi »",
  "vient d'arriver depuis Instagram",
  "partage un article sur les réseaux",
  "explore la carte des destinations",
];

const FIRST_NAMES = ["Léa", "Hugo", "Nora", "Sami", "Inès", "Théo", "Camille", "Yanis"];

function pushActivityItem() {
  const feed = document.getElementById("activity-feed");
  if (!feed) return;

  const name = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const event = ACTIVITY_EVENTS[Math.floor(Math.random() * ACTIVITY_EVENTS.length)];
  const li = document.createElement("li");
  li.textContent = `${name} ${event}`;
  feed.prepend(li);

  // On garde seulement les 5 derniers éléments
  while (feed.children.length > 5) {
    feed.removeChild(feed.lastChild);
  }

  // Événement GA4 personnalisé : à activer une fois gtag.js installé
  if (typeof gtag === "function") {
    gtag("event", "activity_feed_update", { event_label: event });
  }
}

/* ---------------------------------------------------
   Compteur de vues par article (simulé via localStorage)
--------------------------------------------------- */
function trackArticleView(articleId) {
  const el = document.getElementById("views-count");
  if (!el || !articleId) return;

  const key = `views_${articleId}`;
  const current = parseInt(localStorage.getItem(key) || "0", 10);
  const updated = current + 1;
  localStorage.setItem(key, updated);
  el.textContent = updated;

  if (typeof gtag === "function") {
    gtag("event", "article_view", { article_id: articleId });
  }
}

/* ---------------------------------------------------
   Apparition des cartes bento au scroll (un seul effet, sobre)
--------------------------------------------------- */
function initBentoReveal() {
  const cards = document.querySelectorAll(".bento .entry-card");
  if (!cards.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("visible"), i * 100);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  cards.forEach((card) => observer.observe(card));
}

/* ---------------------------------------------------
   Init
--------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  updateClocks();
  setInterval(updateClocks, 1000);

  updateOnlineCount();
  setInterval(updateOnlineCount, 4000);

  pushActivityItem();
  setInterval(pushActivityItem, 6000);

  initBentoReveal();

  const articleId = document.body.dataset.articleId;
  if (articleId) trackArticleView(articleId);
});
