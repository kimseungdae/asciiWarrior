export interface CharacterLevel {
    level: number;
    minExp: number;
    maxExp: number;
    title: string;
    emoji: string;
}

export class Character {
    private _level: number = 1;
    private _experience: number = 0;
    private _combo: number = 1;
    private _hp: number = 100;
    private _maxHp: number = 100;
    private _mp: number = 50;
    private _maxMp: number = 50;
    private _position: { x: number, y: number } = { x: 5, y: 5 };
    private _currentMonster: Monster | null = null;
    private _inBattle: boolean = false;
    private _animationFrame: number = 0;
    
    private levelData: CharacterLevel[] = [
        { level: 1, minExp: 0, maxExp: 99, title: "견습 전사", emoji: "⚔️" },
        { level: 5, minExp: 100, maxExp: 499, title: "숙련 전사", emoji: "🛡️" },
        { level: 15, minExp: 500, maxExp: 1499, title: "기사", emoji: "🏰" },
        { level: 30, minExp: 1500, maxExp: 2999, title: "전설 전사", emoji: "👑" },
        { level: 50, minExp: 3000, maxExp: Infinity, title: "keyWerrior Master", emoji: "💎" }
    ];

    constructor() {
        this.updateLevel();
    }

    get level(): number {
        return this._level;
    }

    get experience(): number {
        return this._experience;
    }

    get combo(): number {
        return this._combo;
    }

    get hp(): number {
        return this._hp;
    }

    get maxHp(): number {
        return this._maxHp;
    }

    get mp(): number {
        return this._mp;
    }

    get maxMp(): number {
        return this._maxMp;
    }

    get position(): { x: number, y: number } {
        return this._position;
    }

    get currentMonster(): Monster | null {
        return this._currentMonster;
    }

    get inBattle(): boolean {
        return this._inBattle;
    }

    get animationFrame(): number {
        return this._animationFrame;
    }

    get maxExp(): number {
        if (this._level >= 50) return Infinity;
        return this._level * 100 + (this._level - 1) * 50;
    }

    get title(): string {
        if (this._level >= 50) return '『전설의 용사』';
        if (this._level >= 30) return '『드래곤 슬레이어』';
        if (this._level >= 20) return '『마법검사』';
        if (this._level >= 15) return '『기사』';
        if (this._level >= 10) return '『전사』';
        if (this._level >= 5) return '『견습 전사』';
        return '『초보자』';
    }

    get emoji(): string {
        // Animation frames for character movement
        const frames = ['⚔️', '🗡️', '⚔️', '🛡️'];
        return frames[this._animationFrame % frames.length];
    }

    get weapon(): string {
        if (this._level >= 30) return '🗡️ 드래곤 소드';
        if (this._level >= 20) return '⚔️ 마법검';
        if (this._level >= 15) return '🗡️ 기사의 검';
        if (this._level >= 10) return '⚔️ 강철검';
        if (this._level >= 5) return '🗡️ 철검';
        return '🔪 나무검';
    }

    takeDamage(damage: number): void {
        this._hp = Math.max(0, this._hp - damage);
        if (this._hp === 0) {
            this.die();
        }
    }

    heal(amount: number): void {
        this._hp = Math.min(this._maxHp, this._hp + amount);
    }

    useMp(amount: number): boolean {
        if (this._mp >= amount) {
            this._mp -= amount;
            return true;
        }
        return false;
    }

    restoreMp(amount: number): void {
        this._mp = Math.min(this._maxMp, this._mp + amount);
    }

    private die(): void {
        console.log('💀 캐릭터가 쓰러졌습니다! 부활 중...');
        this._hp = Math.floor(this._maxHp * 0.5);
        this._mp = Math.floor(this._maxMp * 0.5);
        this._inBattle = false;
        this._currentMonster = null;
    }

    moveCharacter(): void {
        this._animationFrame = (this._animationFrame + 1) % 4;
        
        // Random movement during battle
        if (this._inBattle) {
            this._position.x = Math.max(1, Math.min(8, this._position.x + (Math.random() > 0.5 ? 1 : -1)));
        }
    }

    startBattle(): void {
        if (!this._inBattle) {
            this._currentMonster = this.generateMonster();
            this._inBattle = true;
            console.log(`⚔️ ${this._currentMonster.name}과(와) 전투 시작!`);
        }
    }

    attack(): number {
        if (!this._inBattle || !this._currentMonster) return 0;

        const baseDamage = Math.floor(this._level * 10 + Math.random() * 20);
        const criticalHit = Math.random() < 0.2; // 20% 크리티컬 확률
        const damage = criticalHit ? baseDamage * 2 : baseDamage;

        this._currentMonster.takeDamage(damage);
        
        if (criticalHit) {
            console.log(`💥 크리티컬 히트! ${damage} 데미지!`);
        }

        if (this._currentMonster.hp <= 0) {
            this.winBattle();
        } else {
            // Monster counter-attack
            const monsterDamage = Math.floor(this._currentMonster.level * 5 + Math.random() * 15);
            this.takeDamage(monsterDamage);
            console.log(`🐺 ${this._currentMonster.name}의 반격! ${monsterDamage} 데미지!`);
        }

        return damage;
    }

    private winBattle(): void {
        if (!this._currentMonster) return;

        const expGain = this._currentMonster.level * 25;
        console.log(`🎉 ${this._currentMonster.name}을(를) 처치했습니다! +${expGain} EXP`);
        
        this.addExperience(expGain);
        this._inBattle = false;
        this._currentMonster = null;
        
        // Restore some HP/MP after victory
        this.heal(Math.floor(this._maxHp * 0.1));
        this.restoreMp(Math.floor(this._maxMp * 0.2));
    }

    private generateMonster(): Monster {
        const monsterTypes = [
            { name: '🐺 늑대', level: Math.max(1, this._level - 2) },
            { name: '🐻 곰', level: Math.max(1, this._level - 1) },
            { name: '🐲 드래곤', level: this._level + 2 },
            { name: '👹 오크', level: this._level },
            { name: '🕷️ 거미', level: Math.max(1, this._level - 3) },
            { name: '🦇 박쥐', level: Math.max(1, this._level - 4) }
        ];

        const randomMonster = monsterTypes[Math.floor(Math.random() * monsterTypes.length)];
        return new Monster(randomMonster.name, randomMonster.level);
    }

    addExperience(amount: number): void {
        this._experience += amount;
        this.updateLevel();
        
        // Random battle chance (10% per typing)
        if (!this._inBattle && Math.random() < 0.1) {
            this.startBattle();
        }
    }

    private updateLevel(): void {
        const oldLevel = this._level;
        while (this._experience >= this.maxExp && this.maxExp !== Infinity) {
            this._experience -= this.maxExp;
            this._level++;
            
            // Level up bonuses
            const hpIncrease = Math.floor(this._level * 10 + Math.random() * 20);
            const mpIncrease = Math.floor(this._level * 5 + Math.random() * 10);
            
            this._maxHp += hpIncrease;
            this._maxMp += mpIncrease;
            this._hp = this._maxHp; // Full heal on level up
            this._mp = this._maxMp; // Full MP restore on level up
            
            console.log(`🎊 레벨업! ${oldLevel} → ${this._level} (HP +${hpIncrease}, MP +${mpIncrease})`);
        }
    }

    reset(): void {
        this._level = 1;
        this._experience = 0;
        this._combo = 1;
        this._hp = 100;
        this._maxHp = 100;
        this._mp = 50;
        this._maxMp = 50;
        this._position = { x: 5, y: 5 };
        this._currentMonster = null;
        this._inBattle = false;
        this._animationFrame = 0;
        this.updateLevel();
    }

    saveToStorage(): any {
        return {
            level: this._level,
            experience: this._experience,
            combo: this._combo,
            hp: this._hp,
            maxHp: this._maxHp,
            mp: this._mp,
            maxMp: this._maxMp,
            position: this._position,
            inBattle: this._inBattle,
            animationFrame: this._animationFrame
        };
    }

    loadFromStorage(data: any): void {
        if (data) {
            this._level = data.level || 1;
            this._experience = data.experience || 0;
            this._combo = data.combo || 1;
            this._hp = data.hp || 100;
            this._maxHp = data.maxHp || 100;
            this._mp = data.mp || 50;
            this._maxMp = data.maxMp || 50;
            this._position = data.position || { x: 5, y: 5 };
            this._inBattle = data.inBattle || false;
            this._animationFrame = data.animationFrame || 0;
        }
    }

    setCombo(combo: number): void {
        this._combo = combo;
    }

    resetCombo(): void {
        this._combo = 1;
    }

    getAsciiArt(): string[][] {
        // Enhanced format: 12 rows x 120 columns for battle display
        const width = 120;
        const height = 12;
        const grid: string[][] = Array(height).fill(null).map(() => Array(width).fill(' '));
        
        // Draw clean horizontal border only
        for (let j = 0; j < width; j++) {
            grid[0][j] = '═';
            grid[height - 1][j] = '═';
        }
        
        // Title section
        const titleText = `🗡️ keyWerrior Lv.${this._level} ${this.title}`;
        const titleStart = Math.floor((width - titleText.length) / 2);
        for (let i = 0; i < titleText.length && titleStart + i < width; i++) {
            grid[1][titleStart + i] = titleText[i];
        }

        // HP Bar
        const hpText = `❤️`.repeat(Math.ceil(this._hp / this._maxHp * 5)) + ` HP: ${this._hp}/${this._maxHp}`;
        for (let i = 0; i < hpText.length && i < 40; i++) {
            grid[2][2 + i] = hpText[i];
        }

        // MP Bar
        const mpText = `⚡ MP: ${this._mp}/${this._maxMp}`;
        for (let i = 0; i < mpText.length && i < 40; i++) {
            grid[2][50 + i] = mpText[i];
        }

        // Battle section
        if (this._inBattle && this._currentMonster) {
            // Monster on left
            const monsterX = 5;
            const monsterY = 5;
            grid[monsterY][monsterX] = this._currentMonster.emoji;
            grid[monsterY + 1][monsterX - 2] = '(';
            const monsterName = this._currentMonster.name;
            for (let i = 0; i < monsterName.length && i < 15; i++) {
                grid[monsterY + 1][monsterX - 1 + i] = monsterName[i];
            }
            grid[monsterY + 1][monsterX + monsterName.length] = ')';

            // VS text
            grid[monsterY][width / 2 - 1] = 'v';
            grid[monsterY][width / 2] = 's';

            // Player character on right (with animation)
            const playerX = width - 15;
            const playerY = 5;
            grid[playerY][playerX + this._position.x] = this.emoji;
            grid[playerY + 1][playerX + this._position.x - 2] = '(';
            grid[playerY + 1][playerX + this._position.x - 1] = 'Y';
            grid[playerY + 1][playerX + this._position.x] = 'o';
            grid[playerY + 1][playerX + this._position.x + 1] = 'u';
            grid[playerY + 1][playerX + this._position.x + 2] = ')';

            // Monster HP
            const monsterHpText = `${this._currentMonster.name} HP: ${this._currentMonster.hp}/${this._currentMonster.maxHp}`;
            for (let i = 0; i < monsterHpText.length && i < 30; i++) {
                grid[7][5 + i] = monsterHpText[i];
            }
        } else {
            // Peaceful state - show character in center
            const centerY = Math.floor(height / 2);
            const centerX = Math.floor(width / 2);
            
            // Add aura based on level
            if (this._level >= 30) {
                grid[centerY - 1][centerX - 1] = '✧';
                grid[centerY - 1][centerX + 1] = '✧';
            } else if (this._level >= 15) {
                grid[centerY][centerX - 2] = '★';
                grid[centerY][centerX + 2] = '★';
            } else if (this._level >= 5) {
                grid[centerY][centerX - 1] = '·';
                grid[centerY][centerX + 1] = '·';
            }
            
            grid[centerY][centerX] = this.emoji;
            
            // Character info below
            const charInfo = `${this.weapon}`;
            const charInfoStart = Math.floor((width - charInfo.length) / 2);
            for (let i = 0; i < charInfo.length && charInfoStart + i < width; i++) {
                grid[centerY + 2][charInfoStart + i] = charInfo[i];
            }
        }

        // EXP Bar at bottom
        const expText = `EXP: `;
        for (let i = 0; i < expText.length; i++) {
            grid[height - 2][2 + i] = expText[i];
        }

        // EXP progress bar
        const barWidth = 20;
        const maxExpDisplay = this.maxExp === Infinity ? 9999 : this.maxExp;
        const expPercent = Math.min(this._experience / maxExpDisplay, 1);
        const filledWidth = Math.floor(barWidth * expPercent);
        
        for (let i = 0; i < barWidth; i++) {
            grid[height - 2][10 + i] = i < filledWidth ? '■' : '□';
        }
        
        const expNumbers = ` ${this._experience}/${this.maxExp === Infinity ? '∞' : this.maxExp}`;
        for (let i = 0; i < expNumbers.length; i++) {
            grid[height - 2][32 + i] = expNumbers[i];
        }

        // Combo info
        const comboText = `연속타이핑: ${'⚡'.repeat(Math.min(this._combo, 5))} x${this._combo} COMBO!`;
        for (let i = 0; i < comboText.length && i < 40; i++) {
            grid[height - 2][width - 45 + i] = comboText[i];
        }

        return grid;
    }
}

export class Monster {
    private _name: string;
    private _level: number;
    private _hp: number;
    private _maxHp: number;

    constructor(name: string, level: number) {
        this._name = name;
        this._level = level;
        this._maxHp = level * 50 + Math.floor(Math.random() * 30);
        this._hp = this._maxHp;
    }

    get name(): string { return this._name; }
    get level(): number { return this._level; }
    get hp(): number { return this._hp; }
    get maxHp(): number { return this._maxHp; }

    get emoji(): string {
        if (this._name.includes('늑대')) return '🐺';
        if (this._name.includes('곰')) return '🐻';
        if (this._name.includes('드래곤')) return '🐲';
        if (this._name.includes('오크')) return '👹';
        if (this._name.includes('거미')) return '🕷️';
        if (this._name.includes('박쥐')) return '🦇';
        return '👾';
    }

    takeDamage(damage: number): void {
        this._hp = Math.max(0, this._hp - damage);
    }
}