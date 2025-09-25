/* global WebImporter */
export default function parse(element, { document }) {
  // Get the direct card containers (each card is a direct child of the inner flex/grid)
  const cardContainers = Array.from(element.querySelectorAll(':scope > div > div'));

  // Table header must match block name exactly
  const headerRow = ['Cards (cards22)'];
  const rows = [headerRow];

  cardContainers.forEach(card => {
    // Find the card image (img inside picture)
    const img = card.querySelector('picture img');
    const imageCell = img || '';

    // Find the card title (the last .absolute.bottom-3 ... a.flex)
    let title = '';
    const titleDiv = card.querySelector('.absolute.bottom-3');
    if (titleDiv) {
      // Find the last <a> inside titleDiv
      const titleLink = Array.from(titleDiv.querySelectorAll('a')).pop();
      if (titleLink) {
        // Use <strong> for heading style, preserve text
        const strong = document.createElement('strong');
        strong.textContent = titleLink.textContent.trim();
        title = strong;
      }
    }

    // Compose text cell (title only)
    // Each card should be a single row with image and text (no empty or duplicate rows)
    rows.push([imageCell, title ? [title] : []]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
