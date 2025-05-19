import * as vscode from "vscode";
import { marked } from "marked";
import { gfmHeadingId } from 'marked-gfm-heading-id';
import markedAlert from 'marked-alert'
import markedFootnote from 'marked-footnote'
import { loadConfig } from "./config.js";
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js';

import htmlTemplate from "../dist/bundle.html" with { type: "text" };

marked.setOptions({
    gfm: true,
    breaks: false
});
marked.use({
    async: true,
    gfm: true,
})

marked.use(gfmHeadingId())
marked.use(markedFootnote());
marked.use(markedAlert());
marked.use(markedHighlight({
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
}));

export async function compile(doc) {
    let config;
    try {
        config = await loadConfig();
    } catch (err) {
        vscode.window.showErrorMessage(`Failed to load configuration. ${err.message}`);
        return;
    }

    try {
        const bodies = await Promise.all(config.files.map(async (file) => {
            const markdownSrc = (await vscode.workspace.fs.readFile(vscode.Uri.file(file))).toString('utf8');
            const body = marked.parse(markdownSrc);
            return body;
        }));
        const body = bodies.join('\n');
        const html = htmlTemplate
            .replace(/{{title}}/g, config.title)
            .replace(/{{body}}/g, body);
        await vscode.workspace.fs.writeFile(vscode.Uri.file(config.output), Buffer.from(html));
    } catch (err) {
        vscode.window.showErrorMessage(`Failed to parse Markdown files. ${err.message}`);
        return;
    }
    vscode.window.showInformationMessage(`Compiled ${config.files.length} files to ${config.output}`);
}
