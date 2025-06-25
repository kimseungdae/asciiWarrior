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
     * Create plain text output without ANSI colors
     * @param grid ASCII art grid
     * @param character Character data
     * @returns Plain string output
     */
    createPlainTextOutput(grid, character) {
        let output = '';
        // Add character info header
        output += `=== keyWerrior Status ===\n`;
        output += `Level: ${character.level} | Title: ${character.title}\n`;
        output += `Experience: ${character.experience}/${character.maxExp}\n`;
        output += `Combo: x${character.combo}\n`;
        output += `========================\n\n`;
        // Add ASCII art
        for (let row = 0; row < grid.length; row++) {
            let line = '';
            for (let col = 0; col < grid[row].length; col++) {
                line += grid[row][col];
            }
            output += line + '\n';
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
     * Render level up animation
     * @param character Character that leveled up
     * @param oldLevel Previous level
     */
    renderLevelUpAnimation(character, oldLevel) {
        // Clear and show celebration
        this.outputChannel.clear();
        const frames = this.createLevelUpFrames(character, oldLevel);
        // Show animation frames with delay
        let frameIndex = 0;
        const interval = setInterval(() => {
            this.outputChannel.clear();
            this.outputChannel.appendLine(frames[frameIndex]);
            frameIndex++;
            if (frameIndex >= frames.length) {
                clearInterval(interval);
                // Show final character state
                setTimeout(() => {
                    this.render(character);
                }, 1000);
            }
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
        // Frame 3: Character reveal
        frames.push(this.createCharacterRevealFrame(character));
        return frames;
    }
    /**
     * Create celebration frame
     */
    createCelebrationFrame(oldLevel, newLevel) {
        const width = 40;
        const height = 15;
        let frame = '';
        // Create border
        frame += '='.repeat(width) + '\n';
        for (let i = 1; i < height - 1; i++) {
            if (i === 4) {
                frame += '|' + this.centerText('🎉 LEVEL UP! 🎉', width - 2) + '|\n';
            }
            else if (i === 6) {
                frame += '|' + this.centerText(`Level ${oldLevel} → ${newLevel}`, width - 2) + '|\n';
            }
            else if (i === 8) {
                frame += '|' + this.centerText('⚔️ ⭐ ⚔️', width - 2) + '|\n';
            }
            else {
                frame += '|' + ' '.repeat(width - 2) + '|\n';
            }
        }
        frame += '='.repeat(width);
        return frame;
    }
    /**
     * Create title announcement frame
     */
    createTitleFrame(title) {
        const width = 40;
        const height = 15;
        let frame = '';
        // Create border
        frame += '='.repeat(width) + '\n';
        for (let i = 1; i < height - 1; i++) {
            if (i === 4) {
                frame += '|' + this.centerText('👑 NEW TITLE 👑', width - 2) + '|\n';
            }
            else if (i === 6) {
                frame += '|' + this.centerText('─'.repeat(20), width - 2) + '|\n';
            }
            else if (i === 8) {
                frame += '|' + this.centerText(title, width - 2) + '|\n';
            }
            else if (i === 10) {
                frame += '|' + this.centerText('🌟 🏆 🌟', width - 2) + '|\n';
            }
            else {
                frame += '|' + ' '.repeat(width - 2) + '|\n';
            }
        }
        frame += '='.repeat(width);
        return frame;
    }
    /**
     * Create character reveal frame
     */
    createCharacterRevealFrame(character) {
        let frame = '';
        frame += '=== Your Warrior ===\n';
        frame += `Level: ${character.level}\n`;
        frame += `Title: ${character.title}\n`;
        frame += `Experience: ${character.experience}/${character.maxExp}\n`;
        frame += '==================\n\n';
        // Add ASCII art
        const asciiGrid = character.getAsciiArt();
        for (let row = 0; row < asciiGrid.length; row++) {
            let line = '';
            for (let col = 0; col < asciiGrid[row].length; col++) {
                line += asciiGrid[row][col];
            }
            frame += line + '\n';
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
