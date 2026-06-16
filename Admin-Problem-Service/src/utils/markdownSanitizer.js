import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import TurndownService from "turndown";

function sanitizeMarkdownContent(markdownContent) {

    // Markdown -> HTML
    const html =
        marked.parse(markdownContent);

    // Sanitize HTML
    const cleanHtml =
        sanitizeHtml(html, {
            allowedTags:
                sanitizeHtml.defaults.allowedTags,
        });

    // HTML -> Markdown
    const turndownService =
        new TurndownService();

    const markdown =
        turndownService.turndown(cleanHtml);

    return markdown;
}

export default sanitizeMarkdownContent;