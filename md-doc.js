import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.min.js';
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.esm.min.mjs';
import { gfmHeadingId } from 'https://cdn.jsdelivr.net/npm/marked-gfm-heading-id/+esm';
import markedAlert from 'https://cdn.jsdelivr.net/npm/marked-alert/+esm'
import markedFootnote from 'https://cdn.jsdelivr.net/npm/marked-footnote/+esm'

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

const md = document.getElementById('md-doc');

md.style.visibility = 'hidden';
md.className = 'markdown-body';

marked.use({
    async: true,
    gfm: true,
})

marked.use(gfmHeadingId({
    prefix: 'md-doc-',
}))

marked.use(markedFootnote());
marked.use(markedAlert());


var text = md.getElementsByTagName('template')[0];
await Promise.all([
    loadStyle('https://cdn.jsdelivr.net/npm/github-markdown-css/github-markdown-light.min.css'),
    loadStyle('https://cdn.jsdelivr.net/gh/highlightjs/cdn-release/build/styles/default.min.css'),
    marked.parse(text).then(html => {md.innerHTML = html;}),
]);

mermaid.initialize({
    startOnLoad: false,
});
await mermaid.run({
    querySelector: 'code.language-mermaid',
});

md.style.visibility = 'visible';
