/**
 * Ghost Text Helper for Code Practice
 *
 * This script adds ghost text to textareas that shows hints or partial code
 * that disappears as the user types. The ghost text is extracted from the
 * corresponding solution code block.
 */
document.addEventListener('DOMContentLoaded', function() {
  // Find all method blocks with textareas and solution code blocks
  const methodBlocks = document.querySelectorAll('.method');

  // Add a style to ensure method blocks don't restrict scrolling
  const methodStyle = document.createElement('style');
  methodStyle.textContent = `
    .method {
      overflow: visible !important;
    }
  `;
  document.head.appendChild(methodStyle);

  methodBlocks.forEach(block => {
    // Ensure the method block doesn't restrict scrolling
    block.style.overflow = 'visible';

    const textarea = block.querySelector('textarea');
    const solutionId = block.querySelector('.check-btn').getAttribute('onclick').match(/toggleSolution\('(.+?)'\)/)[1];
    const solutionBlock = document.getElementById(solutionId);

    if (textarea && solutionBlock) {
      setupGhostText(textarea, solutionBlock);
    }
  });

  /**
   * Sets up ghost text functionality for a textarea
   */
  function setupGhostText(textarea, solutionBlock) {
    // Remove the placeholder text
    textarea.placeholder = '';

    // Create a container to hold both the textarea and ghost text
    const container = document.createElement('div');
    container.className = 'ghost-text-container';
    textarea.parentNode.insertBefore(container, textarea);
    container.appendChild(textarea);

    // Create the ghost text element
    const ghostText = document.createElement('div');
    ghostText.className = 'ghost-text';
    container.appendChild(ghostText);

    // Create the hint element
    const hintText = document.createElement('div');
    hintText.className = 'ghost-text-hint';
    hintText.textContent = 'Type to practice, ghost text will guide you';
    container.appendChild(hintText);

    // Extract code from solution block - use the exact code without processing
    const solutionCode = solutionBlock.querySelector('code').innerText;

    // Set initial ghost text
    updateGhostText(textarea, ghostText, solutionCode);

    // Update ghost text when user types and handle auto-scrolling
    textarea.addEventListener('input', function() {
      updateGhostText(textarea, ghostText, solutionCode);
      autoScrollIfNeeded(textarea);
    });

    // Update ghost text when user clicks or focuses
    textarea.addEventListener('focus', function() {
      updateGhostText(textarea, ghostText, solutionCode);
    });

    // Update ghost text on scroll to keep alignment
    textarea.addEventListener('scroll', function() {
      ghostText.scrollTop = textarea.scrollTop;
      ghostText.scrollLeft = textarea.scrollLeft;
    });

    // Enable scrolling on both elements
    ghostText.style.pointerEvents = 'auto';

    // Make sure the textarea is visible and on top for typing
    textarea.style.position = 'relative';
    textarea.style.zIndex = '2';

    // Sync scrolling between textarea and ghost text
    ghostText.addEventListener('scroll', function() {
      textarea.scrollTop = ghostText.scrollTop;
      textarea.scrollLeft = ghostText.scrollLeft;
    });

    // Handle touch events for scrolling the ghost text
    ghostText.addEventListener('touchmove', function(e) {
      // Allow the event to propagate for natural scrolling
      // The browser will handle the scrolling of the ghost text

      // Sync the textarea scroll position
      textarea.scrollTop = ghostText.scrollTop;
      textarea.scrollLeft = ghostText.scrollLeft;
    });

    // Handle tab key for indentation
    textarea.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.selectionStart;
        const end = this.selectionEnd;

        // Insert tab at cursor position
        this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);

        // Move cursor after the inserted tab
        this.selectionStart = this.selectionEnd = start + 2;

        // Update ghost text
        updateGhostText(textarea, ghostText, solutionCode);
        autoScrollIfNeeded(textarea);
      }
    });
  }

  /**
   * Auto-scrolls the textarea if the cursor is near the edge
   */
  function autoScrollIfNeeded(textarea) {
    const cursorPosition = textarea.selectionStart;
    const text = textarea.value;

    // Find the line and column of the cursor
    const lines = text.substring(0, cursorPosition).split('\n');
    const currentLine = lines.length;
    const currentColumn = lines[lines.length - 1].length;

    // Get the total number of lines
    const totalLines = text.split('\n').length;

    // Get the visible area dimensions
    const visibleLines = Math.floor(textarea.clientHeight / parseInt(getComputedStyle(textarea).lineHeight));
    const visibleColumns = Math.floor(textarea.clientWidth / 8); // Approximate character width

    // Calculate the current scroll position in lines
    const scrollTopInLines = Math.floor(textarea.scrollTop / parseInt(getComputedStyle(textarea).lineHeight));
    const scrollLeftInColumns = Math.floor(textarea.scrollLeft / 8);

    // Auto-scroll vertically if cursor is near the bottom edge (scroll earlier - at 50% of visible area)
    if (currentLine > scrollTopInLines + Math.floor(visibleLines * 0.5)) {
      textarea.scrollTop = (currentLine - Math.floor(visibleLines * 0.5)) * parseInt(getComputedStyle(textarea).lineHeight);
    }

    // Auto-scroll vertically if cursor is near the top edge
    if (currentLine < scrollTopInLines + 3) {
      textarea.scrollTop = (currentLine - 3) * parseInt(getComputedStyle(textarea).lineHeight);
      if (textarea.scrollTop < 0) textarea.scrollTop = 0;
    }

    // Auto-scroll horizontally if cursor is near the right edge (scroll earlier)
    if (currentColumn > scrollLeftInColumns + Math.floor(visibleColumns * 0.7)) {
      textarea.scrollLeft = (currentColumn - Math.floor(visibleColumns * 0.7)) * 8;
    }

    // Auto-scroll horizontally if cursor is near the left edge
    if (currentColumn < scrollLeftInColumns + 10) {
      textarea.scrollLeft = (currentColumn - 10) * 8;
      if (textarea.scrollLeft < 0) textarea.scrollLeft = 0;
    }
  }

  /**
   * Updates the ghost text based on what the user has typed
   */
  function updateGhostText(textarea, ghostElement, fullCode) {
    const userText = textarea.value;

    // Create a non-visible span to measure text width
    const measureSpan = document.createElement('span');
    measureSpan.style.visibility = 'hidden';
    measureSpan.style.position = 'absolute';
    measureSpan.style.whiteSpace = 'pre';
    measureSpan.style.font = getComputedStyle(textarea).font;
    document.body.appendChild(measureSpan);

    // Normalize the texts by removing extra spaces and converting to lowercase
    const normalizedUserText = userText.replace(/\s+/g, ' ').toLowerCase();
    const normalizedFullCode = fullCode.replace(/\s+/g, ' ').toLowerCase();

    // Find the common prefix between normalized texts
    let commonLength = 0;
    let normalizedCommonLength = 0;

    // Map positions from normalized text back to original text
    const userTextMap = createPositionMap(userText);
    const fullCodeMap = createPositionMap(fullCode);

    while (normalizedCommonLength < normalizedUserText.length &&
           normalizedCommonLength < normalizedFullCode.length) {
      // Compare normalized characters
      if (normalizedUserText[normalizedCommonLength] === normalizedFullCode[normalizedCommonLength]) {
        normalizedCommonLength++;
        // Map back to original position
        commonLength = userTextMap[normalizedCommonLength] || commonLength;
      } else {
        break;
      }
    }

    // Get the remaining code to show as ghost text
    let remainingCode = fullCode.substring(commonLength);

    // Create a placeholder for the matched text (to maintain alignment)
    let matchedText = '';
    if (commonLength > 0) {
      // Use invisible text that takes up space to maintain alignment
      matchedText = '<span style="color: transparent;">' +
                    escapeHTML(userText.substring(0, commonLength)) +
                    '</span>';
    }

    // Only hide ghost text if user is typing something completely different
    // Allow for small differences like capitalization and errors
    let isWayOff = false;
    if (userText.length > 0 && commonLength < userText.length) {
      // Check if the user is just typing with different capitalization or has minor errors
      const lowerUserText = userText.toLowerCase();
      const lowerFullCode = fullCode.toLowerCase();

      // Calculate edit distance to determine how far off the user is
      const editDistance = calculateEditDistance(
        lowerUserText.substring(Math.max(0, lowerUserText.length - 10)),
        lowerFullCode.substring(commonLength, commonLength + 10)
      );

      // If the edit distance is too large (more than 5 errors), the user is way off
      if (editDistance > 5) {
        isWayOff = true;
      }
    }

    // Update ghost text content with proper alignment
    if (isWayOff) {
      // Even if user is way off track, still show ghost text but make it very faint
      let formattedRemainingCode = escapeHTML(remainingCode);
      ghostElement.innerHTML = matchedText + formattedRemainingCode;
      ghostElement.style.opacity = '0.2'; // Make it very faint
    } else {
      // Show the exact remaining code from the solution
      let formattedRemainingCode = escapeHTML(remainingCode);

      // Add the invisible matched text followed by the visible remaining code
      ghostElement.innerHTML = matchedText + formattedRemainingCode;
      ghostElement.style.opacity = '0.5'; // Normal opacity
    }

    // Position ghost text to align with textarea
    ghostElement.style.top = '0px';
    ghostElement.style.left = '0px';
    ghostElement.style.width = '100%';
    ghostElement.style.height = '100%';
    ghostElement.style.padding = getComputedStyle(textarea).padding;

    // Make sure the ghost text is clickable for scrolling
    ghostElement.style.pointerEvents = 'auto';

    // Scroll ghost text to match textarea scroll position
    ghostElement.scrollTop = textarea.scrollTop;
    ghostElement.scrollLeft = textarea.scrollLeft;

    // Clean up measurement span
    document.body.removeChild(measureSpan);
  }

  /**
   * Creates a mapping from normalized text positions to original text positions
   */
  function createPositionMap(text) {
    const normalized = text.replace(/\s+/g, ' ').toLowerCase();
    const map = {};
    let normalizedPos = 0;

    for (let i = 0; i < text.length; i++) {
      // Skip extra whitespace in original text
      if (i > 0 && isWhitespace(text[i]) && isWhitespace(text[i-1])) {
        continue;
      }

      // Map this normalized position to the original position
      map[normalizedPos] = i;
      normalizedPos++;
    }

    return map;
  }

  /**
   * Checks if a character is whitespace (space, tab, newline)
   */
  function isWhitespace(char) {
    return char === ' ' || char === '\t' || char === '\n' || char === '\r';
  }

  /**
   * Calculates the Levenshtein edit distance between two strings
   * This measures how many single-character edits are needed to change one string into another
   */
  function calculateEditDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    // Initialize the matrix
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    // Fill in the matrix
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  /**
   * Escapes HTML special characters
   */
  function escapeHTML(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Gets the cursor position in a textarea
   */
  function getCursorPosition(textarea) {
    const position = textarea.selectionStart;
    const text = textarea.value.substring(0, position);
    const lines = text.split('\n');
    const lineCount = lines.length;
    const charCount = lines[lines.length - 1].length;

    return {
      line: lineCount,
      char: charCount
    };
  }


});

// Add CSS for ghost text
const style = document.createElement('style');
style.textContent = `
.ghost-text-container {
  position: relative;
  width: 100%;
  margin-bottom: 10px;
  overflow: visible; /* Allow scrollbars to be visible */
  min-height: 200px; /* Ensure container has enough height */
  display: block;
  clear: both;
}

textarea {
  background: transparent !important;
  position: relative;
  z-index: 2;
  color: white;
  caret-color: #ff9800; /* Make cursor more visible */
  font-family: monospace;
  padding: 10px;
  line-height: 1.5;
  resize: both;
  overflow: auto;
  letter-spacing: normal !important;
  word-spacing: normal !important;
  tab-size: 2;
  -moz-tab-size: 2;
  white-space: pre-wrap !important; /* Allow wrapping */
  overflow-wrap: break-word !important;
  word-wrap: break-word !important;
  width: 100%;
  box-sizing: border-box;
  min-height: 200px;
  display: block;
}

.ghost-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%; /* Match the textarea height */
  padding: 10px;
  font-family: monospace;
  font-size: 14px;
  color: rgba(120, 120, 120, 0.5);
  white-space: pre-wrap !important; /* Allow wrapping */
  overflow: auto;
  pointer-events: auto; /* Enable interaction for scrolling */
  z-index: 1;
  box-sizing: border-box;
  line-height: 1.5;
  background-color: transparent; /* Make background transparent */
  letter-spacing: normal !important;
  word-spacing: normal !important;
  overflow-wrap: break-word !important;
  word-wrap: break-word !important;
  touch-action: pan-x pan-y; /* Enable touch scrolling */
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
}

/* Make scrollbars visible and usable */
textarea::-webkit-scrollbar,
.ghost-text::-webkit-scrollbar {
  width: 12px;
  height: 12px;
  background-color: #222;
}

textarea::-webkit-scrollbar-thumb,
.ghost-text::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: 6px;
  border: 2px solid #222;
  min-height: 40px; /* Minimum size for better touch targets */
  min-width: 40px;
}

textarea::-webkit-scrollbar-thumb:hover,
.ghost-text::-webkit-scrollbar-thumb:hover {
  background-color: #777;
}

/* Scrollbar corner */
textarea::-webkit-scrollbar-corner,
.ghost-text::-webkit-scrollbar-corner {
  background-color: #222;
}

/* Remove scroll indicators */

/* Add a hint about the ghost text */
.method:hover .ghost-text-hint {
  display: block;
}

.ghost-text-hint {
  display: none;
  position: absolute;
  top: -20px;
  left: 0;
  font-size: 12px;
  color: #ff9800;
  opacity: 0.8;
  z-index: 3;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

/* Ensure proper spacing in mobile */
@media (max-width: 768px) {
  .ghost-text {
    font-size: 12px;
    padding: 8px;
  }

  textarea {
    font-size: 12px;
    padding: 8px;
  }

  .ghost-text-hint {
    font-size: 10px;
    top: -16px;
  }

  textarea::-webkit-scrollbar,
  .ghost-text::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  textarea::-webkit-scrollbar-thumb,
  .ghost-text::-webkit-scrollbar-thumb {
    min-height: 30px;
    min-width: 30px;
  }

  /* Make the ghost text container taller on mobile for better scrolling */
  .ghost-text-container {
    min-height: 150px;
    overflow: visible;
  }

  /* Ensure wrapping on mobile */
  textarea {
    white-space: pre-wrap !important;
    overflow-wrap: break-word !important;
    word-wrap: break-word !important;
    min-height: 150px;
  }

  /* Remove ALL mobile scroll indicators */
  .ghost-text-container::after,
  .ghost-text-container::before {
    display: none !important;
    content: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
  }
}
`;
document.head.appendChild(style);
