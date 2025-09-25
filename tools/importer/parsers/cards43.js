/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract cards from swiper-slide elements
  function extractCards(container) {
    const cards = [];
    // Get all direct swiper-slide children
    const slides = container.querySelectorAll(':scope > .swiper-slide');
    slides.forEach((slide) => {
      // Find the image
      let imageEl = null;
      const img = slide.querySelector('img');
      if (img) imageEl = img;
      // Find the title (the bottom-placed <a> text)
      let titleEl = null;
      const titleContainer = slide.querySelector('.absolute.bottom-3');
      if (titleContainer) {
        const titleLink = titleContainer.querySelector('a');
        if (titleLink) {
          // Create a heading element for the title
          const h3 = document.createElement('h3');
          h3.textContent = titleLink.textContent.trim();
          titleEl = h3;
        }
      }
      // Compose the card row: [image, text]
      const cardRow = [
        imageEl,
        titleEl ? [titleEl] : ['']
      ];
      cards.push(cardRow);
    });
    return cards;
  }

  // Find the swiper-wrapper containing the cards
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  // Build the table rows
  const headerRow = ['Cards (cards43)'];
  const cardRows = extractCards(swiperWrapper);

  // Compose the table data
  const tableData = [headerRow, ...cardRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element
  element.replaceWith(block);
}
