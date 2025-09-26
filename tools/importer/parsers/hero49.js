/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image (background asset)
  let imageEl = null;
  const img = element.querySelector('picture img');
  if (img) {
    imageEl = img.cloneNode(true);
  }

  // Find the text content (title, subheading, paragraph)
  let textFragment = document.createDocumentFragment();
  const description = element.querySelector('[data-testid="mobile-description"]');
  if (description) {
    Array.from(description.children).forEach(child => {
      textFragment.appendChild(child.cloneNode(true));
    });
  }

  // Table rows
  const headerRow = ['Hero (hero49)'];
  const imageRow = [imageEl ? imageEl : ''];
  const textRow = [textFragment.childNodes.length ? textFragment : ''];

  // Create table
  const cells = [headerRow, imageRow, textRow];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(blockTable);
}
