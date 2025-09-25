/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Search (search50)'];

  // Try to get all relevant visible text content from the search UI
  let cellContent = document.createElement('div');

  // Extract placeholder from input
  const input = element.querySelector('input[placeholder]');
  if (input) {
    const placeholder = input.getAttribute('placeholder') || '';
    if (placeholder) {
      const ph = document.createElement('div');
      ph.textContent = placeholder;
      cellContent.appendChild(ph);
    }
  }

  // Extract filter labels if present
  const filterLabels = Array.from(element.querySelectorAll('.rounded-full .font-primary'));
  if (filterLabels.length > 0) {
    const filtersDiv = document.createElement('div');
    filtersDiv.textContent = 'Filters: ' + filterLabels.map(el => el.textContent.trim()).join(', ');
    cellContent.appendChild(filtersDiv);
  }

  // The second row must contain the absolute URL to the query index
  const queryIndexUrl = 'https://main--helix-block-collection--adobe.hlx.live/block-collection/sample-search-data/query-index.json';
  const link = document.createElement('a');
  link.href = queryIndexUrl;
  link.textContent = queryIndexUrl;
  cellContent.appendChild(link);

  // If nothing was added except the link, just use the link
  if (cellContent.childNodes.length === 1) {
    cellContent = link;
  }

  // Build the table rows
  const rows = [
    headerRow,
    [cellContent],
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
