/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract text content from a node, fallback to empty string
  function getTextContent(node) {
    return node ? node.textContent.trim() : '';
  }

  // Get all card containers (each .pp_grid)
  const cardRows = Array.from(element.querySelectorAll(':scope .pp_blockheadlines_container .pp_blockheadlines_item_container > .pp_grid'));

  // Collect all card units
  let cardUnits = [];
  cardRows.forEach(row => {
    cardUnits = cardUnits.concat(Array.from(row.querySelectorAll(':scope > .pp_unit')));
  });

  // Build table rows for each card
  const rows = cardUnits.map(unit => {
    // Find image (if present)
    let img = unit.querySelector('.pp_blockheadlines_thumb img');
    let mediaCell = null;
    if (img && img.src) {
      mediaCell = img;
    } else {
      // If no image, try to extract a fallback icon (e.g., a play icon for video)
      // If not present, use a placeholder image
      const placeholder = document.createElement('img');
      placeholder.src = 'https://www.adobe.com/content/dam/cc/icons/experience-cloud-no-image.svg';
      placeholder.alt = 'No image available';
      mediaCell = placeholder;
    }

    // Compose text cell: date, title, (no description), link
    const contentDiv = unit.querySelector('.pp-block-item-content');
    let textParts = [];

    // Date
    const dateDiv = contentDiv && contentDiv.querySelector('.pp-block-item-date');
    if (dateDiv) {
      // Compose date string: day month year [| time timezone]
      const day = getTextContent(dateDiv.querySelector('.pp-block-item-date-day'));
      const month = getTextContent(dateDiv.querySelector('.pp-block-item-date-month'));
      const year = getTextContent(dateDiv.querySelector('.pp-block-item-date-year'));
      let dateStr = `${day} ${month} ${year}`.trim();
      // Optionally add time and timezone
      const time = getTextContent(dateDiv.querySelector('.pp_release_time'));
      const timezone = getTextContent(dateDiv.querySelector('.pp_release_timezone'));
      if (time && timezone) {
        dateStr += ` | ${time} ${timezone}`;
      }
      if (dateStr) {
        const dateP = document.createElement('div');
        dateP.textContent = dateStr;
        textParts.push(dateP);
      }
    }

    // Title
    const titleDiv = contentDiv && contentDiv.querySelector('.pp-block-item-title');
    if (titleDiv) {
      const heading = titleDiv.querySelector('h3');
      if (heading) {
        textParts.push(heading);
      }
    }

    // CTA: use the card link if present
    const link = unit.querySelector('a.pp-block-item-container');
    if (link && link.href) {
      const cta = document.createElement('a');
      cta.href = link.href;
      cta.textContent = 'Read more';
      textParts.push(cta);
    }

    return [mediaCell, textParts];
  });

  // Table header
  const headerRow = ['Cards (cards36)'];
  const tableCells = [headerRow, ...rows];

  // Create table
  const table = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace element
  element.replaceWith(table);
}
