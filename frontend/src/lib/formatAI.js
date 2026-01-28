/**
 * Utility to clean and format AI-generated text
 * Removes markdown artifacts and makes text production-ready
 */

/**
 * Clean markdown formatting from AI text
 * @param {string} text - Raw AI text with markdown
 * @returns {string} - Clean text without markdown symbols
 */
export function cleanMarkdown(text) {
  if (!text) return '';
  
  return text
    // Remove bold markers
    .replace(/\*\*(.*?)\*\*/g, '$1')
    // Remove italic markers
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    // Remove strikethrough
    .replace(/~~(.*?)~~/g, '$1')
    // Remove inline code
    .replace(/`(.*?)`/g, '$1')
    // Remove headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bullet points at start
    .replace(/^[-*]\s+/gm, '')
    // Remove numbered list markers
    .replace(/^\d+\.\s+/gm, '')
    // Clean up extra whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Parse AI text into structured sections
 * @param {string} text - AI text that may contain sections
 * @returns {Object} - Parsed sections { title, description, steps }
 */
export function parseAIText(text) {
  if (!text) return { title: '', description: '', steps: [] };
  
  const cleaned = cleanMarkdown(text);
  const lines = cleaned.split('\n').filter(line => line.trim());
  
  // First line is usually the title/main idea
  const title = lines[0] || '';
  
  // Look for step-like content
  const steps = lines.slice(1).filter(line => 
    line.length > 10 && 
    !line.toLowerCase().startsWith('note') &&
    !line.toLowerCase().startsWith('tip')
  );
  
  return {
    title: title,
    description: steps.slice(0, 1).join(' '),
    steps: steps.slice(1),
  };
}

/**
 * Format idea text for display
 * Ensures clean, readable output
 * @param {string} idea - Raw idea text
 * @returns {string} - Clean formatted idea
 */
export function formatIdea(idea) {
  if (!idea) return '';
  
  // Clean markdown
  let formatted = cleanMarkdown(idea);
  
  // Capitalize first letter
  formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  
  // Ensure it ends with proper punctuation
  if (!/[.!?]$/.test(formatted)) {
    formatted += '.';
  }
  
  return formatted;
}

/**
 * Extract title from idea (first sentence or phrase)
 * @param {string} idea - Full idea text
 * @returns {string} - Short title
 */
export function extractTitle(idea) {
  if (!idea) return '';
  
  const cleaned = cleanMarkdown(idea);
  
  // Get first sentence or first 60 chars
  const firstSentence = cleaned.split(/[.!?]/)[0];
  if (firstSentence.length <= 60) {
    return firstSentence.trim();
  }
  
  // Truncate at word boundary
  return cleaned.slice(0, 57).replace(/\s+\S*$/, '') + '...';
}

export default {
  cleanMarkdown,
  parseAIText,
  formatIdea,
  extractTitle,
};
