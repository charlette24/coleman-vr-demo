const locations = {
  seattle: {
    title: "Seattle Waterfront Night Run",
    mode: "Phone AR",
    distance: "42 meters",
    accuracy: "98.4%",
    geofenceStatus: "Ready to unlock the waterfront portal",
    geofenceCopy:
      "Multi-signal verification blends GPS, device motion, timestamp drift, and local world anchors to prevent spoofing and keep cache placement precise.",
    entry: 92,
    cache: 67,
    rewardTitle: 'LG OLED Evo 55"',
    rewardCopy:
      "Premium sponsor reward seeded into a night exploration campaign to convert discovery into measurable engagement.",
    sponsor: "Sponsored by LG",
    rarity: "Legendary drop",
    pulse: { top: "28%", left: "35%" },
    analytics: {
      title: "Seattle launch performance",
      trafficLift: "+28%",
      redemption: "71%",
      dwell: "19 min",
      shares: "84K",
    },
  },
  denver: {
    title: "Denver Sculpture Garden Quest",
    mode: "Tablet AR",
    distance: "18 meters",
    accuracy: "97.1%",
    geofenceStatus: "Altitude-aware geofence confirmed",
    geofenceCopy:
      "Terrain offsets and venue mesh anchors keep hidden caches aligned with stairs, plazas, and elevated walkways.",
    entry: 96,
    cache: 88,
    rewardTitle: "Backstage Red Rocks Experience",
    rewardCopy:
      "Experience rewards pair especially well with dense urban hunts and event-driven foot traffic spikes.",
    sponsor: "Sponsored by Visit Colorado",
    rarity: "Epic experience",
    pulse: { top: "42%", left: "61%" },
    analytics: {
      title: "Denver arts district performance",
      trafficLift: "+36%",
      redemption: "79%",
      dwell: "24 min",
      shares: "61K",
    },
  },
  austin: {
    title: "Austin Night Market Cache Run",
    mode: "Desktop + WebXR",
    distance: "31 meters",
    accuracy: "96.3%",
    geofenceStatus: "Hybrid mobile-to-VR progression armed",
    geofenceCopy:
      "Players can discover on mobile, then jump into an immersive WebXR reward chamber using the same session identity.",
    entry: 89,
    cache: 76,
    rewardTitle: "VIP Festival Pass Bundle",
    rewardCopy:
      "The prize layer supports scarce, high-intent rewards as well as broad digital voucher drops for mass campaigns.",
    sponsor: "Sponsored by Live Nation",
    rarity: "High-demand bundle",
    pulse: { top: "63%", left: "48%" },
    analytics: {
      title: "Austin nightlife performance",
      trafficLift: "+22%",
      redemption: "68%",
      dwell: "17 min",
      shares: "93K",
    },
  },
  miami: {
    title: "Miami Beach Sunrise Hunt",
    mode: "Meta VR handoff",
    distance: "12 meters",
    accuracy: "99.1%",
    geofenceStatus: "Beachfront cache anchor stabilized",
    geofenceCopy:
      "Dynamic drift correction handles open environments with fewer landmarks, then syncs players into a branded VR reward reveal.",
    entry: 98,
    cache: 94,
    rewardTitle: "Private Resort Weekend",
    rewardCopy:
      "Luxury sponsor inventory becomes a measurable acquisition funnel when tied to location-triggered discovery loops.",
    sponsor: "Sponsored by Fontainebleau",
    rarity: "Ultra rare escape",
    pulse: { top: "70%", left: "76%" },
    analytics: {
      title: "Miami beach campaign performance",
      trafficLift: "+41%",
      redemption: "83%",
      dwell: "27 min",
      shares: "112K",
    },
  },
};

const inventory = [
  {
    title: 'LG OLED Evo 55"',
    sponsor: "LG",
    stock: "120 units",
    conversion: "11.8% claim-to-purchase uplift",
    audience: "Tech-forward urban explorers",
  },
  {
    title: "Partner Experience Weekends",
    sponsor: "Travel Network",
    stock: "40 premium packages",
    conversion: "73% voucher redemption",
    audience: "High-intent event audiences",
  },
  {
    title: "Instant food + retail vouchers",
    sponsor: "National retail bundle",
    stock: "250K digital redemptions",
    conversion: "28% store visit lift",
    audience: "Mass-user onboarding campaigns",
  },
];

const timelineEvents = [
  {
    time: "08:00",
    title: "New campaign goes live",
    detail: "Seattle geofences activate across waterfront, stadium district, and partner retail zones.",
  },
  {
    time: "09:25",
    title: "3D cache unlock spike",
    detail: "32,400 simultaneous cache reveals routed through edge session shards with no queueing.",
  },
  {
    time: "11:10",
    title: "Reward pool rebalanced",
    detail: "The prize API shifts more LG inventory toward high-conversion geofences automatically.",
  },
  {
    time: "13:45",
    title: "Sponsor conversion snapshot",
    detail: "New voucher cohort shows lift in store visits and post-campaign purchase attribution.",
  },
];

const snippets = [
  `import { createCacheExperience } from "@coleman/sdk";

const hunt = createCacheExperience({
  world: "meta-horizon",
  cacheId: "waterfront-portal-7",
  geofence: {
    shape: "polygon",
    radiusMeters: 35,
    antiSpoofProfile: "urban-dense"
  }
});

hunt.onUnlock((player) => {
  hunt.spawnPrizeReveal({
    asset: "lg-portal-v3.glb",
    rewardPool: "premium-electronics"
  });
});`,
  `POST /v1/prizes/issue-voucher
{
  "playerId": "player_82931",
  "campaignId": "seattle-night-run",
  "rewardSku": "lg-oled-55",
  "claimContext": {
    "zoneId": "wf-07",
    "deviceClass": "ios-ar",
    "confidence": 0.984
  }
}

// => returns signed voucher, sponsor attribution, analytics hooks`,
  `event GeofenceEntered(player, zone) {
  if (!zone.policy.allows(player.device, player.riskScore)) return;

  enqueue("cache-materialization", {
    zoneId: zone.id,
    playerId: player.id,
    worldAdapter: player.worldAdapter
  });
}

// horizontally scaled through stateless edge validators + regional event streams`,
];

const state = {
  activeTab: "player",
  activeLocation: "seattle",
  snippetIndex: 0,
};

const tabButtons = Array.from(document.querySelectorAll(".tab-button"));
const tabPanels = {
  player: document.getElementById("panel-player"),
  sponsor: document.getElementById("panel-sponsor"),
  sdk: document.getElementById("panel-sdk"),
};

const hotspots = Array.from(document.querySelectorAll(".hotspot"));
const radarPins = Array.from(document.querySelectorAll(".map-pin"));
const ctaButtons = Array.from(document.querySelectorAll("[data-target-tab]"));

const el = {
  locationTitle: document.getElementById("location-title"),
  playerMode: document.getElementById("player-mode"),
  distance: document.getElementById("distance-label"),
  accuracy: document.getElementById("accuracy-label"),
  geofenceStatus: document.getElementById("geofence-status"),
  geofenceCopy: document.getElementById("geofence-copy"),
  entryPercent: document.getElementById("entry-percent"),
  entryFill: document.getElementById("entry-fill"),
  cachePercent: document.getElementById("cache-percent"),
  cacheFill: document.getElementById("cache-fill"),
  rewardTitle: document.getElementById("reward-title"),
  rewardCopy: document.getElementById("reward-copy"),
  rewardSponsor: document.getElementById("reward-sponsor"),
  rewardRarity: document.getElementById("reward-rarity"),
  voucherCode: document.getElementById("voucher-code"),
  userPulse: document.getElementById("user-pulse"),
  heroPlayers: document.getElementById("hero-players"),
  heroClaims: document.getElementById("hero-claims"),
  inventoryList: document.getElementById("inventory-list"),
  analyticsTitle: document.getElementById("analytics-title"),
  trafficLift: document.getElementById("traffic-lift"),
  voucherRedemption: document.getElementById("voucher-redemption"),
  dwellTime: document.getElementById("dwell-time"),
  socialShares: document.getElementById("social-shares"),
  timelineList: document.getElementById("timeline-list"),
  sdkSnippet: document.getElementById("sdk-snippet"),
};

function switchTab(tab) {
  state.activeTab = tab;
  tabButtons.forEach((button) => {
    const isActive = button.dataset.tab === tab;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  Object.entries(tabPanels).forEach(([key, panel]) => {
    panel.classList.toggle("active", key === tab);
  });
}

function renderLocation(locationKey) {
  state.activeLocation = locationKey;
  const data = locations[locationKey];

  hotspots.forEach((hotspot) => {
    hotspot.classList.toggle("active", hotspot.dataset.location === locationKey);
  });

  el.locationTitle.textContent = data.title;
  el.playerMode.textContent = data.mode;
  el.distance.textContent = data.distance;
  el.accuracy.textContent = data.accuracy;
  el.geofenceStatus.textContent = data.geofenceStatus;
  el.geofenceCopy.textContent = data.geofenceCopy;
  el.entryPercent.textContent = `${data.entry}%`;
  el.entryFill.style.width = `${data.entry}%`;
  el.cachePercent.textContent = `${data.cache}%`;
  el.cacheFill.style.width = `${data.cache}%`;
  el.rewardTitle.textContent = data.rewardTitle;
  el.rewardCopy.textContent = data.rewardCopy;
  el.rewardSponsor.textContent = data.sponsor;
  el.rewardRarity.textContent = data.rarity;
  el.voucherCode.textContent = "Voucher pending";
  el.userPulse.style.top = data.pulse.top;
  el.userPulse.style.left = data.pulse.left;

  el.analyticsTitle.textContent = data.analytics.title;
  el.trafficLift.textContent = data.analytics.trafficLift;
  el.voucherRedemption.textContent = data.analytics.redemption;
  el.dwellTime.textContent = data.analytics.dwell;
  el.socialShares.textContent = data.analytics.shares;
}

function renderInventory() {
  el.inventoryList.innerHTML = inventory
    .map(
      (item) => `
        <article class="inventory-item">
          <div class="inventory-head">
            <div>
              <p class="panel-label">Sponsor inventory</p>
              <h4>${item.title}</h4>
            </div>
            <span class="chip chip-live">${item.sponsor}</span>
          </div>
          <p>${item.conversion}</p>
          <div class="inventory-meta">
            <span>${item.stock}</span>
            <span>${item.audience}</span>
          </div>
        </article>
      `
    )
    .join("");
}

function renderTimeline() {
  el.timelineList.innerHTML = timelineEvents
    .map(
      (event) => `
        <div class="timeline-item">
          <div class="timeline-time">${event.time}</div>
          <div>
            <h4>${event.title}</h4>
            <p>${event.detail}</p>
          </div>
        </div>
      `
    )
    .join("");
}

function renderSnippet() {
  el.sdkSnippet.textContent = snippets[state.snippetIndex];
}

function generateVoucher() {
  const active = locations[state.activeLocation];
  const locationCode = state.activeLocation.slice(0, 3).toUpperCase();
  const sponsorCode = active.sponsor.replace("Sponsored by ", "").slice(0, 2).toUpperCase();
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  el.voucherCode.textContent = `Voucher issued: CVR-${locationCode}-${sponsorCode}-${random}`;
  el.heroClaims.textContent = "76%";
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => switchTab(button.dataset.tab));
});

ctaButtons.forEach((button) => {
  button.addEventListener("click", () => switchTab(button.dataset.targetTab));
});

hotspots.forEach((hotspot) => {
  hotspot.addEventListener("click", () => renderLocation(hotspot.dataset.location));
});

radarPins.forEach((pin) => {
  pin.addEventListener("click", () => {
    renderLocation(pin.dataset.location);
    switchTab("player");
    document.getElementById("experience").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.getElementById("launch-demo").addEventListener("click", () => {
  switchTab("player");
  document.getElementById("experience").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById("claim-reward").addEventListener("click", generateVoucher);
document.getElementById("cycle-snippet").addEventListener("click", () => {
  state.snippetIndex = (state.snippetIndex + 1) % snippets.length;
  renderSnippet();
});

let metricDirection = 1;
window.setInterval(() => {
  const currentPlayers = Number.parseFloat(el.heroPlayers.textContent.replace("M", ""));
  const nextPlayers = (currentPlayers + metricDirection * 0.1).toFixed(1);
  el.heroPlayers.textContent = `${nextPlayers}M`;
  metricDirection = currentPlayers >= 2.1 ? -1 : currentPlayers <= 1.7 ? 1 : metricDirection;
}, 2200);

renderInventory();
renderTimeline();
renderSnippet();
renderLocation(state.activeLocation);
