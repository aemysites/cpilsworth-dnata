/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Columns block (columns11)'];

  // Defensive: find the grid container (should have two main children: text and image columns)
  const grid = element.querySelector('.grid');
  if (!grid) return;
  const gridChildren = Array.from(grid.children);

  // Find the text/content column (usually col-span-12 bg-slate-600 ...)
  const textCol = gridChildren.find((col) => col.className && col.className.includes('col-span-12') && col.className.includes('bg-slate-600'));
  // Find the image/media column (usually col-span-12 bg-stone-600 ...)
  const imgCol = gridChildren.find((col) => col.className && col.className.includes('col-span-12') && col.className.includes('bg-stone-600'));

  // Defensive: if not found, fallback to first/second child
  const leftCol = textCol || gridChildren[0];
  const rightCol = imgCol || gridChildren[1];

  // --- LEFT COLUMN CONTENT ---
  // Find the main heading (h1), description (paragraphs), and button
  let leftContent = [];
  if (leftCol) {
    // Find h1
    const h1 = leftCol.querySelector('h1');
    if (h1) leftContent.push(h1);
    // Find paragraphs (inside .leading-130 or similar)
    const desc = leftCol.querySelector('.leading-130, .text-22px');
    if (desc) leftContent.push(desc);
    // Find button (a)
    const button = leftCol.querySelector('a');
    if (button) leftContent.push(button);
  }

  // --- RIGHT COLUMN CONTENT ---
  let rightContent = [];
  if (rightCol) {
    // Find image (img inside picture)
    const img = rightCol.querySelector('img');
    if (img) rightContent.push(img);
  }

  // Build the table rows
  const rows = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
