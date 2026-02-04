// Bram and the Quest of the Holy Sausage - Audio System

class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.musicPlaying = false;
        this.musicOscillators = [];
        this.volume = 0.3;
    }

    init() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.connect(this.audioContext.destination);
        this.masterGain.gain.value = this.volume;
    }

    // Generate retro-style sound effects
    playSound(type) {
        if (!this.audioContext) this.init();
        
        const now = this.audioContext.currentTime;
        
        switch(type) {
            case 'walk':
                this.playWalkSound(now);
                break;
            case 'pickup':
                this.playPickupSound(now);
                break;
            case 'error':
                this.playErrorSound(now);
                break;
            case 'success':
                this.playSuccessSound(now);
                break;
            case 'bark':
                this.playBarkSound(now);
                break;
            case 'sniff':
                this.playSniffSound(now);
                break;
            case 'click':
                this.playClickSound(now);
                break;
            case 'door':
                this.playDoorSound(now);
                break;
        }
    }

    playWalkSound(now) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.setValueAtTime(80, now + 0.05);
        
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialDecayTo = 0.01;
        gain.gain.setValueAtTime(0.01, now + 0.1);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(now);
        osc.stop(now + 0.1);
    }

    playPickupSound(now) {
        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
        
        frequencies.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'square';
            osc.frequency.value = freq;
            
            gain.gain.setValueAtTime(0, now + i * 0.1);
            gain.gain.linearRampToValueAtTime(0.15, now + i * 0.1 + 0.05);
            gain.gain.linearRampToValueAtTime(0, now + i * 0.1 + 0.2);
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            
            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.2);
        });
    }

    playErrorSound(now) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.setValueAtTime(150, now + 0.1);
        
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.2);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(now);
        osc.stop(now + 0.2);
    }

    playSuccessSound(now) {
        const frequencies = [392, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
        
        frequencies.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'triangle';
            osc.frequency.value = freq;
            
            gain.gain.setValueAtTime(0, now + i * 0.08);
            gain.gain.linearRampToValueAtTime(0.2, now + i * 0.08 + 0.05);
            gain.gain.linearRampToValueAtTime(0.1, now + i * 0.08 + 0.3);
            gain.gain.linearRampToValueAtTime(0, now + i * 0.08 + 0.5);
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            
            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.5);
        });
    }

    playBarkSound(now) {
        // Two-tone bark
        [300, 250].forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'sawtooth';
            osc.frequency.value = freq;
            
            gain.gain.setValueAtTime(0.2, now + i * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.12);
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            
            osc.start(now + i * 0.15);
            osc.stop(now + i * 0.15 + 0.15);
        });
    }

    playSniffSound(now) {
        for (let i = 0; i < 3; i++) {
            const noise = this.createNoise();
            const gain = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            filter.type = 'bandpass';
            filter.frequency.value = 1000 + i * 200;
            filter.Q.value = 5;
            
            gain.gain.setValueAtTime(0, now + i * 0.1);
            gain.gain.linearRampToValueAtTime(0.1, now + i * 0.1 + 0.03);
            gain.gain.linearRampToValueAtTime(0, now + i * 0.1 + 0.08);
            
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);
            
            noise.start(now + i * 0.1);
            noise.stop(now + i * 0.1 + 0.1);
        }
    }

    playClickSound(now) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'square';
        osc.frequency.value = 1000;
        
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(now);
        osc.stop(now + 0.05);
    }

    playDoorSound(now) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.3);
        
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(now);
        osc.stop(now + 0.3);
    }

    createNoise() {
        const bufferSize = this.audioContext.sampleRate * 0.5;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        return noise;
    }

    // Play background music (simple chiptune loop)
    playMusic() {
        if (!this.audioContext) this.init();
        if (this.musicPlaying) return;
        
        this.musicPlaying = true;
        this.playMusicLoop();
    }

    playMusicLoop() {
        if (!this.musicPlaying) return;
        
        const now = this.audioContext.currentTime;
        
        // Simple adventure melody
        const melody = [
            { note: 392, duration: 0.25 },   // G4
            { note: 440, duration: 0.25 },   // A4
            { note: 493.88, duration: 0.25 }, // B4
            { note: 523.25, duration: 0.5 },  // C5
            { note: 493.88, duration: 0.25 }, // B4
            { note: 440, duration: 0.25 },   // A4
            { note: 392, duration: 0.5 },    // G4
            { note: 329.63, duration: 0.25 }, // E4
            { note: 349.23, duration: 0.25 }, // F4
            { note: 392, duration: 0.5 },    // G4
            { note: 440, duration: 0.5 },    // A4
            { note: 392, duration: 0.75 },   // G4
        ];

        let time = now;
        melody.forEach(({ note, duration }) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'triangle';
            osc.frequency.value = note;
            
            gain.gain.setValueAtTime(0.08, time);
            gain.gain.setValueAtTime(0.08, time + duration - 0.05);
            gain.gain.linearRampToValueAtTime(0, time + duration);
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            
            osc.start(time);
            osc.stop(time + duration);
            
            this.musicOscillators.push(osc);
            
            time += duration;
        });

        // Loop the music
        const totalDuration = melody.reduce((sum, n) => sum + n.duration, 0);
        setTimeout(() => this.playMusicLoop(), totalDuration * 1000);
    }

    stopMusic() {
        this.musicPlaying = false;
        this.musicOscillators.forEach(osc => {
            try { osc.stop(); } catch(e) {}
        });
        this.musicOscillators = [];
    }

    setVolume(value) {
        this.volume = value;
        if (this.masterGain) {
            this.masterGain.gain.value = value;
        }
    }
}

// Global audio manager instance
const audioManager = new AudioManager();
