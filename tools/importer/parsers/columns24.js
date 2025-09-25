/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the footer block
  const footer = element.querySelector('footer');
  if (!footer) return;

  // Helper to get all primary nav links (top row)
  const primaryNav = footer.querySelector('.c-footer__primary ul');
  let navLinks = [];
  if (primaryNav) {
    navLinks = Array.from(primaryNav.querySelectorAll('li')).map((li) => li);
  }

  // Helper to get copyright (bottom left)
  let copyrightSpan = null;
  const copyrightDiv = footer.querySelector('.c-footer__alt');
  if (copyrightDiv) {
    copyrightSpan = copyrightDiv.querySelector('span');
  }

  // Helper to get secondary links (bottom center)
  const secondaryLinksUl = footer.querySelector('.c-footer__links ul');
  let secondaryLinks = [];
  if (secondaryLinksUl) {
    secondaryLinks = Array.from(secondaryLinksUl.querySelectorAll('li')).map((li) => li);
  }

  // Helper to get social icons (bottom right)
  const socialDiv = footer.querySelector('.c-footer__social');
  let socialLinks = [];
  if (socialDiv) {
    socialLinks = Array.from(socialDiv.querySelectorAll('a')).map((a) => a);
  }

  // Compose table rows
  const headerRow = ['Columns block (columns24)'];

  // Second row: Top nav links, one per column
  const navRow = navLinks.length ? navLinks : [''];
  const colCount = navRow.length;

  // Third row: Copyright, secondary links, social icons
  // Must have same number of columns as navRow
  // We'll place copyright, secondary links, social icons in first three columns, rest omitted
  let bottomRow = [];
  if (colCount > 0) {
    if (copyrightSpan) bottomRow.push(copyrightSpan); else bottomRow.push('');
    if (secondaryLinks.length) bottomRow.push(secondaryLinks); else bottomRow.push('');
    if (socialLinks.length) bottomRow.push(socialLinks); else bottomRow.push('');
    // Only fill up to 3 columns, do not add extra empty columns
  }

  // Build table
  const cells = [
    headerRow,
    navRow,
    bottomRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
