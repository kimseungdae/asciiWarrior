"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Character = void 0;
class Character {
    constructor() {
        this._level = 1;
        this._experience = 0;
        this._combo = 1;
        this.levelData = [
            { level: 1, minExp: 0, maxExp: 99, title: "견습 전사", emoji: "⚔️" },
            { level: 5, minExp: 100, maxExp: 499, title: "숙련 전사", emoji: "🛡️" },
            { level: 15, minExp: 500, maxExp: 1499, title: "기사", emoji: "🏰" },
            { level: 30, minExp: 1500, maxExp: 2999, title: "전설 전사", emoji: "👑" },
            { level: 50, minExp: 3000, maxExp: Infinity, title: "keyWerrior Master", emoji: "💎" }
        ];
        this._level = 1;
        this._experience = 0;
        this._combo = 1;
    }
    get level() {
        return this._level;
    }
    get experience() {
        return this._experience;
    }
    get combo() {
        return this._combo;
    }
    get maxExp() {
        return this.getCurrentLevelData().maxExp;
    }
    get title() {
        return this.getCurrentLevelData().title;
    }
    get emoji() {
        return this.getCurrentLevelData().emoji;
    }
    get weapon() {
        // Return weapon based on level
        if (this._level >= 50)
            return "💎";
        if (this._level >= 30)
            return "👑";
        if (this._level >= 15)
            return "🏰";
        if (this._level >= 5)
            return "🛡️";
        return "⚔️";
    }
    addExperience(exp) {
        this._experience += exp;
        this.updateLevel();
    }
    // Save and load methods for persistence
    saveToStorage() {
        return {
            level: this._level,
            experience: this._experience,
            combo: this._combo
        };
    }
    loadFromStorage(data) {
        if (data) {
            this._level = data.level || 1;
            this._experience = data.experience || 0;
            this._combo = data.combo || 1;
        }
    }
    setCombo(combo) {
        this._combo = Math.max(1, combo);
    }
    resetCombo() {
        this._combo = 1;
    }
    reset() {
        this._level = 1;
        this._experience = 0;
        this._combo = 1;
    }
    updateLevel() {
        var _a;
        // Find appropriate level based on experience
        for (let i = this.levelData.length - 1; i >= 0; i--) {
            const levelInfo = this.levelData[i];
            if (this._experience >= levelInfo.minExp) {
                // Calculate actual level within the tier
                if (levelInfo.maxExp === Infinity) {
                    // Max tier - calculate level based on experience
                    this._level = Math.max(levelInfo.level, Math.floor((this._experience - levelInfo.minExp) / 100) + levelInfo.level);
                }
                else {
                    // Calculate level within tier
                    const expInTier = this._experience - levelInfo.minExp;
                    const expPerLevel = (levelInfo.maxExp - levelInfo.minExp + 1) /
                        (((_a = this.getNextLevelData(i)) === null || _a === void 0 ? void 0 : _a.level) || levelInfo.level + 1 - levelInfo.level);
                    this._level = Math.max(levelInfo.level, Math.floor(expInTier / expPerLevel) + levelInfo.level);
                }
                break;
            }
        }
    }
    getCurrentLevelData() {
        for (let i = this.levelData.length - 1; i >= 0; i--) {
            if (this._level >= this.levelData[i].level) {
                return this.levelData[i];
            }
        }
        return this.levelData[0];
    }
    getNextLevelData(currentIndex) {
        return currentIndex < this.levelData.length - 1 ? this.levelData[currentIndex + 1] : null;
    }
    // Get character ASCII representation for current level
    getAsciiArt() {
        // Compact format: 10 rows x 120 columns for horizontal layout
        const width = 120;
        const height = 10;
        const grid = Array(height).fill(null).map(() => Array(width).fill(' '));
        // Draw clean horizontal border only (no vertical lines)
        for (let j = 0; j < width; j++) {
            grid[0][j] = '─';
            grid[height - 1][j] = '─';
        }
        // Left section: Character info (40 columns)
        const leftSectionWidth = 40;
        // Draw compact title
        const title = `⚔️ keyWerrior`;
        const titleStart = Math.floor((leftSectionWidth - title.length) / 2);
        for (let i = 0; i < title.length && titleStart + i < leftSectionWidth - 1; i++) {
            grid[1][titleStart + i + 2] = title[i];
        }
        // Draw character emoji with compact aura
        const centerY = Math.floor(height / 2);
        const centerX = Math.floor(leftSectionWidth / 2);
        // Add simplified aura based on level
        if (this._level >= 30) {
            grid[centerY - 1][centerX - 1] = '✧';
            grid[centerY - 1][centerX + 1] = '✧';
        }
        else if (this._level >= 15) {
            grid[centerY][centerX - 2] = '★';
            grid[centerY][centerX + 2] = '★';
        }
        else if (this._level >= 5) {
            grid[centerY][centerX - 1] = '·';
            grid[centerY][centerX + 1] = '·';
        }
        grid[centerY][centerX] = this.emoji;
        // Draw compact level and title info
        const levelText = `Lv.${this._level} ${this.title}`;
        const levelStart = Math.floor((leftSectionWidth - levelText.length) / 2);
        for (let i = 0; i < levelText.length && levelStart + i < leftSectionWidth - 1; i++) {
            grid[centerY + 2][levelStart + i + 2] = levelText[i];
        }
        // Middle section: Clean horizontal separator instead of vertical
        for (let j = leftSectionWidth; j < leftSectionWidth + 3; j++) {
            grid[Math.floor(height / 2)][j] = '─';
        }
        // Right section: Compact experience and stats
        const rightSectionStart = leftSectionWidth + 5;
        const rightSectionWidth = width - rightSectionStart - 2;
        // Compact experience info
        const expText = `EXP: ${this._experience}/${this.maxExp === Infinity ? '∞' : this.maxExp}`;
        for (let i = 0; i < expText.length && i < rightSectionWidth; i++) {
            grid[2][rightSectionStart + i] = expText[i];
        }
        // Draw compact horizontal EXP progress bar
        const barWidth = Math.min(rightSectionWidth - 2, 60);
        const maxExpDisplay = this.maxExp === Infinity ? 9999 : this.maxExp;
        const expPercent = Math.min(this._experience / maxExpDisplay, 1);
        const filledWidth = Math.floor(barWidth * expPercent);
        grid[3][rightSectionStart] = '[';
        for (let i = 0; i < barWidth; i++) {
            grid[3][rightSectionStart + 1 + i] = i < filledWidth ? '■' : '□';
        }
        grid[3][rightSectionStart + barWidth + 1] = ']';
        // Compact combo and weapon info
        const statsText = `콤보 x${this._combo} | 무기 ${this.weapon}`;
        for (let i = 0; i < statsText.length && i < rightSectionWidth; i++) {
            grid[5][rightSectionStart + i] = statsText[i];
        }
        // Add combo sparkles if high combo
        if (this._combo >= 5) {
            grid[5][rightSectionStart - 2] = '✨';
        }
        // Compact tip at bottom
        const tipText = `💡 연속 타이핑으로 콤보업!`;
        for (let i = 0; i < tipText.length && i < rightSectionWidth; i++) {
            grid[height - 2][rightSectionStart + i] = tipText[i];
        }
        return grid;
    }
}
exports.Character = Character;
