"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const character_1 = require("./character");
const experience_1 = require("./experience");
const renderer_1 = require("./renderer");
let outputChannel;
let character;
let experienceSystem;
let renderer;
let isActive = false;
let textDocumentListener;
function activate(context) {
    console.log('keyWerrior extension activated');
    // Initialize systems
    outputChannel = vscode.window.createOutputChannel('keyWerrior');
    character = new character_1.Character();
    experienceSystem = new experience_1.ExperienceSystem();
    renderer = new renderer_1.Renderer(outputChannel);
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
    if (isActive) {
        vscode.window.showInformationMessage('keyWerrior is already active!');
        return;
    }
    isActive = true;
    outputChannel.show(true);
    outputChannel.appendLine('🗡️ keyWerrior has awakened!');
    // Initial render
    renderer.render(character);
    // Start listening to text document changes
    textDocumentListener = vscode.workspace.onDidChangeTextDocument((event) => {
        if (isActive) {
            handleTextChange(event);
        }
    });
    vscode.window.showInformationMessage('⚔️ keyWerrior is ready for battle!');
}
function stopKeyWerrior() {
    if (!isActive) {
        vscode.window.showInformationMessage('keyWerrior is not active.');
        return;
    }
    isActive = false;
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
    character.reset();
    experienceSystem.reset();
    renderer.render(character);
    outputChannel.appendLine('🔄 keyWerrior has been reset to level 1!');
    vscode.window.showInformationMessage('keyWerrior has been reset!');
}
function handleTextChange(event) {
    // Calculate typed characters (exclude deletions)
    let typedChars = 0;
    for (const change of event.contentChanges) {
        if (change.text.length > 0) {
            typedChars += change.text.length;
        }
    }
    if (typedChars > 0) {
        // Process experience gain
        const expGain = experienceSystem.processTyping(typedChars);
        const oldLevel = character.level;
        // Update character
        character.addExperience(expGain);
        // Check for level up
        if (character.level > oldLevel) {
            handleLevelUp(oldLevel, character.level);
        }
        // Update display
        renderer.render(character);
    }
}
function handleLevelUp(oldLevel, newLevel) {
    outputChannel.appendLine(`🎉 LEVEL UP! ${oldLevel} → ${newLevel}`);
    outputChannel.appendLine(`🏆 New title: ${character.title}`);
    // Show celebration message
    vscode.window.showInformationMessage(`🎉 Level Up! You are now a ${character.title}!`);
}
function deactivate() {
    if (textDocumentListener) {
        textDocumentListener.dispose();
    }
    if (outputChannel) {
        outputChannel.dispose();
    }
}
