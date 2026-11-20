const filterButtons = document.querySelectorAll(".filter-button");
const gameCards = document.querySelectorAll(".game-card");
const searchInput = document.querySelector("#game-search");
const visibleCount = document.querySelector("#visible-count");
const emptyState = document.querySelector("#empty-state");
const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
const worldCards = Array.from(document.querySelectorAll(".world-trigger"));
const worldDialog = document.querySelector("#world-dialog");
const portalImage = document.querySelector("#portal-image");
const portalImageIndex = document.querySelector("#portal-image-index");
const portalCoordinate = document.querySelector("#portal-coordinate");
const portalNumber = document.querySelector("#portal-number");
const portalTitle = document.querySelector("#portal-title");
const portalType = document.querySelector("#portal-type");
const portalStory = document.querySelector("#portal-story");
const fortniteDetailsTrigger = document.querySelector(".fortnite-details-trigger");
const fortniteDialog = document.querySelector("#fortnite-dialog");
const fortniteLike = document.querySelector("#fortnite-like");

let activeFilter = "all";
let activeWorldIndex = 0;

const worldStories = {
  oni: {
    coordinate: "KYOTO / THE RED-MOON DISTRICT",
    story: "I was born beneath a red moon, in a village that forgot its own name. My blade remembers every ghost I've outlived. Follow the lanterns; if they go dark, don't look behind you."
  },
  midnight: {
    coordinate: "TOKYO / 02:17 AM",
    story: "I learned the city by its reflections. At 2:17, the streets belong to the insomniacs and the ones still deciding who to become. Keep driving until the skyline changes."
  },
  spirit: {
    coordinate: "THE OLD FOREST / AFTER THE LAST BELL",
    story: "I woke beneath the cedars after the last bell. The spirits call me keeper, though I have no memory of choosing. Every flower is a name someone tried to forget."
  },
  pixel: {
    coordinate: "LEVEL 01 / THE EDGE OF THE SCREEN",
    story: "The world ends at the edge of the screen. I have restarted a thousand times, and each life brought me closer to the truth: the hero is the one who keeps pressing start."
  },
  cloud: {
    coordinate: "ABOVE THE CLOUDLINE / HOME, EVENTUALLY",
    story: "I left the ground to find somewhere quiet enough to hear my own thoughts. A small house, a drifting island, a garden that never hurries. Stay awhile; the sky is kind here."
  },
  phantom: {
    coordinate: "THE OLD ARCADE / ONE LAST CREDIT",
    story: "They say the arcade closed thirty years ago. Every night, one cabinet still glows, and the high score is written in my handwriting. If you play, take my place on the leaderboard."
  }
};

function updateGames() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;

  gameCards.forEach((card) => {
    const matchesFilter = activeFilter === "all" || card.dataset.category === activeFilter;
    const matchesSearch = card.dataset.name.includes(query);
    const show = matchesFilter && matchesSearch;
    card.hidden = !show;
    if (show) visible += 1;
  });

  visibleCount.textContent = String(visible).padStart(2, "0");
  emptyState.hidden = visible !== 0;
}

function updatePortal() {
  const card = worldCards[activeWorldIndex];
  const story = worldStories[card.dataset.world];

  portalImage.src = card.querySelector(".game-image").src;
  portalImageIndex.textContent = card.querySelector(".game-number").textContent;
  portalCoordinate.textContent = story.coordinate;
  portalNumber.textContent = `WORLD ${String(activeWorldIndex + 1).padStart(2, "0")} / ${String(worldCards.length).padStart(2, "0")}`;
  portalTitle.textContent = card.closest(".game-card").querySelector(".game-details h3").textContent;
  portalType.textContent = `${card.querySelector(".game-tag").textContent} · A STORY FROM THE OTHER SIDE`;
  portalStory.textContent = story.story;
}

function openWorld(index) {
  activeWorldIndex = index;
  updatePortal();
  worldDialog.showModal();
  document.body.classList.add("portal-open");
}

function travelWorld(direction) {
  const availableWorlds = worldCards.filter((card) => !card.closest(".game-card").hidden);
  if (availableWorlds.length === 0) return;
  const currentCard = worldCards[activeWorldIndex];
  const currentVisibleIndex = availableWorlds.indexOf(currentCard);
  const nextVisibleIndex = (currentVisibleIndex + direction + availableWorlds.length) % availableWorlds.length;
  activeWorldIndex = worldCards.indexOf(availableWorlds[nextVisibleIndex]);
  updatePortal();
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    updateGames();
  });
});

worldCards.forEach((card, index) => {
  card.addEventListener("click", () => openWorld(index));
});

if (worldDialog) {
  document.querySelector("#portal-close").addEventListener("click", () => worldDialog.close());
  document.querySelector("#portal-previous").addEventListener("click", () => travelWorld(-1));
  document.querySelector("#portal-next").addEventListener("click", () => travelWorld(1));
  worldDialog.addEventListener("click", (event) => {
    if (event.target === worldDialog) worldDialog.close();
  });
  worldDialog.addEventListener("close", () => document.body.classList.remove("portal-open"));
  worldDialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      travelWorld(event.key === "ArrowRight" ? 1 : -1);
    }
  });
}

if (fortniteDetailsTrigger && fortniteDialog) {
  const closeButton = document.querySelector("#fortnite-close");

  fortniteDetailsTrigger.addEventListener("click", () => {
    fortniteDialog.showModal();
    document.body.classList.add("portal-open");
  });
  closeButton.addEventListener("click", () => fortniteDialog.close());
  fortniteDialog.addEventListener("click", (event) => {
    if (event.target === fortniteDialog) fortniteDialog.close();
  });
  fortniteDialog.addEventListener("close", () => document.body.classList.remove("portal-open"));
}

if (fortniteLike) {
  const likeLabel = document.querySelector("#like-label");
  const likeIcon = fortniteLike.querySelector(".like-icon");
  const likeCount = document.querySelector("#like-count");

  fortniteLike.addEventListener("click", () => {
    const liked = fortniteLike.getAttribute("aria-pressed") !== "true";
    fortniteLike.setAttribute("aria-pressed", String(liked));
    fortniteLike.setAttribute("aria-label", liked ? "Unlike Fortnite" : "Like Fortnite");
    likeLabel.textContent = liked ? "Liked" : "Like";
    likeIcon.textContent = liked ? "♥" : "♡";
    likeCount.textContent = liked ? "1" : "0";
  });
}

searchInput?.addEventListener("input", updateGames);
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && searchInput && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape" && searchInput && document.activeElement === searchInput) {
    searchInput.value = "";
    updateGames();
    searchInput.blur();
  }
});

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  primaryNav.classList.toggle("open", !isExpanded);
});

primaryNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    primaryNav.classList.remove("open");
  }
});
