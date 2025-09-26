/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as header
  const headerRow = ['Columns (columns44)'];

  // The source HTML is a decorative gradient div with no content for columns.
  // But per feedback, text content from the source html is missing.
  // To be maximally flexible, if the element has any text content, include it in a column.
  // If not, do not output a columns row at all (just the header row).
  const text = element.textContent && element.textContent.trim();
  const rows = [headerRow];
  if (text) {
    rows.push([text]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
