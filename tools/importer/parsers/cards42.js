/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as specified
  const headerRow = ['Cards (cards42)'];
  const rows = [headerRow];

  // Select all card containers (direct children)
  const cardWrappers = Array.from(element.children).filter(child => child.querySelector('.flex'));

  cardWrappers.forEach((cardWrapper) => {
    // Find the card inner container
    const cardInner = cardWrapper.querySelector('.flex');
    if (!cardInner) return;

    // There are two main children: image and text
    const cardChildren = Array.from(cardInner.children);
    let imageContainer = null;
    let textContainer = null;
    // Find the container with a <picture>
    imageContainer = cardChildren.find(c => c.querySelector('picture'));
    // The other is the text container
    textContainer = cardChildren.find(c => c !== imageContainer);
    if (!imageContainer || !textContainer) return;

    // Extract the <picture> element (image)
    const picture = imageContainer.querySelector('picture');
    let imageEl = picture || '';

    // Extract text content: heading and description
    let headingEl = null;
    let descEl = null;
    // Heading is inside h2 (may be nested)
    const h2 = textContainer.querySelector('h2');
    if (h2) {
      headingEl = h2.querySelector('div div') || h2.querySelector('div') || h2;
    }
    // Description is the next div after h2
    const descDiv = textContainer.querySelector('.type-body-small-regular');
    if (descDiv) {
      descEl = descDiv.querySelector('div div') || descDiv.querySelector('div') || descDiv;
    }

    // Compose text cell
    const textCellContent = [];
    if (headingEl) textCellContent.push(headingEl);
    if (descEl) textCellContent.push(descEl);

    // Add the row: [image, text]
    rows.push([
      imageEl,
      textCellContent
    ]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
