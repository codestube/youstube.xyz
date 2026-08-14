$(document).ready(function() {
    // Only initialize terminal if element exists
    if ($("#terminal").length === 0) {
        return;
    }

    const HOME_PATH = ["home", "yst"];
    const PROTECTED_ROOT_NAMES = new Set([
        "bin", "boot", "dev", "etc", "lib", "lib64", "lost+found",
        "media", "mnt", "opt", "proc", "root", "run", "sbin", "srv",
        "sys", "tmp", "usr", "var", "secret", "flag"
    ]);
    const protectedMessage = "pls don't actually go through my fs >_<";

    const directory = (children = {}) => ({ type: "directory", children });
    const file = (content) => ({ type: "file", content });
    const protectedDirectory = () => ({ type: "protected" });

    const rootChildren = {};
    PROTECTED_ROOT_NAMES.forEach((name) => {
        rootChildren[name] = protectedDirectory();
    });
    rootChildren.home = directory({
        yst: directory({
            "about.md": file([
                "# hai im youstube!!",
                "I'm the Leader of flagaholic, #2 CTF team in Hong Kong.",
                "",
                "I'm also a student about to study CS in University of Birmingham and am very interested in the world of Cybersecurity OvO",
                "",
                "I am a good leader, and a good listener. I have led multiple projects and teams acquiring incredible results, and organized various events with succession, all of which had staggering amount of positive feedbacks :D",
                "",
                "Extremely interested in forensics & a bit of math. (but too lazy to learn -v-)",
                "I LOVE puzzle games like Escape Simulator and Keep Talking and Nobody Explode!",
                "also a Minecraft nerd :p I js play it but never done modding stuff (in future?)",
                "",
                "my fav quote I heard from someone:",
                '"You know you\'re real, but not everyone else around you, so stop controlling them."',
            ]),
            "achievements.md": file([
                "# my achievements and shii",
                "#1 [[!;;;;https://2026.polyuctf.com/scoreboard/](Nuttyshell CTF 2026)] in Sub-Degree Division (Leading 3Failures1Noob)!!",
                "#5 [[!;;;;https://github.com/codestube/CTF-Write-Ups/tree/main/HKCERT%20CTF%202025](HKCERT CTF 2025)] in Tertiary Division (Finalist)!",
                "#3 CUHK CTF 2025 Overall (Joined in Guest Division so no prize ;_;)",
                "",
            ]),
            "contact.md": file([
                // gng codex did NOT cook on formats wtf
                // "discord.txt": file("DM me @youtubeshort"),
                // "email.txt": file("[[!;;]youstube@flagaholic.xyz]"),
                // "github.txt": file("[[!;;]https://github.com/codestube]"),
                // "x.txt": file("[[!;;]https://x.com/codestube]")
                "# Find me onnnnnn",
                "[Email]     [[!;;]youstube@flagaholic.xyz]",
                "[Discord]   DM me @youtubeshort",
                "[X]         [[!;;]https://x.com/codestube]",
                "[GitHub]    [[!;;]https://github.com/codestube]",
                "",
            ]),
            projects: directory({
                "combine.md": file([
                    "# COMBINE",
                    "just a fun puzzle game that I made in Unity C# for my homework during my founddip sch year! (oh how the AI-less era was fun when coding this, legit had to ask for an extension because I had a bug that took me 2 days to fix :sob:",
                    "[[!;;]https://github.com/codestube/com-bine]",
                    "",
                ]),
                "holicctf.md": file([
                    "# holicCTF v1",
                    "An internal CTF I hosted and organized for my team flagaholic :>",
                    "Check out the challenges here! (blog will be coming soon trust)",
                    "[[!;;]https://github.com/Flagaholic/holicCTF-internal-2026-v1-challenges]",
                    "",
                ]),
                "websites.md": file([
                    "# youstube.xyz and flagaholic.xyz",
                    "I [[s;;]vibe]built these websites, but meticulously added/fixed various UI/UX manually! (I read the code)",
                    "",
                    "This website was built w/ 11ty, and the other one w/ Astro.",
                    "(i know this isn't really an achievement in SWE-sense (vibe-building projects), but I'm learning from the code and actively reading it)",
                    "",
                    "Anyways! [[!;;]https://youstube.xyz] && [[!;;]https://flagaholic.xyz] << check them out!",
                    "",
                ])
            }),
        })
    });

    const virtualFS = directory(rootChildren);
    let currentPath = HOME_PATH.slice();

    function resolvePath(input) {
        const rawPath = String(input || ".");
        let parts;

        if (rawPath === "~" || rawPath.startsWith("~/")) {
            parts = HOME_PATH.slice();
            input = rawPath.slice(1);
        } else {
            parts = rawPath.startsWith("/") ? [] : currentPath.slice();
            input = rawPath;
        }

        const pathParts = String(input).split("/");

        for (const part of pathParts) {
            if (!part || part === "." || part === "~") {
                continue;
            }
            if (part === "..") {
                parts.pop();
                continue;
            }

            const parent = getNode(parts);
            if (parent && parent.type === "directory") {
                if (parent.children[part]) {
                    parts.push(part);
                    continue;
                }

                const matches = Object.keys(parent.children)
                    .filter((name) => name.startsWith(part));
                if (matches.length === 1) {
                    parts.push(matches[0]);
                    continue;
                }
                if (matches.length > 1) {
                    return { ambiguous: part, matches, parts: null };
                }
            }

            parts.push(part);
        }

        return { ambiguous: null, matches: [], parts };
    }

    function getNode(pathParts) {
        let node = virtualFS;

        for (const part of pathParts) {
            if (node.type !== "directory" || !node.children[part]) {
                return null;
            }
            node = node.children[part];
        }

        return node;
    }

    function isProtectedPath(pathParts) {
        return pathParts.length > 0 && PROTECTED_ROOT_NAMES.has(pathParts[0]);
    }

    function displayPath(pathParts) {
        const isHome = HOME_PATH.every((part, index) => pathParts[index] === part);

        if (isHome) {
            const rest = pathParts.slice(HOME_PATH.length);
            return rest.length ? `~/${rest.join("/")}` : "~";
        }

        return pathParts.length ? `/${pathParts.join("/")}` : "/";
    }

    function buildPrompt() {
        return "[[b;#58a6ff;]yst@happyplace][[b;#ffffff;]:]" + `[[b;#a371f7;]${displayPath(currentPath)}]` + "[[b;#ffffff;]$] ";
    }

    function echoProtected(term) {
        term.echo(`[[;#f778ba;]${protectedMessage}]`);
    }

    function echoPathError(term, command, path) {
        const safePath = $.terminal.escape_formatting(String(path));
        term.echo(`[[;#ff7b72;]${command}: ${safePath}: No such file or directory]`);
    }

    function echoAmbiguousPath(term, command, path, matches) {
        const safePath = $.terminal.escape_formatting(String(path));
        const safeMatches = matches
            .map((match) => $.terminal.escape_formatting(match))
            .join(", ");
        term.echo(`[[;#ff7b72;]${command}: ${safePath}: ambiguous (${safeMatches})]`);
    }

    function formatEntry(name, node) {
        if (node.type === "directory" || node.type === "protected") {
            return `[[b;#58a6ff;]${name}/]`;
        }
        return name;
    }

    function completionCandidates(commandLine) {
        const commandMatch = commandLine.match(/^\s*(\S+)/);
        const commandNames = Object.keys(commands);

        if (!commandMatch || !commandLine.match(/\s/)) {
            return commandNames;
        }

        const command = commandMatch[1];
        if (!["cat", "cd", "ls"].includes(command)) {
            return [];
        }

        const path = commandLine.match(/(\S*)$/)[1];
        const lastSlash = path.lastIndexOf("/");
        const parentInput = lastSlash === -1 ? "." : path.slice(0, lastSlash + 1);
        const typedName = path.slice(lastSlash + 1);
        const displayedParent = lastSlash === -1 ? "" : path.slice(0, lastSlash + 1);
        const resolvedParent = resolvePath(parentInput);

        if (resolvedParent.ambiguous) {
            return [];
        }

        const parent = getNode(resolvedParent.parts);
        if (!parent || parent.type !== "directory") {
            return [];
        }

        return Object.entries(parent.children)
            .filter(([name, node]) => {
                const nameMatches = name.startsWith(typedName);
                const validForCommand = command !== "cd" ||
                    node.type === "directory" || node.type === "protected";
                return nameMatches && validForCommand;
            })
            .map(([name, node]) => {
                const slash = node.type === "directory" || node.type === "protected"
                    ? "/"
                    : "";
                return `${displayedParent}${name}${slash}`;
            });
    }
    
    const commands = {
        help: function() {
            this.echo([
                "[[s;;]Useful] commands:",
                "  [[b;#58a6ff;]whoami]      - display user id",
                "  [[b;#58a6ff;]ls <path>]   - list files and folders",
                "  [[b;#58a6ff;]cd <path>]   - change folder",
                "  [[b;#58a6ff;]pwd]         - show the current path",
                "  [[b;#58a6ff;]cat <file>]  - read a file",
                "  [[b;#58a6ff;]help]        - show this screen",
                "  [[b;#58a6ff;]clear]       - reset this screen"
            ], { keepWords: true });
            this.echo();
        },
        whoami: function() {
            this.echo("yst");
        },
        ls: function(path = ".") {
            const resolvedPath = resolvePath(path);
            if (resolvedPath.ambiguous) {
                echoAmbiguousPath(this, "ls", path, resolvedPath.matches);
                return;
            }
            const pathParts = resolvedPath.parts;

            if (isProtectedPath(pathParts)) {
                echoProtected(this);
                return;
            }

            const node = getNode(pathParts);
            if (!node) {
                echoPathError(this, "ls", path);
                return;
            }

            if (node.type === "file") {
                this.echo(pathParts[pathParts.length - 1]);
                return;
            }

            const entries = Object.entries(node.children)
                .sort(([left], [right]) => left.localeCompare(right))
                .map(([name, entry]) => formatEntry(name, entry));
            this.echo(entries.join("  "));
        },
        cd: function(path = "~") {
            const resolvedPath = resolvePath(path);
            if (resolvedPath.ambiguous) {
                echoAmbiguousPath(this, "cd", path, resolvedPath.matches);
                return;
            }
            const pathParts = resolvedPath.parts;

            if (isProtectedPath(pathParts)) {
                echoProtected(this);
                return;
            }

            const node = getNode(pathParts);
            if (!node) {
                echoPathError(this, "cd", path);
                return;
            }
            if (node.type !== "directory") {
                const safePath = $.terminal.escape_formatting(String(path));
                this.echo(`[[;#ff7b72;]cd: ${safePath}: Not a directory]`);
                return;
            }

            currentPath = pathParts;
            this.set_prompt(buildPrompt());
        },
        pwd: function() {
            this.echo(`/${currentPath.join("/")}`);
        },
        cat: function(path) {
            if (!path) {
                this.echo("[[;#ff7b72;]cat: missing file operand]");
                return;
            }

            const resolvedPath = resolvePath(path);
            if (resolvedPath.ambiguous) {
                echoAmbiguousPath(this, "cat", path, resolvedPath.matches);
                return;
            }
            const pathParts = resolvedPath.parts;
            if (isProtectedPath(pathParts)) {
                echoProtected(this);
                return;
            }

            const node = getNode(pathParts);
            const parentIsRoot = pathParts.length === 1;
            if (!node && parentIsRoot) {
                echoProtected(this);
                return;
            }
            if (!node) {
                echoPathError(this, "cat", path);
                return;
            }
            if (node.type !== "file") {
                const safePath = $.terminal.escape_formatting(String(path));
                this.echo(`[[;#ff7b72;]cat: ${safePath}: Is a directory]`);
                return;
            }

            this.echo(node.content, { keepWords: true });
        },
        clear: function() {
            this.clear();
        }
    };

    $("#terminal").terminal(commands, {
        greetings: false,
        prompt: buildPrompt(),
        checkArity: false,
        exit: false,
        clear: false,
        height: "100%",
        scrollOnEcho: true,
        wrap: true,
        keepWords: true,
        onInit: function() {
            this.echo("Type '[[b;#58a6ff;]help]' to see available commands.", { keepWords: true });
            this.echo("please don't break my terminal =v=", { keepWords: true });
            this.echo();
        },
        completion: function() {
            return completionCandidates(this.get_command());
        }
    });
});
