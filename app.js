/* ====================== CHARACTER ROSTER ======================
   Put your 32 image files inside the /images folder using these
   exact filenames. Edit the "name" field if you want different
   display text - it does NOT need to match the filename.
================================================================== */
const CHARACTERS = [
  { name: "Snail",             file: "Snail.png" },
  { name: "Mona",               file: "Mona.png" },
  { name: "Blind Date Dude",    file: "Blind Date Dude.png" },
  { name: "Kyunghwan",          file: "Kyunghwan.png" },
  { name: "Gossip Girl",        file: "Gossip Girl.png" },
  { name: "Dayoung",            file: "Dayoung.png" },
  { name: "Piano Professor",    file: "Piano Professor.png" },
  { name: "Jung's Dad",         file: "Jung's Dad.png" },
  { name: "Seol's Dad",         file: "Seol's Dad.png" },
  { name: "Minsoo",             file: "Minsoo.png" },
  { name: "Young Gon",          file: "Young Gon.png" },
  { name: "Ahreum",             file: "Ahreum.png" },
  { name: "Academy Dude",       file: "Academy Dude.png" },
  { name: "Jaewoo",             file: "Jaewoo.png" },
  { name: "Sangchul",           file: "Sangchul.png" },
  { name: "Seol's Mom",         file: "Seol's Mom.png" },
  { name: "Yu Jung",            file: "Yu Jung.png" },
  { name: "Kwon Euntaek",       file: "Kwon Euntaek.png" },
  { name: "Jang Bora",          file: "Jang Bora.png" },
  { name: "Juyong",             file: "Juyong.png" },
  { name: "Inho's Housemate",   file: "Inho's Housemate.png" },
  { name: "Nam Juyeon",         file: "Nam Juyeon.png" },
  { name: "Seung Eun",          file: "Seung Eun.png" },
  { name: "Professor Baek",     file: "Professor Baek.png" },
  { name: "Panty Thief",        file: "Panty Thief.png" },
  { name: "Inho's Friend",      file: "Inho's Friend.png" },
  { name: "TA Heo",             file: "TA Heo.png" },
  { name: "HongJun",            file: "HongJun.png" },
  { name: "Baek Inho",          file: "Baek Inho.png" },
  { name: "Hong Seol",          file: "Hong Seol.png" },
  { name: "Baek Inha",          file: "Baek Inha.png" },
  { name: "Ahyoung",            file: "Ahyoung.png" },
];

const IMAGE_DIR = "images/";

/* ====================== STATE ====================== */
let rounds = [];        // rounds[r] = array of {p1, p2, winner}
let currentRoundIdx = 0;
let currentMatchIdx = 0;
let totalMatches = 0;
let matchesDone = 0;

/* ====================== DOM ====================== */
const introScreen = document.getElementById("intro");
const matchupScreen = document.getElementById("matchup");
const resultScreen = document.getElementById("result");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const downloadBtn = document.getElementById("downloadBtn");

const cardA = document.getElementById("cardA");
const cardB = document.getElementById("cardB");
const imgA = document.getElementById("imgA");
const imgB = document.getElementById("imgB");
const nameA = document.getElementById("nameA");
const nameB = document.getElementById("nameB");
const roundLabel = document.getElementById("roundLabel");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const championBox = document.getElementById("championBox");
const canvas = document.getElementById("bracketCanvas");

const ROUND_NAMES = ["Round of 32", "Round of 16", "Quarterfinals", "Semifinals", "FINAL"];

/* ====================== HELPERS ====================== */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function imgPath(char) {
  return IMAGE_DIR + char.file;
}

/* ====================== TOURNAMENT ENGINE ====================== */
function startTournament() {
  rounds = [];
  const shuffled = shuffle(CHARACTERS);
  const firstRound = [];
  for (let i = 0; i < shuffled.length; i += 2) {
    firstRound.push({ p1: shuffled[i], p2: shuffled[i + 1], winner: null });
  }
  rounds.push(firstRound);

  totalMatches = CHARACTERS.length - 1; // total matches in a single-elim bracket
  matchesDone = 0;
  currentRoundIdx = 0;
  currentMatchIdx = 0;

  introScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  matchupScreen.classList.remove("hidden");

  showCurrentMatch();
}

function showCurrentMatch() {
  const round = rounds[currentRoundIdx];
  const match = round[currentMatchIdx];

  roundLabel.textContent = ROUND_NAMES[currentRoundIdx] || `Round ${currentRoundIdx + 1}`;

  nameA.textContent = match.p1.name;
  nameB.textContent = match.p2.name;
  imgA.src = imgPath(match.p1);
  imgB.src = imgPath(match.p2);
  imgA.alt = match.p1.name;
  imgB.alt = match.p2.name;

  progressFill.style.width = `${(matchesDone / totalMatches) * 100}%`;
  progressText.textContent = `Matchup ${matchesDone + 1} of ${totalMatches}`;
}

function pickWinner(winner) {
  const round = rounds[currentRoundIdx];
  const match = round[currentMatchIdx];
  match.winner = winner;
  matchesDone++;

  currentMatchIdx++;

  if (currentMatchIdx >= round.length) {
    // round finished, build next round
    const winners = round.map(m => m.winner);
    if (winners.length === 1) {
      finishTournament(winners[0]);
      return;
    }
    const nextRound = [];
    for (let i = 0; i < winners.length; i += 2) {
      nextRound.push({ p1: winners[i], p2: winners[i + 1], winner: null });
    }
    rounds.push(nextRound);
    currentRoundIdx++;
    currentMatchIdx = 0;
  }

  showCurrentMatch();
}

function finishTournament(champion) {
  matchupScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  championBox.innerHTML = `
    <img src="${imgPath(champion)}" alt="${champion.name}">
    <div class="cname">👑 ${champion.name} 👑</div>
  `;

  renderBracketImage(champion);
}

cardA.addEventListener("click", () => pickWinner(rounds[currentRoundIdx][currentMatchIdx].p1));
cardB.addEventListener("click", () => pickWinner(rounds[currentRoundIdx][currentMatchIdx].p2));
startBtn.addEventListener("click", startTournament);
restartBtn.addEventListener("click", () => {
  resultScreen.classList.add("hidden");
  introScreen.classList.remove("hidden");
});

/* ====================== CANVAS BRACKET RENDER ====================== */
function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.warn("Bracket image failed to load:", src);
      resolve(null); // fallback gracefully if missing
    };
    img.src = src;
  });
}

async function renderBracketImage(champion) {
  const ctx = canvas.getContext("2d");

  // 1. HIGH-RESOLUTION BRACKET SIZE CONFIGURATION
  const numRounds = rounds.length; 
  const colWidth = 280;   
  const rowHeight = 70;   
  const thumb = 50;       
  const padding = 60;     
  const titleHeight = 90; 

  const firstRoundCount = rounds[0].length; 
  const width = padding * 2 + colWidth * (numRounds + 1);
  const height = padding * 2 + titleHeight + firstRoundCount * rowHeight * 2;

  canvas.width = width;
  canvas.height = height;

  // Draw solid dark background
  ctx.fillStyle = "#15151a";
  ctx.fillRect(0, 0, width, height);

  // 2. CLEAN TEXT TITLE (Replaced the annoying image banner layout)
  ctx.fillStyle = "#f2b134";
  ctx.font = "bold 38px Arial";
  ctx.textAlign = "center";
  ctx.fillText("🧀 Cheese in the Trap: Who is your GOAT? 🧀", width / 2, padding + 35);

  // Preload all character images used
  const cache = {};
  for (const round of rounds) {
    for (const m of round) {
      for (const p of [m.p1, m.p2]) {
        if (p && !cache[p.file]) {
          cache[p.file] = await loadImage(imgPath(p));
        }
      }
    }
  }

  // Compute y positions for structural entries
  const topY = padding + titleHeight;
  let prevCenters = [];

  for (let r = 0; r < numRounds; r++) {
    const round = rounds[r];
    const x = padding + r * colWidth;
    const matchCount = round.length;
    const blockHeight = (height - topY - padding) / matchCount;
    const centers = [];

    for (let i = 0; i < matchCount; i++) {
      const m = round[i];
      const blockTop = topY + i * blockHeight;
      
      // Math optimization (0.25 & 0.75) ensuring node connectors line up perfectly
      const y1 = blockTop + blockHeight * 0.25;
      const y2 = blockTop + blockHeight * 0.75;
      const centerY = (y1 + y2) / 2;
      centers.push(centerY);

      drawEntrant(ctx, m.p1, x, y1, m.winner === m.p1, cache, thumb);
      drawEntrant(ctx, m.p2, x, y2, m.winner === m.p2, cache, thumb);

      // Thicker connector tree branches
      ctx.strokeStyle = "#555560";
      ctx.lineWidth = 3; 
      ctx.beginPath();
      ctx.moveTo(x + colWidth - 30, y1);
      ctx.lineTo(x + colWidth - 10, y1);
      ctx.lineTo(x + colWidth - 10, y2);
      ctx.lineTo(x + colWidth - 30, y2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + colWidth - 10, centerY);
      ctx.lineTo(x + colWidth + 10, centerY);
      ctx.stroke();
    }
    prevCenters = centers;
  }

  // 3. CHAMPION BOX AND TYPOGRAPHY DRAWING
  const champX = padding + numRounds * colWidth;
  const champY = topY + (height - topY - padding) / 2 - 90;

  ctx.font = "bold 60px Arial";
  ctx.fillStyle = "#f2b134";
  ctx.textAlign = "center";
  ctx.fillText("👑", champX + 90, champY - 20);

  const champImg = cache[champion.file];
  if (champImg) {
    ctx.save();
    roundRect(ctx, champX, champY, 180, 180, 20); 
    ctx.clip();
    ctx.drawImage(champImg, champX, champY, 180, 180);
    ctx.restore();
  }
  ctx.strokeStyle = "#f2b134";
  ctx.lineWidth = 6;
  roundRect(ctx, champX, champY, 180, 180, 20);
  ctx.stroke();

  ctx.font = "bold 28px Arial";
  ctx.fillStyle = "#f0f0f0";
  ctx.fillText(champion.name, champX + 90, champY + 225);
  
  ctx.font = "24px Arial";
  ctx.fillStyle = "#f2b134";
  ctx.fillText("GOAT", champX + 90, champY + 260);
}

function drawEntrant(ctx, player, x, y, isWinner, cache, thumb) {
  if (!player) return;
  const img = cache[player.file];

  ctx.save();
  if (img) {
    roundRect(ctx, x, y - thumb / 2, thumb, thumb, 8); 
    ctx.clip();
    ctx.drawImage(img, x, y - thumb / 2, thumb, thumb);
  }
  ctx.restore();

  ctx.strokeStyle = isWinner ? "#f2b134" : "#444450";
  ctx.lineWidth = isWinner ? 4 : 2; 
  roundRect(ctx, x, y - thumb / 2, thumb, thumb, 8);
  ctx.stroke();

  ctx.font = isWinner ? "bold 20px Arial" : "20px Arial";
  ctx.fillStyle = isWinner ? "#f2b134" : "#9a9aa2";
  ctx.textAlign = "left";
  ctx.fillText(truncate(player.name, 16), x + thumb + 12, y + 6);
}

function truncate(str, n) {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "cheese-in-the-trap-goat-bracket.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});