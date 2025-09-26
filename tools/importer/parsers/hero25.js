/* global WebImporter */
export default function parse(element, { document }) {
  // Find the background image (must reference the <img> element, not clone or use URL)
  let imgEl = null;
  const videoModal = element.querySelector('[data-testid="videomodal"]');
  if (videoModal) {
    const picture = videoModal.querySelector('picture');
    if (picture) {
      imgEl = picture.querySelector('img');
    }
  }

  // Find the text content block (title, subheading, paragraph)
  let textBlock = null;
  const descDiv = element.querySelector('[data-testid="mobile-description"]');
  if (descDiv) {
    textBlock = descDiv;
  }

  // Build the table as per block spec and example markdown
  const headerRow = ['Hero (hero25)'];
  const imageRow = [imgEl ? imgEl : '']; // Reference the actual image element
  const textRow = [textBlock ? textBlock : '']; // Reference the actual text block

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    textRow,
  ], document);

  element.replaceWith(table);
}
