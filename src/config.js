import * as vscode from 'vscode';
import path from 'path';

const def = {
    title: 'Markdown Documentation',
    output: 'index.html'
};


export async function loadConfig() {
    const configFileUris = await vscode.workspace.findFiles("**/md-doc.json");

    if (configFileUris.length === 0) {
        throw new Error('No configuration file found.');
    }
    if (configFileUris.length > 1) {
        throw new Error('Multiple configuration files found. Please use only one.');
    }

    const fileContent = await vscode.workspace.fs.readFile(configFileUris[0]);

    let config;
    try {
        config = JSON.parse(fileContent);
    } catch (error) {
        throw new Error(`Invalid configuration file. ${error.message}`);
    }
    if (typeof config !== 'object' || config === null) {
        throw new Error('Invalid configuration file. The content should be a JSON object.');
    }
    if (!Array.isArray(config.files) || config.files.some(file => typeof file !== 'string')) {
        throw new Error('Invalid configuration file. "files" should be an array of strings.');
    }

    const fileDir = path.dirname(configFileUris[0].fsPath);
    config.files = config.files.map(file => path.join(fileDir, file));
    if (config.files.length === 0) {
        throw new Error('Invalid configuration file. No files found.');
    }
    if (config.files.some(file => !file.endsWith('.md'))) {
        throw new Error('Invalid configuration file. All files should be Markdown files.');
    }

    if (!config.title) {
        config.title = def.title;
    }
    if (!config.output) {
        config.output = def.output;
    }
    config.output = path.join(fileDir, config.output);
    return config;
}
