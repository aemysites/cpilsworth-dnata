/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Columns block (columns9)'];

  // Defensive: Find main container (should be the section itself)
  const container = element;

  // --- COLUMN 1: Logo ---
  // Find the logo link (first <a> with <img> inside)
  let logoCell = '';
  const logoLink = container.querySelector('a[href]');
  if (logoLink && logoLink.querySelector('img')) {
    logoCell = logoLink;
  }

  // --- COLUMN 2: Navigation ---
  // Find the nav (desktop menu)
  let navCell = '';
  const nav = container.querySelector('nav');
  if (nav) {
    navCell = nav;
  }

  // --- COLUMN 3: Search ---
  // Find the search button (last button in the right flex container)
  let searchCell = '';
  // The right flex container (ml-auto)
  const rightFlex = container.querySelector('.ml-auto.flex');
  if (rightFlex) {
    // Find the button with aria-expanded or aria-label or the magnifying-glass icon
    const searchBtn = Array.from(rightFlex.querySelectorAll('button')).find(btn => {
      return btn.innerHTML.includes('magnifying-glass') || btn.getAttribute('aria-label') === 'Search';
    });
    if (searchBtn) {
      searchCell = searchBtn;
    }
  }

  // Compose the columns row
  const columnsRow = [logoCell, navCell, searchCell];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // Replace the element
  element.replaceWith(table);
}
