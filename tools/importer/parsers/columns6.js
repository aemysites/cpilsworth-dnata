/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find((el) => el.classList.contains(className));
  }

  // Get left (image) and right (content) columns
  const imageCol = getChildByClass(element, 'assistance-image');
  const bodyCol = getChildByClass(element, 'assistance-card-body');

  // Defensive: If not found, fallback to all children
  const columns = [imageCol, bodyCol].map((col, idx) => col || element.children[idx]);

  // For left column: try to find a real image (none in source), else use the image container
  let leftContent = null;
  if (columns[0]) {
    // If there's an <img> inside, use it, else use the whole div
    const img = columns[0].querySelector('img');
    leftContent = img || columns[0];
  }

  // For right column: heading and buttons
  let rightContent = document.createElement('div');
  if (columns[1]) {
    // Heading
    const heading = columns[1].querySelector('.heading3');
    if (heading) rightContent.appendChild(heading);
    // All buttons
    const buttons = columns[1].querySelectorAll('.button');
    buttons.forEach((btn) => {
      rightContent.appendChild(btn);
    });
  }

  // Compose table rows
  const headerRow = ['Columns block (columns6)'];
  const contentRow = [leftContent, rightContent];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace original element
  element.replaceWith(table);
}
