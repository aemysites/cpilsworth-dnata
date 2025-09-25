/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Hero (hero41)'];

  // Find the main grid container
  const gridContainer = element.querySelector('.container');

  // Find the text column (contains heading)
  let contentCell = '';
  if (gridContainer) {
    // Find the column by class substring match
    let textCol = null;
    Array.from(gridContainer.children).forEach((child) => {
      if (
        child.className.includes('col-span-10') ||
        child.className.includes('col-span-8')
      ) {
        textCol = child;
      }
    });
    if (textCol) {
      // Find the heading element (h1)
      const heading = textCol.querySelector('h1');
      if (heading) {
        contentCell = heading;
      }
    }
  }

  // No background image in the provided HTML
  const backgroundRow = [''];
  const contentRow = [contentCell];

  const cells = [headerRow, backgroundRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
