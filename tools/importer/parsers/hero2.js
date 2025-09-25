/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the background image (desktop version only)
  let bgImg = null;
  const bannerImgDiv = element.querySelector('.banner-img');
  if (bannerImgDiv) {
    const img = bannerImgDiv.querySelector('img');
    if (img) {
      bgImg = img;
    }
  }

  // Extract hero text content (subheading and heading)
  let heroContent = [];
  const container = element.querySelector('.container');
  if (container) {
    const heroBody = container.querySelector('.hero-body');
    if (heroBody) {
      // Only include direct children that are text elements
      Array.from(heroBody.children).forEach((child) => {
        if (
          child.tagName === 'DIV' ||
          child.tagName.match(/^H[1-6]$/)
        ) {
          heroContent.push(child);
        }
      });
    }
  }

  // Table header must match target block name exactly
  const headerRow = ['Hero (hero2)'];
  // Second row: background image (referenced element, not URL)
  const imageRow = [bgImg ? bgImg : ''];
  // Third row: all text content (referenced elements)
  const contentRow = [heroContent.length ? heroContent : ''];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
