/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children
  const getDirectChildren = (parent, selector) => {
    return Array.from(parent.children).filter((el) => el.matches(selector));
  };

  // The block header row
  const headerRow = ['Columns (columns13)'];

  // The top-level element has two main children for the two columns
  // First column: left (station dropdown)
  // Second column: right (status/time info)
  // We'll use the two direct child divs as columns
  const columns = getDirectChildren(element, 'div');

  // Defensive: if not exactly 2 columns, fallback to all content in one cell
  let contentRow;
  if (columns.length === 2) {
    contentRow = [columns[0], columns[1]];
  } else {
    contentRow = [element];
  }

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
