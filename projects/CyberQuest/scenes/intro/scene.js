/**
 * Intro Scene - Story Part 0
 * Prologue establishing Ryan's character and setting
 */

const IntroScene = {
    id: 'intro',
    name: 'Prologue',
    
    background: 'assets/images/scenes/intro.svg',
    
    description: 'A quiet morning in Compascuum, Drenthe. The world is about to change.',
    
    playerStart: { x: 50, y: 85 },
    
    idleThoughts: [],
    
    hotspots: [],
    
    onEnter: function(game) {
        // Show prologue sequence
        setTimeout(() => {
            game.startDialogue([
                { speaker: '', text: '📍 COMPASCUUM, DRENTHE, NETHERLANDS' },
                { speaker: '', text: '📅 February 2026' },
                { speaker: '', text: '⏰ 07:45 AM' },
                { speaker: '', text: '' },
                { speaker: 'Narrator', text: 'This is Ryan Weylant.' },
                { speaker: 'Narrator', text: '55 years old. Software developer. Hacker. MacGyver-style problem solver.' },
                { speaker: 'Narrator', text: 'He lives in a small white farmhouse with a red roof, next to a canal in rural Drenthe.' },
                { speaker: '', text: '' },
                { speaker: 'Narrator', text: 'His garage is filled with 3D printers, oscilloscopes, wireless hacking devices.' },
                { speaker: 'Narrator', text: 'HackRF One. Flipper Zero. WiFi Pineapple. Meshtastic. An SSTV satellite terminal.' },
                { speaker: '', text: '' },
                { speaker: 'Narrator', text: 'Ryan is curious. Methodical. Never backs down from a mystery.' },
                { speaker: 'Narrator', text: 'In his kitchen, an espresso machine is warming up.' },
                { speaker: '', text: '' },
                { speaker: 'Narrator', text: 'He has no idea that today will change everything.' },
                { speaker: 'Narrator', text: 'That a transmission is coming.' },
                { speaker: 'Narrator', text: 'That forces larger than he can imagine are already watching.' },
                { speaker: '', text: '' },
                { speaker: 'Narrator', text: 'This is how it begins.' },
                { speaker: '', text: '' },
                { speaker: '', text: '🎮 CYBERQUEST: OPERATION ZERFALL' }
            ]);
            
            // After dialogue, transition to home
            setTimeout(() => {
                game.loadScene('home');
            }, 2000);
        }, 500);
    }
};

// Register scene
if (typeof window.game !== 'undefined') {
    window.game.registerScene(IntroScene);
}
