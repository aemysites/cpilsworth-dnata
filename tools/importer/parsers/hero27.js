/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Extract background images (decorative)
  const bgImages = [];
  // These are the absolutely positioned divs with an <img> inside
  element.querySelectorAll('div.absolute').forEach(div => {
    const img = div.querySelector('img');
    if (img) bgImages.push(img);
  });

  // 2. Extract main content (heading, subheading, CTA)
  const cardDiv = element.querySelector('[data-testid="more-info-card"]');
  const contentCell = [];
  if (cardDiv) {
    // Heading (h2)
    const heading = cardDiv.querySelector('h2');
    if (heading) contentCell.push(heading);
    // Subheading (the main card text)
    const subheading = cardDiv.querySelector('.text-22px');
    if (subheading) contentCell.push(subheading);
    // CTA (button-like link)
    const cta = cardDiv.querySelector('a[href]');
    if (cta) contentCell.push(cta);
  }

  // 3. Compose table rows
  const headerRow = ['Hero (hero27)'];
  const bgImageRow = [bgImages.length ? bgImages : ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgImageRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
