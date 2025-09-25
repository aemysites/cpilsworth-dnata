/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract accordion items from a given accordion container
  function extractAccordionItems(accordion) {
    const rows = [];
    const items = accordion.querySelectorAll(':scope > .accordion-item');
    items.forEach((item) => {
      // Title: find the .heading6 inside the button
      let title = '';
      const header = item.querySelector('.accordion-header');
      if (header) {
        const heading = header.querySelector('.heading6');
        if (heading) {
          title = heading.textContent.trim();
        } else {
          // fallback: get button text
          const btn = header.querySelector('button');
          if (btn) title = btn.textContent.trim();
        }
      }
      // Content: collect all .accordion-body.contentSection within this item
      const bodies = item.querySelectorAll('.accordion-body.contentSection');
      const contentParts = [];
      bodies.forEach((body) => {
        // Defensive: reference the node, do not clone or move it
        contentParts.push(body);
      });
      // If there are no .accordion-body.contentSection, look for other content
      if (contentParts.length === 0) {
        // fallback: look for .accordion-collapse > div
        const collapse = item.querySelector('.accordion-collapse');
        if (collapse) {
          const divs = collapse.querySelectorAll(':scope > div');
          divs.forEach((div) => contentParts.push(div));
        }
      }
      // Compose row
      rows.push([title, contentParts.length === 1 ? contentParts[0] : contentParts]);
    });
    return rows;
  }

  // Find all accordions in all tab panes
  const accordions = element.querySelectorAll('.accordion.accordion-ui');
  const rows = [];
  accordions.forEach((accordion) => {
    rows.push(...extractAccordionItems(accordion));
  });

  // Compose the table: header row, then all accordion rows
  const tableRows = [
    ['Accordion (accordion5)'],
    ...rows,
  ];

  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
