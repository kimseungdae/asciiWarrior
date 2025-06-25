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
        // Simple ASCII art based on level
        // This is a 20x20 grid using ■ characters
        const grid = Array(20).fill(null).map(() => Array(20).fill(' '));
        // Draw border
        for (let i = 0; i < 20; i++) {
            grid[0][i] = '■';
            grid[19][i] = '■';
            grid[i][0] = '■';
            grid[i][19] = '■';
        }
        // Draw title
        const title = `keyWerrior`;
        const titleStart = Math.floor((20 - title.length) / 2);
        for (let i = 0; i < title.length && titleStart + i < 19; i++) {
            grid[1][titleStart + i] = title[i];
        }
        // Draw character emoji in center
        const centerY = 8;
        const centerX = 9;
        grid[centerY][centerX] = this.emoji;
        // Draw level info
        const levelText = `LV.${this._level} ${this.title}`;
        if (levelText.length < 18) {
            for (let i = 0; i < levelText.length; i++) {
                grid[15][i + 1] = levelText[i];
            }
        }
        // Draw EXP bar
        const expText = `EXP: ${this._experience}/${this.maxExp === Infinity ? '∞' : this.maxExp}`;
        if (expText.length < 18) {
            for (let i = 0; i < expText.length; i++) {
                grid[16][i + 1] = expText[i];
            }
        }
        // Draw combo
        const comboText = `콤보: x${this._combo}`;
        if (comboText.length < 18) {
            for (let i = 0; i < comboText.length; i++) {
                grid[17][i + 1] = comboText[i];
            }
        }
        return grid;
    }
}
exports.Character = Character;
