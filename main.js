const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const TILE = 16;
const SAVE_KEY = 'yoinaki-house-save-v2';

const ui = {
  hudMap: document.getElementById('mapName'),
  hudHint: document.getElementById('hintText'),
  inventory: document.getElementById('inventoryBar'),
  messageBox: document.getElementById('messageBox'),
  speakerName: document.getElementById('speakerName'),
  messageText: document.getElementById('messageText'),
  choiceBox: document.getElementById('choiceBox'),
  overlay: document.getElementById('overlay'),
  titleScreen: document.getElementById('titleScreen'),
  endingScreen: document.getElementById('endingScreen'),
  endingLabel: document.getElementById('endingLabel'),
  endingTitle: document.getElementById('endingTitle'),
  endingDesc: document.getElementById('endingDesc'),
  startBtn: document.getElementById('startBtn'),
  continueBtn: document.getElementById('continueBtn'),
  restartBtn: document.getElementById('restartBtn'),
  interactBtn: document.getElementById('interactBtn'),
  saveBtn: document.getElementById('saveBtn'),
  menuBtn: document.getElementById('menuBtn'),
  runBtn: document.getElementById('runBtn'),
  guideBtn: document.getElementById('guideBtn'),
  joystick: document.getElementById('joystick'),
  joystickKnob: document.getElementById('joystickKnob'),
};

const ITEMS = {
  brassKey: { id: 'brassKey', name: '真鍮の鍵', color: '#cfb27c' },
  cellarKey: { id: 'cellarKey', name: '地下の鍵', color: '#8fd0d7' },
  whiteFlower: { id: 'whiteFlower', name: '白い花', color: '#f2f4ff' },
};

const MAPS = {
  hall: {
    id: 'hall',
    name: '宵鳴き館 玄関ホール',
    width: 20,
    height: 11,
    floor: 'hall',
    walls: [
      '####################',
      '#........#.........#',
      '#........#....D..D.#',
      '#........#.........#',
      '#........#.........#',
      '#..................#',
      '#.........##.......#',
      '#.........##.......#',
      '#..................#',
      '#...........DD.....#',
      '#########DD#########',
    ],
    transfers: [
      { x: 9, y: 10, to: 'outside', tx: 10, ty: 2, dir: 'up' },
      { x: 10, y: 10, to: 'outside', tx: 10, ty: 2, dir: 'up' },
      { x: 14, y: 2, to: 'study', tx: 2, ty: 5, dir: 'right', requires: 'brassKey', lockedText: '右奥の書斎は鍵がかかっている。子供部屋で鍵を探そう。' },
      { x: 17, y: 2, to: 'childRoom', tx: 2, ty: 5, dir: 'right' },
      { x: 12, y: 9, to: 'basement', tx: 8, ty: 7, dir: 'up', requires: 'cellarKey', lockedText: '地下の扉は鎖で閉ざされている。書斎で鍵を探そう。' },
      { x: 13, y: 9, to: 'basement', tx: 8, ty: 7, dir: 'up', requires: 'cellarKey', lockedText: '地下の扉は鎖で閉ざされている。書斎で鍵を探そう。' },
    ],
    decorations: [
      { type: 'rug', x: 8, y: 4, w: 4, h: 3 },
      { type: 'vase', x: 3, y: 8 },
      { type: 'mirror', x: 3, y: 2 },
      { type: 'statue', x: 16, y: 7 },
      { type: 'note', x: 5, y: 5 },
      { type: 'doorframe', x: 14, y: 2 },
      { type: 'doorframe', x: 17, y: 2 },
      { type: 'stairs', x: 12, y: 9 },
    ],
  },
  childRoom: {
    id: 'childRoom',
    name: '子供部屋',
    width: 14,
    height: 10,
    floor: 'child',
    walls: [
      '##############',
      '#............#',
      '#............#',
      '#............#',
      '#............#',
      'D............#',
      '#............#',
      '#............#',
      '#............#',
      '##############',
    ],
    transfers: [
      { x: 0, y: 5, to: 'hall', tx: 16, ty: 2, dir: 'left' },
    ],
    decorations: [
      { type: 'bed', x: 9, y: 2, w: 3, h: 2 },
      { type: 'toybox', x: 10, y: 7 },
      { type: 'frameMoon', x: 3, y: 2 },
      { type: 'frameRain', x: 6, y: 2 },
      { type: 'frameEye', x: 9, y: 2 },
      { type: 'note', x: 3, y: 6 },
      { type: 'doll', x: 5, y: 7 },
    ],
  },
  study: {
    id: 'study',
    name: '書斎',
    width: 14,
    height: 10,
    floor: 'study',
    walls: [
      '##############',
      '#............#',
      '#............#',
      '#............#',
      '#............#',
      'D............#',
      '#............#',
      '#............#',
      '#............#',
      '##############',
    ],
    transfers: [
      { x: 0, y: 5, to: 'hall', tx: 15, ty: 2, dir: 'left' },
    ],
    decorations: [
      { type: 'bookshelf', x: 2, y: 1, w: 10, h: 1 },
      { type: 'desk', x: 8, y: 5, w: 3, h: 2 },
      { type: 'diary', x: 9, y: 4 },
      { type: 'window', x: 3, y: 8, w: 3, h: 1 },
      { type: 'clock', x: 11, y: 2 },
    ],
  },
  basement: {
    id: 'basement',
    name: '地下祭壇',
    width: 16,
    height: 10,
    floor: 'basement',
    walls: [
      '################',
      '#..............#',
      '#..............#',
      '#......##......#',
      '#......##......#',
      '#..............#',
      '#..............#',
      '#..............#',
      '#.......D......#',
      '################',
    ],
    transfers: [
      { x: 8, y: 8, to: 'hall', tx: 12, ty: 8, dir: 'down' },
    ],
    decorations: [
      { type: 'altar', x: 7, y: 2, w: 2, h: 2 },
      { type: 'candles', x: 5, y: 5 },
      { type: 'candles', x: 10, y: 5 },
      { type: 'grave', x: 3, y: 7 },
      { type: 'grave', x: 12, y: 7 },
    ],
  },
  outside: {
    id: 'outside',
    name: '館の前庭',
    width: 20,
    height: 11,
    floor: 'outside',
    walls: [
      '####################',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '#........DD........#',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '####################',
    ],
    transfers: [
      { x: 8, y: 5, to: 'hall', tx: 9, ty: 9, dir: 'up' },
      { x: 9, y: 5, to: 'hall', tx: 10, ty: 9, dir: 'up' },
    ],
    decorations: [
      { type: 'fountain', x: 4, y: 3, w: 3, h: 3 },
      { type: 'tree', x: 14, y: 3 },
      { type: 'tree', x: 16, y: 6 },
      { type: 'gate', x: 9, y: 1, w: 2, h: 1 },
    ],
  },
};

const state = {
  screen: 'title',
  mapId: 'hall',
  player: { x: 5.5 * TILE, y: 7.5 * TILE, w: 10, h: 14, dir: 'down', speed: 68, anim: 0 },
  items: [],
  flags: {
    introSeen: false,
    mirrorSeen: false,
    hallNoteRead: false,
    childNoteRead: false,
    puzzleSolved: false,
    brassKeyTaken: false,
    flowerTaken: false,
    diaryRead: false,
    cellarKeyTaken: false,
    chaseStarted: false,
    chaseEnded: false,
    altarSeen: false,
    ending: null,
  },
  puzzleProgress: [],
  messageQueue: [],
  onMessageDone: null,
  choiceActive: false,
  controlsLocked: false,
  running: false,
  stepTimer: 0,
  flashTimer: 0,
  shakeTimer: 0,
  chaser: null,
  doorMessageCooldown: 0,
};

const keys = { up: false, down: false, left: false, right: false };
const touchStick = { active: false, pointerId: null, x: 0, y: 0 };
let lastTime = performance.now();

function resetState() {
  state.screen = 'game';
  state.mapId = 'hall';
  state.player.x = 5.5 * TILE;
  state.player.y = 7.5 * TILE;
  state.player.dir = 'down';
  state.player.anim = 0;
  state.items = [];
  state.flags = {
    introSeen: false,
    mirrorSeen: false,
    hallNoteRead: false,
    childNoteRead: false,
    puzzleSolved: false,
    brassKeyTaken: false,
    flowerTaken: false,
    diaryRead: false,
    cellarKeyTaken: false,
    chaseStarted: false,
    chaseEnded: false,
    altarSeen: false,
    ending: null,
  };
  state.puzzleProgress = [];
  state.messageQueue = [];
  state.onMessageDone = null;
  state.choiceActive = false;
  state.controlsLocked = false;
  state.running = false;
  state.stepTimer = 0;
  state.flashTimer = 0;
  state.shakeTimer = 0;
  state.doorMessageCooldown = 0;
  state.chaser = null;
  resetStick();
  closeMessage();
  hideChoices();
  renderInventory();
  updateHud();
  updateRunButton();
}

function currentMap() {
  return MAPS[state.mapId];
}

function tileAt(map, tx, ty) {
  if (ty < 0 || ty >= map.height || tx < 0 || tx >= map.width) return '#';
  return map.walls[ty][tx];
}

function hasItem(id) {
  return state.items.includes(id);
}

function addItem(id) {
  if (!hasItem(id)) {
    state.items.push(id);
    renderInventory();
  }
}

function renderInventory() {
  ui.inventory.innerHTML = '';
  state.items.forEach((id) => {
    const item = ITEMS[id];
    if (!item) return;
    const node = document.createElement('div');
    node.className = 'inventory-item';
    node.innerHTML = `<span class="inventory-icon" style="background:${item.color}"></span>${item.name}`;
    ui.inventory.appendChild(node);
  });
}

function getObjectiveText() {
  if (!state.flags.brassKeyTaken) {
    return '右上の子供部屋へ。壁の絵を左から順番に調べて、木箱の鍵を開けよう。';
  }
  if (!state.flags.diaryRead) {
    return '右奥の書斎へ。机の上の赤い日記を調べよう。';
  }
  if (!state.flags.flowerTaken) {
    return 'ホール左下の花瓶から白い花を取って、下の地下扉へ向かおう。';
  }
  if (!state.flags.altarSeen) {
    return '地下祭壇まで進み、祭壇を調べよう。';
  }
  return '祭壇で選択し、この館を終わらせよう。';
}

function updateHud() {
  const map = currentMap();
  ui.hudMap.textContent = map.name;
  ui.hudHint.textContent = getObjectiveText();
}

function showMessage(lines, speaker = '') {
  state.controlsLocked = true;
  state.messageQueue = Array.isArray(lines) ? [...lines] : [lines];
  ui.speakerName.textContent = speaker;
  ui.messageBox.classList.remove('hidden');
  advanceMessage();
}

function advanceMessage() {
  if (!state.messageQueue.length) {
    closeMessage();
    if (typeof state.onMessageDone === 'function') {
      const cb = state.onMessageDone;
      state.onMessageDone = null;
      cb();
    } else {
      state.controlsLocked = false;
    }
    updateHud();
    return;
  }
  ui.messageText.textContent = state.messageQueue.shift();
}

function closeMessage() {
  ui.messageBox.classList.add('hidden');
  ui.speakerName.textContent = '';
  ui.messageText.textContent = '';
}

function showChoices(choices) {
  state.controlsLocked = true;
  state.choiceActive = true;
  ui.choiceBox.innerHTML = '';
  ui.choiceBox.classList.remove('hidden');

  choices.forEach((choice) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = choice.label;
    btn.addEventListener('click', () => {
      hideChoices();
      state.controlsLocked = false;
      choice.onSelect();
    });
    ui.choiceBox.appendChild(btn);
  });
}

function hideChoices() {
  state.choiceActive = false;
  ui.choiceBox.classList.add('hidden');
  ui.choiceBox.innerHTML = '';
}

function flash(color = 'rgba(255,255,255,0.4)', duration = 0.18) {
  ui.overlay.classList.remove('hidden');
  ui.overlay.style.background = color;
  state.flashTimer = duration;
}

function shake(duration = 0.35) {
  state.shakeTimer = duration;
}

function playBeep(type = 'soft') {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  if (!playBeep.ctx) playBeep.ctx = new AudioCtx();
  const ac = playBeep.ctx;
  if (ac.state === 'suspended') ac.resume();
  const now = ac.currentTime;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.connect(gain);
  gain.connect(ac.destination);
  if (type === 'scare') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.22);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
  } else if (type === 'item') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.linearRampToValueAtTime(740, now + 0.08);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
  } else if (type === 'door') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(190, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);
  } else {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(340, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.02, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
  }
  osc.start(now);
  osc.stop(now + 0.25);
}

function saveGame() {
  const payload = {
    mapId: state.mapId,
    player: { x: state.player.x, y: state.player.y, dir: state.player.dir },
    items: state.items,
    flags: state.flags,
    puzzleProgress: state.puzzleProgress,
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
  playBeep('item');
  showMessage('静かな気配が、記録を保存した。');
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return false;
  try {
    const data = JSON.parse(raw);
    resetState();
    state.mapId = data.mapId || 'hall';
    state.player.x = data.player?.x ?? 5.5 * TILE;
    state.player.y = data.player?.y ?? 7.5 * TILE;
    state.player.dir = data.player?.dir || 'down';
    state.items = Array.isArray(data.items) ? data.items : [];
    state.flags = { ...state.flags, ...(data.flags || {}) };
    state.puzzleProgress = Array.isArray(data.puzzleProgress) ? data.puzzleProgress : [];
    if (state.flags.chaseStarted && !state.flags.chaseEnded) startChase(true);
    renderInventory();
    updateHud();
    state.screen = 'game';
    updateRunButton();
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

function isBlocked(x, y) {
  const map = currentMap();
  const p = { x, y, w: state.player.w, h: state.player.h };
  const left = Math.floor((p.x - p.w / 2) / TILE);
  const right = Math.floor((p.x + p.w / 2) / TILE);
  const top = Math.floor((p.y - p.h / 2) / TILE);
  const bottom = Math.floor((p.y + p.h / 2) / TILE);

  for (let ty = top; ty <= bottom; ty++) {
    for (let tx = left; tx <= right; tx++) {
      const tile = tileAt(map, tx, ty);
      if (tile === '#') return true;
    }
  }
  return false;
}

function updatePlayer(dt) {
  if (state.controlsLocked || state.screen !== 'game') return;

  const rawX = (keys.right ? 1 : 0) - (keys.left ? 1 : 0) + touchStick.x;
  const rawY = (keys.down ? 1 : 0) - (keys.up ? 1 : 0) + touchStick.y;
  const move = { x: rawX, y: rawY };
  const magnitude = Math.hypot(move.x, move.y);
  if (magnitude < 0.12) return;

  move.x /= magnitude || 1;
  move.y /= magnitude || 1;

  const speed = state.player.speed * (state.running ? 1.42 : 1);
  const nx = state.player.x + move.x * speed * dt;
  const ny = state.player.y + move.y * speed * dt;

  if (Math.abs(move.x) > Math.abs(move.y)) state.player.dir = move.x > 0 ? 'right' : 'left';
  else state.player.dir = move.y > 0 ? 'down' : 'up';

  if (!isBlocked(nx, state.player.y)) state.player.x = nx;
  if (!isBlocked(state.player.x, ny)) state.player.y = ny;

  state.player.anim += dt * (state.running ? 11 : 7);
  state.stepTimer += dt;
  if (state.stepTimer > (state.running ? 0.16 : 0.23)) {
    state.stepTimer = 0;
    playBeep('soft');
  }

  checkTransfers();
}

function checkTransfers() {
  const map = currentMap();
  const tx = Math.floor(state.player.x / TILE);
  const ty = Math.floor(state.player.y / TILE);
  const transfer = map.transfers.find((t) => t.x === tx && t.y === ty);
  if (!transfer) return;

  if (transfer.requires && !hasItem(transfer.requires)) {
    if (state.doorMessageCooldown <= 0 && !state.controlsLocked) {
      state.controlsLocked = true;
      state.onMessageDone = () => { state.controlsLocked = false; };
      showMessage(transfer.lockedText || '鍵がかかっている。');
      state.doorMessageCooldown = 0.8;
    }
    return;
  }

  if (transfer.requires && hasItem(transfer.requires)) playBeep('door');
  changeMap(transfer.to, transfer.tx, transfer.ty, transfer.dir);
}

function changeMap(mapId, tx, ty, dir = 'down') {
  state.mapId = mapId;
  state.player.x = tx * TILE + TILE / 2;
  state.player.y = ty * TILE + TILE / 2;
  state.player.dir = dir;
  updateHud();
  if (state.chaser && mapId !== 'hall') {
    state.chaser = null;
  }
}

function facingTile() {
  const tx = Math.floor(state.player.x / TILE);
  const ty = Math.floor(state.player.y / TILE);
  if (state.player.dir === 'up') return { x: tx, y: ty - 1 };
  if (state.player.dir === 'down') return { x: tx, y: ty + 1 };
  if (state.player.dir === 'left') return { x: tx - 1, y: ty };
  return { x: tx + 1, y: ty };
}

function interact() {
  if (state.screen === 'title') return;
  if (state.screen === 'ending') {
    goTitle();
    return;
  }
  if (!ui.messageBox.classList.contains('hidden')) {
    advanceMessage();
    return;
  }
  if (state.choiceActive || state.controlsLocked) return;

  const tile = facingTile();
  const mapId = state.mapId;

  if (handleInteraction(mapId, tile.x, tile.y)) return;
  playBeep('soft');
  showMessage('そこには、今すぐ調べるものはなさそうだ。');
}

function handleInteraction(mapId, x, y) {
  if (mapId === 'hall') {
    if (x === 3 && y === 2) {
      state.flags.mirrorSeen = true;
      showMessage([
        'ひび割れた鏡だ。映っているはずの自分の背後に、もうひとり立っている。',
        '振り返っても、そこには誰もいない。',
      ]);
      playBeep('scare');
      flash('rgba(255,255,255,0.22)');
      return true;
    }
    if (x === 5 && y === 5) {
      state.flags.hallNoteRead = true;
      showMessage([
        '濡れた紙片に、走り書きのメモが残っている。',
        '「右上の子供部屋。絵を左から順に触れれば、箱が開く」',
      ], '古いメモ');
      return true;
    }
    if (x === 3 && y === 8) {
      if (!state.flags.puzzleSolved) {
        showMessage('白い花が挿された花瓶だ。今はまだ、ただ静かに揺れている。');
      } else if (!state.flags.flowerTaken) {
        state.flags.flowerTaken = true;
        addItem('whiteFlower');
        playBeep('item');
        showMessage('花瓶から、白い花をそっと抜いた。地下へ持って行けそうだ。');
      } else {
        showMessage('花瓶は空だ。水面だけがかすかに揺れている。');
      }
      updateHud();
      return true;
    }
    if ((x === 12 || x === 13) && y === 9) {
      if (!hasItem('cellarKey')) {
        showMessage('地下へ続く扉だ。錆びた鎖の奥に、冷たい鍵穴が見える。');
      } else {
        showMessage('地下の鍵が、鎖の奥でかすかに鳴った。');
      }
      return true;
    }
    if (x === 16 && y === 7) {
      showMessage('石像の顔は削られていて、誰を模したものか分からない。');
      return true;
    }
  }

  if (mapId === 'childRoom') {
    if (x === 3 && y === 6) {
      state.flags.childNoteRead = true;
      showMessage([
        'クレヨンで大きく書かれている。',
        '「かべの えは ひだりから じゅんばん！」',
      ], '子供の字');
      return true;
    }
    if ((x === 3 && y === 2) || (x === 6 && y === 2) || (x === 9 && y === 2)) {
      const key = `${x},${y}`;
      const symbol = x === 3 ? '月' : x === 6 ? '雨' : '目';
      handleFramePuzzle(key, symbol);
      return true;
    }
    if (x === 10 && y === 7) {
      if (!state.flags.puzzleSolved) {
        showMessage('木箱には三つの印が刻まれている。壁の絵の順番が必要みたいだ。');
      } else if (!state.flags.brassKeyTaken) {
        state.flags.brassKeyTaken = true;
        addItem('brassKey');
        playBeep('item');
        showMessage('木箱の中から、真鍮の鍵を手に入れた。これで書斎の扉が開きそうだ。');
        updateHud();
      } else {
        showMessage('箱の中は、もう空っぽだ。');
      }
      return true;
    }
    if (x === 5 && y === 7) {
      showMessage('布人形の視線だけが、不自然にこちらを追ってくる。');
      return true;
    }
  }

  if (mapId === 'study') {
    if (x === 9 && y === 4) {
      if (!state.flags.diaryRead) {
        state.flags.diaryRead = true;
        state.onMessageDone = () => {
          if (!state.flags.cellarKeyTaken) {
            state.flags.cellarKeyTaken = true;
            addItem('cellarKey');
            playBeep('item');
            showMessage('日記の下に隠されていた地下の鍵を見つけた。ホール左下の花瓶も気になる。');
            state.onMessageDone = () => {
              startChase();
            };
          }
        };
        showMessage([
          '机の赤い日記が開いた。',
          '「地下の子は、白い花だけを待っている」',
          '「鍵はここに。読んだ者が扉を開けること」',
        ], '館の記録');
        updateHud();
      } else {
        showMessage('日記の最後のページだけ、誰かに破り取られている。');
      }
      return true;
    }
    if (x === 11 && y === 2) {
      showMessage('止まった時計だ。針は9時12分を指したまま、微かに震えている。');
      return true;
    }
    if ((x >= 2 && x <= 11) && y === 1) {
      showMessage('本の背表紙に触れた瞬間、どれも湿っていることに気づく。');
      return true;
    }
  }

  if (mapId === 'basement') {
    if ((x === 7 || x === 8) && (y === 2 || y === 3)) {
      state.flags.altarSeen = true;
      updateHud();
      showBasementChoice();
      return true;
    }
    if (x === 3 && y === 7) {
      showMessage('名もない小さな墓標。花を置く窪みがある。');
      return true;
    }
    if (x === 12 && y === 7) {
      showMessage('土はまだ湿っている。最近、ここを掘り返した者がいる。');
      return true;
    }
  }

  if (mapId === 'outside') {
    if (x === 4 && y === 3) {
      showMessage('枯れた噴水だ。水の代わりに、薄い霧がわずかに溜まっている。');
      return true;
    }
    if ((x === 9 || x === 10) && y === 1) {
      showMessage('門は開いている。けれど、なぜか背中が重い。');
      return true;
    }
  }

  return false;
}

function handleFramePuzzle(key, symbol) {
  const correct = ['3,2', '6,2', '9,2'];
  state.puzzleProgress.push(key);
  playBeep('soft');

  const index = state.puzzleProgress.length - 1;
  if (state.puzzleProgress[index] !== correct[index]) {
    state.puzzleProgress = [];
    flash('rgba(255, 120, 140, 0.28)', 0.2);
    shake(0.3);
    playBeep('scare');
    showMessage([
      `額縁の${symbol}に触れた瞬間、部屋の空気が冷えきった。`,
      '順番が違う。左から調べる必要がありそうだ。',
    ]);
    return;
  }

  if (state.puzzleProgress.length === correct.length) {
    state.flags.puzzleSolved = true;
    state.puzzleProgress = [];
    flash('rgba(255,255,255,0.22)', 0.15);
    playBeep('item');
    showMessage([
      '三つの額縁が同時に裏返り、木箱の鍵が外れる音がした。',
      'これで木箱を調べれば、中身を取り出せそうだ。',
    ]);
    updateHud();
  } else {
    showMessage(`額縁の${symbol}が、わずかに軋む音を立てた。`);
  }
}

function startChase(restoring = false) {
  state.flags.chaseStarted = true;
  state.controlsLocked = false;
  state.mapId = 'hall';
  state.player.x = 15 * TILE + TILE / 2;
  state.player.y = 2 * TILE + TILE / 2;
  state.player.dir = 'down';
  state.chaser = {
    x: 4 * TILE + TILE / 2,
    y: 8 * TILE + TILE / 2,
    w: 10,
    h: 14,
    speed: restoring ? 42 : 46,
  };
  updateHud();
  flash('rgba(255,255,255,0.18)', 0.15);
  shake(0.45);
  if (!restoring) {
    showMessage([
      '廊下の奥で、濡れた足音が増えた。',
      '地下の扉まで急いで。白い花も忘れずに。',
    ]);
    state.onMessageDone = () => {
      playBeep('scare');
    };
  }
}

function updateChaser(dt) {
  if (!state.chaser || state.mapId !== 'hall' || state.controlsLocked) return;

  const dx = state.player.x - state.chaser.x;
  const dy = state.player.y - state.chaser.y;
  const len = Math.hypot(dx, dy) || 1;
  const vx = (dx / len) * state.chaser.speed * dt;
  const vy = (dy / len) * state.chaser.speed * dt;
  state.chaser.x += vx;
  state.chaser.y += vy;

  const dist = Math.hypot(state.player.x - state.chaser.x, state.player.y - state.chaser.y);
  if (dist < 14) gameOver();

  if (state.mapId === 'basement') {
    state.chaser = null;
    state.flags.chaseEnded = true;
  }
}

function gameOver() {
  state.controlsLocked = true;
  state.chaser = null;
  flash('rgba(150, 0, 12, 0.48)', 0.4);
  playBeep('scare');
  showMessage([
    '冷たい指が、首の後ろに触れた。',
    '次の瞬間、館の音がすべて消えた。',
  ]);
  state.onMessageDone = () => {
    showEnding('GAME OVER', '見つかった記録', '地下へ辿りつく前に、館に見つかった。\nタイトルへ戻り、もう一度順番を辿ってください。');
  };
}

function showBasementChoice() {
  showMessage([
    '祭壇の中心に、小さな骨壺が置かれている。',
    'ここで花を手向ければ、この館は静かになる気がした。',
  ]);
  state.onMessageDone = () => {
    showChoices([
      {
        label: hasItem('whiteFlower') ? '白い花を供える' : '白い花を供える（花がない）',
        onSelect: () => {
          if (hasItem('whiteFlower')) trueEnding();
          else showMessage('花がない。このままでは、何かが足りない。');
        },
      },
      {
        label: '祭壇に背を向け、外へ逃げる',
        onSelect: () => {
          normalEnding();
        },
      },
    ]);
  };
}

function trueEnding() {
  state.flags.ending = 'true';
  showMessage([
    '白い花を置くと、地下の冷気がほどけるように薄れていく。',
    '誰かの泣き声が、ようやく遠ざかった。',
  ]);
  state.onMessageDone = () => {
    showEnding('TRUE END', '白い花の帰り道', 'ユイは館の外へ出た。\n背後の窓辺にはもう、誰の影もない。\n\n読んだ記録を終わらせた者だけが、朝の門をくぐれる。');
  };
}

function normalEnding() {
  state.flags.ending = 'normal';
  showMessage([
    '祭壇から目を逸らしたまま、あなたは階段を駆け上がる。',
    '館は追ってこなかった。ただ、足音だけがひとつ多い。',
  ]);
  state.onMessageDone = () => {
    showEnding('NORMAL END', '足音は、ひとつ多い', '館からは出られた。\nけれど帰り道の舗道に、あなた以外の足音が混ざり続けた。\n\n白い花を見つけていれば、別の終わり方があったかもしれない。');
  };
}

function showEnding(label, title, desc) {
  state.screen = 'ending';
  state.controlsLocked = true;
  ui.endingLabel.textContent = label;
  ui.endingTitle.textContent = title;
  ui.endingDesc.textContent = desc;
  ui.endingScreen.classList.remove('hidden');
}

function goTitle() {
  state.screen = 'title';
  state.controlsLocked = true;
  state.chaser = null;
  ui.endingScreen.classList.add('hidden');
  ui.titleScreen.classList.remove('hidden');
  closeMessage();
  hideChoices();
}

function startNewGame() {
  resetState();
  state.screen = 'game';
  ui.titleScreen.classList.add('hidden');
  ui.endingScreen.classList.add('hidden');
  showMessage([
    '雨宿りのつもりで入った館は、外から見たよりもずっと広かった。',
    'まずは右上の子供部屋を探そう。壁の絵が、鍵の手掛かりらしい。',
  ], 'ユイ');
}

function getCamera(map) {
  const worldW = map.width * TILE;
  const worldH = map.height * TILE;
  let camX = 0;
  let camY = 0;
  let padX = 0;
  let padY = 0;

  if (worldW <= canvas.width) {
    padX = Math.floor((canvas.width - worldW) / 2);
  } else {
    camX = clamp(state.player.x - canvas.width / 2, 0, worldW - canvas.width);
  }

  if (worldH <= canvas.height) {
    padY = Math.floor((canvas.height - worldH) / 2);
  } else {
    camY = clamp(state.player.y - canvas.height / 2, 0, worldH - canvas.height);
  }

  return { x: camX, y: camY, padX, padY, worldW, worldH };
}

function worldToScreen(wx, wy, camera) {
  return {
    x: Math.round(wx - camera.x + camera.padX),
    y: Math.round(wy - camera.y + camera.padY),
  };
}

function draw() {
  const map = currentMap();
  const camera = getCamera(map);
  const shakeX = state.shakeTimer > 0 ? Math.sin(performance.now() * 0.08) * 2 : 0;
  const shakeY = state.shakeTimer > 0 ? Math.cos(performance.now() * 0.1) * 2 : 0;

  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(shakeX, shakeY);

  drawMap(map, camera);
  drawDecorations(map, camera);
  drawDoorHighlights(map, camera);
  drawInteractMarker(camera);
  drawChaser(camera);
  drawPlayer(camera);
  ctx.restore();
}

function drawMap(map, camera) {
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const tile = tileAt(map, x, y);
      const screen = worldToScreen(x * TILE, y * TILE, camera);
      drawFloor(map.floor, screen.x, screen.y, x, y);
      if (tile === '#') drawWall(screen.x, screen.y, map.floor);
      if (tile === 'D') drawDoor(screen.x, screen.y);
    }
  }
}

function drawFloor(type, x, y, tx, ty) {
  let base = '#202534';
  if (type === 'hall') base = '#25283d';
  if (type === 'child') base = '#2d2638';
  if (type === 'study') base = '#292431';
  if (type === 'basement') base = '#1b1e24';
  if (type === 'outside') base = '#243126';

  ctx.fillStyle = base;
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = (tx + ty) % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  ctx.fillRect(x, y, TILE, TILE);
  ctx.strokeStyle = 'rgba(255,255,255,0.025)';
  ctx.strokeRect(x, y, TILE, TILE);
}

function drawWall(x, y, type) {
  let color = '#4c4158';
  if (type === 'outside') color = '#465446';
  if (type === 'basement') color = '#3d3f47';
  ctx.fillStyle = color;
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.fillRect(x, y, TILE, 3);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(x, y + TILE - 3, TILE, 3);
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  ctx.fillRect(x + 1, y + 5, TILE - 2, 2);
  ctx.fillRect(x + 1, y + 10, TILE - 2, 2);
}

function drawDoor(x, y) {
  ctx.fillStyle = '#2c1d1c';
  ctx.fillRect(x + 2, y + 1, TILE - 4, TILE - 2);
  ctx.fillStyle = '#845c4b';
  ctx.fillRect(x + 4, y + 3, TILE - 8, TILE - 4);
  ctx.fillStyle = '#d7c197';
  ctx.fillRect(x + TILE - 5, y + 8, 2, 2);
}

function objectivePulse() {
  return 0.5 + Math.sin(performance.now() * 0.006) * 0.5;
}

function strokeHighlight(screenX, screenY, w = TILE, h = TILE, color = 'rgba(233, 210, 154, 0.9)') {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.strokeRect(screenX + 1, screenY + 1, w - 2, h - 2);
  ctx.restore();
}

function shouldHighlightDecor(decor) {
  if (state.mapId === 'hall' && !state.flags.brassKeyTaken && decor.type === 'doorframe' && decor.x === 17) return true;
  if (state.mapId === 'childRoom' && !state.flags.puzzleSolved && ['frameMoon', 'frameRain', 'frameEye'].includes(decor.type)) return true;
  if (state.mapId === 'childRoom' && state.flags.puzzleSolved && !state.flags.brassKeyTaken && decor.type === 'toybox') return true;
  if (state.mapId === 'hall' && state.flags.brassKeyTaken && !state.flags.diaryRead && decor.type === 'doorframe' && decor.x === 14) return true;
  if (state.mapId === 'study' && !state.flags.diaryRead && decor.type === 'diary') return true;
  if (state.mapId === 'hall' && state.flags.diaryRead && !state.flags.flowerTaken && decor.type === 'vase') return true;
  if (state.mapId === 'hall' && state.flags.diaryRead && decor.type === 'stairs') return true;
  if (state.mapId === 'basement' && !state.flags.altarSeen && decor.type === 'altar') return true;
  return false;
}

function drawDecorations(map, camera) {
  map.decorations.forEach((decor) => {
    const base = worldToScreen(decor.x * TILE, decor.y * TILE, camera);
    const x = base.x;
    const y = base.y;

    switch (decor.type) {
      case 'rug':
        ctx.fillStyle = '#5a2740';
        ctx.fillRect(x, y, decor.w * TILE, decor.h * TILE);
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.fillRect(x + 3, y + 3, decor.w * TILE - 6, decor.h * TILE - 6);
        break;
      case 'vase':
        ctx.fillStyle = '#ebf0ff';
        ctx.fillRect(x + 5, y + 1, 6, 4);
        ctx.fillStyle = '#96aac9';
        ctx.fillRect(x + 5, y + 5, 6, 8);
        ctx.fillStyle = '#6c7f9d';
        ctx.fillRect(x + 4, y + 12, 8, 2);
        break;
      case 'mirror':
        ctx.fillStyle = '#7f6f8a';
        ctx.fillRect(x + 2, y + 1, 12, 14);
        ctx.fillStyle = '#9ec1d7';
        ctx.fillRect(x + 4, y + 3, 8, 10);
        ctx.fillStyle = 'rgba(255,255,255,0.18)';
        ctx.fillRect(x + 5, y + 4, 2, 8);
        break;
      case 'statue':
        ctx.fillStyle = '#7f7a85';
        ctx.fillRect(x + 5, y + 3, 6, 9);
        ctx.fillStyle = '#9b96a3';
        ctx.fillRect(x + 6, y + 1, 4, 3);
        ctx.fillStyle = '#5d5a67';
        ctx.fillRect(x + 3, y + 12, 10, 2);
        break;
      case 'note':
        ctx.fillStyle = '#d8ccb3';
        ctx.fillRect(x + 4, y + 4, 8, 7);
        ctx.fillStyle = '#876';
        ctx.fillRect(x + 5, y + 6, 6, 1);
        ctx.fillRect(x + 5, y + 8, 5, 1);
        break;
      case 'doorframe':
        ctx.strokeStyle = 'rgba(255,255,255,0.16)';
        ctx.strokeRect(x, y, TILE, TILE);
        break;
      case 'stairs':
        ctx.fillStyle = '#4e525f';
        for (let i = 0; i < 4; i++) ctx.fillRect(x + i * 3, y + i * 3, 10, 2);
        break;
      case 'bed':
        ctx.fillStyle = '#6a5161';
        ctx.fillRect(x, y, decor.w * TILE, decor.h * TILE);
        ctx.fillStyle = '#d8d0e4';
        ctx.fillRect(x + 2, y + 2, decor.w * TILE - 4, TILE - 4);
        ctx.fillStyle = '#baa9c9';
        ctx.fillRect(x + 2, y + TILE + 1, decor.w * TILE - 4, TILE - 3);
        break;
      case 'toybox':
        ctx.fillStyle = '#734e35';
        ctx.fillRect(x + 1, y + 4, 14, 9);
        ctx.fillStyle = '#b58359';
        ctx.fillRect(x + 1, y + 3, 14, 2);
        ctx.fillStyle = '#dec68f';
        ctx.fillRect(x + 7, y + 8, 2, 2);
        break;
      case 'frameMoon':
      case 'frameRain':
      case 'frameEye':
        ctx.fillStyle = '#9a795b';
        ctx.fillRect(x + 1, y + 1, 14, 14);
        ctx.fillStyle = '#1f2235';
        ctx.fillRect(x + 3, y + 3, 10, 10);
        if (decor.type === 'frameMoon') {
          ctx.fillStyle = '#efe3a7';
          ctx.fillRect(x + 6, y + 5, 4, 5);
          ctx.fillStyle = '#1f2235';
          ctx.fillRect(x + 8, y + 5, 3, 5);
        }
        if (decor.type === 'frameRain') {
          ctx.fillStyle = '#b9d6ff';
          ctx.fillRect(x + 5, y + 5, 1, 5);
          ctx.fillRect(x + 8, y + 4, 1, 6);
          ctx.fillRect(x + 10, y + 6, 1, 4);
        }
        if (decor.type === 'frameEye') {
          ctx.strokeStyle = '#e9d29a';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x + 4.5, y + 6.5, 7, 3);
          ctx.fillStyle = '#e9d29a';
          ctx.fillRect(x + 7, y + 7, 2, 1);
        }
        break;
      case 'doll':
        ctx.fillStyle = '#f1d8c6';
        ctx.fillRect(x + 5, y + 1, 6, 4);
        ctx.fillStyle = '#cabfd7';
        ctx.fillRect(x + 6, y + 5, 4, 7);
        ctx.fillStyle = '#8e6880';
        ctx.fillRect(x + 5, y + 5, 1, 6);
        ctx.fillRect(x + 10, y + 5, 1, 6);
        break;
      case 'bookshelf':
        ctx.fillStyle = '#5c3d2d';
        ctx.fillRect(x, y, decor.w * TILE, TILE);
        for (let i = 0; i < decor.w * TILE; i += 4) {
          ctx.fillStyle = i % 8 === 0 ? '#b27b50' : '#876147';
          ctx.fillRect(x + i, y + 3, 2, 10);
        }
        break;
      case 'desk':
        ctx.fillStyle = '#6b4d37';
        ctx.fillRect(x, y, decor.w * TILE, decor.h * TILE);
        ctx.fillStyle = '#98704e';
        ctx.fillRect(x + 1, y + 2, decor.w * TILE - 2, TILE - 5);
        break;
      case 'diary':
        ctx.fillStyle = '#7d2439';
        ctx.fillRect(x + 4, y + 4, 8, 7);
        ctx.fillStyle = '#f0e2d0';
        ctx.fillRect(x + 5, y + 5, 1, 5);
        break;
      case 'window':
        ctx.fillStyle = '#6f9bb3';
        ctx.fillRect(x, y, decor.w * TILE, TILE);
        ctx.fillStyle = 'rgba(255,255,255,0.18)';
        ctx.fillRect(x + 2, y + 2, decor.w * TILE - 4, TILE - 4);
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.fillRect(x + decor.w * TILE / 2 - 1, y + 2, 2, TILE - 4);
        break;
      case 'clock':
        ctx.fillStyle = '#9c8b68';
        ctx.fillRect(x + 4, y + 2, 8, 12);
        ctx.fillStyle = '#d5d0c4';
        ctx.fillRect(x + 5, y + 4, 6, 5);
        ctx.fillStyle = '#5d5140';
        ctx.fillRect(x + 7, y + 5, 1, 3);
        ctx.fillRect(x + 7, y + 6, 2, 1);
        break;
      case 'altar':
        ctx.fillStyle = '#57423a';
        ctx.fillRect(x, y, decor.w * TILE, decor.h * TILE);
        ctx.fillStyle = '#cdb49a';
        ctx.fillRect(x + 2, y + 2, decor.w * TILE - 4, 4);
        ctx.fillStyle = '#ece0cc';
        ctx.fillRect(x + 12, y + 8, 8, 5);
        break;
      case 'candles':
        ctx.fillStyle = '#e7dbb7';
        ctx.fillRect(x + 6, y + 5, 4, 6);
        ctx.fillStyle = '#ffd36f';
        ctx.fillRect(x + 7, y + 3, 2, 2);
        break;
      case 'grave':
        ctx.fillStyle = '#6a6d76';
        ctx.fillRect(x + 4, y + 3, 8, 10);
        ctx.fillStyle = '#555861';
        ctx.fillRect(x + 3, y + 13, 10, 1);
        ctx.fillStyle = '#8b8e98';
        ctx.fillRect(x + 7, y + 6, 1, 4);
        ctx.fillRect(x + 5, y + 8, 5, 1);
        break;
      case 'fountain':
        ctx.fillStyle = '#626f7c';
        ctx.fillRect(x, y, decor.w * TILE, decor.h * TILE);
        ctx.fillStyle = '#7fa7bc';
        ctx.fillRect(x + 4, y + 4, decor.w * TILE - 8, decor.h * TILE - 8);
        break;
      case 'tree':
        ctx.fillStyle = '#59422f';
        ctx.fillRect(x + 6, y + 10, 4, 6);
        ctx.fillStyle = '#35533a';
        ctx.fillRect(x + 2, y + 3, 12, 10);
        ctx.fillStyle = '#507359';
        ctx.fillRect(x + 4, y + 5, 8, 4);
        break;
      case 'gate':
        ctx.fillStyle = '#788092';
        ctx.fillRect(x, y, decor.w * TILE, TILE);
        break;
      default:
        break;
    }

    if (shouldHighlightDecor(decor)) {
      const pulse = 0.4 + objectivePulse() * 0.5;
      strokeHighlight(x, y, (decor.w || 1) * TILE, (decor.h || 1) * TILE, `rgba(233,210,154,${pulse})`);
    }
  });
}

function drawDoorHighlights(map, camera) {
  const pulse = 0.35 + objectivePulse() * 0.45;
  map.transfers.forEach((transfer) => {
    const should = (
      (map.id === 'hall' && !state.flags.brassKeyTaken && transfer.to === 'childRoom') ||
      (map.id === 'hall' && state.flags.brassKeyTaken && !state.flags.diaryRead && transfer.to === 'study') ||
      (map.id === 'hall' && state.flags.diaryRead && transfer.to === 'basement')
    );
    if (!should) return;
    const pos = worldToScreen(transfer.x * TILE, transfer.y * TILE, camera);
    strokeHighlight(pos.x, pos.y, TILE, TILE, `rgba(233,210,154,${pulse})`);
  });
}

function getFacingInteractionTile() {
  const tile = facingTile();
  const hit = handleInteractionPreview(state.mapId, tile.x, tile.y);
  return hit ? tile : null;
}

function handleInteractionPreview(mapId, x, y) {
  if (mapId === 'hall') return [[3,2],[5,5],[3,8],[12,9],[13,9],[16,7]].some(([tx, ty]) => tx === x && ty === y);
  if (mapId === 'childRoom') return [[3,6],[3,2],[6,2],[9,2],[10,7],[5,7]].some(([tx, ty]) => tx === x && ty === y);
  if (mapId === 'study') return (x === 9 && y === 4) || (x === 11 && y === 2) || (y === 1 && x >= 2 && x <= 11);
  if (mapId === 'basement') return ((x === 7 || x === 8) && (y === 2 || y === 3)) || (x === 3 && y === 7) || (x === 12 && y === 7);
  if (mapId === 'outside') return (x === 4 && y === 3) || ((x === 9 || x === 10) && y === 1);
  return false;
}

function drawInteractMarker(camera) {
  const facing = getFacingInteractionTile();
  if (!facing || state.controlsLocked || state.screen !== 'game') return;
  const pos = worldToScreen(facing.x * TILE, facing.y * TILE, camera);
  const alpha = 0.5 + objectivePulse() * 0.4;
  ctx.fillStyle = `rgba(233, 210, 154, ${alpha})`;
  ctx.fillRect(pos.x + 6, pos.y - 5, 4, 4);
  ctx.fillRect(pos.x + 7, pos.y, 2, 4);
}

function drawPlayer(camera) {
  const pos = worldToScreen(state.player.x, state.player.y, camera);
  const x = pos.x;
  const y = pos.y;
  const moving = Math.abs(touchStick.x) + Math.abs(touchStick.y) + Number(keys.up || keys.down || keys.left || keys.right) > 0;
  const step = moving ? Math.sin(state.player.anim) : 0;
  const foot = step > 0 ? 1 : -1;

  ctx.fillStyle = '#6b4b5a';
  ctx.fillRect(x - 5, y - 13, 10, 4);
  ctx.fillRect(x - 6, y - 9, 12, 2);

  ctx.fillStyle = '#f2ddcf';
  ctx.fillRect(x - 4, y - 9, 8, 6);

  ctx.fillStyle = '#2d344f';
  ctx.fillRect(x - 5, y - 3, 10, 7);
  ctx.fillStyle = '#7e93df';
  ctx.fillRect(x - 4, y - 2, 8, 6);
  ctx.fillStyle = '#e6ecff';
  ctx.fillRect(x - 1, y - 1, 2, 2);

  ctx.fillStyle = '#1b1f31';
  ctx.fillRect(x - 3, y + 4, 2, 5 + foot);
  ctx.fillRect(x + 1, y + 4, 2, 5 - foot);

  if (state.player.dir !== 'up') {
    ctx.fillStyle = '#222';
    if (state.player.dir === 'left') {
      ctx.fillRect(x - 2, y - 7, 1, 1);
      ctx.fillRect(x - 4, y - 7, 1, 1);
    } else if (state.player.dir === 'right') {
      ctx.fillRect(x + 1, y - 7, 1, 1);
      ctx.fillRect(x + 3, y - 7, 1, 1);
    } else {
      ctx.fillRect(x - 2, y - 7, 1, 1);
      ctx.fillRect(x + 1, y - 7, 1, 1);
    }
  }
}

function drawChaser(camera) {
  if (!state.chaser || state.mapId !== 'hall') return;
  const pos = worldToScreen(state.chaser.x, state.chaser.y, camera);
  const x = pos.x;
  const y = pos.y;
  ctx.fillStyle = 'rgba(240, 245, 255, 0.82)';
  ctx.fillRect(x - 4, y - 11, 8, 10);
  ctx.fillStyle = 'rgba(240, 245, 255, 0.48)';
  ctx.fillRect(x - 6, y - 1, 12, 11);
  ctx.fillStyle = 'rgba(255, 120, 140, 0.76)';
  ctx.fillRect(x - 2, y - 8, 1, 1);
  ctx.fillRect(x + 1, y - 8, 1, 1);
}

function update(dt) {
  if (state.flashTimer > 0) {
    state.flashTimer -= dt;
    if (state.flashTimer <= 0) {
      ui.overlay.style.background = 'rgba(0,0,0,0)';
      ui.overlay.classList.add('hidden');
    }
  }

  if (state.shakeTimer > 0) state.shakeTimer -= dt;
  if (state.doorMessageCooldown > 0) state.doorMessageCooldown -= dt;

  updatePlayer(dt);
  updateChaser(dt);
}

function loop(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.033);
  lastTime = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

function bindKeyboard() {
  window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'arrowup' || key === 'w') keys.up = true;
    if (key === 'arrowdown' || key === 's') keys.down = true;
    if (key === 'arrowleft' || key === 'a') keys.left = true;
    if (key === 'arrowright' || key === 'd') keys.right = true;
    if (key === 'shift') {
      state.running = true;
      updateRunButton();
    }
    if (key === 'e' || key === ' ' || key === 'enter') {
      e.preventDefault();
      interact();
    }
  });

  window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'arrowup' || key === 'w') keys.up = false;
    if (key === 'arrowdown' || key === 's') keys.down = false;
    if (key === 'arrowleft' || key === 'a') keys.left = false;
    if (key === 'arrowright' || key === 'd') keys.right = false;
    if (key === 'shift') {
      state.running = false;
      updateRunButton();
    }
  });
}

function resetStick() {
  touchStick.active = false;
  touchStick.pointerId = null;
  touchStick.x = 0;
  touchStick.y = 0;
  if (ui.joystickKnob) ui.joystickKnob.style.transform = 'translate(0px, 0px)';
}

function updateStickFromEvent(event) {
  const rect = ui.joystick.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  let dx = event.clientX - cx;
  let dy = event.clientY - cy;
  const dist = Math.hypot(dx, dy);
  const max = Math.max(20, Math.min(rect.width, rect.height) * 0.34);
  if (dist > max) {
    dx = (dx / dist) * max;
    dy = (dy / dist) * max;
  }
  touchStick.x = dx / max;
  touchStick.y = dy / max;
  ui.joystickKnob.style.transform = `translate(${dx}px, ${dy}px)`;
}

function bindJoystick() {
  if (!ui.joystick) return;

  ui.joystick.addEventListener('pointerdown', (event) => {
    touchStick.active = true;
    touchStick.pointerId = event.pointerId;
    ui.joystick.setPointerCapture(event.pointerId);
    updateStickFromEvent(event);
  });

  ui.joystick.addEventListener('pointermove', (event) => {
    if (!touchStick.active || event.pointerId !== touchStick.pointerId) return;
    updateStickFromEvent(event);
  });

  const end = (event) => {
    if (touchStick.pointerId !== null && event.pointerId !== touchStick.pointerId) return;
    resetStick();
  };

  ui.joystick.addEventListener('pointerup', end);
  ui.joystick.addEventListener('pointercancel', end);
  ui.joystick.addEventListener('lostpointercapture', resetStick);
}

function updateRunButton() {
  ui.runBtn.classList.toggle('active', state.running);
  ui.runBtn.textContent = state.running ? '走る' : '歩く';
}

function bindTouchControls() {
  ui.interactBtn.addEventListener('click', interact);
  ui.messageBox.addEventListener('click', advanceMessage);
  ui.saveBtn.addEventListener('click', () => {
    if (state.screen === 'game' && !state.choiceActive) saveGame();
  });
  ui.menuBtn.addEventListener('click', goTitle);
  ui.guideBtn.addEventListener('click', () => {
    showMessage(getObjectiveText(), '次の目的');
  });
  ui.runBtn.addEventListener('click', () => {
    state.running = !state.running;
    updateRunButton();
  });
  bindJoystick();
}

function bindUi() {
  ui.startBtn.addEventListener('click', startNewGame);
  ui.continueBtn.addEventListener('click', () => {
    const ok = loadGame();
    if (ok) {
      ui.titleScreen.classList.add('hidden');
      updateHud();
    } else {
      state.screen = 'game';
      ui.titleScreen.classList.add('hidden');
      showMessage('保存データが見つからない。最初から始めよう。');
      state.onMessageDone = () => {
        goTitle();
      };
    }
  });
  ui.restartBtn.addEventListener('click', goTitle);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function init() {
  resetState();
  renderInventory();
  updateHud();
  bindKeyboard();
  bindTouchControls();
  bindUi();
  requestAnimationFrame(loop);
}

init();
