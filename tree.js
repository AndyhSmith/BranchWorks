// tree.js

/***** 1) CONFIG (Edit this only) *********************************************/
const CONFIG = {
  defaultTree: "original",
  defaultSeason: "fall",
  trees: {
    "original": {
      "label": "Original",
      "seasons": {
        "spring": { "label": "Summer", "leafImage": "images/branch.png", "trunkColor": "#4b4a33", "leafScale": 0.60, "anchor": { "x": 0.5, "y": 0.95 } },
        "fall":   { "label": "Fall",   "leafImage": "images/branch2.png", "trunkColor": "#80461b", "leafScale": 0.60, "anchor": { "x": 0.48, "y": 0.95 } }
      }
    },
    "oak": {
      "label": "Oak",
      "seasons": {
        "spring": { "label": "Spring", "leafImage": "images/oak_spring.png", "trunkColor": "#3f5d2a", "leafScale": 0.60, "anchor": { "x": 0.5, "y": 0.95 } },
        "summer": { "label": "Summer", "leafImage": "images/oak_summer.png", "trunkColor": "#4b4a33", "leafScale": 0.60, "anchor": { "x": 0.5, "y": 0.95 } },
        "fall":   { "label": "Fall",   "leafImage": "images/oak_fall.png",   "trunkColor": "#80461b", "leafScale": 0.62, "anchor": { "x": 0.5, "y": 0.95 } },
        "winter": { "label": "Winter", "leafImage": "images/oak_winter.png", "trunkColor": "#5a534a", "leafScale": 0.55, "anchor": { "x": 0.5, "y": 0.90 } }
      }
    },
    "maple": {
      "label": "Maple",
      "seasons": {
        "spring": { "label": "Spring", "leafImage": "images/maple_spring.png", "trunkColor": "#3a5f2b", "leafScale": 0.58, "anchor": { "x": 0.5, "y": 0.95 } },
        "summer": { "label": "Summer", "leafImage": "images/maple_summer.png", "trunkColor": "#3f3a2b", "leafScale": 0.58, "anchor": { "x": 0.5, "y": 0.95 } },
        "fall":   { "label": "Fall",   "leafImage": "images/maple_fall.png",   "trunkColor": "#6e3a1b", "leafScale": 0.64, "anchor": { "x": 0.5, "y": 0.95 } },
        "winter": { "label": "Winter", "leafImage": "images/maple_winter.png", "trunkColor": "#5a534a", "leafScale": 0.52, "anchor": { "x": 0.5, "y": 0.95 } },
        "rainy":  { "label": "Rainy",  "leafImage": "images/maple_rainy.png",  "trunkColor": "#2b4f3a", "leafScale": 0.58, "anchor": { "x": 0.5, "y": 0.95 } }
      }
    },
    "birch": {
      "label": "Birch",
      "seasons": {
        "spring": { "label": "Spring", "leafImage": "images/birch_spring.png", "trunkColor": "#5b6b50", "leafScale": 0.56, "anchor": { "x": 0.5, "y": 0.95 } },
        "summer": { "label": "Summer", "leafImage": "images/birch_summer.png", "trunkColor": "#6b5e52", "leafScale": 0.56, "anchor": { "x": 0.5, "y": 0.95 } },
        "fall":   { "label": "Fall",   "leafImage": "images/birch_fall.png",   "trunkColor": "#7a5a3a", "leafScale": 0.60, "anchor": { "x": 0.5, "y": 0.95 } },
        "winter": { "label": "Winter", "leafImage": "images/birch_winter.png", "trunkColor": "#7c746a", "leafScale": 0.50, "anchor": { "x": 0.5, "y": 0.95 } },
      }
    },
    "pine": {
      "label": "Pine",
      "seasons": {
        "Winter": { "label": "Winter", "leafImage": "images/pine_spring.png", "trunkColor": "#38422b", "leafScale": 0.58, "anchor": { "x": 0.5, "y": 0.95 } },
      }
    },
    "cherry": {
      "label": "Cherry",
      "seasons": {
        "spring": { "label": "Spring (Blossom)", "leafImage": "images/cherry_spring.png", "trunkColor": "#5a3a3a", "leafScale": 0.62, "anchor": { "x": 0.5, "y": 0.95 } },
        "fall":   { "label": "Fall",             "leafImage": "images/cherry_fall.png",   "trunkColor": "#6a432e", "leafScale": 0.62, "anchor": { "x": 0.5, "y": 0.95 } },
        "winter": { "label": "Winter",           "leafImage": "images/cherry_winter.png", "trunkColor": "#5c4d46", "leafScale": 0.54, "anchor": { "x": 0.5, "y": 0.95 } },
      }
    },
  }
};

/***** 2) CANVAS SETUP ********************************************************/
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/***** 3) STATE ****************************************************************/
let showLeaves = true;
let settingAnimation = true;
let settingTreeDepth = 10;
let settingTrunkThickness = true;
let settingsConnectedTrunk = true;

let currentTreeKey = CONFIG.defaultTree;
let currentSeasonKey = CONFIG.defaultSeason;

let BRANCH_LENGTH = (window.innerHeight / (.00001 * Math.pow(settingTreeDepth, 10)));
const LEAF_SIZE = 25;
const FLEXIBILITY = 200;

let counter = 1;
let treeColor = getTrunkColor();

/***** 4) IMAGE CACHE *********************************************************/
const ImageCache = {};
function preloadImagesFromConfig() {
  for (const [treeKey, tree] of Object.entries(CONFIG.trees)) {
    ImageCache[treeKey] = ImageCache[treeKey] || {};
    for (const [seasonKey, season] of Object.entries(tree.seasons)) {
      const img = new Image();
      img.src = season.leafImage;
      ImageCache[treeKey][seasonKey] = img;
    }
  }
}
preloadImagesFromConfig();

function getLeafImage() { return ImageCache[currentTreeKey]?.[currentSeasonKey]; }
function getSeasonConfig() { return CONFIG.trees[currentTreeKey]?.seasons?.[currentSeasonKey] || {}; }
function getTrunkColor() { return getSeasonConfig().trunkColor || '#4b4a33'; }
function getLeafScale() { return getSeasonConfig().leafScale ?? 0.6; }
function getLeafAnchor() {
  const a = getSeasonConfig().anchor;
  return { x: (a?.x ?? 0.5), y: (a?.y ?? 0.9) };
}

/***** 5) HELPERS *************************************************************/
function toRadians(angle) { return angle * (Math.PI / 180); }
function treeRandomness(value) { return 1 - value + Math.random() * value * 2; }
function tm(v, r) { return (Math.cos(counter/100 + (r * 100)) * (1/v)) / 400; }
function getRandomInt(min, max) { return Math.floor(Math.random() * (max - Math.ceil(min) + 1)) + Math.ceil(min); }

/***** 6) UI WIRING ***********************************************************/
function buildDynamicUI() {
  const host = document.getElementById('dynamic-ui');
  host.innerHTML = '';

  const treesDiv = document.createElement('div');
  treesDiv.innerHTML = `<h3>Trees</h3>`;
  const treeRow = document.createElement('div');
  treeRow.className = 'row';
  Object.entries(CONFIG.trees).forEach(([key, tree]) => {
    const btn = document.createElement('button');
    btn.textContent = tree.label ?? key;
    btn.onclick = () => {
      currentTreeKey = key;
      if (!CONFIG.trees[currentTreeKey].seasons[currentSeasonKey]) {
        currentSeasonKey = Object.keys(CONFIG.trees[currentTreeKey].seasons)[0];
      }
      treeColor = getTrunkColor();
      renderSeasonButtons(seasonRow);
      genNewTree();

      // highlight active
        document.querySelectorAll('[data-tree]').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
    };
    btn.dataset.tree = key; 

    // set initial active tree
    const initTreeBtn = treeRow.querySelector(`[data-tree="${currentTreeKey}"]`);
    if (initTreeBtn) initTreeBtn.classList.add('is-active');

    treeRow.appendChild(btn);
  });
  treesDiv.appendChild(treeRow);

  const seasonsDiv = document.createElement('div');
  seasonsDiv.innerHTML = `<h3>Seasons</h3>`;
  const seasonRow = document.createElement('div');
  seasonRow.className = 'row';
  seasonsDiv.appendChild(seasonRow);

  host.appendChild(treesDiv);
  host.appendChild(seasonsDiv);

  renderSeasonButtons(seasonRow);
}

function renderSeasonButtons(container) {
  container.innerHTML = '';
  const seasons = CONFIG.trees[currentTreeKey].seasons;
  Object.entries(seasons).forEach(([sKey, s]) => {
    const btn = document.createElement('button');
    btn.textContent = s.label ?? sKey;
    btn.onclick = () => {
      currentSeasonKey = sKey;
      treeColor = getTrunkColor();

      // highlight active
  document.querySelectorAll('[data-season]').forEach(b => b.classList.remove('is-active'));
  btn.classList.add('is-active');
    };
    btn.dataset.season = sKey;
    container.appendChild(btn);

    if (sKey === currentSeasonKey) btn.classList.add('is-active');
  });
}

/***** 7) CONTROL HANDLERS ****************************************************/
function onload() {
  document.getElementById("settingTreeDepth").innerHTML = settingTreeDepth;
  const sizeEl = document.getElementById("size");
  sizeEl.value = settingTreeDepth;

  document.getElementById('btnGen').onclick = genNewTree;

  document.getElementById('checkbox1').onclick = () => { showLeaves = document.getElementById('checkbox1').checked; };
  document.getElementById('checkbox2').onclick = () => { settingAnimation = document.getElementById('checkbox2').checked; };
  document.getElementById('checkbox3').onclick = () => { settingTrunkThickness = document.getElementById('checkbox3').checked; };
  document.getElementById('checkbox4').onclick = () => { settingsConnectedTrunk = document.getElementById('checkbox4').checked; };

  document.getElementById('size').addEventListener('input', (e) => {
    const val = Number(e.target.value);
    settingTreeDepth = val;
    document.getElementById("settingTreeDepth").innerHTML = val;
    BRANCH_LENGTH = (window.innerHeight / (20 * Math.pow(settingTreeDepth, 2)));
    genNewTree();
  });

  buildDynamicUI();

    // --- Grass blades slider ---
  const bladeEl = document.getElementById('bladeCount');
  const bladeVal = document.getElementById('bladeCountVal');
  if (bladeEl && bladeVal) {
    bladeEl.value = String(GROUND.bladesCount);
    bladeVal.textContent = String(GROUND.bladesCount);

    bladeEl.addEventListener('input', (e) => {
      GROUND.bladesCount = Number(e.target.value);
      bladeVal.textContent = String(GROUND.bladesCount);
      generateBlades(); // just rebuild blades; hill & tree stay put
    });
  }

  

}

/***** 8) TREE GENERATION & RENDER ********************************************/
function drawTreeFancy(x, y, branch) {
  let branchY = 0;
  let branchX = 0;
  for (let i in branch.branches) {
    if (branch.depth > -1) {
      let newBranchY = Math.cos(branch.angle) * branch.length * branch.depth * BRANCH_LENGTH;
      let newBranchX = Math.sin(branch.angle) * branch.length * branch.depth * BRANCH_LENGTH;

      if (settingTrunkThickness) {
        ctx.lineWidth = branch.depth - 2;
        ctx.beginPath();
      } else {
        ctx.lineWidth  = 1;
      }

      ctx.moveTo(branchX + x, branchY + y);
      ctx.lineTo(newBranchX + branchX + x, newBranchY + branchY + y);
      if (branch.depth > 0 && settingsConnectedTrunk) {
        let newerBranchY = Math.cos(branch.branches[i].angle) * branch.branches[i].length * branch.branches[i].depth * BRANCH_LENGTH;
        let newerBranchX = Math.sin(branch.branches[i].angle) * branch.branches[i].length * branch.branches[i].depth * BRANCH_LENGTH;
        ctx.lineTo(newerBranchX + newBranchX + branchX + x, newerBranchY + newBranchY + branchY + y);
        branch.branches[i].x = newerBranchX + newBranchX + branchX + x;
        branch.branches[i].y = newerBranchY + newBranchY + branchY + y;
      }
      else if (!settingsConnectedTrunk) {
        branch.branches[i].x = newBranchX + branchX + x;
        branch.branches[i].y = newBranchY + branchY + y;
      }
      if (settingTrunkThickness) {
        ctx.stroke();
      }
      drawTreeFancy(newBranchX + x, newBranchY + y, branch.branches[i]);
    }
  }
}

function updateTree(branch) {
  branch.angle += tm(branch.depth, branch.rSeed);
  for (let i in branch.branches) {
    if (branch.branches[i].depth > 0) {
      updateTree(branch.branches[i]);
    }
  }
}

// Draw image with anchor point
function drawImageAnchored(image, x, y, scale, rotation, anchor){
  const iw = image.naturalWidth || image.width || 1;
  const ih = image.naturalHeight || image.height || 1;
  const targetW = 100, targetH = 150;
  const normScale = Math.min(targetW / iw, targetH / ih);
  const ax = iw * (anchor?.x ?? 0.5);
  const ay = ih * (anchor?.y ?? 0.9);
  const totalScale = scale * normScale;
  ctx.setTransform(totalScale, 0, 0, totalScale, x, y);
  ctx.rotate(rotation);
  ctx.drawImage(image, -ax, -ay);
}

function drawLeaves(branch) {
  for (let i in branch.branches) {
    drawLeaves(branch.branches[i]);
    if (branch.branches[0].depth == 0) {
      const image = getLeafImage();
      if (image && image.complete) {
        const anchor = getLeafAnchor();
        drawImageAnchored(
          image,
          branch.branches[i].x,
          branch.branches[i].y,
          getLeafScale() + (branch.rSeed / 3),
          -branch.angle + Math.PI,
          anchor
        );
      }
    }
  }
  ctx.setTransform(1,0,0,1,0,0);
}

function createTree(degree, len, depth, first) {
  depth -= 1;
  if (depth <= 0) {
    return { angle: degree * treeRandomness(.8), length: len * treeRandomness(.2), depth, rSeed: Math.random(), branches: [] };
  }
  let numberOfNewBranches = Math.min(getRandomInt(1,10), 2);
  let branches = [];
  let leanAmount = getRandomInt(0,2);
  for (let i = 0; i < numberOfNewBranches; i++) {
    while (true) {
      let newValue = treeRandomness(.15);
      if ( (leanAmount <= 1 && newValue >= 1) || (leanAmount > 1 && newValue < 1) ) {
        leanAmount = newValue;
        break;
      }
    }
    if (first) { leanAmount = 1; }
    let newBranch = createTree(degree * leanAmount, len * treeRandomness(.1), depth, false);
    branches.push(newBranch);
  }
  return { angle: degree, length: len, depth, rSeed: Math.random(), branches };
}

/***** 8.1) GROUND — STATIC HILL + MOVING GRASS BLADES ************************
   - Black silhouette
   - Hill shape is static (does not move)
   - Only individual blades sway subtly
*******************************************************************************/
const GROUND = {
  baseOffset: 42,      // distance from bottom to the ground edge mid-height
  humpHeight: 70,      // hill height at center
  noiseAmp: 3,         // small edge roughness (static)
  noiseFreq1: 0.010,
  noiseFreq2: 0.036,

  bladesCount: 200,    // how many blades to draw
  bladeMin: 12,        // min blade height (px)
  bladeMax: 28,        // max blade height (px)
  bladeBase: 3,        // base width at ground (px)
  swayAmp: 2.2,        // max sideways sway (px) — subtle!
  swaySpeedMin: 0.035, // radians/frame
  swaySpeedMax: 0.075
};

let groundEdgeY = null;     // function x -> y (static)
let groundForBlades = [];   // {x, y, h, phase, speed, lean}

/** Build a static hill + edge function */
function generateGround() {
  const baseY = canvas.height - GROUND.baseOffset;
  const center = canvas.width / 2;
  const sigma = canvas.width * 0.35; // width of the mound

  // Static edge function with a soft mound + frozen roughness
  groundEdgeY = (x) => {
    const dx = x - center;
    const mound = Math.exp(-(dx * dx) / (2 * sigma * sigma)) * GROUND.humpHeight;
    const rough = Math.sin(x * GROUND.noiseFreq1) * GROUND.noiseAmp
                + Math.sin(x * GROUND.noiseFreq2 + 1.7) * (GROUND.noiseAmp * 0.6);
    return baseY - mound - rough;
  };

  // Blades along the edge
   generateBlades();
}

/** Rebuild ONLY the blades array (keeps ground edge & tree position) */
function generateBlades() {
  groundForBlades = [];
  if (!groundEdgeY) return;

  for (let i = 0; i < GROUND.bladesCount; i++) {
    const x = Math.random() * canvas.width;
    const y = groundEdgeY(x);
    const h = GROUND.bladeMin + Math.random() * (GROUND.bladeMax - GROUND.bladeMin);
    const phase = Math.random() * Math.PI * 2;
    const speed = GROUND.swaySpeedMin + Math.random() * (GROUND.swaySpeedMax - GROUND.swaySpeedMin);
    const lean = (Math.random() - 0.5) * 0.8;
    groundForBlades.push({ x, y, h, phase, speed, lean });
  }
}




/** Draw filled black hill silhouette (to the bottom of the canvas) */
function drawGroundSilhouette() {
  ctx.save();
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.moveTo(0, groundEdgeY(0));
  const step = 6;
  for (let x = step; x <= canvas.width; x += step) {
    ctx.lineTo(x, groundEdgeY(x));
  }
  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Draw blades (thin curved triangles) that sway gently */
function drawGrassBlades() {
  ctx.save();
  ctx.fillStyle = '#000';
  for (const b of groundForBlades) {
    const sway = Math.sin(counter * b.speed + b.phase) * GROUND.swayAmp;
    const baseL = { x: b.x - GROUND.bladeBase * 0.5, y: b.y + 1 };
    const baseR = { x: b.x + GROUND.bladeBase * 0.5, y: b.y + 1 };
    const tip   = { x: b.x + sway + b.lean * 6,      y: b.y - b.h };

    ctx.beginPath();
    ctx.moveTo(baseL.x, baseL.y);
    // left side curve
    ctx.quadraticCurveTo(b.x - 1, b.y - b.h * 0.45, tip.x, tip.y);
    // right side back to base
    ctx.quadraticCurveTo(b.x + 1, b.y - b.h * 0.45, baseR.x, baseR.y);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

/***** 9) LIFECYCLE ************************************************************/
let tree = null;
const treeX = window.innerWidth / 2;
let treeY = 0; // pinned ONCE to the static ground (no vertical bobbing)

function genNewTree() {
  tree = createTree(toRadians(180), 20, settingTreeDepth, true);
  BRANCH_LENGTH = (window.innerHeight / (20 * Math.pow(settingTreeDepth, 2)));

  // (Re)build ground and pin tree base once
  generateGround();
  treeY = groundEdgeY(treeX) - 2; // fixed from now on
}

let d = new Date();
let oldDate = d.getTime();
let newDate = null;
let fpsAccum = 0;
let fpsCounter = 0;

function animation() {
  d = new Date();
  oldDate = newDate;
  newDate = d.getTime();
  if (oldDate) {
    fpsAccum += (1000 / (newDate - oldDate));
    fpsCounter++;
    if (counter % 20 === 0 && fpsCounter > 0) {
      document.getElementById("fps").innerHTML = (fpsAccum / fpsCounter).toFixed(2);
      fpsAccum = 0; fpsCounter = 0;
    }
  }

  counter += 1;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (settingAnimation) updateTree(tree);

  // Draw tree (Y is fixed; no bobbing)
  ctx.strokeStyle = treeColor;
  if (!settingTrunkThickness) {
    ctx.beginPath();
    drawTreeFancy(treeX, treeY, tree);
    ctx.stroke();
  } else {
    drawTreeFancy(treeX, treeY, tree);
  }
  if (showLeaves) drawLeaves(tree);

  // Ground (silhouette behind + blades on top) — draw LAST to overlap trunk base
  drawGroundSilhouette();
  drawGrassBlades();

  window.requestAnimationFrame(animation);
}

// Initialize first tree & ground
genNewTree();
window.requestAnimationFrame(animation);

// Expose onload for HTML body
window.onload = onload;

// Keep canvas full-screen on resize and rebuild ground; keep tree pinned to new edge
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  generateGround();
  treeY = groundEdgeY(treeX) - 2; // still fixed
  BRANCH_LENGTH = (window.innerHeight / (20 * Math.pow(settingTreeDepth, 2)));
});
