// Bram and the Quest of the Holy Sausage - Main Entry Point

document.addEventListener('DOMContentLoaded', () => {
    const titleScreen = document.getElementById('title-screen');
    const gameScreen = document.getElementById('game-screen');
    const creditsScreen = document.getElementById('credits-screen');
    const startBtn = document.getElementById('start-btn');
    const creditsBtn = document.getElementById('credits-btn');
    const backBtn = document.getElementById('back-btn');
    
    let game = null;
    
    // Initialize audio on first interaction
    let audioInitialized = false;
    const initAudio = () => {
        if (!audioInitialized) {
            audioManager.init();
            audioInitialized = true;
        }
    };
    
    // Start button
    startBtn.addEventListener('click', () => {
        initAudio();
        audioManager.playSound('bark');
        
        titleScreen.classList.remove('active');
        gameScreen.classList.add('active');
        
        // Initialize game
        const canvas = document.getElementById('game-canvas');
        game = new Game(canvas);
        
        // Check for saved game
        setTimeout(() => {
            const hasSave = localStorage.getItem('bram_save');
            if (hasSave) {
                if (confirm('Found a saved game! Do you want to continue?')) {
                    game.loadGame();
                } else {
                    game.start();
                }
            } else {
                game.start();
            }
        }, 100);
    });
    
    // Credits button
    creditsBtn.addEventListener('click', () => {
        initAudio();
        audioManager.playSound('click');
        titleScreen.classList.remove('active');
        creditsScreen.classList.add('active');
    });
    
    // Back button
    backBtn.addEventListener('click', () => {
        audioManager.playSound('click');
        creditsScreen.classList.remove('active');
        titleScreen.classList.add('active');
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (!game) return;
        
        switch(e.key.toLowerCase()) {
            case 'w':
                game.setAction('walk');
                break;
            case 'l':
                game.setAction('look');
                break;
            case 'u':
                game.setAction('use');
                break;
            case 't':
                game.setAction('talk');
                break;
            case 'i':
                game.showInventory();
                break;
            case 'escape':
                // Close any open panels
                document.getElementById('inventory-panel').classList.add('hidden');
                document.getElementById('dialog-box').classList.add('hidden');
                break;
        }
    });
    
    // Prevent context menu on canvas
    document.getElementById('game-canvas')?.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    
    console.log('🐕 Bram and the Quest of the Holy Sausage 🌭');
    console.log('Press Start to begin the adventure!');
    console.log('Keyboard shortcuts: W=Walk, L=Look, U=Use, T=Talk, I=Inventory');
});
