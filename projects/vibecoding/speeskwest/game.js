// Space Quest: The Cosmic Janitor
// A Sierra-style adventure game

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const titleCanvas = document.getElementById('title-canvas');
const titleCtx = titleCanvas.getContext('2d');

// Game State
let gameState = {
    currentRoom: 'janitorCloset',
    score: 0,
    inventory: [],
    flags: {},
    roger: { x: 320, y: 280, targetX: 320, targetY: 280, frame: 0, direction: 'down', walking: false },
    selectedVerb: 'walk',
    selectedItem: null,
    messageQueue: [],
    showingMessage: false,
    showingDialog: false,
    gameStarted: false,
    savedState: null
};

// Colors for pixel art
const COLORS = {
    skin: '#e8b89d',
    skinDark: '#c49a7e',
    hair: '#ffd700',
    suit: '#4488ff',
    suitDark: '#2266cc',
    suitLight: '#66aaff',
    boots: '#333',
    white: '#fff',
    black: '#000',
    metal: '#888',
    metalDark: '#666',
    metalLight: '#aaa',
    red: '#f44',
    green: '#4f4',
    blue: '#44f',
    purple: '#a4f',
    orange: '#f84',
    yellow: '#ff0',
    brown: '#864',
    brownDark: '#642',
    floor: '#445',
    wall: '#334',
    stars: '#fff'
};

// Draw Roger Wilco (space janitor)
function drawRoger(ctx, x, y, frame, direction, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    
    const walkOffset = Math.sin(frame * 0.3) * 2;
    const flip = direction === 'left' ? -1 : 1;
    ctx.scale(flip, 1);
    
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(0, 30, 12, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Boots
    ctx.fillStyle = COLORS.boots;
    ctx.fillRect(-10, 22 + (frame % 2 ? walkOffset : 0), 8, 8);
    ctx.fillRect(2, 22 + (frame % 2 ? 0 : walkOffset), 8, 8);
    
    // Legs
    ctx.fillStyle = COLORS.suit;
    ctx.fillRect(-8, 10, 6, 14 + (frame % 2 ? walkOffset : 0));
    ctx.fillRect(2, 10, 6, 14 + (frame % 2 ? 0 : walkOffset));
    
    // Body (janitor suit)
    ctx.fillStyle = COLORS.suit;
    ctx.fillRect(-12, -15, 24, 28);
    
    // Suit details
    ctx.fillStyle = COLORS.suitDark;
    ctx.fillRect(-12, -15, 3, 28);
    ctx.fillRect(9, -15, 3, 28);
    ctx.fillRect(-5, -5, 10, 2);
    
    // Belt with tools
    ctx.fillStyle = COLORS.brown;
    ctx.fillRect(-12, 5, 24, 4);
    ctx.fillStyle = COLORS.metalLight;
    ctx.fillRect(-10, 6, 3, 2);
    ctx.fillRect(7, 6, 3, 2);
    
    // Arms
    ctx.fillStyle = COLORS.suit;
    ctx.fillRect(-18, -12, 7, 18);
    ctx.fillRect(11, -12, 7, 18);
    
    // Hands
    ctx.fillStyle = COLORS.skin;
    ctx.fillRect(-17, 4, 5, 5);
    ctx.fillRect(12, 4, 5, 5);
    
    // Neck
    ctx.fillStyle = COLORS.skin;
    ctx.fillRect(-4, -20, 8, 6);
    
    // Head
    ctx.fillStyle = COLORS.skin;
    ctx.beginPath();
    ctx.ellipse(0, -30, 12, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Hair (blonde)
    ctx.fillStyle = COLORS.hair;
    ctx.beginPath();
    ctx.ellipse(0, -38, 10, 8, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-10, -38, 20, 4);
    
    // Eyes
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(-7, -33, 5, 4);
    ctx.fillRect(2, -33, 5, 4);
    ctx.fillStyle = COLORS.blue;
    ctx.fillRect(-5, -32, 2, 3);
    ctx.fillRect(4, -32, 2, 3);
    
    // Nose
    ctx.fillStyle = COLORS.skinDark;
    ctx.fillRect(-1, -28, 2, 4);
    
    // Mouth
    ctx.fillStyle = '#c66';
    ctx.fillRect(-3, -22, 6, 2);
    
    // Name tag
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(-8, -10, 16, 6);
    ctx.fillStyle = COLORS.black;
    ctx.font = '4px Arial';
    ctx.fillText('ROGER', -6, -5);
    
    ctx.restore();
}

// Room definitions
const rooms = {
    janitorCloset: {
        name: "Janitor's Closet",
        background: drawJanitorCloset,
        hotspots: [
            { id: 'mop', x: 50, y: 200, w: 30, h: 120, name: 'mop', 
                look: "Your trusty mop. It's seen better days, much like your career.",
                get: () => { addToInventory('mop'); removeHotspot('janitorCloset', 'mop'); addScore(5); return "You grab the mop. A janitor is nothing without their mop."; }
            },
            { id: 'bucket', x: 100, y: 280, w: 40, h: 40, name: 'bucket',
                look: "A dented metal bucket. It has 'Property of Xenon Orbital Station' scratched into it.",
                get: () => { addToInventory('bucket'); removeHotspot('janitorCloset', 'bucket'); addScore(5); return "You pick up the bucket. It smells like industrial cleaner and regret."; }
            },
            { id: 'locker', x: 150, y: 150, w: 60, h: 150, name: 'locker',
                look: "Your locker. The name 'WILCO' is barely visible under years of grime.",
                open: () => {
                    if (!gameState.flags.lockerOpen) {
                        gameState.flags.lockerOpen = true;
                        addHotspot('janitorCloset', { id: 'keycard', x: 160, y: 200, w: 30, h: 20, name: 'keycard',
                            look: "A security keycard. Level 1 access.",
                            get: () => { addToInventory('keycard'); removeHotspot('janitorCloset', 'keycard'); addScore(10); return "You take the keycard. Who knows, maybe you'll actually need it someday."; }
                        });
                        return "The locker creaks open. Inside you see your spare keycard.";
                    }
                    return "It's already open.";
                }
            },
            { id: 'door', x: 550, y: 120, w: 70, h: 180, name: 'door to corridor',
                look: "The door leading to the main corridor. Through the window you can see the usual station chaos.",
                walk: () => { 
                    if (hasItem('keycard')) {
                        changeRoom('corridor', 100, 280);
                        return "";
                    }
                    return "The door is locked. You need your keycard to get out.";
                },
                use: (item) => {
                    if (item === 'keycard') {
                        changeRoom('corridor', 100, 280);
                        return "";
                    }
                    return "That won't work on the door.";
                }
            },
            { id: 'poster', x: 400, y: 100, w: 80, h: 100, name: 'motivational poster',
                look: "A faded poster showing a muscular space marine. The caption reads: 'SPACE HEROES WANTED! (Janitors need not apply)'"
            }
        ],
        walkableArea: { x1: 40, y1: 260, x2: 600, y2: 350 }
    },
    
    corridor: {
        name: "Main Corridor",
        background: drawCorridor,
        hotspots: [
            { id: 'janitorDoor', x: 30, y: 120, w: 70, h: 180, name: 'janitor closet door',
                look: "The door to your humble workspace.",
                walk: () => { changeRoom('janitorCloset', 520, 280); return ""; }
            },
            { id: 'bridgeDoor', x: 280, y: 100, w: 80, h: 200, name: 'bridge door',
                look: "The door to the bridge. Usually off-limits to cleaning staff.",
                walk: () => { 
                    if (gameState.flags.alienAttack) {
                        changeRoom('bridge', 320, 300);
                        return "";
                    }
                    return "A sign says 'AUTHORIZED PERSONNEL ONLY'. That definitely doesn't include you.";
                }
            },
            { id: 'cargoDoor', x: 530, y: 120, w: 70, h: 180, name: 'cargo bay door',
                look: "The door to the cargo bay.",
                walk: () => { changeRoom('cargoBay', 100, 280); return ""; }
            },
            { id: 'window', x: 150, y: 80, w: 100, h: 100, name: 'window',
                look: () => {
                    if (!gameState.flags.alienAttack) {
                        return "You can see the beautiful Xenon nebula outside. Another boring day in spa- WAIT! Is that an alien ship approaching?!";
                    }
                    return "The alien ship is docked to the station. This is bad. Very bad.";
                }
            },
            { id: 'alarmPanel', x: 450, y: 150, w: 40, h: 60, name: 'alarm panel',
                look: "An emergency alarm panel. The big red button is very tempting.",
                use: () => {
                    if (!gameState.flags.alienAttack) {
                        gameState.flags.alienAttack = true;
                        addScore(15);
                        showDialog("CAPTAIN BLASTOID", "RED ALERT! We're under attack by the Sariens! All hands to battle stations! ...Wait, is that the janitor? GET TO THE ESCAPE PODS!");
                        return "";
                    }
                    return "The alarm is already blaring.";
                }
            },
            { id: 'deadCrew', x: 200, y: 300, w: 60, h: 40, name: 'fallen crew member', visible: () => gameState.flags.alienAttack,
                look: "It's Lieutenant Rodriguez. He's... not going to make it. There's something in his hand.",
                get: () => {
                    if (!gameState.flags.gotDataChip) {
                        gameState.flags.gotDataChip = true;
                        addToInventory('datachip');
                        addScore(20);
                        return "You carefully take the data chip from his hand. 'The... plans...' he whispers. 'Don't let them... get...' He's gone.";
                    }
                    return "You've already taken the data chip. Rest in peace, Lieutenant.";
                }
            }
        ],
        walkableArea: { x1: 40, y1: 260, x2: 600, y2: 350 },
        onEnter: () => {
            if (!gameState.flags.sawCorridor) {
                gameState.flags.sawCorridor = true;
                showMessage("The main corridor of Xenon Orbital Station. It's suspiciously quiet today...");
            }
        }
    },
    
    cargoBay: {
        name: "Cargo Bay",
        background: drawCargoBay,
        hotspots: [
            { id: 'corridorDoor', x: 30, y: 120, w: 70, h: 180, name: 'corridor door',
                look: "The door back to the main corridor.",
                walk: () => { changeRoom('corridor', 500, 280); return ""; }
            },
            { id: 'crates', x: 200, y: 200, w: 150, h: 120, name: 'cargo crates',
                look: "Stacks of cargo crates. Most are marked 'FRAGILE' which probably means weapons.",
                get: "These crates are way too heavy to carry."
            },
            { id: 'escapePod', x: 450, y: 150, w: 150, h: 180, name: 'escape pod',
                look: "A single-person escape pod. It looks functional.",
                walk: () => {
                    if (gameState.flags.alienAttack) {
                        if (hasItem('datachip')) {
                            changeRoom('escapePod', 160, 200);
                            return "";
                        }
                        return "You can't just leave! There must be something important on this station worth saving...";
                    }
                    return "Why would you need to escape? Everything is fine... right?";
                }
            },
            { id: 'toolbox', x: 100, y: 280, w: 50, h: 40, name: 'toolbox',
                look: "A maintenance toolbox. Might have something useful inside.",
                open: () => {
                    if (!gameState.flags.toolboxOpen) {
                        gameState.flags.toolboxOpen = true;
                        addToInventory('wrench');
                        addScore(10);
                        return "You find a sturdy wrench inside. This could come in handy!";
                    }
                    return "You've already looted it. Nothing else useful inside.";
                }
            },
            { id: 'sarien', x: 400, y: 250, w: 60, h: 80, name: 'Sarien guard', visible: () => gameState.flags.alienAttack && !gameState.flags.sarienDefeated,
                look: "A Sarien soldier! He hasn't noticed you yet...",
                talk: "Are you crazy?! He'll vaporize you!",
                walk: () => { 
                    die("The Sarien guard spots you and opens fire. Your career as a space janitor comes to an abrupt end.");
                    return "";
                },
                use: (item) => {
                    if (item === 'wrench') {
                        gameState.flags.sarienDefeated = true;
                        addScore(25);
                        removeHotspot('cargoBay', 'sarien');
                        return "You sneak up behind the guard and whack him with the wrench. CLANG! He crumples to the floor. Who knew janitor skills would be useful?";
                    } else if (item === 'mop') {
                        die("You charge at the Sarien with your mop. He looks at you, confused, then vaporizes you. Not your best plan.");
                        return "";
                    }
                    return "That's not going to help against an armed alien!";
                }
            }
        ],
        walkableArea: { x1: 40, y1: 260, x2: 600, y2: 350 }
    },
    
    escapePod: {
        name: "Escape Pod",
        background: drawEscapePod,
        hotspots: [
            { id: 'seat', x: 120, y: 150, w: 80, h: 100, name: 'pilot seat',
                look: "A cramped pilot seat. Built for function, not comfort.",
                walk: () => {
                    gameState.roger.x = 160;
                    gameState.roger.y = 200;
                    showMessage("You squeeze into the pilot seat.");
                    return "";
                }
            },
            { id: 'controls', x: 220, y: 100, w: 200, h: 150, name: 'control panel',
                look: "The escape pod controls. Buttons, switches, and a slot for a navigation chip.",
                use: (item) => {
                    if (item === 'datachip') {
                        gameState.flags.chipInserted = true;
                        addScore(20);
                        showMessage("You insert the data chip. The navigation computer whirs to life!");
                        return "";
                    }
                    return "That doesn't fit in any of the slots.";
                }
            },
            { id: 'launchButton', x: 450, y: 180, w: 60, h: 60, name: 'launch button',
                look: "A big red button labeled 'LAUNCH'. Very tempting.",
                use: () => {
                    if (gameState.flags.chipInserted) {
                        winGame();
                        return "";
                    }
                    return "The navigation computer needs a destination chip first, or you'll just drift in space forever!";
                }
            },
            { id: 'hatch', x: 30, y: 120, w: 50, h: 180, name: 'hatch',
                look: "The exit hatch. Your last chance to go back.",
                walk: () => { changeRoom('cargoBay', 500, 280); return ""; }
            }
        ],
        walkableArea: { x1: 80, y1: 200, x2: 550, y2: 350 }
    },
    
    bridge: {
        name: "Bridge",
        background: drawBridge,
        hotspots: [
            { id: 'corridorDoor', x: 280, y: 300, w: 80, h: 60, name: 'corridor door',
                look: "The door back to the corridor.",
                walk: () => { changeRoom('corridor', 320, 280); return ""; }
            },
            { id: 'captainChair', x: 280, y: 150, w: 80, h: 80, name: "captain's chair",
                look: "The captain's chair. It looks very comfortable. The captain is... not in it anymore.",
                walk: () => {
                    addScore(5);
                    showMessage("You sit in the captain's chair. For a moment, you feel important. Then you remember aliens are attacking.");
                    return "";
                }
            },
            { id: 'viewscreen', x: 150, y: 50, w: 340, h: 150, name: 'viewscreen',
                look: "The main viewscreen shows the Sarien battleship. It's absolutely massive and terrifying."
            },
            { id: 'tacticalConsole', x: 50, y: 200, w: 100, h: 80, name: 'tactical console',
                look: "The tactical console. Most of the buttons are smashed. Weapons are offline.",
                use: "The weapons are completely destroyed. There's no way to fight back from here."
            },
            { id: 'scienceConsole', x: 490, y: 200, w: 100, h: 80, name: 'science console',
                look: () => {
                    if (!gameState.flags.readScience) {
                        gameState.flags.readScience = true;
                        addScore(10);
                        return "The console shows the station's research data. Apparently they were working on a secret weapon called the 'Star Generator'. No wonder the Sariens attacked!";
                    }
                    return "The Star Generator research data. Incredibly dangerous in the wrong hands.";
                }
            }
        ],
        walkableArea: { x1: 40, y1: 260, x2: 600, y2: 350 }
    }
};

// Background drawing functions
function drawJanitorCloset(ctx) {
    // Floor
    ctx.fillStyle = '#334';
    ctx.fillRect(0, 280, 640, 120);
    
    // Floor tiles
    for (let x = 0; x < 640; x += 40) {
        for (let y = 280; y < 400; y += 40) {
            ctx.fillStyle = (x + y) % 80 === 0 ? '#3a3a4a' : '#2a2a3a';
            ctx.fillRect(x, y, 38, 38);
        }
    }
    
    // Back wall
    ctx.fillStyle = '#445';
    ctx.fillRect(0, 0, 640, 280);
    
    // Wall panels
    for (let x = 0; x < 640; x += 80) {
        ctx.strokeStyle = '#556';
        ctx.strokeRect(x + 5, 20, 70, 250);
    }
    
    // Locker
    if (gameState.flags.lockerOpen) {
        ctx.fillStyle = '#2a2a3a';
        ctx.fillRect(150, 150, 60, 150);
        ctx.fillStyle = '#3a3a4a';
        ctx.fillRect(155, 155, 50, 140);
        // Keycard inside (if not taken)
        if (findHotspot('janitorCloset', 'keycard')) {
            ctx.fillStyle = '#4a8';
            ctx.fillRect(160, 200, 30, 20);
            ctx.fillStyle = '#fff';
            ctx.fillRect(165, 205, 10, 5);
        }
    } else {
        ctx.fillStyle = '#555';
        ctx.fillRect(150, 150, 60, 150);
        ctx.fillStyle = '#666';
        ctx.fillRect(152, 152, 26, 146);
        ctx.fillRect(182, 152, 26, 146);
    }
    
    // Mop (if not taken)
    if (findHotspot('janitorCloset', 'mop')) {
        ctx.fillStyle = '#864';
        ctx.fillRect(55, 140, 10, 160);
        ctx.fillStyle = '#888';
        ctx.fillRect(45, 280, 30, 40);
        for (let i = 0; i < 5; i++) {
            ctx.fillStyle = '#aaa';
            ctx.fillRect(48 + i * 6, 295, 4, 25);
        }
    }
    
    // Bucket (if not taken)
    if (findHotspot('janitorCloset', 'bucket')) {
        ctx.fillStyle = '#777';
        ctx.fillRect(100, 285, 40, 35);
        ctx.fillStyle = '#888';
        ctx.fillRect(103, 280, 34, 8);
        ctx.fillStyle = '#555';
        ctx.fillRect(105, 290, 30, 25);
    }
    
    // Door
    ctx.fillStyle = '#666';
    ctx.fillRect(550, 120, 70, 180);
    ctx.fillStyle = '#777';
    ctx.fillRect(555, 125, 60, 170);
    ctx.fillStyle = '#4af';
    ctx.globalAlpha = 0.5;
    ctx.fillRect(560, 130, 50, 80);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#555';
    ctx.fillRect(605, 200, 8, 20);
    
    // Poster
    ctx.fillStyle = '#543';
    ctx.fillRect(400, 100, 80, 100);
    ctx.fillStyle = '#765';
    ctx.fillRect(405, 105, 70, 90);
    ctx.fillStyle = '#a86';
    ctx.fillRect(420, 120, 40, 50);
    ctx.fillStyle = '#000';
    ctx.font = '8px Arial';
    ctx.fillText('HEROES', 415, 185);
    ctx.fillText('WANTED', 415, 195);
    
    // Ceiling light
    ctx.fillStyle = '#aaf';
    ctx.fillRect(300, 10, 60, 20);
    ctx.fillStyle = 'rgba(170, 170, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(300, 30);
    ctx.lineTo(200, 280);
    ctx.lineTo(460, 280);
    ctx.lineTo(360, 30);
    ctx.fill();
}

function drawCorridor(ctx) {
    // Floor
    ctx.fillStyle = '#334';
    ctx.fillRect(0, 280, 640, 120);
    
    // Floor pattern
    for (let x = 0; x < 640; x += 60) {
        ctx.fillStyle = '#3a3a5a';
        ctx.fillRect(x, 290, 50, 100);
    }
    
    // Walls
    ctx.fillStyle = '#445';
    ctx.fillRect(0, 0, 640, 280);
    
    // Wall panels with lights
    for (let x = 0; x < 640; x += 160) {
        ctx.fillStyle = '#556';
        ctx.fillRect(x + 10, 180, 140, 100);
        ctx.fillStyle = '#4a8';
        ctx.fillRect(x + 65, 190, 20, 10);
    }
    
    // Window
    ctx.fillStyle = '#000';
    ctx.fillRect(150, 80, 100, 100);
    ctx.fillStyle = '#112';
    ctx.fillRect(155, 85, 90, 90);
    // Stars
    for (let i = 0; i < 20; i++) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(160 + Math.random() * 80, 90 + Math.random() * 80, 1, 1);
    }
    // Alien ship (if attack started)
    if (gameState.flags.alienAttack) {
        ctx.fillStyle = '#800';
        ctx.beginPath();
        ctx.ellipse(200, 130, 25, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#600';
        ctx.fillRect(190, 125, 20, 10);
    }
    
    // Janitor door (left)
    ctx.fillStyle = '#555';
    ctx.fillRect(30, 120, 70, 180);
    ctx.fillStyle = '#666';
    ctx.fillRect(35, 125, 60, 170);
    ctx.fillStyle = '#844';
    ctx.font = '10px Arial';
    ctx.fillText('JANITOR', 42, 210);
    
    // Bridge door (center)
    ctx.fillStyle = '#777';
    ctx.fillRect(280, 100, 80, 200);
    ctx.fillStyle = '#888';
    ctx.fillRect(285, 105, 70, 190);
    ctx.fillStyle = '#4af';
    ctx.globalAlpha = 0.3;
    ctx.fillRect(290, 110, 60, 100);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ff0';
    ctx.font = '12px Arial';
    ctx.fillText('BRIDGE', 293, 240);
    
    // Cargo door (right)
    ctx.fillStyle = '#555';
    ctx.fillRect(530, 120, 70, 180);
    ctx.fillStyle = '#666';
    ctx.fillRect(535, 125, 60, 170);
    ctx.fillStyle = '#888';
    ctx.font = '10px Arial';
    ctx.fillText('CARGO', 545, 210);
    
    // Alarm panel
    ctx.fillStyle = '#333';
    ctx.fillRect(450, 150, 40, 60);
    ctx.fillStyle = gameState.flags.alienAttack ? '#f00' : '#800';
    ctx.fillRect(460, 170, 20, 20);
    
    // Dead crew member (if aliens attacked)
    if (gameState.flags.alienAttack) {
        ctx.fillStyle = '#48f';
        ctx.fillRect(200, 310, 60, 20);
        ctx.fillStyle = '#e8b89d';
        ctx.beginPath();
        ctx.arc(190, 315, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Blinking red lights
        if (Math.floor(Date.now() / 500) % 2) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
            ctx.fillRect(0, 0, 640, 400);
        }
    }
}

function drawCargoBay(ctx) {
    // Floor
    ctx.fillStyle = '#3a3a4a';
    ctx.fillRect(0, 280, 640, 120);
    
    // Floor markings
    ctx.fillStyle = '#ff0';
    ctx.fillRect(50, 320, 200, 4);
    ctx.fillRect(400, 320, 200, 4);
    
    // Walls
    ctx.fillStyle = '#4a4a5a';
    ctx.fillRect(0, 0, 640, 280);
    
    // Industrial look
    for (let x = 0; x < 640; x += 100) {
        ctx.fillStyle = '#5a5a6a';
        ctx.fillRect(x, 50, 10, 230);
    }
    
    // Corridor door
    ctx.fillStyle = '#555';
    ctx.fillRect(30, 120, 70, 180);
    ctx.fillStyle = '#666';
    ctx.fillRect(35, 125, 60, 170);
    
    // Cargo crates
    const crateColors = ['#864', '#648', '#486'];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 2; j++) {
            ctx.fillStyle = crateColors[(i + j) % 3];
            ctx.fillRect(200 + i * 50, 200 + j * 50, 45, 45);
            ctx.fillStyle = '#000';
            ctx.strokeRect(200 + i * 50, 200 + j * 50, 45, 45);
        }
    }
    
    // Escape pod
    ctx.fillStyle = '#666';
    ctx.beginPath();
    ctx.ellipse(525, 250, 75, 100, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#777';
    ctx.beginPath();
    ctx.ellipse(525, 250, 65, 90, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#4af';
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.ellipse(525, 200, 30, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ff0';
    ctx.font = '14px Arial';
    ctx.fillText('ESCAPE', 495, 290);
    ctx.fillText('POD', 510, 310);
    
    // Toolbox
    if (!gameState.flags.toolboxOpen) {
        ctx.fillStyle = '#800';
        ctx.fillRect(100, 285, 50, 30);
        ctx.fillStyle = '#600';
        ctx.fillRect(105, 280, 40, 8);
    } else {
        ctx.fillStyle = '#800';
        ctx.fillRect(100, 285, 50, 30);
        ctx.fillStyle = '#600';
        ctx.fillRect(95, 265, 50, 20);
    }
    
    // Sarien guard
    if (gameState.flags.alienAttack && !gameState.flags.sarienDefeated) {
        drawSarien(ctx, 430, 280);
        
        // Red alert lights
        if (Math.floor(Date.now() / 500) % 2) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.15)';
            ctx.fillRect(0, 0, 640, 400);
        }
    }
}

function drawSarien(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    
    // Body (armored)
    ctx.fillStyle = '#080';
    ctx.fillRect(-15, -30, 30, 50);
    
    // Armor details
    ctx.fillStyle = '#060';
    ctx.fillRect(-15, -30, 5, 50);
    ctx.fillRect(10, -30, 5, 50);
    
    // Head (insectoid)
    ctx.fillStyle = '#0a0';
    ctx.beginPath();
    ctx.ellipse(0, -45, 15, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes (compound)
    ctx.fillStyle = '#f00';
    ctx.beginPath();
    ctx.ellipse(-8, -48, 6, 8, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(8, -48, 6, 8, 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Weapon
    ctx.fillStyle = '#444';
    ctx.fillRect(15, -20, 30, 8);
    ctx.fillStyle = '#f00';
    ctx.fillRect(42, -18, 5, 4);
    
    // Legs
    ctx.fillStyle = '#080';
    ctx.fillRect(-12, 20, 8, 20);
    ctx.fillRect(4, 20, 8, 20);
    
    ctx.restore();
}

function drawEscapePod(ctx) {
    // Interior walls (curved)
    ctx.fillStyle = '#556';
    ctx.fillRect(0, 0, 640, 400);
    
    ctx.fillStyle = '#667';
    ctx.beginPath();
    ctx.ellipse(320, 200, 350, 250, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#778';
    ctx.beginPath();
    ctx.ellipse(320, 200, 320, 220, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Floor
    ctx.fillStyle = '#445';
    ctx.fillRect(50, 280, 540, 120);
    
    // Pilot seat
    ctx.fillStyle = '#654';
    ctx.fillRect(120, 180, 80, 100);
    ctx.fillStyle = '#765';
    ctx.fillRect(130, 150, 60, 40);
    ctx.fillRect(125, 185, 70, 90);
    
    // Control panel
    ctx.fillStyle = '#333';
    ctx.fillRect(220, 100, 200, 150);
    ctx.fillStyle = '#444';
    ctx.fillRect(225, 105, 190, 140);
    
    // Screens
    ctx.fillStyle = '#020';
    ctx.fillRect(230, 110, 80, 50);
    ctx.fillStyle = '#040';
    ctx.fillRect(235, 115, 70, 40);
    
    ctx.fillStyle = '#002';
    ctx.fillRect(320, 110, 80, 50);
    
    // Navigation slot
    ctx.fillStyle = gameState.flags.chipInserted ? '#0f0' : '#333';
    ctx.fillRect(280, 170, 60, 30);
    ctx.fillStyle = '#000';
    ctx.fillRect(285, 175, 50, 20);
    
    // Buttons
    for (let i = 0; i < 4; i++) {
        ctx.fillStyle = ['#f00', '#0f0', '#00f', '#ff0'][i];
        ctx.fillRect(230 + i * 25, 210, 20, 15);
    }
    
    // Launch button
    ctx.fillStyle = '#800';
    ctx.beginPath();
    ctx.arc(480, 210, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f00';
    ctx.beginPath();
    ctx.arc(480, 210, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '10px Arial';
    ctx.fillText('LAUNCH', 458, 215);
    
    // Hatch
    ctx.fillStyle = '#444';
    ctx.fillRect(30, 120, 50, 180);
    ctx.fillStyle = '#555';
    ctx.fillRect(35, 125, 40, 170);
    
    // Window to space
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(560, 120, 60, 80, 0, 0, Math.PI * 2);
    ctx.fill();
    // Stars
    for (let i = 0; i < 15; i++) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(510 + Math.random() * 100, 60 + Math.random() * 120, 1, 1);
    }
}

function drawBridge(ctx) {
    // Walls
    ctx.fillStyle = '#3a3a5a';
    ctx.fillRect(0, 0, 640, 280);
    
    // Floor
    ctx.fillStyle = '#2a2a4a';
    ctx.fillRect(0, 280, 640, 120);
    
    // Raised platform
    ctx.fillStyle = '#4a4a6a';
    ctx.fillRect(100, 260, 440, 30);
    
    // Viewscreen
    ctx.fillStyle = '#111';
    ctx.fillRect(150, 50, 340, 150);
    ctx.fillStyle = '#001';
    ctx.fillRect(155, 55, 330, 140);
    
    // Stars on viewscreen
    for (let i = 0; i < 30; i++) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(160 + Math.random() * 320, 60 + Math.random() * 130, 1, 1);
    }
    
    // Sarien ship on viewscreen
    ctx.fillStyle = '#800';
    ctx.beginPath();
    ctx.moveTo(250, 120);
    ctx.lineTo(390, 120);
    ctx.lineTo(420, 140);
    ctx.lineTo(390, 160);
    ctx.lineTo(250, 160);
    ctx.lineTo(220, 140);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#600';
    ctx.fillRect(270, 125, 100, 30);
    ctx.fillStyle = '#f00';
    ctx.fillRect(360, 135, 50, 10);
    
    // Captain's chair
    ctx.fillStyle = '#654';
    ctx.fillRect(280, 170, 80, 80);
    ctx.fillStyle = '#543';
    ctx.fillRect(290, 150, 60, 30);
    ctx.fillStyle = '#765';
    ctx.fillRect(285, 175, 70, 70);
    
    // Consoles
    // Tactical (left)
    ctx.fillStyle = '#333';
    ctx.fillRect(50, 200, 100, 80);
    ctx.fillStyle = '#200';
    ctx.fillRect(55, 205, 90, 50);
    ctx.fillStyle = '#f00';
    ctx.font = '10px Arial';
    ctx.fillText('OFFLINE', 70, 235);
    
    // Science (right)
    ctx.fillStyle = '#333';
    ctx.fillRect(490, 200, 100, 80);
    ctx.fillStyle = '#020';
    ctx.fillRect(495, 205, 90, 50);
    ctx.fillStyle = '#0f0';
    ctx.fillText('DATA READY', 505, 235);
    
    // Door
    ctx.fillStyle = '#555';
    ctx.fillRect(280, 310, 80, 50);
    ctx.fillStyle = '#666';
    ctx.fillRect(285, 315, 70, 40);
    
    // Red alert effect
    if (Math.floor(Date.now() / 500) % 2) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
        ctx.fillRect(0, 0, 640, 400);
    }
}

// Inventory item graphics
const itemGraphics = {
    mop: (ctx) => {
        ctx.fillStyle = COLORS.brown;
        ctx.fillRect(22, 5, 6, 35);
        ctx.fillStyle = COLORS.metalLight;
        ctx.fillRect(15, 35, 20, 12);
        for (let i = 0; i < 4; i++) {
            ctx.fillStyle = '#ccc';
            ctx.fillRect(17 + i * 5, 40, 3, 8);
        }
    },
    bucket: (ctx) => {
        ctx.fillStyle = COLORS.metal;
        ctx.fillRect(12, 18, 26, 25);
        ctx.fillStyle = COLORS.metalDark;
        ctx.fillRect(15, 22, 20, 18);
        ctx.fillStyle = COLORS.metalLight;
        ctx.fillRect(10, 15, 30, 5);
    },
    keycard: (ctx) => {
        ctx.fillStyle = '#4a8';
        ctx.fillRect(10, 15, 30, 20);
        ctx.fillStyle = '#fff';
        ctx.fillRect(15, 20, 12, 6);
        ctx.fillStyle = '#333';
        ctx.fillRect(15, 28, 20, 3);
    },
    datachip: (ctx) => {
        ctx.fillStyle = '#48f';
        ctx.fillRect(12, 18, 26, 16);
        ctx.fillStyle = '#26c';
        ctx.fillRect(15, 20, 8, 12);
        ctx.fillStyle = '#fff';
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(25, 20 + i * 3, 10, 2);
        }
    },
    wrench: (ctx) => {
        ctx.fillStyle = COLORS.metalLight;
        ctx.fillRect(20, 10, 10, 30);
        ctx.fillStyle = COLORS.metal;
        ctx.fillRect(15, 8, 20, 8);
        ctx.fillRect(15, 35, 20, 8);
        ctx.fillStyle = COLORS.metalDark;
        ctx.fillRect(20, 10, 4, 6);
        ctx.fillRect(26, 10, 4, 6);
    }
};

// Utility functions
function findHotspot(roomId, hotspotId) {
    return rooms[roomId].hotspots.find(h => h.id === hotspotId);
}

function removeHotspot(roomId, hotspotId) {
    const idx = rooms[roomId].hotspots.findIndex(h => h.id === hotspotId);
    if (idx !== -1) rooms[roomId].hotspots.splice(idx, 1);
}

function addHotspot(roomId, hotspot) {
    rooms[roomId].hotspots.push(hotspot);
}

function addToInventory(item) {
    if (!gameState.inventory.includes(item)) {
        gameState.inventory.push(item);
        updateInventoryDisplay();
    }
}

function hasItem(item) {
    return gameState.inventory.includes(item);
}

function removeFromInventory(item) {
    const idx = gameState.inventory.indexOf(item);
    if (idx !== -1) {
        gameState.inventory.splice(idx, 1);
        updateInventoryDisplay();
    }
}

function addScore(points) {
    gameState.score += points;
    document.getElementById('score').textContent = gameState.score;
}

function showMessage(text, duration = 3000) {
    const box = document.getElementById('message-box');
    box.textContent = text;
    box.style.display = 'block';
    gameState.showingMessage = true;
    setTimeout(() => {
        box.style.display = 'none';
        gameState.showingMessage = false;
    }, duration);
}

function showDialog(speaker, text) {
    const box = document.getElementById('dialog-box');
    box.innerHTML = `<div class="speaker">${speaker}</div>${text}<div class="continue">[Click to continue]</div>`;
    box.style.display = 'block';
    gameState.showingDialog = true;
}

function hideDialog() {
    document.getElementById('dialog-box').style.display = 'none';
    gameState.showingDialog = false;
}

function changeRoom(roomId, x, y) {
    gameState.currentRoom = roomId;
    gameState.roger.x = x;
    gameState.roger.y = y;
    gameState.roger.targetX = x;
    gameState.roger.targetY = y;
    
    const room = rooms[roomId];
    if (room.onEnter) room.onEnter();
    
    saveGame();
}

function die(message) {
    const screen = document.getElementById('death-screen');
    document.getElementById('death-message').textContent = message;
    screen.style.display = 'flex';
}

function restoreGame() {
    document.getElementById('death-screen').style.display = 'none';
    if (gameState.savedState) {
        gameState = JSON.parse(gameState.savedState);
        updateInventoryDisplay();
        document.getElementById('score').textContent = gameState.score;
    }
}

function saveGame() {
    const stateCopy = JSON.parse(JSON.stringify(gameState));
    delete stateCopy.savedState;
    gameState.savedState = JSON.stringify(stateCopy);
}

function winGame() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 640, 400);
    
    ctx.fillStyle = '#4af';
    ctx.font = '36px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('CONGRATULATIONS!', 320, 100);
    
    ctx.fillStyle = '#fff';
    ctx.font = '16px Courier New';
    ctx.fillText('You escaped the Xenon Orbital Station', 320, 150);
    ctx.fillText('with the Star Generator plans!', 320, 175);
    
    ctx.fillStyle = '#ff0';
    ctx.fillText(`Final Score: ${gameState.score} of 200`, 320, 230);
    
    ctx.fillStyle = '#8af';
    ctx.font = '14px Courier New';
    ctx.fillText('Roger Wilco, space janitor, accidentally', 320, 280);
    ctx.fillText('became the hero who saved the galaxy.', 320, 300);
    ctx.fillText('But that\'s a story for another game...', 320, 320);
    
    ctx.fillStyle = '#666';
    ctx.font = '12px Courier New';
    ctx.fillText('SPACE QUEST: THE COSMIC JANITOR', 320, 370);
    ctx.fillText('Thanks for playing!', 320, 385);
    
    ctx.textAlign = 'left';
    gameState.gameStarted = false;
}

function updateInventoryDisplay() {
    const panel = document.getElementById('inventory-panel');
    panel.innerHTML = '';
    
    for (const item of gameState.inventory) {
        const div = document.createElement('div');
        div.className = 'inv-item';
        div.dataset.item = item;
        
        const itemCanvas = document.createElement('canvas');
        itemCanvas.width = 50;
        itemCanvas.height = 50;
        const itemCtx = itemCanvas.getContext('2d');
        
        if (itemGraphics[item]) {
            itemGraphics[item](itemCtx);
        }
        
        div.appendChild(itemCanvas);
        div.onclick = () => selectInventoryItem(item);
        panel.appendChild(div);
    }
}

function selectInventoryItem(item) {
    gameState.selectedItem = item;
    gameState.selectedVerb = 'use';
    updateVerbButtons();
    showMessage(`Using: ${item}`);
}

function updateVerbButtons() {
    document.querySelectorAll('.verb-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.verb === gameState.selectedVerb);
    });
}

// Drawing and game loop
function draw() {
    const room = rooms[gameState.currentRoom];
    
    // Clear and draw background
    ctx.clearRect(0, 0, 640, 400);
    room.background(ctx);
    
    // Draw hotspots that have visual elements
    for (const hotspot of room.hotspots) {
        if (hotspot.visible && !hotspot.visible()) continue;
        if (hotspot.draw) hotspot.draw(ctx);
    }
    
    // Draw Roger
    drawRoger(ctx, gameState.roger.x, gameState.roger.y, gameState.roger.frame, gameState.roger.direction);
    
    // Draw room name
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(5, 5, 200, 25);
    ctx.fillStyle = '#8af';
    ctx.font = '14px Courier New';
    ctx.fillText(room.name, 15, 22);
}

function update() {
    // Move Roger towards target
    const dx = gameState.roger.targetX - gameState.roger.x;
    const dy = gameState.roger.targetY - gameState.roger.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > 3) {
        gameState.roger.walking = true;
        gameState.roger.x += (dx / dist) * 3;
        gameState.roger.y += (dy / dist) * 2;
        gameState.roger.frame++;
        
        if (Math.abs(dx) > Math.abs(dy)) {
            gameState.roger.direction = dx > 0 ? 'right' : 'left';
        }
    } else {
        gameState.roger.walking = false;
    }
}

function gameLoop() {
    if (gameState.gameStarted) {
        update();
        draw();
    }
    requestAnimationFrame(gameLoop);
}

// Event handlers
canvas.addEventListener('click', (e) => {
    if (!gameState.gameStarted || gameState.showingDialog) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const room = rooms[gameState.currentRoom];
    
    // Check hotspots
    let clickedHotspot = null;
    for (const hotspot of room.hotspots) {
        if (hotspot.visible && !hotspot.visible()) continue;
        if (x >= hotspot.x && x <= hotspot.x + hotspot.w &&
            y >= hotspot.y && y <= hotspot.y + hotspot.h) {
            clickedHotspot = hotspot;
            break;
        }
    }
    
    if (clickedHotspot) {
        handleHotspotInteraction(clickedHotspot, x, y);
    } else if (gameState.selectedVerb === 'walk') {
        // Walk to location
        const area = room.walkableArea;
        const targetX = Math.max(area.x1, Math.min(area.x2, x));
        const targetY = Math.max(area.y1, Math.min(area.y2, y));
        gameState.roger.targetX = targetX;
        gameState.roger.targetY = targetY;
    }
    
    // Reset selected item after use
    if (gameState.selectedVerb === 'use' && gameState.selectedItem) {
        gameState.selectedItem = null;
    }
});

document.getElementById('dialog-box').addEventListener('click', hideDialog);

function handleHotspotInteraction(hotspot, x, y) {
    const verb = gameState.selectedVerb;
    let result = null;
    
    if (verb === 'walk') {
        if (hotspot.walk) {
            result = typeof hotspot.walk === 'function' ? hotspot.walk() : hotspot.walk;
        } else {
            // Walk to hotspot then interact
            const room = rooms[gameState.currentRoom];
            const area = room.walkableArea;
            gameState.roger.targetX = Math.max(area.x1, Math.min(area.x2, hotspot.x + hotspot.w / 2));
            gameState.roger.targetY = Math.max(area.y1, Math.min(area.y2, hotspot.y + hotspot.h));
        }
    } else if (verb === 'look') {
        result = typeof hotspot.look === 'function' ? hotspot.look() : hotspot.look;
        if (!result) result = `You see nothing special about the ${hotspot.name}.`;
    } else if (verb === 'get') {
        if (hotspot.get) {
            result = typeof hotspot.get === 'function' ? hotspot.get() : hotspot.get;
        } else {
            result = `You can't take the ${hotspot.name}.`;
        }
    } else if (verb === 'use') {
        if (gameState.selectedItem && hotspot.use) {
            result = typeof hotspot.use === 'function' ? hotspot.use(gameState.selectedItem) : hotspot.use;
        } else if (hotspot.use) {
            result = typeof hotspot.use === 'function' ? hotspot.use() : hotspot.use;
        } else {
            result = `You can't use that on the ${hotspot.name}.`;
        }
    } else if (verb === 'talk') {
        if (hotspot.talk) {
            result = typeof hotspot.talk === 'function' ? hotspot.talk() : hotspot.talk;
        } else {
            result = `The ${hotspot.name} doesn't seem very talkative.`;
        }
    } else if (verb === 'open') {
        if (hotspot.open) {
            result = typeof hotspot.open === 'function' ? hotspot.open() : hotspot.open;
        } else {
            result = `You can't open the ${hotspot.name}.`;
        }
    }
    
    if (result) showMessage(result);
}

// Verb button handlers
document.querySelectorAll('.verb-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        gameState.selectedVerb = btn.dataset.verb;
        gameState.selectedItem = null;
        updateVerbButtons();
    });
});

// Title screen animation
function drawTitleScreen() {
    titleCtx.fillStyle = '#000';
    titleCtx.fillRect(0, 0, 300, 200);
    
    // Stars
    for (let i = 0; i < 50; i++) {
        const twinkle = Math.sin(Date.now() / 200 + i) > 0 ? 1 : 0.5;
        titleCtx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
        const x = (i * 47) % 300;
        const y = (i * 31) % 200;
        titleCtx.fillRect(x, y, 1, 1);
    }
    
    // Planet
    titleCtx.fillStyle = '#248';
    titleCtx.beginPath();
    titleCtx.arc(220, 150, 50, 0, Math.PI * 2);
    titleCtx.fill();
    titleCtx.fillStyle = '#36a';
    titleCtx.beginPath();
    titleCtx.arc(210, 140, 40, 0, Math.PI * 2);
    titleCtx.fill();
    
    // Station
    titleCtx.fillStyle = '#666';
    titleCtx.fillRect(80, 80, 100, 30);
    titleCtx.fillStyle = '#888';
    titleCtx.beginPath();
    titleCtx.ellipse(130, 95, 20, 30, 0, 0, Math.PI * 2);
    titleCtx.fill();
    
    // Draw small Roger
    drawRoger(titleCtx, 130, 140, Math.floor(Date.now() / 200), 'right', 0.6);
    
    requestAnimationFrame(drawTitleScreen);
}

// Start game
function startNewGame() {
    document.getElementById('title-screen').style.display = 'none';
    gameState.gameStarted = true;
    saveGame();
    
    showDialog("NARRATOR", "The year is 2450. You are Roger Wilco, a humble janitor aboard the Xenon Orbital Station. Your day started like any other - mopping floors, unclogging toilets, and being ignored by everyone. Little did you know, today would be different...");
}

// Initialize
drawTitleScreen();
gameLoop();
