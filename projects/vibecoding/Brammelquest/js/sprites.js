// Bram and the Quest of the Holy Sausage - Sprite System

class SpriteRenderer {
    constructor(ctx) {
        this.ctx = ctx;
    }

    // Draw Bram the Pug
    drawBram(x, y, direction = 'right', frame = 0, scale = 1) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(x, y);
        
        if (direction === 'left') {
            ctx.scale(-1, 1);
        }
        
        const s = scale;
        
        // Body (tan/fawn color)
        ctx.fillStyle = '#D2B48C';
        ctx.beginPath();
        ctx.ellipse(0, 10 * s, 25 * s, 18 * s, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Legs
        ctx.fillStyle = '#C4A67C';
        const legOffset = frame % 2 === 0 ? 2 : -2;
        // Front legs
        ctx.fillRect(-15 * s, 20 * s, 8 * s, 15 * s + legOffset);
        ctx.fillRect(7 * s, 20 * s, 8 * s, 15 * s - legOffset);
        // Back legs
        ctx.fillRect(-20 * s, 15 * s, 8 * s, 18 * s - legOffset);
        ctx.fillRect(12 * s, 15 * s, 8 * s, 18 * s + legOffset);
        
        // Paws
        ctx.fillStyle = '#8B7355';
        ctx.fillRect(-16 * s, 33 * s + legOffset, 10 * s, 4 * s);
        ctx.fillRect(6 * s, 33 * s - legOffset, 10 * s, 4 * s);
        ctx.fillRect(-21 * s, 31 * s - legOffset, 10 * s, 4 * s);
        ctx.fillRect(11 * s, 31 * s + legOffset, 10 * s, 4 * s);
        
        // Head
        ctx.fillStyle = '#D2B48C';
        ctx.beginPath();
        ctx.arc(20 * s, -5 * s, 20 * s, 0, Math.PI * 2);
        ctx.fill();
        
        // Black mask (pug face)
        ctx.fillStyle = '#2F2F2F';
        ctx.beginPath();
        ctx.ellipse(28 * s, 0 * s, 12 * s, 14 * s, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Snout
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.ellipse(35 * s, 5 * s, 8 * s, 6 * s, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Nose
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(40 * s, 4 * s, 4 * s, 3 * s, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(22 * s, -8 * s, 6 * s, 0, Math.PI * 2);
        ctx.arc(34 * s, -8 * s, 6 * s, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupils
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(24 * s, -7 * s, 3 * s, 0, Math.PI * 2);
        ctx.arc(36 * s, -7 * s, 3 * s, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye shine
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(25 * s, -9 * s, 1.5 * s, 0, Math.PI * 2);
        ctx.arc(37 * s, -9 * s, 1.5 * s, 0, Math.PI * 2);
        ctx.fill();
        
        // Ears
        ctx.fillStyle = '#2F2F2F';
        ctx.beginPath();
        ctx.moveTo(5 * s, -15 * s);
        ctx.quadraticCurveTo(-5 * s, -25 * s, 10 * s, -20 * s);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(35 * s, -20 * s);
        ctx.quadraticCurveTo(50 * s, -30 * s, 40 * s, -15 * s);
        ctx.fill();
        
        // Curly tail
        ctx.fillStyle = '#D2B48C';
        ctx.beginPath();
        ctx.arc(-30 * s, 0 * s, 8 * s, 0, Math.PI * 1.5);
        ctx.lineWidth = 6 * s;
        ctx.strokeStyle = '#D2B48C';
        ctx.stroke();
        
        // Tongue (when happy)
        if (frame % 4 < 2) {
            ctx.fillStyle = '#FF69B4';
            ctx.beginPath();
            ctx.ellipse(38 * s, 12 * s, 3 * s, 5 * s, 0.2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }

    // Draw a sausage
    drawSausage(x, y, type = 'normal', glow = false) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(x, y);
        
        if (glow) {
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 20;
        }
        
        // Sausage body
        ctx.fillStyle = type === 'holy' ? '#FFD700' : '#8B4513';
        ctx.beginPath();
        ctx.ellipse(0, 0, 30, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Ends
        ctx.fillStyle = type === 'holy' ? '#DAA520' : '#654321';
        ctx.beginPath();
        ctx.ellipse(-25, 0, 8, 8, 0, 0, Math.PI * 2);
        ctx.ellipse(25, 0, 8, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.ellipse(-5, -5, 15, 3, -0.2, 0, Math.PI * 2);
        ctx.fill();
        
        if (type === 'holy') {
            // Holy halo
            ctx.strokeStyle = '#FFF8DC';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(0, -20, 20, 8, 0, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.restore();
    }

    // Draw an NPC character
    drawNPC(x, y, type, frame = 0) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(x, y);
        
        switch(type) {
            case 'cat':
                this.drawCat(frame);
                break;
            case 'butcher':
                this.drawButcher(frame);
                break;
            case 'oldDog':
                this.drawOldDog(frame);
                break;
            case 'squirrel':
                this.drawSquirrel(frame);
                break;
        }
        
        ctx.restore();
    }

    drawCat(frame) {
        const ctx = this.ctx;
        
        // Body
        ctx.fillStyle = '#808080';
        ctx.beginPath();
        ctx.ellipse(0, 10, 20, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Head
        ctx.beginPath();
        ctx.arc(18, -5, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Ears
        ctx.beginPath();
        ctx.moveTo(8, -15);
        ctx.lineTo(5, -30);
        ctx.lineTo(15, -18);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(25, -18);
        ctx.lineTo(32, -30);
        ctx.lineTo(28, -15);
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = '#90EE90';
        ctx.beginPath();
        ctx.ellipse(12, -8, 4, 5, 0, 0, Math.PI * 2);
        ctx.ellipse(24, -8, 4, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupils
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(12, -8, 1.5, 4, 0, 0, Math.PI * 2);
        ctx.ellipse(24, -8, 1.5, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Tail
        ctx.strokeStyle = '#808080';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(-20, 5);
        ctx.quadraticCurveTo(-35, -10 + Math.sin(frame * 0.5) * 5, -30, -20);
        ctx.stroke();
    }

    drawButcher(frame) {
        const ctx = this.ctx;
        
        // Body/Apron
        ctx.fillStyle = '#fff';
        ctx.fillRect(-20, -20, 40, 60);
        
        // Apron stains
        ctx.fillStyle = '#8B0000';
        ctx.beginPath();
        ctx.arc(-5, 10, 5, 0, Math.PI * 2);
        ctx.arc(10, 25, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Head
        ctx.fillStyle = '#FFDAB9';
        ctx.beginPath();
        ctx.arc(0, -35, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Mustache
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.ellipse(-8, -28, 8, 4, 0.3, 0, Math.PI * 2);
        ctx.ellipse(8, -28, 8, 4, -0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Hat
        ctx.fillStyle = '#fff';
        ctx.fillRect(-18, -55, 36, 15);
        ctx.fillRect(-15, -65, 30, 12);
        
        // Eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-8, -40, 3, 0, Math.PI * 2);
        ctx.arc(8, -40, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Legs
        ctx.fillStyle = '#2F4F4F';
        ctx.fillRect(-15, 40, 12, 25);
        ctx.fillRect(3, 40, 12, 25);
    }

    drawOldDog(frame) {
        const ctx = this.ctx;
        
        // Body (gray with age)
        ctx.fillStyle = '#A9A9A9';
        ctx.beginPath();
        ctx.ellipse(0, 10, 28, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Head
        ctx.beginPath();
        ctx.arc(25, -5, 22, 0, Math.PI * 2);
        ctx.fill();
        
        // White muzzle
        ctx.fillStyle = '#D3D3D3';
        ctx.beginPath();
        ctx.ellipse(40, 5, 12, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Wise old eyes
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(20, -10, 5, 0, Math.PI * 2);
        ctx.arc(35, -10, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyebrows (bushy)
        ctx.fillStyle = '#696969';
        ctx.fillRect(15, -18, 12, 4);
        ctx.fillRect(30, -18, 12, 4);
        
        // Walking stick/cane
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-30, -20);
        ctx.lineTo(-25, 35);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(-32, -22, 5, Math.PI, Math.PI * 2);
        ctx.stroke();
    }

    drawSquirrel(frame) {
        const ctx = this.ctx;
        
        // Body
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.ellipse(0, 5, 12, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Big fluffy tail
        ctx.beginPath();
        ctx.moveTo(-5, 10);
        ctx.quadraticCurveTo(-25, 0, -20, -25);
        ctx.quadraticCurveTo(-10, -35, 0, -20);
        ctx.fill();
        
        // Head
        ctx.beginPath();
        ctx.arc(8, -12, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Ears
        ctx.beginPath();
        ctx.ellipse(2, -22, 4, 6, -0.3, 0, Math.PI * 2);
        ctx.ellipse(14, -22, 4, 6, 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(5, -14, 3, 0, Math.PI * 2);
        ctx.arc(12, -14, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Cheeks
        ctx.fillStyle = '#DEB887';
        ctx.beginPath();
        ctx.ellipse(3, -8, 4, 3, 0, 0, Math.PI * 2);
        ctx.ellipse(13, -8, 4, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Acorn (holding)
        ctx.fillStyle = '#654321';
        ctx.beginPath();
        ctx.ellipse(8, 2, 5, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#8B7355';
        ctx.beginPath();
        ctx.arc(8, -4, 5, Math.PI, 0);
        ctx.fill();
    }

    // Draw environment objects
    drawTree(x, y, type = 'oak') {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(x, y);
        
        // Trunk
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(-15, 0, 30, 80);
        
        // Foliage
        ctx.fillStyle = type === 'oak' ? '#228B22' : '#2E8B57';
        ctx.beginPath();
        ctx.arc(0, -20, 50, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-30, 10, 35, 0, Math.PI * 2);
        ctx.arc(30, 10, 35, 0, Math.PI * 2);
        ctx.fill();
        
        // Darker spots
        ctx.fillStyle = '#006400';
        ctx.beginPath();
        ctx.arc(-15, -15, 20, 0, Math.PI * 2);
        ctx.arc(20, 0, 18, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    drawHouse(x, y) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(x, y);
        
        // Main structure
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(-60, 0, 120, 100);
        
        // Roof
        ctx.fillStyle = '#8B0000';
        ctx.beginPath();
        ctx.moveTo(-70, 0);
        ctx.lineTo(0, -50);
        ctx.lineTo(70, 0);
        ctx.closePath();
        ctx.fill();
        
        // Door
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(-15, 40, 30, 60);
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(10, 70, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Windows
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(-50, 20, 25, 25);
        ctx.fillRect(25, 20, 25, 25);
        
        // Window frames
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        ctx.strokeRect(-50, 20, 25, 25);
        ctx.strokeRect(25, 20, 25, 25);
        
        ctx.restore();
    }

    drawBush(x, y) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(x, y);
        
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(0, 0, 25, 0, Math.PI * 2);
        ctx.arc(-20, 5, 20, 0, Math.PI * 2);
        ctx.arc(20, 5, 20, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#006400';
        ctx.beginPath();
        ctx.arc(-10, -5, 12, 0, Math.PI * 2);
        ctx.arc(15, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    drawFence(x, y, width) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(x, y);
        
        ctx.fillStyle = '#DEB887';
        
        // Horizontal bars
        ctx.fillRect(0, 10, width, 8);
        ctx.fillRect(0, 35, width, 8);
        
        // Vertical posts
        for (let i = 0; i <= width; i += 30) {
            ctx.fillRect(i - 4, 0, 8, 50);
            // Pointed top
            ctx.beginPath();
            ctx.moveTo(i - 4, 0);
            ctx.lineTo(i, -10);
            ctx.lineTo(i + 4, 0);
            ctx.fill();
        }
        
        ctx.restore();
    }

    drawBone(x, y) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(x, y);
        
        ctx.fillStyle = '#FFFAF0';
        
        // Center
        ctx.fillRect(-15, -5, 30, 10);
        
        // Ends
        ctx.beginPath();
        ctx.arc(-15, -8, 6, 0, Math.PI * 2);
        ctx.arc(-15, 8, 6, 0, Math.PI * 2);
        ctx.arc(15, -8, 6, 0, Math.PI * 2);
        ctx.arc(15, 8, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    drawDogBowl(x, y, hasFood = false) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(x, y);
        
        // Bowl
        ctx.fillStyle = '#CD5C5C';
        ctx.beginPath();
        ctx.ellipse(0, 0, 25, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#B22222';
        ctx.beginPath();
        ctx.ellipse(0, 5, 25, 8, 0, 0, Math.PI);
        ctx.fill();
        
        if (hasFood) {
            ctx.fillStyle = '#8B4513';
            ctx.beginPath();
            ctx.ellipse(0, -2, 18, 6, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // "BRAM" text
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 8px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('BRAM', 0, 8);
        
        ctx.restore();
    }
}

// Export for use in game
window.SpriteRenderer = SpriteRenderer;
