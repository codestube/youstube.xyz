const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const REPOSITORY = "codestube/CTF-Write-Ups";
const BRANCH = "main";
const OUTPUT_DIRECTORY = path.resolve(__dirname, "../src/writeups/imported");
const sourceRoot = path.resolve(process.argv[2] || "");

const currentlyIncompleteReadmes = new Set([
    "Firebird CTF 2026/Fire Drop/README.md",
    "Firebird CTF 2026/My Creativity/README.md",
    "HKCERT CTF 2025/Bivariate Copper/README.md",
    "PolyUCTF 2026/nutty_hater_2/README.md",
    "PolyUCTF 2026/nutty_hater_3/README.md",
    "PolyUCTF 2026/nutty_hater_4/README.md",
    "scriptCTF 2025/Insider 1-4/README.md"
]);
const indexReadmes = new Set([
    "PolyUCTF 2026/nutty_hater full series/README.md"
]);

function fail(message) {
    console.error(message);
    process.exit(1);
}

function walk(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const fullPath = path.join(directory, entry.name);
        return entry.isDirectory() ? walk(fullPath) : [fullPath];
    });
}

function encodeRepositoryPath(value) {
    return value.split("/").map(encodeURIComponent).join("/");
}

function slugify(value) {
    return value
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

function stripMarkdown(value) {
    return value
        .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
        .replace(/[`*_~>#]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function getTitle(markdown, fallback) {
    const heading = markdown.match(/^#\s+(.+)$/m);
    return (heading ? heading[1] : fallback).replace(/\s+-\s+Write up$/i, "").trim();
}

function getCategory(markdown) {
    const category = markdown.match(/^[-*]\s+Category:\s*(.+)$/mi);
    return category ? stripMarkdown(category[1]) : "CTF";
}

function getSummary(markdown) {
    const description = markdown.match(/(?:^|\n)##\s+Description:?\s*\n([\s\S]*?)(?=\n##\s|$)/i);
    if (!description) {
        return "A CTF challenge writeup from my archive.";
    }

    const lines = [];
    for (const rawLine of description[1].split("\n")) {
        const line = rawLine.replace(/^>\s?/, "").trim();
        if (!line && lines.length) {
            break;
        }
        if (/^(?:Flag Format|The flag format|[-*]\s+\[[^\]]+\]|#\s+Remarks)/i.test(line)) {
            break;
        }
        if (line) {
            lines.push(line);
        }
    }
    const summary = stripMarkdown(lines.join(" "));

    if (!summary) {
        return "A CTF challenge writeup from my archive.";
    }

    return summary.length > 220 ? `${summary.slice(0, 217).trim()}...` : summary;
}

function yamlString(value) {
    return JSON.stringify(String(value));
}

function sourceUrl(relativeReadme) {
    return `https://github.com/${REPOSITORY}/blob/${BRANCH}/${encodeRepositoryPath(relativeReadme)}`;
}

function getPostDate(relativeReadme, year) {
    try {
        const committedAt = execFileSync(
            "git",
            ["-C", sourceRoot, "log", "-1", "--format=%aI", "--", relativeReadme],
            { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
        ).trim();
        if (committedAt) {
            return committedAt.slice(0, 10);
        }
    } catch (error) {
        // A non-git source folder still gets a deterministic fallback date.
    }

    return year ? `${year}-01-01` : "1970-01-01";
}

function repositoryTarget(relativeTarget, relativeReadme, slugByReadme) {
    const cleanTarget = relativeTarget.replace(/^<|>$/g, "");
    const hashIndex = cleanTarget.indexOf("#");
    const encodedTargetPath = hashIndex === -1 ? cleanTarget : cleanTarget.slice(0, hashIndex);
    let targetPath = encodedTargetPath;
    try {
        targetPath = decodeURI(encodedTargetPath);
    } catch (error) {
        targetPath = encodedTargetPath;
    }
    const hash = hashIndex === -1 ? "" : cleanTarget.slice(hashIndex);

    if (!targetPath || targetPath.startsWith("#") || targetPath.startsWith("/")) {
        return relativeTarget;
    }
    if (/^(?:[a-z]+:|\/\/)/i.test(targetPath)) {
        return relativeTarget;
    }
    if (/^[\w.-]+\.[a-z]{2,}(?::\d+)?(?:\/|\?|$)/i.test(targetPath)) {
        return `https://${targetPath}${hash}`;
    }

    const readmeDirectory = path.posix.dirname(relativeReadme);
    const resolved = path.posix.normalize(path.posix.join(readmeDirectory, targetPath));
    if (slugByReadme.has(resolved)) {
        return `/writeups/${slugByReadme.get(resolved)}/${hash}`;
    }

    const localTarget = path.join(sourceRoot, ...resolved.split("/"));
    const isDirectory = fs.existsSync(localTarget) && fs.statSync(localTarget).isDirectory();
    const base = isDirectory
        ? `https://github.com/${REPOSITORY}/tree/${BRANCH}`
        : `https://raw.githubusercontent.com/${REPOSITORY}/${BRANCH}`;
    return `${base}/${encodeRepositoryPath(resolved)}${hash}`;
}

function rewriteLinks(markdown, relativeReadme, slugByReadme) {
    const markdownLink = /(!?\[[^\]]*\]\()(<)?([^\n)]+?)(>)?(\))/g;
    const htmlLink = /\b(href|src)=(['"])([^'"]+)\2/g;

    return markdown
        .replace(markdownLink, (match, opening, leftAngle, target, rightAngle, closing) => {
            const rewritten = repositoryTarget(target.trim(), relativeReadme, slugByReadme);
            return `${opening}${leftAngle || ""}${rewritten}${rightAngle || ""}${closing}`;
        })
        .replace(htmlLink, (match, attribute, quote, target) => {
            const rewritten = repositoryTarget(target, relativeReadme, slugByReadme);
            return `${attribute}=${quote}${rewritten}${quote}`;
        });
}

if (!process.argv[2]) {
    fail("Usage: npm run import:writeups -- /path/to/CTF-Write-Ups");
}
if (!fs.existsSync(sourceRoot) || !fs.statSync(sourceRoot).isDirectory()) {
    fail(`Writeups repository not found: ${sourceRoot}`);
}

const readmes = walk(sourceRoot)
    .filter((filePath) => path.basename(filePath).toLowerCase() === "readme.md")
    .map((filePath) => ({
        absolute: filePath,
        relative: path.relative(sourceRoot, filePath).split(path.sep).join("/")
    }))
    .filter(({ relative }) => relative !== "README.md" && !indexReadmes.has(relative));

const skippedDuringImport = [];
const posts = readmes.map((readme) => {
    const parts = readme.relative.split("/");
    const event = parts[0];
    const challenge = parts[parts.length - 2];
    const slug = slugify(`${event}-${challenge}`);
    const markdown = fs.readFileSync(readme.absolute, "utf8").replace(/^\uFEFF/, "");
    const year = Number((event.match(/20\d{2}/) || ["0"])[0]);
    return {
        ...readme,
        category: getCategory(markdown),
        date: getPostDate(readme.relative, year),
        event,
        markdown,
        slug,
        summary: getSummary(markdown),
        title: getTitle(markdown, challenge),
        year
    };
}).filter((post) => {
    const stillIncomplete = post.markdown.length < 1500 || /^>\s*WIP\s*$/mi.test(post.markdown);
    if (currentlyIncompleteReadmes.has(post.relative) && stillIncomplete) {
        skippedDuringImport.push(post.relative);
        return false;
    }
    return true;
});

const slugByReadme = new Map(posts.map((post) => [post.relative, post.slug]));

fs.mkdirSync(OUTPUT_DIRECTORY, { recursive: true });
fs.readdirSync(OUTPUT_DIRECTORY)
    .filter((fileName) => fileName.endsWith(".md"))
    .forEach((fileName) => fs.unlinkSync(path.join(OUTPUT_DIRECTORY, fileName)));

posts.forEach((post) => {
    const content = rewriteLinks(
        post.markdown.replace(/^#\s+.+\n+/, ""),
        post.relative,
        slugByReadme
    ).trim();
    const frontMatter = [
        "---",
        "layout: post.njk",
        `title: ${yamlString(post.title)}`,
        `description: ${yamlString(post.summary)}`,
        "tags: archivePost",
        "contentType: ctf",
        `event: ${yamlString(post.event)}`,
        `category: ${yamlString(post.category)}`,
        `date: ${post.date}`,
        `year: ${post.year}`,
        `sourceUrl: ${yamlString(sourceUrl(post.relative))}`,
        `sourcePath: ${yamlString(post.relative)}`,
        `permalink: /writeups/${post.slug}/index.html`,
        "templateEngineOverride: md",
        "---"
    ].join("\n");

    fs.writeFileSync(
        path.join(OUTPUT_DIRECTORY, `${post.slug}.md`),
        `${frontMatter}\n\n${content}\n`
    );
});

console.log(`Imported ${posts.length} writeups into ${OUTPUT_DIRECTORY}`);
skippedDuringImport.forEach((readme) => console.log(`Skipped unfinished entry: ${readme}`));
indexReadmes.forEach((readme) => console.log(`Skipped index entry: ${readme}`));
