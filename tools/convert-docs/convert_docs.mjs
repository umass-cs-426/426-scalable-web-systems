// import the dependencies
import fs from 'fs-extra';
import path from 'path';
import * as glob from 'glob';
import markdownIt from 'markdown-it'
import markdownItHighlight from "markdown-it-highlightjs";
import hljs from "highlight.js";
import juice from 'juice';
import cliProgress from 'cli-progress';

// define some constants
const SOURCE_DIR = 'docs';
const OUTPUT_DIR = 'html';
const CSS_FILE = 'styles.css';

// Initialize Markdown parser with highlight.js for syntax highlighting
const mdParser = markdownIt({
    highlight: (code, lang) => {
        const validLang = lang && hljs.getLanguage(lang) ? lang : "plaintext";
        return `<pre><code class="hljs language-${validLang}">${hljs.highlight(code, { language: validLang }).value}</code></pre>`;
    }
});

// Find the markdown files.
const findMarkdownFiles = () => glob.sync(`${SOURCE_DIR}/**/*.md`);

const ensureOutputDirectory = async filePath =>
    await fs.ensureDir(path.dirname(filePath));

const loadCss = async () =>
    await fs.pathExists(CSS_FILE)
        ? await fs.readFile(CSS_FILE, 'utf8')
        : '';

const convertMarkdownToHtml = (markdown) => mdParser.render(markdown);

const inlineCss = (html) => juice(html);

const processFile = async (mdFile, cssContent) => {
    const relativePath = path.relative(SOURCE_DIR, mdFile);
    const outputHtml = 
        path.join(OUTPUT_DIR, relativePath.replace(/\.md$/, '.html'))

    await ensureOutputDirectory(outputHtml)
    const markdownContent = await fs.readFile(mdFile, 'utf8');
    let htmlContent = convertMarkdownToHtml(markdownContent);

    if (cssContent) {
        htmlContent = `<style>${cssContent}</style>\n${htmlContent}`;
    }

    const inlinedHtml = inlineCss(htmlContent);
    await fs.writeFile(outputHtml, inlinedHtml, 'utf8');

    return {
        mdFile,
        outputHtml
    }
}

const main = async () => {
    await fs.ensureDir(OUTPUT_DIR);
    const markdownFiles = findMarkdownFiles();
    const cssContent = await loadCss();

    const progressBar = new cliProgress.SingleBar(
        {}, cliProgress.Presets.shades_classic
    );

    progressBar.start(markdownFiles.length, 0);

    for (const mdFile of markdownFiles) {
        const { mdFile: input, outputHtml: output} =
            await processFile(mdFile, cssContent);
        progressBar.update(markdownFiles.indexOf(mdFile) + 1,
            { file: `${input} -> ${output}`}
        )
    }

    progressBar.stop();
    console.log("\nAll Markdown files converted successfully!");
}

main().catch(error => console.error(`\n Fatal Error: ${error.message}`));