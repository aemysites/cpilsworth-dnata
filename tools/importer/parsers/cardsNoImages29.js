/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct child columns (cards)
  const cardDivs = element.querySelectorAll(':scope > div');

  // Table header row as required
  const headerRow = ['Cards (cardsNoImages29)'];
  const rows = [headerRow];

  // For each card column (there are 3)
  cardDivs.forEach((colDiv) => {
    // Each colDiv contains a .pp-footer-module div
    const cardModule = colDiv.querySelector(':scope > div');
    if (!cardModule) return;

    const cellContent = [];

    // Heading (optional)
    const heading = cardModule.querySelector('h3');
    if (heading) cellContent.push(heading);

    // Description (all <p> except those that contain only a link)
    const paragraphs = Array.from(cardModule.querySelectorAll('p'));
    paragraphs.forEach((p) => {
      const links = p.querySelectorAll('a');
      // If p contains only a link (possibly with whitespace), treat as CTA
      if (links.length === 1 && p.textContent.trim() === links[0].textContent.trim()) {
        return;
      }
      cellContent.push(p);
    });

    // CTA (optional): <a> whose parent is <p> and is the only child
    paragraphs.forEach((p) => {
      const links = p.querySelectorAll('a');
      if (links.length === 1 && p.textContent.trim() === links[0].textContent.trim()) {
        cellContent.push(links[0]);
      }
    });

    // Add card row (single cell)
    rows.push([cellContent]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
