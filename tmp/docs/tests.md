**🎤 Revised Teleprompter Script for `convert_docs.mjs`**  

**🟢 Introduction**  
"Hey everyone! Today, I'll be building a  
**Markdown-to-HTML converter** in Node.js.  
This script will:  
✅ Convert `.md` files to HTML,  
✅ Apply **syntax highlighting** to code blocks,  
✅ Inline **CSS** for a clean look,  
✅ Maintain the **folder structure**,  
✅ And at the end, we'll add a **progress bar**."  

"We’ll start by writing the **`main()`  
function** and defining functions **as we  
need them**. Let's get started!"  

**🟢 Writing `main()`**  
"I’ll start with `main()`, which will handle  
the entire conversion process."  

**Type this out:**  
```javascript
const main = async () => {  
    await fs.ensureDir(OUTPUT_DIR);  
    const markdownFiles =  
        findMarkdownFiles();  
    const cssContent = await loadCss();  

    for (const mdFile of markdownFiles) {  
        await processFile(mdFile,  
            cssContent);  
    }  

    console.log("\n✅ All Markdown files " +  
        "converted successfully!");  
};  

main().catch((error) => console.error(  
    `\n❌ Fatal error: ${error.message}`));  
```  

**🟢 Importing `fs-extra`**  
"We used `fs.ensureDir()` in `main()`,  
so let's import `fs-extra` now."  

**Type this out:**  
```javascript
import fs from "fs-extra";  
```  

**🟢 Defining Constants**  
"Since we just used `OUTPUT_DIR`, let's  
define it now."  

**Type this out:**  
```javascript
const OUTPUT_DIR = "html";  
```  

"We also referenced `SOURCE_DIR` and  
`CSS_FILE`, so let's define those too."  

**Type this out:**  
```javascript
const SOURCE_DIR = "docs";  
const CSS_FILE = "styles.css";  
```  

**🟢 Finding Markdown Files**  
"In `main()`, I called `findMarkdownFiles()`,  
so let’s implement that now."  

**Type this out:**  
```javascript
const findMarkdownFiles = () =>  
    glob.sync(`${SOURCE_DIR}/**/*.md`);  
```  

**🟢 Importing `glob`**  
"Since we just used `glob.sync()`, let's  
import `glob` now."  

**Type this out:**  
```javascript
import glob from "glob";  
```  

**🟢 Loading CSS**  
"We also called `loadCss()`, so let’s define  
it now."  

**Type this out:**  
```javascript
const loadCss = async () => {  
    return (await fs.pathExists(CSS_FILE))  
        ? await fs.readFile(CSS_FILE, "utf8")  
        : "";  
};  
```  

"This function **loads a CSS file** if it  
exists, otherwise, it returns an empty  
string."  

**🟢 Processing a Markdown File**  
"In `main()`, we called `processFile()`.  
Let’s define it next."  

**Type this out:**  
```javascript
const processFile = async (mdFile,  
    cssContent) => {  
    const relativePath =  
        path.relative(SOURCE_DIR, mdFile);  
    const outputHtml =  
        path.join(OUTPUT_DIR,  
            relativePath.replace(/\.md$/,  
            ".html"));  

    await ensureOutputDirectory(outputHtml);  

    const markdownContent =  
        await fs.readFile(mdFile, "utf8");  
    let htmlContent =  
        convertMarkdownToHtml(markdownContent);  

    if (cssContent) {  
        htmlContent = `<style>${cssContent}` +  
            `</style>\n${htmlContent}`;  
    }  

    const inlinedHtml = inlineCss(htmlContent);  
    await fs.writeFile(outputHtml, inlinedHtml,  
        "utf8");  
};  
```  

**🟢 Importing `path`**  
"We used `path.relative()` and  
`path.join()`, so let's import `path` now."  

**Type this out:**  
```javascript
import path from "path";  
```  

**🟢 Ensuring Directories Exist**  
"`processFile()` uses `ensureOutputDirectory()`,  
so let’s define it next."  

**Type this out:**  
```javascript
const ensureOutputDirectory = async  
    (filePath) => {  
    await fs.ensureDir(path.dirname(filePath));  
};  
```  

"This ensures that **output directories exist**  
before saving the HTML file."  

**🟢 Converting Markdown to HTML**  
"We also need `convertMarkdownToHtml()`,  
which will **process Markdown and highlight  
code blocks**."  

**Type this out:**  
```javascript
const convertMarkdownToHtml =  
    (markdown) => mdParser.render(markdown);  
```  

**🟢 Importing `markdown-it`**  
"We just referenced `mdParser`, so let's  
import `markdown-it` now."  

**Type this out:**  
```javascript
import markdownIt from "markdown-it";  
```  

**🟢 Setting Up Syntax Highlighting**  
"But `convertMarkdownToHtml()` needs a  
Markdown parser. Let’s configure it now with  
syntax highlighting."  

**Type this out:**  
```javascript
const mdParser = markdownIt({  
    highlight: (code, lang) => {  
        const validLang = lang &&  
            hljs.getLanguage(lang) ? lang  
            : "plaintext";  
        return `<pre><code class="hljs ` +  
            `language-${validLang}">` +  
            hljs.highlight(code,  
                { language: validLang }).value  
            + `</code></pre>`;  
    }  
});  
```  

**🟢 Importing `highlight.js`**  
"We just used `hljs.getLanguage()` and  
`hljs.highlight()`, so let's import  
`highlight.js` now."  

**Type this out:**  
```javascript
import hljs from "highlight.js";  
```  

**🟢 Inlining CSS**  
"Finally, `processFile()` calls `inlineCss()`,  
so let’s define that next."  

**Type this out:**  
```javascript
const inlineCss = (html) => juice(html);  
```  

**🟢 Importing `juice`**  
"Since we used `juice()`, let's import  
`juice` now."  

**Type this out:**  
```javascript
import juice from "juice";  
```  

**🟢 Adding the Progress Bar**  
"Now, let’s improve the script by **adding a  
progress bar**."  

**Replace the `for` loop inside `main()` with  
this:**  
```javascript
const progressBar = new cliProgress.SingleBar(  
    {}, cliProgress.Presets.shades_classic);  
progressBar.start(markdownFiles.length, 0);  

for (const mdFile of markdownFiles) {  
    await processFile(mdFile, cssContent);  
    progressBar.update(markdownFiles.indexOf(  
        mdFile) + 1);  
}  

progressBar.stop();  
console.log("\n✅ All Markdown files converted" +  
    " successfully!");  
```  

**🟢 Importing `cli-progress`**  
"We just used `cliProgress.SingleBar()`,  
so let's import `cli-progress` now."  

**Type this out:**  
```javascript
import cliProgress from "cli-progress";  
```  

**🟢 Running the Script**  
"Now let’s test the script!"  

**Type this out:**  
```sh
node convert_docs.mjs  
```  

"This will **convert all Markdown files** in  
`docs/` into **highlighted HTML** inside  
`html/`."  

**🟢 Closing the Video**  
"That’s it! We’ve built a **Markdown-to-HTML  
converter** that:  
✅ Finds Markdown files,  
✅ Converts them to **styled HTML**,  
✅ Highlights **code blocks**,  
✅ Inlines CSS for a **self-contained output**,  
✅ Preserves the **folder structure**,  
✅ And shows a **progress bar**!"  

"If you found this useful, don’t forget to  
**like, subscribe, and comment**! See you in  
the next one. 🚀"  

---

Now the script imports each library **only when  
we encounter its first use**, making it  
easier to follow along in the screen recording. 🚀  
Let me know if you need any refinements!