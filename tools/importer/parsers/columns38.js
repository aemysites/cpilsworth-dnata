/* global WebImporter */
export default function parse(element, { document }) {
  // --- Critical Review: ---
  // 1. All content is dynamically extracted (no hardcoding of text or URLs)
  // 2. No markdown formatting, only HTML elements
  // 3. Only one table is required (no Section Metadata)
  // 4. Header row matches EXACTLY: 'Columns block (columns38)'
  // 5. Handles empty/missing data gracefully
  // 6. All text content is included in table cells
  // 7. No new image elements are created (none present)
  // 8. Semantic meaning is preserved (links remain links, copyright is plain text)
  // 9. Existing elements are referenced, not cloned

  // Find the two main columns: links and copyright
  const children = Array.from(element.children);
  let linksDiv = null;
  let copyrightDiv = null;
  if (children.length === 2) {
    linksDiv = children[0];
    copyrightDiv = children[1];
  } else {
    linksDiv = element.querySelector('.text-textprimary');
    copyrightDiv = element.querySelector('.text-textsecondary');
  }

  // Gather all links (as elements, not cloning)
  let linksContent = '';
  if (linksDiv) {
    const links = Array.from(linksDiv.querySelectorAll('a'));
    if (links.length > 0) {
      // Place all links in a single <div> for the cell
      const linksContainer = document.createElement('div');
      links.forEach((a, i) => {
        linksContainer.appendChild(a);
        if (i !== links.length - 1) {
          linksContainer.appendChild(document.createTextNode(' '));
        }
      });
      linksContent = linksContainer;
    }
  }

  // Copyright (as element, not cloning)
  let copyrightContent = '';
  if (copyrightDiv) {
    copyrightContent = copyrightDiv;
  }

  // Compose table rows
  const headerRow = ['Columns block (columns38)'];
  const contentRow = [linksContent, copyrightContent];

  // Build table
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);

  // Replace the original element
  element.replaceWith(table);
}
