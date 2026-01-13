# Rein's Collection voor Ledder

**Bijdrage aan het Ledder Project**

---

Ledder is een framework voor het maken van pixel-animaties op LED-matrixen, ontwikkeld door psy0rz. Binnen dit project heb ik "Rein's Collection" bijgedragen – een verzameling van meer dan 40 animaties en experimenten die de mogelijkheden van het framework verkennen.

## Over Ledder

Ledder stelt je in staat om realtime geanimeerde pixel-art te maken en te streamen naar LED-matrix displays. Via een webinterface kun je animaties in realtime aansturen en aanpassen. Het project ondersteunt verschillende hardware-drivers, waaronder HUB75 LED-panelen via Colorlight 5A-75B kaarten.

**Live demo:** https://ledder.datux.nl  
**GitHub:** https://github.com/psy0rz/ledder

## Rein's Collection

Mijn bijdrage bestaat uit proof-of-concept animaties die laten zien hoe je met relatief weinig code complexe visuele effecten kunt creëren. De collectie bevat:

### 3D Graphics
- **Cube, Cubevec3, Cube2** – 3D kubus-animaties met rotaties (sommige met bewuste "bugs" die interessante effecten opleveren)
- **DNA, Grasmaaier** – 3D objecten met fade-effecten
- **Vwlt35** – Retro racing-game esthetiek met perspectief en horizon-effecten

### Retro Game Esthetiek  
- **Digger** – Geïnspireerd door de VIC-20 klassieker
- **Jetfighter** – ASCII-art sprite animaties
- **Eightiesdemo** – Jaren '80 demo-scene stijl met 3D objecten, vuur-effecten en wandelende sprites
- **Slotmachine** – Casino-themed animatie met ASCII-art symbolen

### Fractals & Generative Art
- **Julibrot** – Mandelbrot en Julia fractal sets met geanimeerde zoom
- **Rainbowzero, Rainbowsquare** – Kleur-geometrie experimenten
- **Fireworks** – Procedurele vuurwerkeffecten

### Simulaties
- **Beleep, Beleep2** – Life-simulaties (geheugen-intensief)
- **Weiland** – Simulatie van wolkenlagen en grasland
- **Snow** – Sneeuwval met wind-effecten

### MQTT-integraties
- **Sensorclock32x8** – Digitale klok met sensor-visualisatie voor temperatuur, vochtigheid en druk
- **MQTTClimate** – MQTT sensor-visualisatie
- **Pong, Tankwars** – Multiplayer games via MQTT

### Text & Media
- **Headlines** – RSS-feed display met achtergrondeffecten
- **Photon** – Marquee met meerdere kleurrijke achtergrond-animaties
- **RemoteImages, RemoteVideo, RemotePlaylist** – Laden van externe media (vereist FFmpeg voor video)
- **Vectorfont** – Vector-gebaseerde text rendering

### Overige Experimenten
- **XmasSantaReindeer** – Kerstthema met ASCII-art sprites
- **Love** – Composiet-animatie gemaakt voor een bruiloft
- **Kong** – ASCII-animatie
- **Pixelfan** – LED-ventilator effect

## Technische Bijdragen

Naast de animaties heb ik ook bijgedragen aan de HUB75 LED Panel Control documentatie voor Colorlight 5A-75B hardware, inclusief firmware-flashing guides en hardware-integratie.

### Gebruikte Technieken
- **3D Projectie** – Eigen implementatie van perspectief-berekeningen en vector-transformaties
- **ASCII Art Rendering** – Custom DrawAsciiArtColor klasse voor sprite-animaties
- **Particle Systems** – Voor vuur, sneeuw en explosie-effecten
- **Procedural Generation** – Fractals, landscapes, cloudlayers
- **MQTT Integration** – Realtime sensor-data en multiplayer gaming
- **Vector Graphics** – Custom vector-font systeem met transformaties

## Filosofie

Deze collectie is bedoeld als inspiratie en leermiddel. Sommige animaties zijn geoptimaliseerd, andere bewust experimenteel en geheugen-intensief. Het doel is om te laten zien wat mogelijk is met het framework, niet per se om productie-klare code te leveren.

Zoals het README van de collectie stelt:
> "These examples are just proof-of-concepts to show how easy it is to create a ledder animation. Some animations are really nice, but some suck and will steal your computers processortime and memory to create ten-thousands of obsolete pixels. You can use this code for your own animations under the condition that you (try to) make things more pretty than i did ;-)"

---

**Links:**
- [Rein's Collection op GitHub](https://github.com/psy0rz/ledder/tree/main/ledder/animations/ReinsCollection)
- [Ledder Wiki](https://github.com/psy0rz/ledder/wiki)
- [Live Demo](https://ledder.datux.nl)