/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required header row
  const headerRow = ['Columns block (columns17)'];

  // Find the first .grid child that contains columns
  const grid = element.querySelector('.grid');
  if (!grid) return;

  // Only keep direct column children (each with class 'grid' and col-span-*)
  const columnEls = Array.from(grid.children).filter(
    (col) => col.classList.contains('grid')
  );

  // Build the columns row: each cell is a column element
  const columnsRow = columnEls.map((col) => col);

  // Compose the table data
  const tableData = [headerRow, columnsRow];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element
  element.replaceWith(table);
}
