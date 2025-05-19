
import * as vscode from "vscode";
import * as path from "path";
import { compile } from "./compiler.js";

/**
 * @param {vscode.ExtensionContext} context
 */
export function activate(context) {
    let onSave = null;

    const startCompilation = vscode.commands.registerCommand('md-doc.start', async () => {
        await compile();

        if (!onSave) {
            onSave = vscode.workspace.onDidSaveTextDocument(async (doc) => {
                const fileName = path.basename(doc.fileName);
                if (fileName.endsWith('.md') || fileName === 'md-doc.json') {
                    await compile(doc);
                }
            });
            context.subscriptions.push(onSave);
            vscode.window.showInformationMessage('Watching for changes.');
        }
    });
    context.subscriptions.push(startCompilation);

    const stopCompilation = vscode.commands.registerCommand('md-doc.stop', async () => {
        if (onSave) {
            context.subscriptions.pop(onSave);
            onSave.dispose();
            onSave = null;
            vscode.window.showInformationMessage('Stopped watching for changes.');
        }
    });
    context.subscriptions.push(stopCompilation);
}

export function deactivate() {/* nothing to cleanup */ }



