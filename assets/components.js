const navItems = [
    { id: "profile", label: "Profile", path: "index.html" },
    { id: "background", label: "Background", path: "pages/background.html" },
    { id: "publications", label: "Publications", path: "pages/publications.html" },
    { id: "materials", label: "Materials", path: "pages/materials.html" },
    { id: "cv", label: "CV", path: "pages/cv.html" },
    { id: "contact", label: "Contact", path: "pages/contact.html" }
];
const rootPrefix = window.location.pathname.includes("/pages/") ? "../" : "";

const icons = {
    email: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M2 4.5a1.5 1.5 0 0 1 1.5-1.5h13a1.5 1.5 0 0 1 1.5 1.5v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 2 15.5v-11Zm1.8-.3L10 8.21l6.2-4.01H3.8Zm12.7 1.77L10.4 10.9a.5.5 0 0 1-.8 0L3.5 5.97v9.53a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5V5.97Z"/></svg>',
    scholar: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M2.5 6.5 10 2l7.5 4.5-2.05 1.23A4.5 4.5 0 0 1 10 15.53V18l6-1.5v-2.11a4.5 4.5 0 0 0-3-4.24l.02-.01L17.5 6.5 10 11 2.5 6.5Zm7.5 5.25a3 3 0 0 1 3 3v1.54l-3 0.75-3-0.75V14.75a3 3 0 0 1 3-3Z"/></svg>',
    github: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.6a8.4 8.4 0 0 0-2.66 16.36c.42.08.58-.18.58-.4v-1.4c-2.37.52-2.87-1.14-2.87-1.14-.38-.95-.92-1.21-.92-1.21-.75-.51.06-.5.06-.5.83.06 1.27.86 1.27.86.74 1.27 1.93.9 2.4.69.08-.54.29-.9.52-1.11-1.89-.21-3.88-.95-3.88-4.26 0-.94.34-1.7.9-2.3-.09-.22-.39-1.11.09-2.32 0 0 .72-.23 2.36.88a8.1 8.1 0 0 1 4.3 0c1.64-1.11 2.36-.88 2.36-.88.48 1.21.18 2.1.09 2.32.56.6.9 1.36.9 2.3 0 3.32-2 4.04-3.9 4.25.3.26.57.77.57 1.56v2.31c0 .22.16.48.58.4A8.4 8.4 0 0 0 10 1.6Z"/></svg>',
    linkedin: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.43 6.58H1.67V18h2.76V6.58ZM3.05 2a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2ZM7.06 6.58V18h2.76v-5.54c0-1.46.28-2.87 2.08-2.87 1.77 0 1.8 1.66 1.8 2.96V18h2.76v-5.98c0-2.96-.64-5.25-4.04-5.25-1.64 0-2.74.9-3.19 1.76h-.04V6.58H7.06Z"/></svg>'
};

const socialLinks = [
    { label: "atodorov.rs@gmail.com", href: "mailto:atodorov.rs@gmail.com", icon: "email", external: false },
    { label: "Google Scholar", href: "https://scholar.google.com/citations?user=bu67WRgAAAAJ&hl=en", icon: "scholar", external: true },
    { label: "GitHub", href: "https://github.com/atodorov284", icon: "github", external: true },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/aleksandar-todorov-26b756213/", icon: "linkedin", external: true }
];

const socialLinksTemplate = `
    <ul class="social-links">
        ${socialLinks
            .map(({ label, href, icon, external }) => {
                const attrs = external ? ' target="_blank" rel="noopener"' : "";
                return `<li><a href="${href}"${attrs}>${icons[icon]}<span>${label}</span></a></li>`;
            })
            .join("")}
    </ul>
`;

let pageHeaderTemplatePromise;

const loadPageHeaderTemplate = () => {
    if (!pageHeaderTemplatePromise) {
        pageHeaderTemplatePromise = fetch(`${rootPrefix}assets/header.html`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Unable to load header template: ${response.status}`);
                }
                return response.text();
            })
            .then((html) => {
                const template = document.createElement("template");
                template.innerHTML = html.trim();
                return template;
            })
            .catch((error) => {
                console.error(error);
                return null;
            });
    }

    return pageHeaderTemplatePromise;
};

const formatLastUpdated = () => {
    const parsed = new Date(document.lastModified);
    if (Number.isNaN(parsed.getTime())) {
        return document.lastModified;
    }

    return parsed.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
};

document.addEventListener("DOMContentLoaded", () => {
    const activePage = document.body.dataset.page || "";

    document.querySelectorAll('[data-component="navigation"]').forEach((nav) => {
        nav.setAttribute("aria-label", "Primary");
        nav.innerHTML = navItems
            .map(({ id, label, path }) => {
                const isActive = id === activePage;
                const classAttr = isActive ? ' class="active"' : "";
                const ariaCurrent = isActive ? ' aria-current="page"' : "";
                const href = `${rootPrefix}${path}`;
                return `<a href="${href}"${classAttr}${ariaCurrent}>${label}</a>`;
            })
            .join("\n");
    });

    document.querySelectorAll('[data-component="social-links"]').forEach((container) => {
        container.innerHTML = socialLinksTemplate;
    });

    const pageHeaderPlaceholders = document.querySelectorAll('[data-component="page-header"]');
    if (pageHeaderPlaceholders.length > 0) {
        loadPageHeaderTemplate().then((template) => {
            pageHeaderPlaceholders.forEach((placeholder) => {
                const title = placeholder.dataset.title || "";
                const subtitle = placeholder.dataset.subtitle || "";

                if (!template) {
                    const fallbackHeader = document.createElement("header");
                    fallbackHeader.className = "page-header";

                    const fallbackTitle = document.createElement("h1");
                    fallbackTitle.textContent = title;
                    fallbackHeader.appendChild(fallbackTitle);

                    if (subtitle) {
                        const fallbackSubtitle = document.createElement("p");
                        fallbackSubtitle.textContent = subtitle;
                        fallbackHeader.appendChild(fallbackSubtitle);
                    }

                    placeholder.replaceWith(fallbackHeader);
                    return;
                }

                const headerFragment = template.content.cloneNode(true);
                const titleSlot = headerFragment.querySelector('[data-slot="title"]');
                const subtitleSlot = headerFragment.querySelector('[data-slot="subtitle"]');

                if (titleSlot) {
                    titleSlot.textContent = title;
                }

                if (subtitleSlot) {
                    if (subtitle) {
                        subtitleSlot.textContent = subtitle;
                    } else {
                        subtitleSlot.remove();
                    }
                }

                placeholder.replaceWith(headerFragment);
            });
        });
    }

    document.querySelectorAll('[data-component="footer"]').forEach((footer) => {
        footer.innerHTML = `
            ${socialLinksTemplate}
            <p class="last-updated">Last updated: ${formatLastUpdated()}</p>
        `;
    });
});
