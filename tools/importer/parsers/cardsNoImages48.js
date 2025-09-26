/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name and variant as the header row
  const headerRow = ['Cards (cardsNoImages48)'];
  const rows = [headerRow];

  // The grid container is the first child of the top-level element
  const grid = element.querySelector(':scope > div');
  if (!grid) return;
  const cardDivs = Array.from(grid.children);

  cardDivs.forEach((cardDiv) => {
    // Only process actual card divs (skip if not an element)
    if (!(cardDiv instanceof HTMLElement)) return;
    // Collect all card content in a single cell
    const cellContent = [];

    // Heading (optional)
    const heading = cardDiv.querySelector('h4');
    if (heading) cellContent.push(heading.cloneNode(true));

    // Description (optional)
    const descContainer = cardDiv.querySelector('.type-action-hyperlink-style');
    if (descContainer) {
      const descText = descContainer.querySelector('div') || descContainer;
      if (descText) cellContent.push(descText.cloneNode(true));
    }

    // CTA (optional)
    const cta = cardDiv.querySelector('a');
    if (cta) cellContent.push(cta.cloneNode(true));

    // Only add row if there is at least one real content element (not empty)
    if (cellContent.length > 0 && cellContent.some(node => node.textContent.trim().length > 0)) {
      rows.push([cellContent]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
