import * as vscode from 'vscode';
import { Character } from './character';
import { ExperienceSystem } from './experience';
import { Renderer } from './renderer';

let outputChannel: vscode.OutputChannel;
let character: Character;
let experienceSystem: ExperienceSystem;
let renderer: Renderer;
let isActive = false;
let textDocumentListener: vscode.Disposable | undefined;
let lastUpdateTime = 0;
let processingUpdate = false;
let outputChannelUri: string | undefined; // Track output channel URI
let extensionContext: vscode.ExtensionContext;
let renderInterval: any | undefined;
let needsRender = false;

export function activate(context: vscode.ExtensionContext) {
    // Store context globally
    extensionContext = context;

    // Initialize systems
    outputChannel = vscode.window.createOutputChannel('keyWerrior');
    character = new Character();
    experienceSystem = new ExperienceSystem();
    renderer = new Renderer(outputChannel);

    // Load saved data
    loadGameData(context);

    // Register commands
    const startCommand = vscode.commands.registerCommand('keywarrior.start', () => {
        startKeyWerrior();
    });

    const stopCommand = vscode.commands.registerCommand('keywarrior.stop', () => {
        stopKeyWerrior();
    });

    const statusCommand = vscode.commands.registerCommand('keywarrior.status', () => {
        showStatus();
    });

    const resetCommand = vscode.commands.registerCommand('keywarrior.reset', () => {
        resetKeyWerrior();
    });

    context.subscriptions.push(startCommand, stopCommand, statusCommand, resetCommand);

    // Auto-start on activation
    startKeyWerrior();
}

function startKeyWerrior() {
    console.log('🎯 startKeyWerrior() called');
    
    if (isActive) {
        console.log('⚠️ keyWerrior is already active!');
        vscode.window.showInformationMessage('keyWerrior is already active!');
        return;
    }

    console.log('🔧 Setting up keyWerrior...');
    isActive = true;
    processingUpdate = true;
    
    outputChannel.show(true);
    outputChannel.appendLine('🗡️ keyWerrior has awakened!');
    console.log('📺 Output channel shown and message added');
    
    // Initial render
    renderer.render(character);
    console.log('🎨 Initial character render completed');
    
    // Start render interval (1 second)
    startRenderInterval();
    
    // Shorter initialization delay
    setTimeout(() => {
        processingUpdate = false;
        lastUpdateTime = Date.now();
        console.log('🔓 Processing lock released after initialization');
    }, 1000); // Reduced from 3000ms to 1000ms

    // Start listening to text document changes
    console.log('👂 Registering text document change listener...');
    textDocumentListener = vscode.workspace.onDidChangeTextDocument((event) => {
        console.log('📝 Text document change event received');
        if (isActive && !processingUpdate) {
            console.log('✅ Passing to handleTextChange');
            handleTextChange(event);
        } else {
            console.log(`❌ Blocked: isActive=${isActive}, processingUpdate=${processingUpdate}`);
        }
    });

    console.log('✅ Text document listener registered successfully');
    vscode.window.showInformationMessage('⚔️ keyWerrior is ready for battle!');
    console.log('🎉 keyWerrior startup completed');
}

function stopKeyWerrior() {
    if (!isActive) {
        vscode.window.showInformationMessage('keyWerrior is not active.');
        return;
    }

    isActive = false;
    processingUpdate = true;
    
    // Stop render interval
    stopRenderInterval();
    
    if (textDocumentListener) {
        textDocumentListener.dispose();
        textDocumentListener = undefined;
    }

    outputChannel.appendLine('💤 keyWerrior is resting...');
    vscode.window.showInformationMessage('keyWerrior has been deactivated.');
}

function showStatus() {
    const status = `
🏆 keyWerrior Status:
Level: ${character.level}
Title: ${character.title}
Experience: ${character.experience}/${character.maxExp}
Combo: x${character.combo}
`;
    vscode.window.showInformationMessage(status);
}

function resetKeyWerrior() {
    processingUpdate = true;
    
    character.reset();
    experienceSystem.reset();
    
    // Save reset data
    saveGameData(extensionContext);
    
    renderer.render(character);
    outputChannel.appendLine('🔄 keyWerrior has been reset to level 1!');
    vscode.window.showInformationMessage('keyWerrior has been reset!');
    
    setTimeout(() => {
        processingUpdate = false;
        lastUpdateTime = Date.now();
    }, 1000); // Reduced from 2000ms
}

function handleTextChange(event: vscode.TextDocumentChangeEvent) {
    // Absolute protection against loops
    if (processingUpdate) {
        return;
    }

    // More reasonable rate limiting
    const now = Date.now();
    if (now - lastUpdateTime < 200) { // Reduced from 500ms to 200ms
        return;
    }

    // CRITICAL: Block ALL non-file documents
    const document = event.document;
    
    // Allow file and untitled schemes (untitled = new unsaved files)
    if (document.uri.scheme !== 'file' && document.uri.scheme !== 'untitled') {
        return;
    }

    // Block if no real file path
    if (!document.fileName || document.fileName.length === 0) {
        return;
    }

    // Get clean file path
    const filePath = document.fileName.toLowerCase().replace(/\\/g, '/');
    
    // Essential blacklist - only block critical items
    const essentialBlacklist = [
        'keywerrior',
        'keywarrior',
        'output',
        'log',
        'debug',
        'console',
        'terminal'
    ];
    
    // Check if path contains any blacklisted terms
    const blacklistedTerm = essentialBlacklist.find(term => filePath.includes(term));
    if (blacklistedTerm) {
        return;
    }

    // WHITELIST approach - allow common code file types or untitled documents
    const allowedExtensions = [
        '.js', '.ts', '.jsx', '.tsx', 
        '.py', '.java', '.cpp', '.c', '.cs', 
        '.php', '.rb', '.go', '.rs', '.vue', 
        '.html', '.css', '.scss', '.sass',
        '.json', '.xml', '.yaml', '.yml',
        '.md', '.txt', '.sql'
    ];
    
    // Allow untitled documents OR files with allowed extensions
    const isUntitled = document.uri.scheme === 'untitled';
    const hasAllowedExtension = allowedExtensions.some(ext => filePath.endsWith(ext));
    
    if (!isUntitled && !hasAllowedExtension) {
        console.log(`keyWerrior: Blocked - file extension not allowed: ${filePath}`);
        return;
    }
    console.log('keyWerrior: File extension allowed or untitled document');

    console.log(`keyWerrior: Processing ${event.contentChanges.length} content changes`);

    // Count real typing events
    let realTypingCount = 0;
    
    for (const change of event.contentChanges) {
        console.log(`keyWerrior: Change - text: "${change.text}", length: ${change.text.length}, rangeLength: ${change.rangeLength}`);
        console.log(`keyWerrior: Change - range start: ${change.range.start.line}:${change.range.start.character}, end: ${change.range.end.line}:${change.range.end.character}`);
        
        // Must be exactly 1 character addition, no deletion
        if (change.text.length === 1 && 
            change.rangeLength === 0 &&
            change.range.start.line === change.range.end.line &&
            change.range.start.character === change.range.end.character) {
            
            // Allow most printable characters including Korean
            const char = change.text;
            console.log(`keyWerrior: Checking character: "${char}" (code: ${char.charCodeAt(0)})`);
            
            // Support English, numbers, symbols, Korean characters, and other Unicode
            if (/^[a-zA-Z0-9\s\.\,\;\:\!\?\(\)\[\]\{\}\-\+\=\<\>\/\*\&\|\%\$\#\@\^\~\`\'\"\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]$/.test(char)) {
                realTypingCount++;
                console.log(`keyWerrior: Valid character counted: "${char}"`);
            } else {
                console.log(`keyWerrior: Character not allowed: "${char}"`);
            }
        } else {
            console.log('keyWerrior: Change not counted - not single character addition');
        }
    }

    console.log(`keyWerrior: Total real typing count: ${realTypingCount}`);

    // Only process if we detected real typing
    if (realTypingCount > 0) {
        // Add debug logging to help troubleshoot
        console.log(`keyWerrior: Processing ${realTypingCount} typing events in ${filePath}`);
        
        // Immediate lock to prevent any loops
        processingUpdate = true;
        lastUpdateTime = now;
        
        // Use setTimeout to ensure this runs after current event processing
        setTimeout(() => {
            try {
                if (!isActive) {
                    console.log('keyWerrior: Extension not active, skipping');
                    return;
                }
                
                console.log('keyWerrior: Processing experience gain');
                const expGain = experienceSystem.processTyping(realTypingCount);
                const oldLevel = character.level;
                
                // Get enhanced combo status
                const comboStatus = experienceSystem.getComboStatus();
                character.setCombo(comboStatus.level);
                
                character.addExperience(expGain);
                console.log(`keyWerrior: Added ${expGain} experience (combo x${comboStatus.multiplier})`);
                
                // Auto-save game data
                saveGameData(extensionContext);
                
                // Mark that render is needed
                needsRender = true;
                
                // Log enhanced combo info
                if (comboStatus.perfectStreak >= 5) {
                    console.log(`keyWerrior: Perfect streak bonus active! (${comboStatus.perfectStreak})`);
                }
                if (comboStatus.consecutiveTyping % 10 === 0) {
                    console.log(`keyWerrior: Milestone achieved! ${comboStatus.consecutiveTyping} consecutive keystrokes`);
                }
                
                if (character.level > oldLevel) {
                    console.log(`keyWerrior: Level up! ${oldLevel} → ${character.level}`);
                    handleLevelUp(oldLevel, character.level);
                    // For level up, render immediately with animation
                    setTimeout(() => {
                        if (isActive) {
                            renderer.renderLevelUpAnimation(character, oldLevel);
                        }
                    }, 100);
                }
                
            } catch (error) {
                console.error('keyWerrior error:', error);
            } finally {
                // Release lock after shorter delay
                setTimeout(() => {
                    processingUpdate = false;
                    console.log('keyWerrior: Processing lock released');
                }, 200); // Reduced from 500ms
            }
        }, 50); // Reduced from 100ms
    } else {
        console.log('keyWerrior: No valid typing detected, skipping');
    }
}

function handleLevelUp(oldLevel: number, newLevel: number) {
    // Use setTimeout to avoid immediate output conflicts
    setTimeout(() => {
        if (isActive) {
            outputChannel.appendLine(`🎉 LEVEL UP! ${oldLevel} → ${newLevel}`);
            outputChannel.appendLine(`🏆 New title: ${character.title}`);
            
            vscode.window.showInformationMessage(
                `🎉 Level Up! You are now a ${character.title}!`
            );
        }
    }, 100); // Reduced from 200ms
}

export function deactivate() {
    processingUpdate = true;
    isActive = false;
    
    // Stop render interval
    stopRenderInterval();
    
    if (textDocumentListener) {
        textDocumentListener.dispose();
    }
    if (outputChannel) {
        outputChannel.dispose();
    }
}

// Game data persistence functions
function loadGameData(context: vscode.ExtensionContext): void {
    try {
        const characterData = context.globalState.get('keywerrior.character');
        const experienceData = context.globalState.get('keywerrior.experience');
        
        if (characterData) {
            character.loadFromStorage(characterData);
        }
        if (experienceData) {
            experienceSystem.loadFromStorage(experienceData);
        }
        
        console.log('✅ Game data loaded successfully');
    } catch (error) {
        console.error('❌ Failed to load game data:', error);
    }
}

function saveGameData(context: vscode.ExtensionContext): void {
    try {
        context.globalState.update('keywerrior.character', character.saveToStorage());
        context.globalState.update('keywerrior.experience', experienceSystem.saveToStorage());
        console.log('💾 Game data saved');
    } catch (error) {
        console.error('❌ Failed to save game data:', error);
    }
}

// Render interval functions
function startRenderInterval(): void {
    if (renderInterval) {
        clearInterval(renderInterval);
    }
    
    renderInterval = setInterval(() => {
        if (isActive && needsRender) {
            renderer.render(character);
            needsRender = false;
        }
    }, 1000); // Render every 1 second
}

function stopRenderInterval(): void {
    if (renderInterval) {
        clearInterval(renderInterval);
        renderInterval = undefined;
    }
}