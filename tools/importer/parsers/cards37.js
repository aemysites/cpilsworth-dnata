/* global WebImporter */
export default function parse(element, { document }) {
  const cardWrappers = Array.from(element.querySelectorAll(':scope > div'));
  const headerRow = ['Cards (cards37)'];
  const rows = [headerRow];

  cardWrappers.forEach((cardWrapper) => {
    let card = cardWrapper;
    if (cardWrapper.children.length === 1) {
      card = cardWrapper.firstElementChild;
    }

    // Find the image (picture or img)
    let imgEl = null;
    const picture = card.querySelector('picture');
    if (picture) {
      imgEl = picture.querySelector('img');
    }

    // Find the title (h4)
    const titleEl = card.querySelector('h4');

    // Find the description (look for .type-body-small-regular or p)
    let descEl = null;
    const descContainer = card.querySelector('.type-body-small-regular');
    if (descContainer) {
      const p = descContainer.querySelector('p');
      if (p) {
        descEl = p;
      } else {
        descEl = descContainer;
      }
    } else {
      descEl = card.querySelector('p');
    }

    // Find CTA (linked text at the bottom, if present)
    let ctaEl = null;
    if (descContainer) {
      const a = descContainer.querySelector('a');
      if (a) {
        ctaEl = a;
      }
    }

    // Compose the text cell
    const textCellContent = [];
    if (titleEl) textCellContent.push(titleEl);
    if (descEl) textCellContent.push(descEl);
    if (ctaEl) textCellContent.push(ctaEl);

    // Only add rows that have at least image or text content
    if (imgEl || textCellContent.length > 0) {
      rows.push([
        imgEl ? imgEl : '',
        textCellContent.length > 0 ? textCellContent : ''
      ]);
    }
  });

  // Remove any rows that are completely empty (shouldn't happen, but just in case)
  // Also, ensure NO empty rows are present (skip any row where both cells are empty)
  // This time, do not add any extra empty rows at all
  const filteredRows = [rows[0]];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const hasImage = row[0] && (row[0].nodeType === 1 || (row[0].outerHTML));
    const hasText = Array.isArray(row[1]) ? row[1].length > 0 : !!row[1];
    if (hasImage || hasText) {
      filteredRows.push(row);
    }
  }

  // Only output the header and actual card rows (no empty rows)
  const block = WebImporter.DOMUtils.createTable(filteredRows, document);
  element.replaceWith(block);
}
