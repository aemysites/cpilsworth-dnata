/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid container (the columns)
  const grid = element.querySelector('.grid.grid-cols-1');
  if (!grid) return;

  // Find direct children of the grid (these are the columns)
  const columns = Array.from(grid.children);

  // Only keep columns that have actual content
  const contentColumns = columns.filter(col => col.textContent.trim() || col.querySelector('img') || col.querySelector('svg'));

  // For this block, we want two columns: left (heading) and right (description)
  // Left column: heading with icon and colored span
  // Right column: paragraph text

  // Find the left column (should contain the h1)
  const leftCol = contentColumns.find(col => col.querySelector('h1'));
  // Find the right column (should contain the paragraph)
  const rightCol = contentColumns.find(col => !col.querySelector('h1'));

  // Defensive: fallback if not found
  const leftCell = leftCol ? leftCol : document.createElement('div');
  const rightCell = rightCol ? rightCol : document.createElement('div');

  // Table header row
  const headerRow = ['Columns block (columns46)'];
  // Table content row: two columns
  const contentRow = [leftCell, rightCell];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace original element
  element.replaceWith(table);
}
