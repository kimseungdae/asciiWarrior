"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Renderer = void 0;
class Renderer {
    constructor(outputChannel) {
        this.outputChannel = outputChannel;
    }
    /**
     * Render character to output channel
     * @param character Character to render
     */
    render(character) {
        this.outputChannel.clear();
        // Get ASCII art grid
        const asciiGrid = character.getAsciiArt();
        // Render as plain text
        const output = this.createPlainTextOutput(asciiGrid, character);
        // Output to channel
        this.outputChannel.appendLine(output);
    }
    /**
     * Create enhanced plain text output with better formatting
     * @param grid ASCII art grid
     * @param character Character data
     * @returns Plain string output
     */
    createPlainTextOutput(grid, character) {
        let output = '';
        // Add ASCII art with optimized rendering
        for (let row = 0; row < grid.length; row++) {
            let line = '';
            for (let col = 0; col < grid[row].length; col++) {
                // Use consistent character rendering to avoid line breaks
                const char = grid[row][col];
                line += char === ' ' ? ' ' : char;
            }
            // Remove trailing spaces and add newline
            output += line.replace(/\s+$/, '') + '\n';
        }
        return output;
    }
    /**
     * Check if character is text (not space or border)
     * @param char Character to check
     * @returns True if it's a text character
     */
    isTextChar(char) {
        return char !== ' ' && char !== '■' && char.length === 1 && !!char.match(/[a-zA-Z0-9가-힣.:]/);
    }
    /**
     * Render enhanced level up animation with multiple effects
     * @param character Character that leveled up
     * @param oldLevel Previous level
     */
    renderLevelUpAnimation(character, oldLevel) {
        // Clear and show celebration
        this.outputChannel.clear();
        const frames = this.createLevelUpFrames(character, oldLevel);
        // Show animation frames with variable timing
        let frameIndex = 0;
        const showNextFrame = () => {
            if (frameIndex < frames.length) {
                this.outputChannel.clear();
                this.outputChannel.appendLine(frames[frameIndex]);
                frameIndex++;
                // Variable timing for better effect
                const delay = frameIndex === 1 ? 1000 : frameIndex === 2 ? 800 : 600;
                setTimeout(showNextFrame, delay);
            }
            else {
                // Show final character state with sparkle effect
                setTimeout(() => {
                    this.renderWithSparkles(character);
                    setTimeout(() => {
                        this.render(character);
                    }, 1500);
                }, 500);
            }
        };
        showNextFrame();
    }
    /**
     * Render character with sparkle effects
     * @param character Character to render with effects
     */
    renderWithSparkles(character) {
        this.outputChannel.clear();
        const grid = character.getAsciiArt();
        const output = this.createSparkleOutput(grid, character);
        this.outputChannel.appendLine(output);
    }
    /**
     * Create output with sparkle effects around the character (optimized)
     * @param grid ASCII art grid
     * @param character Character data
     * @returns Formatted output string with sparkles
     */
    createSparkleOutput(grid, character) {
        let output = '';
        // Compact header with sparkles using only horizontal lines
        const headerWidth = 60;
        output += '─'.repeat(headerWidth) + '\n';
        output += this.centerText('✨🗡️ 레벨업! 🗡️✨', headerWidth) + '\n';
        output += '─'.repeat(headerWidth) + '\n';
        output += this.centerText('🎉 축하합니다! 새로운 힘을 얻었습니다! 🎉', headerWidth) + '\n';
        output += '─'.repeat(headerWidth) + '\n\n';
        // Add ASCII art with optimized sparkles
        const sparkles = ['✨', '⭐', '🌟', '💫'];
        for (let row = 0; row < grid.length; row++) {
            let line = '';
            // Add occasional sparkles on sides (reduced frequency for cleaner look)
            if (Math.random() < 0.2) {
                line = sparkles[Math.floor(Math.random() * sparkles.length)] + ' ';
            }
            else {
                line = '  ';
            }
            for (let col = 0; col < grid[row].length; col++) {
                const char = grid[row][col];
                line += char === ' ' ? ' ' : char;
            }
            // Add sparkles on right side occasionally
            if (Math.random() < 0.2) {
                line += ' ' + sparkles[Math.floor(Math.random() * sparkles.length)];
            }
            output += line.replace(/\s+$/, '') + '\n';
        }
        output += '\n' + '─'.repeat(headerWidth) + '\n';
        output += this.centerText('🎊 레벨업 완료! 계속 타이핑해서 더 강해지세요! 🎊', headerWidth) + '\n';
        output += '─'.repeat(headerWidth) + '\n';
        return output;
    }
    /**
     * Render typing effect animation
     * @param character Character to show typing effect for
     */
    renderTypingEffect(character) {
        const grid = character.getAsciiArt();
        let output = this.createPlainTextOutput(grid, character);
        // Add animated dots
        const dots = ['', '.', '..', '...'];
        let dotIndex = 0;
        const animateTyping = () => {
            this.outputChannel.clear();
            this.outputChannel.appendLine(output + dots[dotIndex]);
            dotIndex = (dotIndex + 1) % dots.length;
        };
        // Show typing animation briefly
        const interval = setInterval(animateTyping, 200);
        setTimeout(() => {
            clearInterval(interval);
            this.render(character); // Return to normal display
        }, 800);
    }
    /**
     * Create level up animation frames
     * @param character New character state
     * @param oldLevel Previous level
     * @returns Array of animation frame strings
     */
    createLevelUpFrames(character, oldLevel) {
        const frames = [];
        // Frame 1: Celebration
        frames.push(this.createCelebrationFrame(oldLevel, character.level));
        // Frame 2: New title announcement
        frames.push(this.createTitleFrame(character.title));
        // Frame 3: Character reveal with consistent formatting
        frames.push(this.createCharacterRevealFrame(character));
        return frames;
    }
    /**
     * Create celebration frame with consistent borders
     */
    createCelebrationFrame(oldLevel, newLevel) {
        const width = 50;
        const height = 8;
        let frame = '';
        // Create clean border using only horizontal lines
        frame += '─'.repeat(width) + '\n';
        for (let i = 1; i < height - 1; i++) {
            if (i === 2) {
                frame += this.centerText('🎉 레벨업 🎉', width) + '\n';
            }
            else if (i === 3) {
                frame += this.centerText(`레벨 ${oldLevel} → ${newLevel}`, width) + '\n';
            }
            else if (i === 4) {
                frame += this.centerText('⚔️ ⭐ ⚔️', width) + '\n';
            }
            else {
                frame += ' '.repeat(width) + '\n';
            }
        }
        frame += '─'.repeat(width);
        return frame;
    }
    /**
     * Create title announcement frame with consistent formatting
     */
    createTitleFrame(title) {
        const width = 50;
        const height = 8;
        let frame = '';
        // Create clean border using only horizontal lines
        frame += '─'.repeat(width) + '\n';
        for (let i = 1; i < height - 1; i++) {
            if (i === 2) {
                frame += this.centerText('👑 NEW TITLE 👑', width) + '\n';
            }
            else if (i === 3) {
                frame += this.centerText('─'.repeat(20), width) + '\n';
            }
            else if (i === 4) {
                frame += this.centerText(title, width) + '\n';
            }
            else if (i === 5) {
                frame += this.centerText('🌟 🏆 🌟', width) + '\n';
            }
            else {
                frame += ' '.repeat(width) + '\n';
            }
        }
        frame += '─'.repeat(width);
        return frame;
    }
    /**
     * Create character reveal frame with optimized rendering
     */
    createCharacterRevealFrame(character) {
        let frame = '';
        frame += '─'.repeat(24) + '\n';
        frame += this.centerText('Your Warrior', 24) + '\n';
        frame += '─'.repeat(24) + '\n';
        const levelStr = character.level.toString();
        const titleStr = character.title;
        const expStr = `${character.experience}/${character.maxExp === Infinity ? '∞' : character.maxExp}`;
        frame += this.centerText(`Level: ${levelStr}`, 24) + '\n';
        frame += this.centerText(`Title: ${titleStr}`, 24) + '\n';
        frame += this.centerText(`EXP: ${expStr}`, 24) + '\n';
        frame += '─'.repeat(24) + '\n\n';
        // Add ASCII art with consistent formatting
        const asciiGrid = character.getAsciiArt();
        for (let row = 0; row < asciiGrid.length; row++) {
            let line = '';
            for (let col = 0; col < asciiGrid[row].length; col++) {
                const char = asciiGrid[row][col];
                line += char === ' ' ? ' ' : char;
            }
            frame += line.replace(/\s+$/, '') + '\n';
        }
        return frame;
    }
    /**
     * Center text within given width
     */
    centerText(text, width) {
        if (text.length >= width) {
            return text.substring(0, width);
        }
        const padding = Math.floor((width - text.length) / 2);
        const leftPad = ' '.repeat(padding);
        const rightPad = ' '.repeat(width - text.length - padding);
        return leftPad + text + rightPad;
    }
    /**
     * Show combo status in output
     */
    showComboStatus(combo, isActive) {
        if (combo >= 2 && isActive) {
            this.outputChannel.appendLine(`🔥 COMBO x${combo}! Keep typing! 🔥`);
        }
    }
}
exports.Renderer = Renderer;
