import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.min.js';
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
import { gfmHeadingId } from 'https://cdn.jsdelivr.net/npm/marked-gfm-heading-id/+esm';
import markedAlert from 'https://cdn.jsdelivr.net/npm/marked-alert/+esm'
import markedFootnote from 'https://cdn.jsdelivr.net/npm/marked-footnote/+esm'
// import { markedHighlight } from 'https://cdn.jsdelivr.net/npm/marked-highlight/+esm'
// import highlightJs from 'https://cdn.jsdelivr.net/npm/highlight.js/+esm'


const loadStyle = (href) => {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
    });
};

const ghThemeLink = (theme) => {
    switch (theme) {
        case 'dark':
            return 'https://cdn.jsdelivr.net/npm/github-markdown-css/github-markdown-dark.min.css';
        case 'light':
            return 'https://cdn.jsdelivr.net/npm/github-markdown-css/github-markdown-light.min.css';
        default:
            return 'https://cdn.jsdelivr.net/npm/github-markdown-css/github-markdown.min.css';
    }
}

const md = document.getElementById('md-doc');
md.style.visibility = 'hidden';
md.className = 'markdown-body';

marked.use({
    async: true,
    gfm: true
})

marked.use(gfmHeadingId({
    prefix: 'md-doc-',
}))

marked.use(markedFootnote());

// marked.use(markedHighlight({
//     emptyLangClass: 'hljs',
//     langPrefix: 'hljs language-',
//     highlight(code, lang, info) {
//         const language = highlightJs.getLanguage(lang) ? lang : 'plaintext';
//         return highlightJs.highlight(code, { language }).value;
//     }
// }))

marked.use(markedAlert());


await Promise.all([
    loadStyle(ghThemeLink(md.dataset.theme)),
    loadStyle('https://cdn.jsdelivr.net/gh/highlightjs/cdn-release/build/styles/default.min.css'),
    marked.parse(md.textContent).then(html => {md.innerHTML = html;}),
]);


mermaid.initialize({ startOnLoad: false });
await mermaid.run({
    querySelector: 'code.language-mermaid',
});

md.style.visibility = 'visible';
