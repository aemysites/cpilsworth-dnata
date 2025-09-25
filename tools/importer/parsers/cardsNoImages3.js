/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card content from a .infoBox-box
  function extractCardContent(box) {
    // If the box contains a link, use its content, else use the direct .infoBox-item
    const link = box.querySelector('a');
    let cardContent;
    if (link) {
      // Use the .infoBox-item inside the link
      cardContent = link.querySelector('.infoBox-item');
      // For cards with a link, wrap the content in an <a> with the href, but only if the content is not already a link
      // However, block expects the link as a CTA at the bottom, not wrapping the whole card
      // So we extract the main content, and if there's a link, add a CTA link at the bottom
      // We'll build a fragment
      const frag = document.createElement('div');
      // Get the title (p.body1) and description (div.heading6)
      const title = cardContent.querySelector('p.body1');
      const desc = cardContent.querySelector('div.heading6');
      if (title) {
        const h = document.createElement('strong');
        h.textContent = title.textContent.trim();
        frag.appendChild(h);
      }
      if (desc) {
        frag.appendChild(document.createElement('br'));
        frag.appendChild(document.createTextNode(desc.textContent.trim()));
      }
      // Add CTA link at the bottom
      frag.appendChild(document.createElement('br'));
      const cta = document.createElement('a');
      cta.href = link.href;
      // Use the title as CTA text if available, else fallback
      cta.textContent = title ? title.textContent.trim() : 'Learn more';
      frag.appendChild(cta);
      return frag;
    } else {
      // No link: just use the .infoBox-item
      cardContent = box.querySelector('.infoBox-item');
      const frag = document.createElement('div');
      const title = cardContent.querySelector('p.body1');
      const desc = cardContent.querySelector('div.heading6');
      if (title) {
        const h = document.createElement('strong');
        h.textContent = title.textContent.trim();
        frag.appendChild(h);
      }
      if (desc) {
        frag.appendChild(document.createElement('br'));
        frag.appendChild(document.createTextNode(desc.textContent.trim()));
      }
      return frag;
    }
  }

  // Get all the .infoBox-box children
  const boxes = Array.from(element.querySelectorAll(':scope > .infoBox-box'));
  const rows = [];
  // Header row
  rows.push(['Cards (cardsNoImages3)']);
  // Each card as a row
  boxes.forEach((box) => {
    rows.push([extractCardContent(box)]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
