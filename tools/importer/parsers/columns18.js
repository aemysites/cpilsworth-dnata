/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get all immediate children (should be two columns)
  const children = Array.from(element.children);
  // Find the two columns: links and copyright
  let linksDiv = null;
  let copyrightDiv = null;
  if (children.length === 2) {
    linksDiv = children[0];
    copyrightDiv = children[1];
  } else {
    // fallback: try to find by class or content
    linksDiv = element.querySelector('div:has(a)');
    copyrightDiv = element.querySelector('div:not(:has(a))');
  }

  // Defensive: if not found, create empty divs
  if (!linksDiv) {
    linksDiv = document.createElement('div');
  }
  if (!copyrightDiv) {
    copyrightDiv = document.createElement('div');
  }

  // Build the table rows
  const headerRow = ['Columns block (columns18)'];
  const contentRow = [linksDiv, copyrightDiv];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
