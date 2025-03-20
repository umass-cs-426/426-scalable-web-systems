#!/usr/bin/env node

// import the dependencies
import fs from 'fs-extra';
import path from 'path';
import * as glob from 'glob';
import markdownIt from 'markdown-it'
import hljs from "highlight.js";
import juice from 'juice';
import cliProgress from 'cli-progress';
import mime from "mime-types";
import { fileURLToPath } from "url";

// Get the directory where this script is located
// We will use this to find assets used in the code.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// define some constants
const SOURCE_DIR = 'docs';
const OUTPUT_DIR = 'html';
const CSS_FILE = 'styles.css';

const mdImageToBase64 = (md) => {
    md.renderer.rules.image = (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        const srcIndex = token.attrIndex("src");

        if (srcIndex < 0) {
            return self.renderToken(tokens, idx, options);
        }

        const src = token.attrs[srcIndex][1];

        // Ignore external images (HTTP/HTTPS links)
        if (src.startsWith("http") || src.startsWith("data:")) {
            return self.renderToken(tokens, idx, options);
        }

        // Resolve the correct image path using the Markdown file's directory
        const markdownDir = env.markdownDir || SOURCE_DIR; // Default to SOURCE_DIR if not set
        const imagePath = path.resolve(markdownDir, src);

        if (fs.existsSync(imagePath)) {
            try {
                const imageBuffer = fs.readFileSync(imagePath);
                const mimeType = mime.lookup(imagePath) || "application/octet-stream";
                const base64String = `data:${mimeType};base64,${imageBuffer.toString("base64")}`;
                token.attrs[srcIndex][1] = base64String;
            } catch (error) {
                console.error(`❌ Error converting image ${imagePath}: ${error.message}`);
            }
        } else {
            console.warn(`⚠️ Image not found: ${imagePath}`);
        }

        return self.renderToken(tokens, idx, options);
    };
};




// Initialize Markdown parser with highlight.js for syntax highlighting
const mdParser = markdownIt({
    highlight: (code, lang) => {
        const validLang = lang && hljs.getLanguage(lang) ? lang : "plaintext";
        return `<pre><code class="hljs language-${validLang}">${hljs.highlight(code, { language: validLang }).value}</code></pre>`;
    }
}).use(mdImageToBase64);

// Find the markdown files.
const findMarkdownFiles = () => glob.sync(`${SOURCE_DIR}/**/*.md`);

const ensureOutputDirectory = async filePath =>
    await fs.ensureDir(path.dirname(filePath));

const loadCss = async () => {
    const cssPath = path.join(__dirname, "styles.css");

    if (await fs.pathExists(cssPath)) {
        return await fs.readFile(cssPath, "utf8");
    } else {
        console.warn(`⚠️ Warning: styles.css not found at ${cssPath}`);
        return "";
    }
};

const convertMarkdownToHtml = (markdown, markdownFilePath) => {
    const markdownDir = path.dirname(markdownFilePath); // Extract the directory
    return mdParser.render(markdown, { markdownDir });
};

const inlineCss = (html) => juice(html);

const processFile = async (mdFile, cssContent) => {
    const relativePath = path.relative(SOURCE_DIR, mdFile);
    const outputHtml =
        path.join(OUTPUT_DIR, relativePath.replace(/\.md$/, '.html'))

    await ensureOutputDirectory(outputHtml)
    const markdownContent = await fs.readFile(mdFile, 'utf8');
    let htmlContent = convertMarkdownToHtml(markdownContent, mdFile);

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
        const { mdFile: input, outputHtml: output } =
            await processFile(mdFile, cssContent);
        progressBar.update(markdownFiles.indexOf(mdFile) + 1,
            { file: `${input} -> ${output}` }
        )
    }

    progressBar.stop();
    console.log("\nAll Markdown files converted successfully!");
}

main().catch(error => console.error(`\n Fatal Error: ${error.message}`));