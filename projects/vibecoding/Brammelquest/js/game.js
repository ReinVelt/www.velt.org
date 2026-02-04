// Bram and the Quest of the Holy Sausage - Main Game Engine

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.sprites = new SpriteRenderer(this.ctx);
        
        // Game state
        this.currentScene = null;
        this.player = {
            x: 400,
            y: 350,
            targetX: 400,
            targetY: 350,
            direction: 'right',
            walking: false,
            frame: 0,
            scale: 1.2
        };
        
        this.currentAction = 'walk';
        this.inventory = [];
        this.flags = {};
        this.gameWon = false;
        
        // Animation
        this.animationFrame = 0;
        this.lastFrameTime = 0;
        
        // UI elements
        this.textBox = document.getElementById('game-text');
        this.inventoryPanel = document.getElementById('inventory-panel');
        this.inventoryItems = document.getElementById('inventory-items');
        this.dialogBox = document.getElementById('dialog-box');
        this.dialogText = document.getElementById('dialog-text');
        this.dialogChoices = document.getElementById('dialog-choices');
        this.dialogPortrait = document.getElementById('dialog-portrait');
        
        // Current dialog state
        this.currentDialog = null;
        this.currentNPC = null;
        
        // Bind event handlers
        this.canvas.addEventListener('click', this.handleClick.bind(this));
        
        // Menu items
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.setAction(e.target.dataset.action);
            });
        });
        
        // Inventory close button
        document.getElementById('close-inventory').addEventListener('click', () => {
            this.inventoryPanel.classList.add('hidden');
        });
    }

    start() {
        this.loadScene('home');
        this.gameLoop();
        audioManager.playMusic();
    }

    loadScene(sceneId) {
        const scene = SCENES[sceneId];
        if (!scene) {
            console.error('Scene not found:', sceneId);
            return;
        }
        
        // Run scene init if exists
        if (scene.init) {
            scene.init(this);
        }
        
        this.currentScene = scene;
        this.player.x = scene.playerStart.x;
        this.player.y = scene.playerStart.y;
        this.player.targetX = scene.playerStart.x;
        this.player.targetY = scene.playerStart.y;
        
        this.showText(scene.description);
        audioManager.playSound('door');
    }

    setAction(action) {
        if (action === 'inventory') {
            this.showInventory();
            return;
        }
        if (action === 'save') {
            this.saveGame();
            return;
        }
        
        this.currentAction = action;
        
        // Update menu UI
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.action === action) {
                item.classList.add('active');
            }
        });
        
        // Update cursor
        this.canvas.className = `cursor-${action}`;
        
        audioManager.playSound('click');
    }

    handleClick(e) {
        if (this.gameWon) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Check if clicking on exit
        const exit = this.checkExits(x, y);
        if (exit && this.currentAction === 'walk') {
            this.walkTo(exit.x, exit.y, () => {
                this.loadScene(exit.target);
            });
            return;
        }
        
        // Check if clicking on NPC
        const npc = this.checkNPCs(x, y);
        if (npc) {
            this.interactWithNPC(npc);
            return;
        }
        
        // Check if clicking on hotspot
        const hotspot = this.checkHotspots(x, y);
        if (hotspot) {
            this.interactWithHotspot(hotspot);
            return;
        }
        
        // Walk to clicked position
        if (this.currentAction === 'walk') {
            const clampedX = Math.max(this.currentScene.walkableArea.x1, 
                            Math.min(this.currentScene.walkableArea.x2, x));
            const clampedY = Math.max(this.currentScene.walkableArea.y1, 
                            Math.min(this.currentScene.walkableArea.y2, y));
            this.walkTo(clampedX, clampedY);
        }
    }

    checkExits(x, y) {
        if (!this.currentScene.exits) return null;
        
        for (const exit of this.currentScene.exits) {
            if (x >= exit.x && x <= exit.x + exit.width &&
                y >= exit.y && y <= exit.y + exit.height) {
                return exit;
            }
        }
        return null;
    }

    checkHotspots(x, y) {
        if (!this.currentScene.hotspots) return null;
        
        for (const hotspot of this.currentScene.hotspots) {
            if (x >= hotspot.x && x <= hotspot.x + hotspot.width &&
                y >= hotspot.y && y <= hotspot.y + hotspot.height) {
                // Check if already picked up
                if (hotspot.canPickUp && this.inventory.find(i => i.id === hotspot.item?.id)) {
                    return null;
                }
                return hotspot;
            }
        }
        return null;
    }

    checkNPCs(x, y) {
        if (!this.currentScene.npcs) return null;
        
        for (const npc of this.currentScene.npcs) {
            if (x >= npc.x - 40 && x <= npc.x + 40 &&
                y >= npc.y - 60 && y <= npc.y + 40) {
                return npc;
            }
        }
        return null;
    }

    interactWithHotspot(hotspot) {
        const action = this.currentAction;
        
        switch(action) {
            case 'look':
                this.showText(hotspot.look);
                audioManager.playSound('sniff');
                break;
            case 'talk':
                this.showText(hotspot.talk || "It doesn't respond. It's not alive... probably.");
                audioManager.playSound('bark');
                break;
            case 'use':
            case 'walk':
                if (hotspot.canPickUp && !this.inventory.find(i => i.id === hotspot.item?.id)) {
                    this.pickUpItem(hotspot);
                } else if (hotspot.useSpecial) {
                    this.handleSpecialUse(hotspot);
                } else {
                    this.showText(hotspot.use || "You can't use that.");
                }
                break;
        }
    }

    interactWithNPC(npc) {
        const action = this.currentAction;
        
        switch(action) {
            case 'look':
                this.showText(npc.look);
                audioManager.playSound('sniff');
                break;
            case 'talk':
            case 'walk':
            case 'use':
                this.startDialog(npc);
                break;
        }
    }

    pickUpItem(hotspot) {
        this.walkTo(hotspot.x + hotspot.width/2, this.player.y, () => {
            this.inventory.push(hotspot.item);
            this.showText(hotspot.pickupText);
            audioManager.playSound('pickup');
        });
    }

    handleSpecialUse(hotspot) {
        if (hotspot.id === 'altar') {
            // VICTORY!
            this.walkTo(400, 350, () => {
                this.gameWon = true;
                this.showVictory();
            });
        }
    }

    startDialog(npc) {
        this.currentNPC = npc;
        const dialogState = this.currentDialog || 'dialog';
        const dialog = npc[dialogState] || npc.dialog;
        
        this.dialogBox.classList.remove('hidden');
        this.dialogText.textContent = dialog.greeting;
        
        // Set portrait emoji based on NPC type
        const portraits = {
            cat: '🐱',
            butcher: '👨‍🍳',
            oldDog: '🐕',
            squirrel: '🐿️'
        };
        this.dialogPortrait.textContent = portraits[npc.type] || '❓';
        
        this.showDialogChoices(dialog.options);
        audioManager.playSound('click');
    }

    showDialogChoices(options) {
        this.dialogChoices.innerHTML = '';
        
        options.forEach((option, index) => {
            // Check if option requires an item
            if (option.requiresItem) {
                if (option.requiresFlag) {
                    if (!this.flags[option.requiresItem]) return;
                } else {
                    if (!this.inventory.find(i => i.id === option.requiresItem)) return;
                }
            }
            
            const choiceEl = document.createElement('div');
            choiceEl.className = 'dialog-choice';
            choiceEl.textContent = option.text;
            choiceEl.addEventListener('click', () => this.selectDialogOption(option));
            this.dialogChoices.appendChild(choiceEl);
        });
    }

    selectDialogOption(option) {
        this.dialogText.textContent = option.response;
        
        // Set flag if specified
        if (option.setsFlag) {
            this.flags[option.setsFlag] = true;
        }
        
        // Remove item if used
        if (option.requiresItem && !option.requiresFlag) {
            this.inventory = this.inventory.filter(i => i.id !== option.requiresItem);
        }
        
        // Unlock exit if specified
        if (option.unlocksExit) {
            const scene = this.currentScene;
            if (scene.init) {
                scene.init(this);
            }
        }
        
        audioManager.playSound('click');
        
        if (option.next) {
            // Continue to next dialog state
            setTimeout(() => {
                const nextDialog = this.currentNPC[option.next];
                if (nextDialog) {
                    this.dialogText.textContent = nextDialog.greeting;
                    this.showDialogChoices(nextDialog.options);
                }
            }, 1500);
        } else {
            // Close dialog after a moment
            setTimeout(() => {
                this.closeDialog();
            }, 2000);
        }
    }

    closeDialog() {
        this.dialogBox.classList.add('hidden');
        this.currentNPC = null;
        this.currentDialog = null;
    }

    walkTo(x, y, callback) {
        this.player.targetX = x;
        this.player.targetY = y;
        this.player.walking = true;
        this.player.walkCallback = callback;
        
        // Set direction
        if (x < this.player.x) {
            this.player.direction = 'left';
        } else if (x > this.player.x) {
            this.player.direction = 'right';
        }
    }

    showText(text) {
        this.textBox.textContent = text;
    }

    showInventory() {
        this.inventoryItems.innerHTML = '';
        
        // Create empty slots
        for (let i = 0; i < 8; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            
            if (this.inventory[i]) {
                slot.textContent = this.inventory[i].icon;
                slot.title = this.inventory[i].name;
                slot.addEventListener('click', () => {
                    this.showText(this.inventory[i].description);
                    audioManager.playSound('sniff');
                });
            }
            
            this.inventoryItems.appendChild(slot);
        }
        
        this.inventoryPanel.classList.remove('hidden');
        audioManager.playSound('click');
    }

    saveGame() {
        const saveData = {
            scene: this.currentScene.id,
            player: { x: this.player.x, y: this.player.y },
            inventory: this.inventory,
            flags: this.flags
        };
        
        localStorage.setItem('bram_save', JSON.stringify(saveData));
        this.showText("Game saved! Good boy, Bram!");
        audioManager.playSound('success');
    }

    loadGame() {
        const saveData = localStorage.getItem('bram_save');
        if (saveData) {
            const data = JSON.parse(saveData);
            this.inventory = data.inventory;
            this.flags = data.flags;
            this.loadScene(data.scene);
            this.player.x = data.player.x;
            this.player.y = data.player.y;
            this.showText("Game loaded! Welcome back, Bram!");
            return true;
        }
        return false;
    }

    showVictory() {
        audioManager.stopMusic();
        audioManager.playSound('success');
        
        setTimeout(() => {
            this.showText("🌭 YOU FOUND THE HOLY SAUSAGE! 🌭 Bram's quest is complete! Infinite belly rubs await!");
            
            // Draw victory screen
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, 800, 450);
            
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = 'bold 36px "Press Start 2P", cursive';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('VICTORY!', 400, 150);
            
            this.ctx.font = '20px "VT323", monospace';
            this.ctx.fillStyle = '#fff';
            this.ctx.fillText('Bram has found the Holy Sausage!', 400, 220);
            this.ctx.fillText('The legend is complete!', 400, 260);
            this.ctx.fillText('"Vies Ventje" is now a hero!', 400, 300);
            
            // Draw celebratory Bram
            this.sprites.drawBram(400, 380, 'right', 0, 2);
            this.sprites.drawSausage(400, 320, 'holy', true);
            
            // Play victory music
            this.playVictoryMusic();
        }, 500);
    }

    playVictoryMusic() {
        if (!audioManager.audioContext) audioManager.init();
        
        const now = audioManager.audioContext.currentTime;
        const victoryMelody = [
            { note: 523.25, duration: 0.15 },
            { note: 587.33, duration: 0.15 },
            { note: 659.25, duration: 0.15 },
            { note: 698.46, duration: 0.15 },
            { note: 783.99, duration: 0.3 },
            { note: 659.25, duration: 0.15 },
            { note: 783.99, duration: 0.5 },
        ];
        
        let time = now;
        victoryMelody.forEach(({ note, duration }) => {
            const osc = audioManager.audioContext.createOscillator();
            const gain = audioManager.audioContext.createGain();
            
            osc.type = 'square';
            osc.frequency.value = note;
            
            gain.gain.setValueAtTime(0.15, time);
            gain.gain.linearRampToValueAtTime(0, time + duration);
            
            osc.connect(gain);
            gain.connect(audioManager.masterGain);
            
            osc.start(time);
            osc.stop(time + duration);
            
            time += duration;
        });
    }

    update(deltaTime) {
        // Update player position
        if (this.player.walking) {
            const dx = this.player.targetX - this.player.x;
            const dy = this.player.targetY - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 5) {
                this.player.x = this.player.targetX;
                this.player.y = this.player.targetY;
                this.player.walking = false;
                
                if (this.player.walkCallback) {
                    this.player.walkCallback();
                    this.player.walkCallback = null;
                }
            } else {
                const speed = 150; // pixels per second
                const moveX = (dx / distance) * speed * deltaTime;
                const moveY = (dy / distance) * speed * deltaTime;
                
                this.player.x += moveX;
                this.player.y += moveY;
                
                // Play walk sound occasionally
                if (Math.floor(this.animationFrame / 10) % 3 === 0 && this.animationFrame % 10 === 0) {
                    audioManager.playSound('walk');
                }
            }
        }
        
        // Update animation frame
        this.animationFrame++;
        if (this.animationFrame % 10 === 0) {
            this.player.frame = (this.player.frame + 1) % 4;
        }
    }

    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        if (this.currentScene && this.currentScene.drawBackground) {
            this.currentScene.drawBackground(this.ctx, this.sprites);
        }
        
        // Draw hotspot items that haven't been picked up
        if (this.currentScene && this.currentScene.hotspots) {
            this.currentScene.hotspots.forEach(hotspot => {
                if (hotspot.canPickUp && hotspot.item) {
                    if (!this.inventory.find(i => i.id === hotspot.item.id)) {
                        // Draw the item
                        if (hotspot.item.id === 'squeaky_bone') {
                            this.sprites.drawBone(hotspot.x + 20, hotspot.y + 10);
                        }
                        // Other items could be drawn here
                    }
                }
            });
        }
        
        // Draw NPCs
        if (this.currentScene && this.currentScene.npcs) {
            this.currentScene.npcs.forEach(npc => {
                this.sprites.drawNPC(npc.x, npc.y, npc.type, this.animationFrame);
            });
        }
        
        // Draw player (Bram)
        this.sprites.drawBram(
            this.player.x, 
            this.player.y, 
            this.player.direction, 
            this.player.walking ? this.player.frame : 0,
            this.player.scale
        );
        
        // Draw exit indicators
        if (this.currentScene && this.currentScene.exits) {
            this.currentScene.exits.forEach(exit => {
                this.ctx.fillStyle = 'rgba(255, 255, 0, 0.2)';
                this.ctx.fillRect(exit.x, exit.y, exit.width, exit.height);
                
                // Arrow indicator
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                this.ctx.font = '20px Arial';
                this.ctx.textAlign = 'center';
                const arrow = exit.direction === 'right' ? '→' : '←';
                this.ctx.fillText(arrow, exit.x + exit.width/2, exit.y + exit.height/2);
            });
        }
    }

    gameLoop(currentTime = 0) {
        const deltaTime = (currentTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentTime;
        
        if (!this.gameWon) {
            this.update(deltaTime);
            this.render();
        }
        
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}

// Export
window.Game = Game;
