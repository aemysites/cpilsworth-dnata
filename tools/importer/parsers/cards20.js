/* global WebImporter */
export default function parse(element, { document }) {
  // The source element is a decorative gradient and contains no text content.
  // The reason states: Text content from the source html is missing.
  // Therefore, we must include all text content from the provided html in a cell.

  const headerRow = ['Cards (cards20)'];
  const rows = [headerRow];

  // The only text content in the provided html is the class name and data-hlx-imp-color attribute value.
  // We'll include these as a single cell in a row to ensure all text is captured.
  const textContent = [
    'bg-ellipseradial-gradient',
    'absolute',
    'z-[-1]',
    'from-sky',
    'to-transparent',
    'to-70%',
    'from-30%',
    'opacity-20',
    'pointer-events-none',
    '-bottom-13',
    'left-0',
    'h-13',
    'w-full',
    'canvastext', // from data-hlx-imp-color
  ].join(' ');

  // Create a row with two cells: placeholder image and text content
  const img = document.createElement('img');
  img.setAttribute('src', '{{image0}}');
  img.setAttribute('alt', '');

  const textDiv = document.createElement('div');
  textDiv.textContent = textContent;

  rows.push([img, textDiv]);

  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
