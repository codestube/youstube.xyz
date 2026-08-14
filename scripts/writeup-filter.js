document.addEventListener("DOMContentLoaded", function() {
    const archive = document.querySelector("[data-archive]");
    if (!archive) {
        return;
    }

    const buttons = Array.from(archive.querySelectorAll("[data-filter]"));
    const cards = Array.from(archive.querySelectorAll("[data-post-type]"));
    const emptyState = archive.querySelector("[data-filter-empty]");
    const status = archive.querySelector("[data-filter-status]");

    const counts = cards.reduce((result, card) => {
        const type = card.dataset.postType;
        result[type] = (result[type] || 0) + 1;
        return result;
    }, { ctf: 0, blog: 0 });

    Object.entries(counts).forEach(([type, count]) => {
        const countElement = archive.querySelector(`[data-filter-count="${type}"]`);
        if (countElement) {
            countElement.textContent = count;
        }
    });

    function applyFilter(filter) {
        let visibleCount = 0;

        cards.forEach((card) => {
            const visible = card.dataset.postType === filter;
            card.hidden = !visible;
            if (visible) {
                visibleCount += 1;
            }
        });

        buttons.forEach((button) => {
            const active = button.dataset.filter === filter;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });

        emptyState.hidden = visibleCount !== 0;
        status.textContent = `${visibleCount} ${visibleCount === 1 ? "post" : "posts"} shown`;
    }

    buttons.forEach((button) => {
        button.addEventListener("click", function() {
            applyFilter(button.dataset.filter);
        });
    });

    const initialButton = buttons.find((button) => button.getAttribute("aria-pressed") === "true") || buttons[0];
    if (initialButton) {
        applyFilter(initialButton.dataset.filter);
    }
});
