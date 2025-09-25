/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the target block name as header
  const headerRow = ['Columns block (columns7)'];

  // Find the three main columns: .links-col (x2) and .links-col + .newsletter-wrapper (in .links-wrapper)
  const columns = [];
  const linksCols = element.querySelectorAll(':scope > .links-col');
  linksCols.forEach(col => columns.push(col));
  const stayInformed = element.querySelector(':scope > .links-col:last-of-type');
  const newsletter = element.querySelector('.newsletter-wrapper');
  if (newsletter) {
    // Combine Stay Informed col and newsletter into one cell
    const wrapper = document.createElement('div');
    // Add Stay Informed heading and info
    const heading = stayInformed.querySelector('.heading6');
    if (heading) wrapper.appendChild(heading.cloneNode(true));
    const infoWrappers = stayInformed.querySelectorAll('.info-wrapper, .info-content');
    infoWrappers.forEach(node => wrapper.appendChild(node.cloneNode(true)));
    // Add newsletter
    wrapper.appendChild(newsletter.cloneNode(true));
    columns.push(wrapper);
  }

  // Build second row: each cell is a column's content
  const secondRow = columns.slice(0,3).map((col) => {
    // If this is a DOM node wrapper (for Stay Informed + newsletter)
    if (col.nodeType === 1 && col.tagName === 'DIV' && col.children.length > 0 && col.querySelector('.newsletter-wrapper')) {
      return Array.from(col.childNodes);
    }
    // For .links-col: heading + list
    if (col.classList && col.classList.contains('links-col')) {
      const colContent = [];
      const heading = col.querySelector('.heading6');
      if (heading) colContent.push(heading.cloneNode(true));
      const list = col.querySelector('ul');
      if (list) colContent.push(list.cloneNode(true));
      return colContent;
    }
    // Fallback: include node
    return [col.cloneNode(true)];
  });

  // Table rows: header and columns
  const rows = [headerRow, secondRow];

  // Create table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
