/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Hero (hero47)'];

  // Find the background image for the hero block
  let backgroundImg = null;
  let maxArea = 0;
  const imgCandidates = element.querySelectorAll('img');
  for (const img of imgCandidates) {
    if (
      img.src &&
      !img.src.includes('map-pin-default.png') &&
      !img.src.includes('markerclusterer') &&
      !img.src.includes('transparent.png') &&
      !img.src.startsWith('data:image/svg+xml')
    ) {
      const area = (img.naturalWidth || img.width) * (img.naturalHeight || img.height);
      if (area > maxArea) {
        backgroundImg = img;
        maxArea = area;
      }
    }
  }
  // Compose table rows: always 3 rows, but image row is empty only if no image
  const cells = [headerRow];
  if (backgroundImg) {
    cells.push([backgroundImg.cloneNode(true)]);
  } else {
    cells.push(['']);
  }

  // Find the main text content for the hero block
  // Use less specific selectors to capture all visible text content
  let lines = [];
  // Try to find visually prominent heading (h1, h2, h3, p) in the entire element
  const headingTags = ['h1', 'h2', 'h3', 'p'];
  for (const tag of headingTags) {
    const el = element.querySelector(tag);
    if (el && el.textContent.trim()) {
      lines.push(el.textContent.trim());
    }
  }
  // If not enough lines, try to get more text from the largest visible element
  if (lines.length < 4) {
    // Find all elements with text
    const allEls = Array.from(element.querySelectorAll('*'));
    allEls.forEach((el) => {
      if (lines.length >= 4) return;
      if (el.childElementCount === 0 && el.textContent.trim() && !lines.includes(el.textContent.trim())) {
        lines.push(el.textContent.trim());
      }
    });
  }

  // Compose content cell as block elements: h1, h2, h3, p (if present)
  const frag = document.createDocumentFragment();
  if (lines[0]) {
    const h1 = document.createElement('h1');
    h1.textContent = lines[0];
    frag.appendChild(h1);
  }
  if (lines[1]) {
    const h2 = document.createElement('h2');
    h2.textContent = lines[1];
    frag.appendChild(h2);
  }
  if (lines[2]) {
    const h3 = document.createElement('h3');
    h3.textContent = lines[2];
    frag.appendChild(h3);
  }
  if (lines[3]) {
    const p = document.createElement('p');
    p.textContent = lines[3];
    frag.appendChild(p);
  }
  const textCell = frag.childNodes.length > 0 ? frag : '';

  cells.push([textCell || '']);

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
