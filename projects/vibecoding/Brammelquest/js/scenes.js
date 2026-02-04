// Bram and the Quest of the Holy Sausage - Scene Definitions

const SCENES = {
    // Starting scene - Bram's home
    home: {
        id: 'home',
        name: "Bram's Cozy Home",
        background: 'home',
        music: 'home_theme',
        description: "This is your cozy home. The smell of your owner's cooking fills the air... but wait, where's your sausage?!",
        walkableArea: { x1: 50, y1: 280, x2: 750, y2: 420 },
        playerStart: { x: 400, y: 350 },
        exits: [
            { x: 750, y: 350, width: 50, height: 100, target: 'garden', direction: 'right' }
        ],
        hotspots: [
            {
                id: 'dog_bed',
                x: 100, y: 320,
                width: 80, height: 60,
                name: 'Dog Bed',
                look: "Your comfy bed. You've had many dreams about sausages here. *sigh*",
                use: "You curl up for a moment, but you can't rest until you find the Holy Sausage!",
                talk: "*sniff sniff* The bed doesn't answer. It's a bed."
            },
            {
                id: 'food_bowl',
                x: 250, y: 380,
                width: 50, height: 30,
                name: 'Food Bowl',
                look: "Your food bowl. It says 'BRAM' on it. Currently empty. Just like your heart without the Holy Sausage.",
                use: "You lick the bowl clean. Still no sausage. The tragedy!",
                talk: "Woof! You bark at the bowl. It remains silent and empty."
            },
            {
                id: 'window',
                x: 350, y: 150,
                width: 100, height: 80,
                name: 'Window',
                look: "Through the window, you can see the garden. Perfect sausage-hunting territory!",
                use: "Your little paws can't reach the window latch. You're a pug, not a cat!",
                talk: "You bark at some birds outside. They fly away, unimpressed."
            },
            {
                id: 'toy_bone',
                x: 500, y: 370,
                width: 40, height: 20,
                name: 'Squeaky Bone',
                look: "Your favorite squeaky bone. But today, only a sausage will do!",
                use: null, // Can be picked up
                canPickUp: true,
                item: { id: 'squeaky_bone', name: 'Squeaky Bone', icon: '🦴', description: 'A squeaky toy bone. Makes annoying sounds.' },
                pickupText: "You grab the squeaky bone. *SQUEAK* This might come in handy!"
            }
        ],
        npcs: [],
        drawBackground: function(ctx, sprites) {
            // Floor
            ctx.fillStyle = '#DEB887';
            ctx.fillRect(0, 280, 800, 200);
            
            // Wall
            ctx.fillStyle = '#FAEBD7';
            ctx.fillRect(0, 0, 800, 280);
            
            // Baseboard
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(0, 270, 800, 15);
            
            // Window
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(350, 100, 100, 100);
            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 5;
            ctx.strokeRect(350, 100, 100, 100);
            ctx.beginPath();
            ctx.moveTo(400, 100);
            ctx.lineTo(400, 200);
            ctx.moveTo(350, 150);
            ctx.lineTo(450, 150);
            ctx.stroke();
            
            // Curtains
            ctx.fillStyle = '#CD5C5C';
            ctx.fillRect(340, 80, 30, 130);
            ctx.fillRect(430, 80, 30, 130);
            
            // Dog bed
            ctx.fillStyle = '#4a3728';
            ctx.beginPath();
            ctx.ellipse(140, 350, 60, 25, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#654321';
            ctx.beginPath();
            ctx.ellipse(140, 345, 50, 18, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Food bowl
            sprites.drawDogBowl(250, 390, false);
            
            // Picture frame on wall
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(580, 120, 80, 100);
            ctx.fillStyle = '#FFF8DC';
            ctx.fillRect(590, 130, 60, 80);
            // Draw tiny sausage in frame (the dream!)
            ctx.fillStyle = '#8B4513';
            ctx.beginPath();
            ctx.ellipse(620, 170, 20, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Door on right
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(720, 180, 80, 150);
            ctx.fillStyle = '#654321';
            ctx.fillRect(730, 190, 60, 130);
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(770, 265, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    },

    // Garden scene
    garden: {
        id: 'garden',
        name: 'The Back Garden',
        background: 'garden',
        description: "The garden! Full of interesting smells and potential sausage clues!",
        walkableArea: { x1: 50, y1: 300, x2: 750, y2: 430 },
        playerStart: { x: 100, y: 360 },
        exits: [
            { x: 0, y: 350, width: 50, height: 100, target: 'home', direction: 'left' },
            { x: 750, y: 350, width: 50, height: 100, target: 'street', direction: 'right' }
        ],
        hotspots: [
            {
                id: 'flowers',
                x: 200, y: 350,
                width: 80, height: 50,
                name: 'Flower Bed',
                look: "Pretty flowers! But you can't eat flowers. Well, you could, but you'd regret it.",
                use: "You dig a little. No sausages buried here. Just dirt and worms.",
                talk: "You sniff the flowers deeply. *ACHOO!* Pug sneeze!"
            },
            {
                id: 'garden_gnome',
                x: 450, y: 340,
                width: 40, height: 70,
                name: 'Garden Gnome',
                look: "A creepy garden gnome. It stares at you with its cold, painted eyes. Does it know about the sausage?",
                use: "You try to knock it over, but it's surprisingly heavy. Suspicious...",
                talk: "You bark at the gnome. It says nothing. Even more suspicious!"
            },
            {
                id: 'bush',
                x: 600, y: 320,
                width: 100, height: 80,
                name: 'Suspicious Bush',
                look: "A thick bush. Something rustles inside... Could be a sausage. Probably not, but a pug can dream!",
                use: "You stick your flat face into the bush. Ouch! Twigs in the snoot!",
                talk: "*sniff sniff* You smell... SQUIRREL!"
            },
            {
                id: 'hidden_treat',
                x: 350, y: 400,
                width: 30, height: 20,
                name: 'Something Shiny',
                look: "Wait... is that... a TREAT?!",
                use: null,
                canPickUp: true,
                item: { id: 'dog_treat', name: 'Dog Treat', icon: '🍪', description: 'A tasty dog treat. Not a sausage, but still good!' },
                pickupText: "*MUNCH* You found a treat! You eat half of it immediately. You save the other half... who are we kidding, you ate it all."
            }
        ],
        npcs: [
            {
                id: 'squirrel',
                x: 620, y: 280,
                type: 'squirrel',
                name: 'Cheeky Squirrel',
                look: "A squirrel! Your eternal nemesis! It's holding an acorn and looking smug.",
                dialog: {
                    greeting: "*chitter chitter* Oh, it's the vies ventje! Looking for something?",
                    options: [
                        {
                            text: "Have you seen the Holy Sausage?",
                            response: "The Holy Sausage? *chitter* I might know something... but what's in it for me?",
                            next: 'negotiate'
                        },
                        {
                            text: "I will chase you!",
                            response: "*jumps to higher branch* Ha! Your little pug legs could never catch me!",
                            next: null
                        },
                        {
                            text: "Goodbye, tree rat!",
                            response: "*offended chittering* Tree rat?! The audacity!",
                            next: null
                        }
                    ]
                },
                negotiate: {
                    greeting: "I'll tell you about the sausage if you bring me something shiny. Squirrels love shiny things!",
                    options: [
                        {
                            text: "[Give Shiny Collar Tag]",
                            requiresItem: 'collar_tag',
                            response: "Ooooh! So shiny! Okay okay, I saw a cat carrying a sausage toward the market! Now leave me alone!",
                            next: null,
                            setsFlag: 'knows_about_cat'
                        },
                        {
                            text: "I don't have anything shiny...",
                            response: "Then we have nothing to discuss! *chitter chitter*",
                            next: null
                        }
                    ]
                }
            }
        ],
        drawBackground: function(ctx, sprites) {
            // Sky
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(0, 0, 800, 300);
            
            // Grass
            ctx.fillStyle = '#228B22';
            ctx.fillRect(0, 300, 800, 200);
            
            // Clouds
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(100, 60, 30, 0, Math.PI * 2);
            ctx.arc(130, 50, 35, 0, Math.PI * 2);
            ctx.arc(160, 60, 30, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(500, 80, 25, 0, Math.PI * 2);
            ctx.arc(530, 70, 30, 0, Math.PI * 2);
            ctx.arc(560, 80, 25, 0, Math.PI * 2);
            ctx.fill();
            
            // Back fence
            sprites.drawFence(0, 250, 800);
            
            // Trees in background
            sprites.drawTree(700, 150, 'oak');
            sprites.drawTree(50, 180, 'pine');
            
            // Flower bed
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(180, 360, 100, 40);
            // Flowers
            ['#FF69B4', '#FF6347', '#FFD700', '#9370DB'].forEach((color, i) => {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(200 + i * 20, 350, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#228B22';
                ctx.fillRect(198 + i * 20, 355, 4, 20);
            });
            
            // Garden gnome
            ctx.fillStyle = '#CD5C5C';
            ctx.beginPath();
            ctx.moveTo(470, 310);
            ctx.lineTo(450, 370);
            ctx.lineTo(490, 370);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#FFDAB9';
            ctx.beginPath();
            ctx.arc(470, 340, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(470, 355, 8, 0, Math.PI);
            ctx.fill();
            
            // Bush
            sprites.drawBush(630, 360);
            
            // Path
            ctx.fillStyle = '#D2B48C';
            ctx.fillRect(700, 300, 100, 150);
        }
    },

    // Street scene
    street: {
        id: 'street',
        name: 'Quiet Neighborhood Street',
        background: 'street',
        description: "The street! Cars, smells, and adventure await! Stay on the sidewalk, Bram!",
        walkableArea: { x1: 50, y1: 350, x2: 750, y2: 430 },
        playerStart: { x: 100, y: 390 },
        exits: [
            { x: 0, y: 380, width: 50, height: 80, target: 'garden', direction: 'left' },
            { x: 750, y: 380, width: 50, height: 80, target: 'market', direction: 'right' }
        ],
        hotspots: [
            {
                id: 'fire_hydrant',
                x: 200, y: 370,
                width: 40, height: 60,
                name: 'Fire Hydrant',
                look: "A fire hydrant! The sacred marking post! Many dogs have visited this holy site.",
                use: "You do what dogs do at fire hydrants. *leg lift* Ahhhh.",
                talk: "You sniff it thoroughly. The hydrant tells tales of many passing dogs."
            },
            {
                id: 'trash_can',
                x: 400, y: 360,
                width: 50, height: 80,
                name: 'Trash Can',
                look: "A trash can! Could there be sausages in there? The possibilities!",
                use: "You knock it over! *CRASH* Just old newspapers and banana peels. No sausages.",
                talk: "The trash can rattles. Did something move inside?"
            },
            {
                id: 'lamp_post',
                x: 550, y: 300,
                width: 30, height: 150,
                name: 'Lamp Post',
                look: "A lamp post. More sniff-messages from other dogs. This is basically doggy social media.",
                use: "You're too short to reach the lamp. Just as well, it's hot!",
                talk: "You bark at it. The echo sounds cool!"
            },
            {
                id: 'dropped_collar',
                x: 320, y: 410,
                width: 30, height: 20,
                name: 'Shiny Object',
                look: "Hey! A shiny collar tag! Someone must have lost it.",
                use: null,
                canPickUp: true,
                item: { id: 'collar_tag', name: 'Shiny Collar Tag', icon: '🏷️', description: 'A shiny metal collar tag. Squirrels love shiny things...' },
                pickupText: "You pick up the shiny collar tag. Ooh, it sparkles!"
            }
        ],
        npcs: [
            {
                id: 'old_dog',
                x: 600, y: 380,
                type: 'oldDog',
                name: 'Old Woofgang',
                look: "An elderly dog with a walking cane. His fur is gray with wisdom. Maybe he knows something!",
                dialog: {
                    greeting: "*wheeze* Well well, young pup. You look like you're on a quest!",
                    options: [
                        {
                            text: "Do you know about the Holy Sausage?",
                            response: "*nostalgic sigh* The Holy Sausage... I sought it myself, many moons ago. Legend says it grants infinite belly rubs!",
                            next: 'sausage_lore'
                        },
                        {
                            text: "What happened to your leg?",
                            response: "Lost it chasing the mailman. Worth it. I caught him. Once.",
                            next: null
                        },
                        {
                            text: "Goodbye, wise elder!",
                            response: "May your nose guide you, young vies ventje!",
                            next: null
                        }
                    ]
                },
                sausage_lore: {
                    greeting: "The Holy Sausage moves from place to place. Last I heard, a sneaky cat took it. Cats! *growls* Check the market!",
                    options: [
                        {
                            text: "Thank you for the wisdom!",
                            response: "Good luck, pup! And remember - follow your nose!",
                            next: null,
                            setsFlag: 'knows_market_hint'
                        },
                        {
                            text: "Any other advice?",
                            response: "Always sniff twice. And never trust a cat with a sausage!",
                            next: null
                        }
                    ]
                }
            }
        ],
        drawBackground: function(ctx, sprites) {
            // Sky
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(0, 0, 800, 250);
            
            // Buildings in background
            ctx.fillStyle = '#BC8F8F';
            ctx.fillRect(50, 100, 120, 200);
            ctx.fillStyle = '#DEB887';
            ctx.fillRect(200, 80, 100, 220);
            ctx.fillStyle = '#D2B48C';
            ctx.fillRect(350, 120, 150, 180);
            ctx.fillStyle = '#C4A67C';
            ctx.fillRect(550, 90, 130, 210);
            
            // Windows
            ctx.fillStyle = '#4169E1';
            for (let i = 0; i < 4; i++) {
                ctx.fillRect(70 + (i % 2) * 50, 120 + Math.floor(i / 2) * 60, 30, 40);
                ctx.fillRect(220 + (i % 2) * 40, 100 + Math.floor(i / 2) * 70, 25, 35);
            }
            
            // Road
            ctx.fillStyle = '#404040';
            ctx.fillRect(0, 300, 800, 100);
            
            // Road lines
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 3;
            ctx.setLineDash([30, 20]);
            ctx.beginPath();
            ctx.moveTo(0, 350);
            ctx.lineTo(800, 350);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Sidewalk
            ctx.fillStyle = '#A9A9A9';
            ctx.fillRect(0, 400, 800, 50);
            
            // Fire hydrant
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(195, 380, 20, 40);
            ctx.beginPath();
            ctx.arc(205, 380, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(188, 395, 34, 8);
            
            // Trash can
            ctx.fillStyle = '#228B22';
            ctx.fillRect(395, 360, 60, 80);
            ctx.fillStyle = '#2E8B57';
            ctx.fillRect(390, 355, 70, 10);
            
            // Lamp post
            ctx.fillStyle = '#2F2F2F';
            ctx.fillRect(548, 200, 14, 250);
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(555, 200, 20, Math.PI, 0);
            ctx.fill();
        }
    },

    // Market scene
    market: {
        id: 'market',
        name: 'The Bustling Market',
        background: 'market',
        description: "The market! So many smells! Especially from that butcher's stall...",
        walkableArea: { x1: 50, y1: 320, x2: 750, y2: 430 },
        playerStart: { x: 100, y: 380 },
        exits: [
            { x: 0, y: 380, width: 50, height: 80, target: 'street', direction: 'left' },
            { x: 750, y: 380, width: 50, height: 80, target: 'alley', direction: 'right' }
        ],
        hotspots: [
            {
                id: 'fruit_stand',
                x: 150, y: 300,
                width: 100, height: 80,
                name: 'Fruit Stand',
                look: "Apples, oranges, bananas... No sausages. What a tragedy!",
                use: "You accidentally knock over some apples. The vendor yells at you!",
                talk: "You look at the fruits with disdain. Not meat. Not interested."
            },
            {
                id: 'butcher_stall',
                x: 400, y: 280,
                width: 150, height: 100,
                name: "Butcher's Stall",
                look: "THE BUTCHER'S STALL! Sausages! Meat! PARADISE! *drool*",
                use: "You try to reach the counter but you're too short! The butcher notices you...",
                talk: "The meat calls to you. It says 'eat me, Bram, eat me!'"
            },
            {
                id: 'cheese_stand',
                x: 600, y: 300,
                width: 80, height: 80,
                name: 'Cheese Stand',
                look: "Cheese! Not as good as sausage, but you wouldn't say no...",
                use: "The cheese vendor shoos you away. No dogs allowed near the cheese!",
                talk: "*sniff* Smelly cheese. Smells almost as bad as you after rolling in mud!"
            }
        ],
        npcs: [
            {
                id: 'butcher',
                x: 450, y: 280,
                type: 'butcher',
                name: 'Hans the Butcher',
                look: "A large man with a mustache and a bloody apron. He's surrounded by delicious meats!",
                dialog: {
                    greeting: "Ah, a little pug! *laughs* Looking for something, kleintje?",
                    options: [
                        {
                            text: "Have you seen the Holy Sausage?",
                            response: "The Holy Sausage? *strokes mustache* Ja, I've heard the legends. Some say a cat stole it from my great-grandfather!",
                            next: 'cat_info'
                        },
                        {
                            text: "Can I have a sausage? *puppy eyes*",
                            response: "Ha! Those eyes! Here's a small piece... *throws tiny bit* Now shoo, before my wife sees!",
                            next: null,
                            setsFlag: 'got_sausage_bit'
                        },
                        {
                            text: "Just sniffing around!",
                            response: "Ja ja, sniff all you want! But no stealing, kleintje!",
                            next: null
                        }
                    ]
                },
                cat_info: {
                    greeting: "That cat... I've seen it lurking in the alley behind the market. Orange, with evil eyes. Careful, pup!",
                    options: [
                        {
                            text: "I'll find that cat!",
                            response: "Good luck! And if you find the Holy Sausage... bring it back and I'll give you unlimited scraps!",
                            next: null,
                            setsFlag: 'butcher_quest'
                        },
                        {
                            text: "Thanks for the info!",
                            response: "Geen probleem! Now go, before my customers complain about dog hair!",
                            next: null
                        }
                    ]
                }
            }
        ],
        drawBackground: function(ctx, sprites) {
            // Sky
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(0, 0, 800, 200);
            
            // Market awnings
            ctx.fillStyle = '#FF6347';
            ctx.fillRect(100, 200, 150, 30);
            ctx.fillStyle = '#4169E1';
            ctx.fillRect(350, 180, 200, 30);
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(580, 200, 120, 30);
            
            // Stripes on awnings
            ctx.fillStyle = '#fff';
            for (let i = 0; i < 8; i++) {
                ctx.fillRect(100 + i * 20, 200, 10, 30);
            }
            
            // Stalls
            ctx.fillStyle = '#DEB887';
            ctx.fillRect(100, 230, 150, 120);
            ctx.fillStyle = '#F5DEB3';
            ctx.fillRect(350, 210, 200, 140);
            ctx.fillStyle = '#FFEFD5';
            ctx.fillRect(580, 230, 120, 120);
            
            // Ground
            ctx.fillStyle = '#D2B48C';
            ctx.fillRect(0, 350, 800, 100);
            
            // Cobblestones pattern
            ctx.fillStyle = '#C4A67C';
            for (let x = 0; x < 800; x += 40) {
                for (let y = 350; y < 450; y += 30) {
                    ctx.fillRect(x + (y % 60 === 0 ? 0 : 20), y, 35, 25);
                }
            }
            
            // Fruits on stand
            ['#FF0000', '#FFA500', '#FFFF00', '#00FF00'].forEach((color, i) => {
                ctx.fillStyle = color;
                for (let j = 0; j < 3; j++) {
                    ctx.beginPath();
                    ctx.arc(120 + i * 30 + j * 10, 260 + j * 15, 12, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
            
            // Sausages at butcher
            ctx.fillStyle = '#8B4513';
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.ellipse(380 + i * 35, 250, 25, 8, 0.3, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Meat hooks
            ctx.strokeStyle = '#808080';
            ctx.lineWidth = 3;
            for (let i = 0; i < 4; i++) {
                ctx.beginPath();
                ctx.moveTo(370 + i * 40, 210);
                ctx.lineTo(370 + i * 40, 230);
                ctx.arc(375 + i * 40, 230, 5, Math.PI, 0);
                ctx.stroke();
            }
            
            // Cheese wheels
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.ellipse(620, 280, 25, 15, 0, 0, Math.PI * 2);
            ctx.ellipse(670, 290, 20, 12, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#FFA500';
            ctx.beginPath();
            ctx.ellipse(640, 310, 30, 18, 0.2, 0, Math.PI * 2);
            ctx.fill();
        }
    },

    // Alley scene
    alley: {
        id: 'alley',
        name: 'Dark Alley',
        background: 'alley',
        description: "A dark alley behind the market. You can smell cat... and something else. Something... sausage-y?",
        walkableArea: { x1: 50, y1: 320, x2: 750, y2: 430 },
        playerStart: { x: 100, y: 380 },
        exits: [
            { x: 0, y: 380, width: 50, height: 80, target: 'market', direction: 'left' }
        ],
        hotspots: [
            {
                id: 'dumpster',
                x: 300, y: 300,
                width: 100, height: 80,
                name: 'Dumpster',
                look: "A large dumpster. Smells like heaven to a pug! Also smells like cat...",
                use: "You dig through the trash. Old fish, rotten vegetables... but wait! A clue! A sausage wrapper!",
                talk: "You bark at the dumpster. Something hisses back!"
            },
            {
                id: 'cardboard_box',
                x: 500, y: 350,
                width: 80, height: 60,
                name: 'Cardboard Box',
                look: "A cardboard box. It's moving slightly...",
                use: "You knock the box over! A startled cat runs out!",
                talk: "You growl at the box. The movement stops. Suspicious..."
            },
            {
                id: 'puddle',
                x: 200, y: 400,
                width: 60, height: 30,
                name: 'Mysterious Puddle',
                look: "A puddle. You see your reflection. Such a handsome pug! Such a flat face!",
                use: "You drink from the puddle. *BLEH* That was NOT water!",
                talk: "You bark at your reflection. It barks back! Scary!"
            }
        ],
        npcs: [
            {
                id: 'cat',
                x: 600, y: 340,
                type: 'cat',
                name: 'Whiskers the Cat',
                look: "An orange cat with evil eyes. It's grooming itself smugly. You can SMELL the sausage on it!",
                dialog: {
                    greeting: "*hisss* Well well, a little pug. Come for the sausage, have you?",
                    options: [
                        {
                            text: "Give me the Holy Sausage!",
                            response: "*licks paw* The Holy Sausage? I might know where it is... but why should I tell a dog?",
                            next: 'negotiate_cat'
                        },
                        {
                            text: "I'm gonna bark so loud!",
                            response: "*yawns* Oh no, not barking. How terrifying. *rolls eyes*",
                            next: null
                        },
                        {
                            text: "Nice kitty... good kitty...",
                            response: "*narrows eyes* Don't patronize me, pug. I'm not nice.",
                            next: null
                        }
                    ]
                },
                negotiate_cat: {
                    greeting: "I'll make you a deal, pug. Bring me something delicious, and I'll tell you where the Holy Sausage is hidden.",
                    options: [
                        {
                            text: "[Give Squeaky Bone]",
                            requiresItem: 'squeaky_bone',
                            response: "*sniffs* A dog toy? Are you serious? I'm a CAT!",
                            next: 'negotiate_cat'
                        },
                        {
                            text: "[Give piece of sausage from butcher]",
                            requiresItem: 'got_sausage_bit',
                            requiresFlag: true,
                            response: "*eyes widen* Ooooh! Real sausage! Fine fine, the Holy Sausage is hidden in the old shrine behind this alley!",
                            next: null,
                            setsFlag: 'knows_shrine_location',
                            unlocksExit: 'shrine'
                        },
                        {
                            text: "I have nothing for you...",
                            response: "Then we're done here. *starts grooming*",
                            next: null
                        }
                    ]
                }
            }
        ],
        drawBackground: function(ctx, sprites) {
            // Dark sky
            ctx.fillStyle = '#2F2F4F';
            ctx.fillRect(0, 0, 800, 200);
            
            // Brick walls
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(0, 0, 100, 450);
            ctx.fillRect(700, 0, 100, 450);
            
            // Brick pattern
            ctx.strokeStyle = '#654321';
            ctx.lineWidth = 1;
            for (let y = 0; y < 450; y += 20) {
                for (let x = 0; x < 100; x += 40) {
                    ctx.strokeRect(x + (y % 40 === 0 ? 0 : 20), y, 40, 20);
                }
                for (let x = 700; x < 800; x += 40) {
                    ctx.strokeRect(x + (y % 40 === 0 ? 0 : 20), y, 40, 20);
                }
            }
            
            // Ground
            ctx.fillStyle = '#3D3D3D';
            ctx.fillRect(100, 350, 600, 100);
            
            // Puddles
            ctx.fillStyle = '#4682B4';
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.ellipse(220, 410, 40, 15, 0.1, 0, Math.PI * 2);
            ctx.ellipse(450, 420, 30, 12, -0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
            
            // Dumpster
            ctx.fillStyle = '#228B22';
            ctx.fillRect(280, 300, 120, 100);
            ctx.fillStyle = '#006400';
            ctx.fillRect(275, 290, 130, 15);
            
            // Boxes
            ctx.fillStyle = '#8B7355';
            ctx.fillRect(500, 360, 80, 60);
            ctx.fillRect(520, 340, 50, 30);
            
            // Pipes
            ctx.fillStyle = '#808080';
            ctx.fillRect(80, 100, 15, 200);
            ctx.fillRect(710, 150, 15, 180);
            
            // Steam/fog
            ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
            ctx.beginPath();
            ctx.ellipse(350, 200, 200, 80, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Mysterious glow from beyond (hint at shrine)
            ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
            ctx.beginPath();
            ctx.arc(750, 380, 100, 0, Math.PI * 2);
            ctx.fill();
        },
        init: function(game) {
            // Add exit to shrine if unlocked
            if (game.flags.knows_shrine_location) {
                if (!this.exits.find(e => e.target === 'shrine')) {
                    this.exits.push({
                        x: 750, y: 380, width: 50, height: 80, 
                        target: 'shrine', direction: 'right',
                        unlocked: true
                    });
                }
            }
        }
    },

    // Final scene - The Shrine
    shrine: {
        id: 'shrine',
        name: 'The Ancient Sausage Shrine',
        background: 'shrine',
        description: "The shrine! Golden light emanates from within. Could this be it? The Holy Sausage?!",
        walkableArea: { x1: 50, y1: 320, x2: 750, y2: 430 },
        playerStart: { x: 100, y: 380 },
        exits: [
            { x: 0, y: 380, width: 50, height: 80, target: 'alley', direction: 'left' }
        ],
        hotspots: [
            {
                id: 'altar',
                x: 350, y: 250,
                width: 100, height: 80,
                name: 'Ancient Altar',
                look: "An ancient stone altar. On top... could it be?! THE HOLY SAUSAGE!",
                use: "You jump up and grab THE HOLY SAUSAGE! Golden light fills the room! *VICTORY FANFARE*",
                useSpecial: true,
                talk: "You bark in reverence. The sausage seems to glow brighter in response!"
            },
            {
                id: 'ancient_bones',
                x: 150, y: 380,
                width: 60, height: 30,
                name: 'Ancient Bones',
                look: "Ancient dog bones, offerings from pugs of ages past. You feel a connection to your ancestors.",
                use: "You sniff them respectfully. These are sacred relics, not for chewing.",
                talk: "You howl softly. Somewhere, the spirits of ancient pugs howl back."
            },
            {
                id: 'inscriptions',
                x: 550, y: 300,
                width: 100, height: 80,
                name: 'Wall Inscriptions',
                look: "Ancient writings... You can't read, you're a dog. But the pictures show pugs worshipping a sausage!",
                use: "You scratch at the wall. Probably shouldn't do that, it's a historical artifact.",
                talk: "You sneeze. Very dusty."
            }
        ],
        npcs: [],
        drawBackground: function(ctx, sprites) {
            // Dark mystical background
            const gradient = ctx.createRadialGradient(400, 300, 0, 400, 300, 500);
            gradient.addColorStop(0, '#4a3c6e');
            gradient.addColorStop(1, '#1a1a2e');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 800, 450);
            
            // Stone floor
            ctx.fillStyle = '#696969';
            ctx.fillRect(0, 350, 800, 100);
            
            // Stone pattern
            ctx.strokeStyle = '#505050';
            ctx.lineWidth = 2;
            for (let x = 0; x < 800; x += 60) {
                for (let y = 350; y < 450; y += 40) {
                    ctx.strokeRect(x + (y % 80 === 0 ? 0 : 30), y, 60, 40);
                }
            }
            
            // Stone pillars
            ctx.fillStyle = '#808080';
            ctx.fillRect(100, 150, 50, 250);
            ctx.fillRect(650, 150, 50, 250);
            
            // Pillar details
            ctx.fillStyle = '#A9A9A9';
            ctx.fillRect(95, 140, 60, 20);
            ctx.fillRect(645, 140, 60, 20);
            ctx.fillRect(95, 380, 60, 20);
            ctx.fillRect(645, 380, 60, 20);
            
            // Ancient wall with inscriptions
            ctx.fillStyle = '#4a4a4a';
            ctx.fillRect(550, 200, 120, 150);
            // Inscription lines
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 1;
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.moveTo(560, 220 + i * 25);
                ctx.lineTo(660, 220 + i * 25);
                ctx.stroke();
            }
            
            // THE ALTAR
            ctx.fillStyle = '#B8860B';
            ctx.fillRect(300, 280, 200, 20);
            ctx.fillRect(330, 300, 140, 80);
            
            // Golden glow
            const glowGradient = ctx.createRadialGradient(400, 260, 0, 400, 260, 100);
            glowGradient.addColorStop(0, 'rgba(255, 215, 0, 0.6)');
            glowGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
            ctx.fillStyle = glowGradient;
            ctx.fillRect(250, 150, 300, 200);
            
            // THE HOLY SAUSAGE on altar
            sprites.drawSausage(400, 260, 'holy', true);
            
            // Light rays
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
            ctx.lineWidth = 3;
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(400, 260);
                ctx.lineTo(400 + Math.cos(angle) * 150, 260 + Math.sin(angle) * 100);
                ctx.stroke();
            }
            
            // Scattered bones
            sprites.drawBone(160, 390);
            sprites.drawBone(620, 400);
        }
    }
};

// Export scenes
window.SCENES = SCENES;
