/* global WebImporter */
export default function parse(element, { document }) {
  // Header row per block spec
  const headerRow = ['Columns block (columns26)'];

  // Get all immediate child column blocks (each col-span-X grid)
  const columns = Array.from(element.querySelectorAll(':scope > div > div'));

  // Defensive: filter only those with a heading (h6) and links
  const columnCells = columns.map((col) => {
    // We'll collect heading and all links (including icons)
    const cellContent = [];

    // Heading (h6 > a)
    const heading = col.querySelector('h6');
    if (heading) {
      cellContent.push(heading);
    }

    // All <span>s with links (and possible icons)
    const spans = col.querySelectorAll('span');
    spans.forEach((span) => {
      // Defensive: some spans may have only text, some may have <a>, some may have icons
      // We'll push the span itself for resilience
      cellContent.push(span);
    });

    // Return as array if multiple, else single element
    return cellContent.length > 1 ? cellContent : cellContent[0] || '';
  });

  // Build table rows: first row is header, second row is columns
  const rows = [headerRow, columnCells];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
