/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only proceed if element is present
  if (!element) return;

  // Create header row per block requirements
  const headerRow = ['Columns block (columns19)'];

  // The element is a background gradient div with no visible content.
  // To avoid unnecessary empty columns or rows, do not create any additional rows.
  // Only the header row should be present.
  const cells = [headerRow];

  // Replace the original element with the new block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
