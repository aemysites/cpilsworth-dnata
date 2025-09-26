/* global WebImporter */
export default function parse(element, { document }) {
  // The element is a background gradient, not a card. But the block requires a card with an image/icon in the first cell.
  // Use the gradient as a pseudo-image/icon (as HTML), and a minimal description in the second cell.

  const headerRow = ['Cards (cards28)'];
  // Use the gradient div's outerHTML as the image/icon (first cell)
  // Use a descriptive text for the second cell
  const cardRow = [element.outerHTML, 'Background gradient'];

  const rows = [headerRow, cardRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
