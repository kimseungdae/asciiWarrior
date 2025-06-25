export interface AnimationFrame {
    content: string;
    duration: number; // milliseconds
}

export class AnimationEngine {
    /**
     * Create level-up animation frames
     * @param oldLevel Previous level
     * @param newLevel New level
     * @param newTitle New character title
     * @returns Array of animation frames
     */
    static createLevelUpAnimation(oldLevel: number, newLevel: number, newTitle: string): AnimationFrame[] {
        const frames: AnimationFrame[] = [];

        // Frame 1: Explosion effect
        frames.push({
            content: this.createExplosionFrame(),
            duration: 600
        });

        // Frame 2: Level announcement
        frames.push({
            content: this.createLevelAnnouncementFrame(oldLevel, newLevel),
            duration: 800
        });

        // Frame 3: Title reveal
        frames.push({
            content: this.createTitleRevealFrame(newTitle),
            duration: 800
        });

        // Frame 4: Sparkle effect
        frames.push({
            content: this.createSparkleFrame(),
            duration: 600
        });

        return frames;
    }

    /**
     * Create combo animation frames
     * @param comboLevel Current combo level
     * @returns Array of animation frames
     */
    static createComboAnimation(comboLevel: number): AnimationFrame[] {
        const frames: AnimationFrame[] = [];

        if (comboLevel >= 2) {
            frames.push({
                content: this.createComboFrame(comboLevel),
                duration: 400
            });
        }

        return frames;
    }

    /**
     * Create explosion effect frame
     */
    private static createExplosionFrame(): string {
        const width = 40;
        const height = 40;
        let frame = '';

        const explosionChars = ['*', '+', 'x', 'o', '#'];

        for (let y = 0; y < height; y++) {
            let line = '';
            for (let x = 0; x < width; x++) {
                if (y === 0 || y === height - 1 || x === 0 || x === width - 1) {
                    line += '=';
                } else if (Math.random() < 0.3) {
                    line += explosionChars[Math.floor(Math.random() * explosionChars.length)];
                } else {
                    line += ' ';
                }
            }
            frame += line + '\n';
        }

        return frame;
    }

    /**
     * Create level announcement frame
     */
    private static createLevelAnnouncementFrame(oldLevel: number, newLevel: number): string {
        const width = 40;
        const height = 15;
        let frame = '';

        // Create border
        frame += '='.repeat(width) + '\n';

        for (let i = 1; i < height - 1; i++) {
            let line = '|';
            
            if (i === 4) {
                line += this.centerText('🎉 LEVEL UP! 🎉', width - 2);
            } else if (i === 6) {
                line += this.centerText('─'.repeat(20), width - 2);
            } else if (i === 8) {
                line += this.centerText(`LEVEL ${oldLevel} → ${newLevel}`, width - 2);
            } else if (i === 10) {
                line += this.centerText('─'.repeat(20), width - 2);
            } else if (i === 12) {
                line += this.centerText('⚔️ ⭐ ⚔️', width - 2);
            } else {
                line += ' '.repeat(width - 2);
            }
            
            line += '|\n';
            frame += line;
        }

        frame += '='.repeat(width);
        return frame;
    }

    /**
     * Create title reveal frame
     */
    private static createTitleRevealFrame(title: string): string {
        const width = 40;
        const height = 15;
        let frame = '';

        // Create border
        frame += '='.repeat(width) + '\n';

        for (let i = 1; i < height - 1; i++) {
            let line = '|';
            
            if (i === 4) {
                line += this.centerText('👑 NEW TITLE 👑', width - 2);
            } else if (i === 6) {
                line += this.centerText('═'.repeat(20), width - 2);
            } else if (i === 8) {
                line += this.centerText(title, width - 2);
            } else if (i === 10) {
                line += this.centerText('═'.repeat(20), width - 2);
            } else if (i === 12) {
                line += this.centerText('🌟 🏆 🌟', width - 2);
            } else {
                line += ' '.repeat(width - 2);
            }
            
            line += '|\n';
            frame += line;
        }

        frame += '='.repeat(width);
        return frame;
    }

    /**
     * Create sparkle effect frame
     */
    private static createSparkleFrame(): string {
        const width = 40;
        const height = 15;
        let frame = '';

        const sparkleChars = ['*', '+', '.', 'o', '^'];
        
        for (let y = 0; y < height; y++) {
            let line = '';
            for (let x = 0; x < width; x++) {
                if (y === 0 || y === height - 1 || x === 0 || x === width - 1) {
                    line += '=';
                } else if ((x + y) % 3 === 0 && Math.random() < 0.4) {
                    line += sparkleChars[Math.floor(Math.random() * sparkleChars.length)];
                } else {
                    line += ' ';
                }
            }
            frame += line + '\n';
        }

        return frame;
    }

    /**
     * Create combo frame
     */
    private static createComboFrame(comboLevel: number): string {
        const width = 30;
        const height = 8;
        let frame = '';

        // Create compact combo display
        frame += '┌' + '─'.repeat(width - 2) + '┐\n';
        
        for (let i = 1; i < height - 1; i++) {
            let line = '│';
            
            if (i === 2) {
                line += this.centerText('🔥 COMBO! 🔥', width - 2);
            } else if (i === 4) {
                line += this.centerText(`x${comboLevel} MULTIPLIER`, width - 2);
            } else {
                line += ' '.repeat(width - 2);
            }
            
            line += '│\n';
            frame += line;
        }

        frame += '└' + '─'.repeat(width - 2) + '┘';
        return frame;
    }

    /**
     * Center text within given width
     */
    private static centerText(text: string, width: number): string {
        if (text.length >= width) {
            return text.substring(0, width);
        }
        
        const padding = Math.floor((width - text.length) / 2);
        const leftPad = ' '.repeat(padding);
        const rightPad = ' '.repeat(width - text.length - padding);
        
        return leftPad + text + rightPad;
    }

    /**
     * Play animation sequence
     * @param frames Animation frames to play
     * @param callback Function to call with each frame content
     * @param onComplete Function to call when animation completes
     */
    static playAnimation(
        frames: AnimationFrame[], 
        callback: (content: string) => void,
        onComplete?: () => void
    ): void {
        let currentFrame = 0;

        const playNextFrame = () => {
            if (currentFrame >= frames.length) {
                if (onComplete) {
                    onComplete();
                }
                return;
            }

            const frame = frames[currentFrame];
            callback(frame.content);
            
            currentFrame++;
            setTimeout(playNextFrame, frame.duration);
        };

        playNextFrame();
    }

    /**
     * Create typing effect animation
     * @param text Text to animate
     * @param speed Speed of typing effect (ms per character)
     * @returns Array of animation frames
     */
    static createTypingEffect(text: string, speed: number = 100): AnimationFrame[] {
        const frames: AnimationFrame[] = [];
        
        for (let i = 1; i <= text.length; i++) {
            frames.push({
                content: text.substring(0, i) + '|', // Cursor effect
                duration: speed
            });
        }
        
        // Final frame without cursor
        frames.push({
            content: text,
            duration: 500
        });

        return frames;
    }
}