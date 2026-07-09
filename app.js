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
  walkthroughStepIndex: 0,
  walkthroughPlaying: false,
  walkthroughTimer: null,
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
  walkthroughHeadline: document.getElementById("walkthrough-headline"),
  walkthroughSummary: document.getElementById("walkthrough-summary"),
  walkthroughStage: document.getElementById("walkthrough-stage"),
  walkthroughCurrentStep: document.getElementById("walkthrough-current-step"),
  walkthroughList: document.getElementById("walkthrough-list"),
};

function createVoucherCode(locationKey, sponsorLabel) {
  const locationCode = locationKey.slice(0, 3).toUpperCase();
  const sponsorCode = sponsorLabel.replace("Sponsored by ", "").slice(0, 2).toUpperCase();
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CVR-${locationCode}-${sponsorCode}-${random}`;
}

function buildWalkthroughSteps(locationKey) {
  const data = locations[locationKey];

  return [
    {
      title: "Player spots a live hunt",
      detail: `Ava opens Coleman VR on ${data.mode.toLowerCase()} and sees ${data.title} trending nearby.`,
      distance: data.distance,
      entry: 28,
      cache: 8,
      geofenceStatus: "Player is outside the active zone",
      geofenceCopy:
        "The engine starts warming up device signals, route context, and anti-spoof scoring before the player arrives.",
      rewardCopy: "Prize inventory stays hidden until the player proves they are physically present in the zone.",
      current: "Ava opens the app and picks a nearby hunt.",
    },
    {
      title: "Geofence confidence rises",
      detail: "As Ava walks in, GPS, motion, and anchor checks converge and the hunt becomes unlock-ready.",
      distance: "12 meters",
      entry: 74,
      cache: 34,
      geofenceStatus: "Cross-signal geofence verification in progress",
      geofenceCopy:
        "The platform blends live device telemetry and world anchors to confirm the player is genuinely on-site.",
      rewardCopy: "The reward pool is reserved but still concealed until the final proximity threshold is met.",
      current: "Ava approaches the cache and the zone begins validating her location.",
    },
    {
      title: "The 3D cache materializes",
      detail: "A portal blooms into view and the player can tap or gesture to open the cache reveal sequence.",
      distance: "3 meters",
      entry: 96,
      cache: 79,
      geofenceStatus: "Verified player presence. Cache reveal armed.",
      geofenceCopy:
        "Once confidence crosses the threshold, the SDK triggers the branded 3D cache inside mobile AR or VR.",
      rewardCopy: "The sponsor reveal is now fully interactive, with telemetry firing for dwell time and engagement.",
      current: "Ava sees the floating cache appear in front of her.",
    },
    {
      title: "Prize reveal lands",
      detail: `A branded animation resolves and Ava wins the featured reward: ${data.rewardTitle}.`,
      distance: "0 meters",
      entry: 100,
      cache: 100,
      geofenceStatus: "Cache opened. Reward reveal completed.",
      geofenceCopy:
        "The reward engine now records a verified unlock event tied to location, device type, and campaign metadata.",
      rewardCopy: `The system reveals ${data.rewardTitle} and tags the claim to ${data.sponsor} for ROI reporting.`,
      current: `Ava wins ${data.rewardTitle} in the live reveal.`,
    },
    {
      title: "Voucher and analytics are issued",
      detail: "A redeemable claim code is generated instantly and sponsor analytics register a full-funnel conversion.",
      distance: "0 meters",
      entry: 100,
      cache: 100,
      geofenceStatus: "Claim verified and handed to the prize API.",
      geofenceCopy:
        "The claim is signed, attached to the player session, and synchronized to sponsor dashboards in real time.",
      rewardCopy: "A redeemable voucher now sits in the player's wallet and the sponsor sees the conversion immediately.",
      current: "Ava receives her voucher and the sponsor gets a measurable win.",
    },
  ];
}

function stopWalkthrough() {
  if (state.walkthroughTimer) {
    window.clearTimeout(state.walkthroughTimer);
    state.walkthroughTimer = null;
  }
  state.walkthroughPlaying = false;
}

function renderWalkthroughPanel() {
  const steps = buildWalkthroughSteps(state.activeLocation);
  const activeStep = steps[state.walkthroughStepIndex];

  el.walkthroughHeadline.textContent = `See a player complete ${locations[state.activeLocation].title}`;
  el.walkthroughSummary.textContent =
    "Use this scripted investor flow to show how one user moves from map discovery to sponsor redemption in under a minute.";
  el.walkthroughStage.textContent = `Stage ${state.walkthroughStepIndex + 1} of ${steps.length}`;
  el.walkthroughCurrentStep.textContent = activeStep.current;
  el.walkthroughList.innerHTML = steps
    .map(
      (step, index) => `
        <article class="walkthrough-item ${index === state.walkthroughStepIndex ? "active" : ""} ${
          index < state.walkthroughStepIndex ? "completed" : ""
        }">
          <div class="walkthrough-step-top">
            <span class="walkthrough-step-index">0${index + 1}</span>
            <span class="chip ${index === state.walkthroughStepIndex ? "chip-live" : ""}">${step.title}</span>
          </div>
          <h4>${step.title}</h4>
          <p>${step.detail}</p>
        </article>
      `
    )
    .join("");
}

function applyWalkthroughStep(step) {
  el.distance.textContent = step.distance;
  el.entryPercent.textContent = `${step.entry}%`;
  el.entryFill.style.width = `${step.entry}%`;
  el.cachePercent.textContent = `${step.cache}%`;
  el.cacheFill.style.width = `${step.cache}%`;
  el.geofenceStatus.textContent = step.geofenceStatus;
  el.geofenceCopy.textContent = step.geofenceCopy;
  el.rewardCopy.textContent = step.rewardCopy;

  if (state.walkthroughStepIndex < 4) {
    el.voucherCode.textContent = "Voucher pending";
  }

  if (state.walkthroughStepIndex === 4) {
    const rewardData = locations[state.activeLocation];
    const code = createVoucherCode(state.activeLocation, rewardData.sponsor);
    el.voucherCode.textContent = `Voucher issued: ${code}`;
    el.heroClaims.textContent = "76%";
  }
}

function resetWalkthrough() {
  stopWalkthrough();
  state.walkthroughStepIndex = 0;
  renderLocation(state.activeLocation);
}

function runWalkthroughStep(index) {
  const steps = buildWalkthroughSteps(state.activeLocation);
  state.walkthroughStepIndex = index;
  renderWalkthroughPanel();
  applyWalkthroughStep(steps[index]);

  if (index === steps.length - 1) {
    state.walkthroughPlaying = false;
    state.walkthroughTimer = null;
    return;
  }

  state.walkthroughTimer = window.setTimeout(() => runWalkthroughStep(index + 1), 1500);
}

function playWalkthrough() {
  stopWalkthrough();
  state.walkthroughPlaying = true;
  switchTab("player");
  runWalkthroughStep(0);
}

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
  stopWalkthrough();
  state.activeLocation = locationKey;
  state.walkthroughStepIndex = 0;
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
  renderWalkthroughPanel();
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
  const code = createVoucherCode(state.activeLocation, active.sponsor);
  el.voucherCode.textContent = `Voucher issued: ${code}`;
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
  document.getElementById("experience").scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(playWalkthrough, 250);
});
document.getElementById("hero-player-journey").addEventListener("click", () => {
  document.getElementById("experience").scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(playWalkthrough, 250);
});

document.getElementById("claim-reward").addEventListener("click", generateVoucher);
document.getElementById("play-walkthrough").addEventListener("click", playWalkthrough);
document.getElementById("reset-walkthrough").addEventListener("click", resetWalkthrough);
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
