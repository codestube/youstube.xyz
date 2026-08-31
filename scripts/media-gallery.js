(() => {
    const content = document.querySelector(".post-content");
    if (!content) return;

    const isWhitespace = (node) => node?.nodeType === Node.TEXT_NODE && !node.textContent.trim();
    const isCaption = (node) => node?.nodeType === Node.ELEMENT_NODE && node.tagName === "SMALL";
    const isBreak = (node) => node?.nodeType === Node.ELEMENT_NODE && node.tagName === "BR";
    const isMeaningful = (nodes) => nodes.some((node) => !isWhitespace(node) && !isBreak(node));

    function moveImageUnit(nodes, start) {
        const image = nodes[start];
        const unit = { image, caption: null };
        let next = start + 1;
        while (next < nodes.length && isWhitespace(nodes[next])) next += 1;
        if (isCaption(nodes[next])) {
            unit.caption = nodes[next];
            next += 1;
        }
        return { next, unit };
    }

    function createGallery(units) {
        const gallery = document.createElement("div");
        gallery.className = "media-gallery";
        units.forEach((unit) => {
            const figure = document.createElement("figure");
            figure.className = "media-gallery-item";
            figure.dataset.originalSrc = unit.image.currentSrc || unit.image.src;
            figure.dataset.alt = unit.image.alt || "";

            unit.image.loading = "lazy";
            unit.image.decoding = "async";

            const button = document.createElement("button");
            button.className = "media-gallery-open";
            button.type = "button";
            button.append(unit.image);
            figure.append(button);

            if (unit.caption) {
                const caption = document.createElement("figcaption");
                caption.className = "media-gallery-caption";
                caption.append(...unit.caption.childNodes);
                figure.append(caption);
            }
            gallery.append(figure);
        });
        return gallery;
    }

    function transformParagraph(paragraph) {
        const nodes = [...paragraph.childNodes];
        if (!nodes.some((node) => node.nodeType === Node.ELEMENT_NODE && node.tagName === "IMG")) return;

        const segments = [];
        let ordinary = [];
        for (let index = 0; index < nodes.length;) {
            const node = nodes[index];
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "IMG") {
                if (ordinary.length) segments.push({ type: "ordinary", nodes: ordinary });
                ordinary = [];
                const moved = moveImageUnit(nodes, index);
                segments.push({ type: "media", unit: moved.unit });
                index = moved.next;
                continue;
            }
            ordinary.push(node);
            index += 1;
        }
        if (ordinary.length) segments.push({ type: "ordinary", nodes: ordinary });

        const replacement = document.createDocumentFragment();
        let galleryUnits = [];
        let separators = [];
        const flushGallery = () => {
            if (!galleryUnits.length) return;
            replacement.append(createGallery(galleryUnits));
            galleryUnits = [];
            separators = [];
        };
        const appendOrdinary = (nodesToAppend) => {
            if (!isMeaningful(nodesToAppend)) return;
            const clone = paragraph.cloneNode(false);
            clone.append(...nodesToAppend);
            replacement.append(clone);
        };

        for (const segment of segments) {
            if (segment.type === "media") {
                galleryUnits.push(segment.unit);
                continue;
            }
            if (isMeaningful(segment.nodes)) {
                flushGallery();
                appendOrdinary(segment.nodes);
            } else {
                separators.push(...segment.nodes);
            }
        }
        flushGallery();
        if (!replacement.childNodes.length) return;
        paragraph.replaceWith(replacement);
    }

    function mergeAdjacentGalleries() {
        const children = [...content.childNodes];
        for (let index = 0; index < children.length; index += 1) {
            const gallery = children[index];
            if (!(gallery instanceof HTMLElement) || !gallery.classList.contains("media-gallery")) continue;
            let next = index + 1;
            while (next < children.length && isWhitespace(children[next])) next += 1;
            while (children[next] instanceof HTMLElement && children[next].classList.contains("media-gallery")) {
                gallery.append(...children[next].children);
                children[next].remove();
                next += 1;
                while (next < children.length && isWhitespace(children[next])) next += 1;
            }
        }
    }

    const inlineEmojiSources = {
        agahi: "/emojis/agahi.gif",
        kekw: "/emojis/kekw.png",
        skulk: "/emojis/skulk.png",
        skull: "/emojis/skull.svg",
        sob: "/emojis/sob.svg"
    };

    function replaceEmojiShortcodes() {
        const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                if (!node.textContent.includes(":")) return NodeFilter.FILTER_REJECT;
                if (node.parentElement?.closest("code, pre, script, style")) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });
        const textNodes = [];
        let node;
        while ((node = walker.nextNode())) textNodes.push(node);

        textNodes.forEach((textNode) => {
            const shortcodePattern = /:([A-Za-z0-9_+-]+):/g;
            const fragment = document.createDocumentFragment();
            const text = textNode.textContent;
            let lastIndex = 0;
            let replaced = false;
            let match;

            while ((match = shortcodePattern.exec(text))) {
                const source = inlineEmojiSources[match[1].toLowerCase()];
                if (!source) continue;
                const shortcode = match[0];
                fragment.append(text.slice(lastIndex, match.index));
                const emoji = document.createElement("img");
                emoji.className = "inline-emoji";
                emoji.src = source;
                emoji.alt = shortcode;
                emoji.title = shortcode;
                emoji.draggable = false;
                emoji.decoding = "async";
                emoji.addEventListener("error", () => emoji.replaceWith(document.createTextNode(shortcode)), { once: true });
                fragment.append(emoji);
                lastIndex = match.index + shortcode.length;
                replaced = true;
            }

            if (!replaced) return;
            fragment.append(text.slice(lastIndex));
            textNode.replaceWith(fragment);
        });
    }

    function applyLayout(gallery) {
        const items = [...gallery.querySelectorAll(":scope > .media-gallery-item")];
        const visibleCount = Math.min(items.length, 4);
        gallery.classList.add(`media-gallery--${visibleCount}`);
        if (items.length > 4) {
            const more = document.createElement("span");
            more.className = "media-gallery-more";
            more.textContent = `+${items.length - 4}`;
            items[3].querySelector(".media-gallery-open").append(more);
        }
        items.forEach((item, index) => item.querySelector("button").addEventListener("click", () => openViewer(items, index)));
    }

    const viewer = document.createElement("dialog");
    viewer.className = "media-viewer";
    viewer.innerHTML = `
        <button class="media-viewer-close" type="button" aria-label="Close image viewer">×</button>
        <button class="media-viewer-previous" type="button" aria-label="Previous image">‹</button>
        <figure class="media-viewer-figure"><img alt=""><figcaption></figcaption></figure>
        <button class="media-viewer-next" type="button" aria-label="Next image">›</button>
    `;
    document.body.append(viewer);

    let viewerItems = [];
    let viewerIndex = 0;
    const viewerImage = viewer.querySelector("img");
    const viewerCaption = viewer.querySelector("figcaption");
    const viewerFigure = viewer.querySelector(".media-viewer-figure");
    const previous = viewer.querySelector(".media-viewer-previous");
    const next = viewer.querySelector(".media-viewer-next");

    function fitViewerImage() {
        if (!viewerImage.naturalWidth || !viewerImage.naturalHeight) return;

        const viewportWidth = document.documentElement.clientWidth;
        const viewportHeight = window.innerHeight;
        const captionAllowance = viewerCaption.textContent ? 40 : 0;
        const maxWidth = viewportWidth * 0.94;
        const maxHeight = viewportHeight * 0.92 - captionAllowance;
        const ratio = viewerImage.naturalWidth / viewerImage.naturalHeight;
        const width = Math.min(maxWidth, maxHeight * ratio);

        viewerFigure.style.width = `${Math.max(1, Math.floor(width))}px`;
        viewerImage.style.width = "100%";
    }

    function renderViewer() {
        const item = viewerItems[viewerIndex];
        const original = item.dataset.originalSrc;
        viewerFigure.style.removeProperty("width");
        viewerImage.style.removeProperty("width");
        viewerImage.src = original;
        viewerImage.alt = item.dataset.alt;
        const caption = item.querySelector(".media-gallery-caption")?.textContent?.trim();
        const label = item.dataset.alt;
        viewerCaption.textContent = caption ? caption : label;
        previous.hidden = viewerItems.length < 2;
        next.hidden = viewerItems.length < 2;
        if (viewerImage.complete) fitViewerImage();
    }

    async function openViewer(items, index) {
        viewerItems = items;
        viewerIndex = index;
        renderViewer();
        try {
            await viewerImage.decode();
        } catch {
            // The load listener will fit the image when decoding is unavailable.
        }
        fitViewerImage();
        viewer.showModal();
    }

    function moveViewer(delta) {
        if (viewerItems.length < 2) return;
        viewerIndex = (viewerIndex + delta + viewerItems.length) % viewerItems.length;
        renderViewer();
    }

    viewer.querySelector(".media-viewer-close").addEventListener("click", () => viewer.close());
    previous.addEventListener("click", () => moveViewer(-1));
    next.addEventListener("click", () => moveViewer(1));
    viewerImage.addEventListener("load", fitViewerImage);
    window.addEventListener("resize", () => {
        if (viewer.open) fitViewerImage();
    });
    viewer.addEventListener("click", (event) => {
        if (event.target === viewer) viewer.close();
    });
    document.addEventListener("keydown", (event) => {
        if (!viewer.open) return;
        if (event.key === "ArrowLeft") moveViewer(-1);
        if (event.key === "ArrowRight") moveViewer(1);
    });
    viewer.addEventListener("close", () => { viewerImage.removeAttribute("src"); });

    [...content.querySelectorAll("p")].forEach(transformParagraph);
    mergeAdjacentGalleries();
    [...content.querySelectorAll(".media-gallery")].forEach(applyLayout);
    replaceEmojiShortcodes();
})();
