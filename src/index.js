import mermaid from "mermaid";

mermaid.initialize({
    startOnLoad: false,
});

await mermaid.run({
    querySelector: 'code.language-mermaid',
    suppressErrors: true,
});