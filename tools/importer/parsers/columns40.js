/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns block (columns40)'];

  // Defensive: Find the stats cards container (the grid)
  // The structure is: container > mx-auto > grid > [card, card, card, card]
  let cardsGrid = null;
  // Try to find the grid by looking for a child with data-testid="stats-block-cards"
  const mxAuto = element.querySelector(':scope > .mx-auto');
  if (mxAuto) {
    cardsGrid = mxAuto.querySelector(':scope > .grid');
  }
  if (!cardsGrid) {
    // fallback: try direct child
    cardsGrid = element.querySelector(':scope > .grid');
  }
  if (!cardsGrid) {
    // fallback: try any child with data-testid
    cardsGrid = element.querySelector('[data-testid="stats-block-cards"]');
  }

  // Defensive: If no cards found, do nothing
  if (!cardsGrid) return;

  // Get all immediate card children
  const cards = Array.from(cardsGrid.querySelectorAll(':scope > div'));
  if (!cards.length) return;

  // Each card becomes a column cell in the second row
  const columnsRow = cards.map(card => card);

  // Build the table
  const cells = [headerRow, columnsRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
