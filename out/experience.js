"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExperienceSystem = void 0;
class ExperienceSystem {
    constructor() {
        this.lastTypingTime = 0;
        this.currentCombo = 1;
        this.comboTimeout = 3000; // 3 seconds for more dynamic gameplay
        this.comboMultipliers = [1, 1.2, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0]; // Extended combo system
        this.consecutiveTyping = 0;
        this.perfectComboStreak = 0;
        this.reset();
    }
    /**
     * Process typing event and return experience gained with enhanced combo system
     * @param typedChars Number of characters typed
     * @returns Experience points gained
     */
    processTyping(typedChars) {
        const now = Date.now();
        const timeSinceLastType = now - this.lastTypingTime;
        // Check if combo should continue
        if (this.lastTypingTime > 0 && timeSinceLastType <= this.comboTimeout) {
            // Continue combo - increase multiplier
            this.currentCombo = Math.min(this.currentCombo + 1, this.comboMultipliers.length);
            this.consecutiveTyping++;
            // Perfect timing bonus (typed within 1 second)
            if (timeSinceLastType < 1000) {
                this.perfectComboStreak++;
            }
            else {
                this.perfectComboStreak = 0;
            }
        }
        else {
            // Combo broken or first typing - reset to base
            this.currentCombo = 1;
            this.consecutiveTyping = 1;
            this.perfectComboStreak = 0;
        }
        this.lastTypingTime = now;
        // Calculate base experience (1 per character)
        let baseExp = typedChars;
        // Apply combo multiplier
        const multiplier = this.getComboMultiplier();
        let totalExp = Math.floor(baseExp * multiplier);
        // Perfect combo streak bonus
        if (this.perfectComboStreak >= 5) {
            totalExp = Math.floor(totalExp * 1.5); // 50% bonus for perfect streak
        }
        // Consecutive typing milestone bonuses
        if (this.consecutiveTyping % 10 === 0) {
            totalExp += 5; // Milestone bonus
        }
        return Math.max(1, totalExp); // Ensure at least 1 exp
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
        this.consecutiveTyping = 0;
        this.perfectComboStreak = 0;
    }
    // Save and load methods for persistence
    saveToStorage() {
        return {
            currentCombo: this.currentCombo,
            lastTypingTime: this.lastTypingTime,
            consecutiveTyping: this.consecutiveTyping,
            perfectComboStreak: this.perfectComboStreak
        };
    }
    loadFromStorage(data) {
        if (data) {
            this.currentCombo = data.currentCombo || 1;
            this.lastTypingTime = data.lastTypingTime || 0;
            this.consecutiveTyping = data.consecutiveTyping || 0;
            this.perfectComboStreak = data.perfectComboStreak || 0;
        }
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
     * Get enhanced combo status information
     */
    getComboStatus() {
        return {
            level: this.currentCombo,
            multiplier: this.getComboMultiplier(),
            isActive: this.isComboActive(),
            timeRemaining: this.getComboTimeRemaining(),
            consecutiveTyping: this.consecutiveTyping,
            perfectStreak: this.perfectComboStreak,
            nextMilestone: 10 - (this.consecutiveTyping % 10)
        };
    }
    /**
     * Get current consecutive typing count
     */
    getConsecutiveTyping() {
        return this.consecutiveTyping;
    }
    /**
     * Get perfect combo streak
     */
    getPerfectStreak() {
        return this.perfectComboStreak;
    }
    /**
     * Check if player has achieved a perfect streak bonus
     */
    hasPerfectStreakBonus() {
        return this.perfectComboStreak >= 5;
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
