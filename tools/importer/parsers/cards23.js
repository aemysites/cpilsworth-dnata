/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image from <picture>
  function getImage(picture) {
    if (!picture) return null;
    const img = picture.querySelector('img');
    return img || null;
  }

  // Helper to extract text content from card
  function getTextContent(card) {
    // Find the heading
    const heading = card.querySelector('h3');
    // Find the description (award organization)
    const org = card.querySelector('[class*="text-textsecondary"]');
    // Find the year/range
    const year = card.querySelector('[class*="text-1.375rem"]');

    // Compose content
    const content = document.createElement('div');
    if (heading) {
      const h = document.createElement('h3');
      h.textContent = heading.textContent;
      content.appendChild(h);
    }
    if (org) {
      const p = document.createElement('p');
      p.textContent = org.textContent;
      content.appendChild(p);
    }
    if (year) {
      const p = document.createElement('p');
      p.textContent = year.textContent;
      content.appendChild(p);
    }
    return content;
  }

  // Find all swiper-slide cards
  const slidesWrapper = element.querySelector('.swiper-wrapper');
  const slides = slidesWrapper ? Array.from(slidesWrapper.children).filter(child => child.classList.contains('swiper-slide')) : [];

  // Compose table rows
  const headerRow = ['Cards (cards23)'];
  const rows = [headerRow];

  slides.forEach(slide => {
    // Each slide contains the card info
    const cardRoot = slide.querySelector('.flex.h-full.flex-col.justify-between');
    if (!cardRoot) return;
    // Get image
    const picture = cardRoot.querySelector('picture');
    const img = getImage(picture);
    // Get text content
    const textContent = getTextContent(cardRoot);
    // Add row: [image, text content]
    rows.push([img, textContent]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
