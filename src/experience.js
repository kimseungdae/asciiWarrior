"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExperienceSystem = void 0;
class ExperienceSystem {
    constructor() {
        this.lastTypingTime = 0;
        this.currentCombo = 1;
        this.comboTimeout = 5000; // 5 seconds
        this.comboMultipliers = [1, 1.5, 2, 3]; // x1, x1.5, x2, x3 max
        this.reset();
    }
    /**
     * Process typing event and return experience gained
     * @param typedChars Number of characters typed
     * @returns Experience points gained
     */
    processTyping(typedChars) {
        const now = Date.now();
        // Check if combo should continue
        if (now - this.lastTypingTime <= this.comboTimeout) {
            // Continue combo - increase multiplier
            this.currentCombo = Math.min(this.currentCombo + 1, this.comboMultipliers.length);
        }
        else {
            // Combo broken - reset to base
            this.currentCombo = 1;
        }
        this.lastTypingTime = now;
        // Calculate base experience (1 per character)
        const baseExp = typedChars;
        // Apply combo multiplier
        const multiplier = this.getComboMultiplier();
        const totalExp = Math.floor(baseExp * multiplier);
        return totalExp;
    }
    /**
     * Get current combo level (1-4)
     */
    getCurrentCombo() {
        return this.currentCombo;
    }
    /**
     * Get current combo multiplier
     */
    getComboMultiplier() {
        return this.comboMultipliers[this.currentCombo - 1] || 1;
    }
    /**
     * Check if combo is still active based on time
     */
    isComboActive() {
        return (Date.now() - this.lastTypingTime) <= this.comboTimeout;
    }
    /**
     * Force break combo
     */
    breakCombo() {
        this.currentCombo = 1;
        this.lastTypingTime = 0;
    }
    /**
     * Reset experience system
     */
    reset() {
        this.currentCombo = 1;
        this.lastTypingTime = 0;
    }
    /**
     * Get time remaining for combo (in milliseconds)
     */
    getComboTimeRemaining() {
        if (!this.isComboActive()) {
            return 0;
        }
        return Math.max(0, this.comboTimeout - (Date.now() - this.lastTypingTime));
    }
    /**
     * Get combo status information
     */
    getComboStatus() {
        return {
            level: this.currentCombo,
            multiplier: this.getComboMultiplier(),
            isActive: this.isComboActive(),
            timeRemaining: this.getComboTimeRemaining()
        };
    }
    /**
     * Calculate experience needed for next level
     * @param currentLevel Current character level
     * @returns Experience needed for next level
     */
    static getExpForLevel(level) {
        if (level <= 4)
            return 100; // Levels 1-4: 0-99
        if (level <= 14)
            return 500; // Levels 5-14: 100-499
        if (level <= 29)
            return 1500; // Levels 15-29: 500-1499
        if (level <= 49)
            return 3000; // Levels 30-49: 1500-2999
        return 3000 + (level - 49) * 100; // Level 50+: 3000+ (100 per level)
    }
    /**
     * Calculate level from experience points
     * @param experience Total experience points
     * @returns Character level
     */
    static getLevelFromExp(experience) {
        if (experience < 100)
            return Math.floor(experience / 25) + 1; // Levels 1-4
        if (experience < 500)
            return Math.floor((experience - 100) / 40) + 5; // Levels 5-14
        if (experience < 1500)
            return Math.floor((experience - 500) / 67) + 15; // Levels 15-29
        if (experience < 3000)
            return Math.floor((experience - 1500) / 75) + 30; // Levels 30-49
        return Math.floor((experience - 3000) / 100) + 50; // Level 50+
    }
}
exports.ExperienceSystem = ExperienceSystem;
