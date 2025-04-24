import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.min.js';

const loadScript = (src) => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

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

class MdDoc extends HTMLElement {
    async connectedCallback() {
        this.hidden = true;
        await Promise.all([
            loadScript('https://cdn.jsdelivr.net/npm/marked-highlight/lib/index.umd.min.js'),
            loadScript('https://cdn.jsdelivr.net/npm/marked-gfm-heading-id/lib/index.umd.min.js'),
            // loadScript('https://cdn.jsdelivr.net/npm/marked/lib/marked.umd.min.js'),
            loadScript('https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js'),
            loadStyle('https://cdn.jsdelivr.net/npm/github-markdown-css/github-markdown-light.min.css'),
        ]);

        marked.use({
            gfm: true,
            safe: false
        });
        marked.use(markedGfmHeadingId.gfmHeadingId({ prefix: 'md-doc-', }));
        // marked.use(markedHighlight.markedHighlight({}));

        this.innerHTML = marked.parse(this.textContent);
        this.className = 'markdown-body';

        this.querySelectorAll('code.language-mermaid').forEach(block => {
            block.className = 'mermaid';
        });
        this.hidden = false;
    }
}

customElements.define('md-doc', MdDoc);
