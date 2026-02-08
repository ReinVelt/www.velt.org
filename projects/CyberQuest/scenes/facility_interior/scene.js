/**
 * Facility Interior Scene - Inside the compound
 * Corridors leading to server room basement
 */

const FacilityInteriorScene = {
    id: 'facility_interior',
    name: 'Inside Steckerdoser Heide',
    
    background: 'assets/images/scenes/facility_interior.svg',
    
    description: 'Inside the compound. Sterile corridors. Fluorescent lights. The hum of ventilation systems.',
    
    playerStart: { x: 15, y: 85 },
    
    idleThoughts: [
        "Stay quiet. Move fast.",
        "Someone could turn that corner any second.",
        "Where's the basement access?",
        "Eva's guidance is keeping me alive.",
        "No cameras here. Good."
    ],
    
    state: {
        basementUnlocked: false,
        doorCodeEntered: false
    },
    
    hotspots: [
        {
            id: 'main_corridor',
            name: 'Main Corridor',
            x: 25,
            y: 30,
            width: 50,
            height: 40,
            cursor: 'look',
            action: function(game) {
                game.showDialogue([
                    "Long corridor. Doors on both sides.",
                    "Signs in German: 'LABOR 3', 'TECHNIK', 'ZUTRITT VERBOTEN'",
                    "Empty at this hour. Night shift is minimal."
                ], "Ryan");
            }
        },
        {
            id: 'eva_mesh',
            name: 'Meshtastic Device',
            x: 85,
            y: 5,
            width: 10,
            height: 8,
            cursor: 'pointer',
            action: function(game) {
                if (!FacilityInteriorScene.state.basementUnlocked) {
                    game.startDialogue([
                        { speaker: 'Ryan', text: '*Checks Meshtastic*' },
                        { speaker: 'Eva (Mesh)', text: 'Status?' },
                        { speaker: 'Ryan', text: 'Inside. Which way to basement?' },
                        { speaker: 'Eva (Mesh)', text: 'End of corridor. Stairwell marked "KELLER B". Basement level.' },
                        { speaker: 'Eva (Mesh)', text: 'Server room door has biometric lock. Override code: 2847' },
                        { speaker: 'Ryan', text: 'Got it. Moving.' }
                    ]);
                    
                    setTimeout(() => {
                        game.showNotification('Find the basement stairwell');
                        FacilityInteriorScene.state.basementUnlocked = true;
                    }, 1500);
                } else {
                    game.showDialogue([
                        "Eva's instructions: Basement stairwell, then server room.",
                        "Override code: 2847"
                    ], "Ryan");
                }
            }
        },
        {
            id: 'security_office',
            name: 'Security Office',
            x: 10,
            y: 45,
            width: 15,
            height: 20,
            cursor: 'look',
            action: function(game) {
                game.showDialogue([
                    "Security office. Door is closed.",
                    "Light is on inside. Can hear radio chatter.",
                    "Keep moving. Don't draw attention."
                ], "Ryan");
            }
        },
        {
            id: 'lab_door',
            name: 'Laboratory 3',
            x: 45,
            y: 45,
            width: 15,
            height: 20,
            cursor: 'look',
            action: function(game) {
                game.showDialogue([
                    "'LABOR 3 - ELEKTRONIK'",
                    "Through the window: workbenches, oscilloscopes, drone components.",
                    "This is where they build it. The weapons."
                ], "Ryan");
            }
        },
        {
            id: 'basement_stairs',
            name: 'Basement Stairwell',
            x: 75,
            y: 60,
            width: 20,
            height: 25,
            cursor: 'pointer',
            enabled: () => FacilityInteriorScene.state.basementUnlocked,
            action: function(game) {
                game.startDialogue([
                    { speaker: 'Ryan', text: '*Opens stairwell door quietly*' },
                    { speaker: '', text: '*Concrete stairs descending into dimness*' },
                    { speaker: 'Ryan', text: 'Basement level. Server room should be here.' },
                    { speaker: '', text: '*Descends. Fluorescent lights hum. Air is colder.*' }
                ]);
                
                setTimeout(() => {
                    game.loadScene('facility_server');
                }, 3000);
            }
        },
        {
            id: 'exit_compound',
            name: 'Exit to Perimeter',
            x: 5,
            y: 85,
            width: 15,
            height: 12,
            cursor: 'exit',
            action: function(game) {
                game.showDialogue([
                    "Back to the perimeter? Not yet.",
                    "Need to get that evidence first."
                ], "Ryan");
            }
        }
    ],
    
    onEnter: (game) => {
        game.showNotification('Inside the compound - Find the server room');
        
        if (!game.getFlag('facility_interior_entered')) {
            game.setFlag('facility_interior_entered', true);
            
            setTimeout(() => {
                game.startDialogue([
                    { speaker: '', text: '*Inside the compound. Empty corridors. Night shift minimal staff.*' },
                    { speaker: 'Ryan', text: 'Made it inside. Now what?' },
                    { speaker: 'Ryan', text: '*Meshtastic chirps softly*' },
                    { speaker: 'Ryan', text: 'Check the Meshtastic for Eva\'s guidance.' }
                ]);
            }, 1000);
        }
    },
    
    onExit: () => {
        // Cleanup
    }
};
