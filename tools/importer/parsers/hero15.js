/* global WebImporter */
export default function parse(element, { document }) {
  // Find the best background image (map tile)
  function findBackgroundImage(el) {
    const imgs = el.querySelectorAll('img');
    for (const img of imgs) {
      const src = img.getAttribute('src') || '';
      if (src.includes('mapsresources-pa.googleapis.com')) {
        return img;
      }
    }
    return '';
  }

  // Find the main heading and all visible text in the top-left area
  function findTextContent(el) {
    // Look for the top-left label ("Explore our network")
    let textContent = [];
    // Try to find a heading or prominent label
    // Use less specific selectors to include more text
    const possibleText = [];
    // Add all text from all divs, but filter out map UI
    el.querySelectorAll('div').forEach(div => {
      const txt = div.textContent.trim();
      if (txt) possibleText.push(txt);
    });
    // Remove duplicates and filter out known map UI text
    textContent = possibleText.filter((txt, idx, arr) => {
      if (arr.indexOf(txt) !== idx) return false;
      return !/Keyboard shortcuts|Terms|Map data|Google|Report a map error|plus-button|minus-button/i.test(txt);
    });
    // Only keep the first non-empty string (the main text label)
    if (textContent.length > 0) {
      // Use the first as heading, others as paragraphs
      const frag = document.createDocumentFragment();
      textContent.forEach((txt, i) => {
        if (i === 0) {
          const h2 = document.createElement('h2');
          h2.textContent = txt;
          frag.appendChild(h2);
        } else {
          const p = document.createElement('p');
          p.textContent = txt;
          frag.appendChild(p);
        }
      });
      return frag;
    }
    return '';
  }

  // Find a CTA link (Google Maps link in bottom left)
  function findCTA(el) {
    const cta = el.querySelector('a[aria-label*="Google Maps"]');
    if (cta) {
      const link = document.createElement('a');
      link.href = cta.href;
      link.textContent = 'Open in Google Maps';
      return link;
    }
    return '';
  }

  const headerRow = ['Hero (hero15)'];
  const imageRow = [findBackgroundImage(element)];
  const textRowContent = [];
  const textFrag = findTextContent(element);
  if (textFrag) textRowContent.push(textFrag);
  const cta = findCTA(element);
  if (cta) textRowContent.push(cta);
  const textRow = [textRowContent.length > 0 ? textRowContent : ''];

  const cells = [
    headerRow,
    imageRow,
    textRow,
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
