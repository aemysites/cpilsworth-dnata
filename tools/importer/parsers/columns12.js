/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children divs
  const mainGrid = element.querySelector('[data-testid="rich-text-with-image"]');
  if (!mainGrid) return;
  const gridChildren = mainGrid.querySelectorAll(':scope > div');
  if (gridChildren.length < 2) return;

  // The left column (text)
  const leftCol = gridChildren[0];
  // The right column (image)
  const rightCol = gridChildren[1];

  // Defensive: swap if order is reversed (due to responsive order classes)
  // The column with an <img> inside is the image column
  let textCol, imageCol;
  if (leftCol.querySelector('img')) {
    imageCol = leftCol;
    textCol = rightCol;
  } else {
    textCol = leftCol;
    imageCol = rightCol;
  }

  // Get the visible heading (desktop: in textCol, mobile: in imageCol)
  let heading = textCol.querySelector('h3');
  if (!heading) heading = imageCol.querySelector('h3');

  // Get the visible paragraph (desktop: in textCol, mobile: in textCol)
  // Avoid using invalid pseudo-classes
  let paragraph = null;
  // Try to find the first <p> in textCol
  const allParagraphs = textCol.querySelectorAll('p');
  if (allParagraphs.length > 0) {
    paragraph = allParagraphs[0];
  }

  // Compose the text column content
  const textContent = [];
  if (heading) textContent.push(heading);
  if (paragraph) textContent.push(paragraph);

  // Get the main image (first <img> in imageCol)
  const image = imageCol.querySelector('img');
  // Only use the main image, not the decorative SVG
  let imageContent = null;
  if (image && image.closest('picture')) {
    imageContent = image.closest('picture');
  } else if (image) {
    imageContent = image;
  }

  // Compose the table rows
  const headerRow = ['Columns block (columns12)'];
  const contentRow = [textContent, imageContent];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
