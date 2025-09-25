/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract text content from a node, fallback to empty string
  function getTextContent(node) {
    return node ? node.textContent.trim() : '';
  }

  // Find all carousel items (slides)
  const content = element.querySelector('.ppNews-content');
  if (!content) return;
  const items = Array.from(content.querySelectorAll(':scope > .ppNews-item'));

  // Only process items that have an image (ignore shadow divs, etc)
  const slides = items.filter(item => item.querySelector('img'));

  // Build rows for the block table
  const rows = [];
  // Header row per instructions
  const headerRow = ['Carousel (carousel32)'];
  rows.push(headerRow);

  slides.forEach(item => {
    // Image cell
    const pictureDiv = item.querySelector('.ppPicture-b');
    let img = pictureDiv ? pictureDiv.querySelector('img') : null;
    if (!img) return;

    // Text cell
    let textCellContent = [];
    // Add release tags (categories) if present
    const tagsDiv = item.querySelector('.release_tags');
    if (tagsDiv) {
      const tagLinks = Array.from(tagsDiv.querySelectorAll('a'));
      if (tagLinks.length) {
        const tagContainer = document.createElement('div');
        tagLinks.forEach((link, idx) => {
          tagContainer.appendChild(link.cloneNode(true));
          if (idx < tagLinks.length - 1) {
            tagContainer.appendChild(document.createTextNode(' '));
          }
        });
        textCellContent.push(tagContainer);
      }
    }
    // Add heading and description from .ppText-b
    const textDiv = item.querySelector('.ppText-b');
    if (textDiv) {
      // Heading (h3)
      const heading = textDiv.querySelector('h3');
      if (heading) {
        const headingLink = heading.querySelector('a');
        if (headingLink) {
          const hEl = document.createElement('h3');
          hEl.appendChild(headingLink.cloneNode(true));
          textCellContent.push(hEl);
        } else {
          textCellContent.push(heading.cloneNode(true));
        }
      }
      // Description (p)
      const desc = textDiv.querySelector('p');
      if (desc) {
        const descClone = desc.cloneNode(true);
        // Remove substring_dots span if present
        const dots = descClone.querySelector('.substring_dots');
        if (dots) dots.remove();
        // Remove trailing CTA link from description
        const links = descClone.querySelectorAll('a');
        links.forEach(link => {
          if (link.textContent.match(/Read more/i)) {
            link.remove();
          }
        });
        if (getTextContent(descClone)) {
          textCellContent.push(descClone);
        }
        // Add CTA link as separate element if present
        const ctaLink = desc.querySelector('a');
        if (ctaLink && ctaLink.textContent.match(/Read more/i)) {
          const cta = document.createElement('p');
          cta.appendChild(ctaLink.cloneNode(true));
          textCellContent.push(cta);
        }
      }
    }
    // Defensive: if no text content, leave cell empty
    rows.push([
      img,
      textCellContent.length ? textCellContent : ''
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
