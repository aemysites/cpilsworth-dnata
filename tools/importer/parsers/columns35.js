/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children
  function getImmediateChildren(parent, selector = 'div') {
    return Array.from(parent.querySelectorAll(`:scope > ${selector}`));
  }

  // Find the main grid row containing the columns
  const grid = element.querySelector('.grid.grid-cols-1');
  if (!grid) return;

  // Get the two main column divs (left and right)
  const columns = getImmediateChildren(grid);
  if (columns.length < 2) return;

  // Left column: headline with icon
  const leftCol = columns[0];
  let leftContent;
  // The headline is the h1
  const h1 = leftCol.querySelector('h1');
  if (h1) {
    leftContent = h1;
  } else {
    leftContent = leftCol;
  }

  // Right column: list and description
  const rightCol = columns[1];
  let rightContent;
  // The paragraph and ul are inside a .type-action-hyperlink-style
  const descWrapper = rightCol.querySelector('.type-action-hyperlink-style');
  if (descWrapper) {
    rightContent = descWrapper;
  } else {
    rightContent = rightCol;
  }

  // Table header
  const headerRow = ['Columns block (columns35)'];
  // Table content row: two columns side by side
  const contentRow = [leftContent, rightContent];

  // Build table and replace
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);
  element.replaceWith(table);
}
