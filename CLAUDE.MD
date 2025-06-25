# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
keyWerrior is a VSCode extension that gamifies the typing experience by displaying a growing ASCII art character. Users gain experience points for typing, with combo bonuses and level-up animations.

## Development Commands
This project needs initial setup. Required commands:

```bash
# Initialize project
npm init -y
npm install --save-dev @types/vscode typescript @vscode/vsce

# Setup TypeScript
npx tsc --init

# Build extension
npx vsce package

# Install for testing
code --install-extension keywarrior-*.vsix
```

Test in VSCode: Press F5 to launch Extension Development Host

## Architecture Overview

### Core System Components
- **extension.ts**: Main entry point, registers commands and event listeners
- **character.ts**: Manages character state (level, experience, combo)
- **renderer.ts**: Handles 20x20 ASCII art rendering with ANSI colors
- **experience.ts**: Experience point calculation and level progression
- **animations.ts**: Level-up and combo animations

### Key Integration Points
- Uses `vscode.workspace.onDidChangeTextDocument` for typing detection
- Creates output channel via `vscode.window.createOutputChannel("keyWerrior")`
- Implements commands: `keywarrior.start`, `keywarrior.stop`, `keywarrior.status`, `keywarrior.reset`

### Data Flow
1. Text document changes trigger typing detection
2. Experience system calculates points (1 per character, combo multipliers)
3. Character state updates trigger renderer
4. Renderer outputs 20x20 ASCII art to output panel
5. Level-up events trigger animations

## Character Progression System
- Level 1-4: ⚔️ Novice Warrior (0-99 EXP)
- Level 5-14: 🛡️ Skilled Warrior (100-499 EXP)
- Level 15-29: 🏰 Knight (500-1499 EXP)
- Level 30-49: 👑 Legend Warrior (1500-2999 EXP)
- Level 50+: 💎 keyWerrior Master (3000+ EXP)

## Combo System Rules
- 5-second window for consecutive typing
- Multipliers: x1 → x1.5 → x2 → x3 (maximum)
- Combo breaks reset multiplier to x1

## Rendering Specifications
- 20x20 character grid using ■ symbols
- ANSI color codes for character coloring
- Output panel updates in real-time
- Animation frames for level-up (3-5 frames)

## VSCode Extension Requirements
- Package.json must include proper activation events
- Commands must be registered in contributes.commands
- Use proper extension lifecycle methods (activate/deactivate)
- Store persistent data using VSCode's storage API