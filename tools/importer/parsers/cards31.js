/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image from <picture>
  function getImage(picture) {
    if (!picture) return null;
    const img = picture.querySelector('img');
    return img || null;
  }

  // Find all card containers
  const cardsContainer = element.querySelector('.flex.flex-wrap');
  const cardDivs = cardsContainer ? Array.from(cardsContainer.children) : [];

  // Build the table rows
  const rows = [];
  // Header row
  const headerRow = ['Cards (cards31)'];
  rows.push(headerRow);

  // For each card, extract image and text
  cardDivs.forEach(card => {
    // Image/icon
    const picture = card.querySelector('picture');
    const img = getImage(picture);

    // Title (h3)
    const title = card.querySelector('h3');

    // Description/location (div.text-textsecondary)
    const desc = card.querySelector('.text-textsecondary');

    // Additional description (div with class containing 'text-1.375rem')
    let extraDesc = null;
    const extraDescCandidates = card.querySelectorAll('div');
    extraDescCandidates.forEach(div => {
      if (div.className && div.className.includes('text-1.375rem')) {
        if (div.textContent.trim()) extraDesc = div;
      }
    });

    // Compose text cell
    const textCellContent = [];
    if (title) textCellContent.push(title);
    if (desc && desc.textContent.trim()) textCellContent.push(desc);
    if (extraDesc && extraDesc.textContent.trim()) textCellContent.push(extraDesc);

    rows.push([
      img || '',
      textCellContent
    ]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
