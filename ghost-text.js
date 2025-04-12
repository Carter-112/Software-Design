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

  methodBlocks.forEach(block => {
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

    // Extract code from solution block
    const solutionCode = solutionBlock.querySelector('code').innerText;

    // Process the solution code to create appropriate ghost text
    const processedCode = processCodeForGhost(solutionCode);

    // Set initial ghost text
    updateGhostText(textarea, ghostText, processedCode);

    // Update ghost text when user types
    textarea.addEventListener('input', function() {
      updateGhostText(textarea, ghostText, processedCode);
    });

    // Update ghost text when user clicks or focuses
    textarea.addEventListener('focus', function() {
      updateGhostText(textarea, ghostText, processedCode);
    });

    // Update ghost text on scroll to keep alignment
    textarea.addEventListener('scroll', function() {
      ghostText.scrollTop = textarea.scrollTop;
      ghostText.scrollLeft = textarea.scrollLeft;
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
        updateGhostText(textarea, ghostText, processedCode);
      }
    });
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

    // Find the common prefix between user text and full code (case-insensitive)
    let commonLength = 0;
    while (commonLength < userText.length && commonLength < fullCode.length) {
      // Case-insensitive comparison
      if (userText[commonLength].toLowerCase() === fullCode[commonLength].toLowerCase()) {
        commonLength++;
      } else {
        // Check for whitespace differences (space vs tab)
        if (isWhitespace(userText[commonLength]) && isWhitespace(fullCode[commonLength])) {
          commonLength++;
        } else {
          break;
        }
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
    // Allow for small differences like capitalization
    let isWayOff = false;
    if (userText.length > 0 && commonLength < userText.length) {
      // Check if the user is just typing with different capitalization
      const lowerUserText = userText.toLowerCase();
      const lowerFullCode = fullCode.toLowerCase();

      let lowerCommonLength = 0;
      while (lowerCommonLength < lowerUserText.length &&
             lowerCommonLength < lowerFullCode.length &&
             lowerUserText[lowerCommonLength] === lowerFullCode[lowerCommonLength]) {
        lowerCommonLength++;
      }

      // If the lowercase comparison is significantly better, user is just using different case
      // Otherwise, they're typing something completely different
      if (lowerCommonLength <= commonLength + 3 && lowerCommonLength < userText.length) {
        // The user is way off track - they're typing something completely different
        isWayOff = true;
      }
    }

    // Update ghost text content with proper alignment
    if (isWayOff) {
      // If user is way off track, don't show ghost text
      ghostElement.innerHTML = '';
    } else {
      // Use a non-breaking space for empty lines to maintain line height
      let formattedRemainingCode = escapeHTML(remainingCode);
      formattedRemainingCode = formattedRemainingCode.replace(/\n/g, '\n&nbsp;').replace(/\n&nbsp;([^\s])/g, '\n$1');

      // Add the invisible matched text followed by the visible remaining code
      ghostElement.innerHTML = matchedText + formattedRemainingCode;
    }

    // Position ghost text to align with textarea
    ghostElement.style.top = textarea.offsetTop + 'px';
    ghostElement.style.left = textarea.offsetLeft + 'px';
    ghostElement.style.width = textarea.offsetWidth + 'px';
    ghostElement.style.height = textarea.offsetHeight + 'px';
    ghostElement.style.padding = getComputedStyle(textarea).padding;

    // Scroll ghost text to match textarea scroll position
    ghostElement.scrollTop = textarea.scrollTop;
    ghostElement.scrollLeft = textarea.scrollLeft;

    // Clean up measurement span
    document.body.removeChild(measureSpan);
  }

  /**
   * Checks if a character is whitespace (space, tab, newline)
   */
  function isWhitespace(char) {
    return char === ' ' || char === '\t' || char === '\n' || char === '\r';
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

  /**
   * Processes code to create appropriate ghost text
   * - Removes comments
   * - Simplifies complex expressions
   * - Adds structural hints
   */
  function processCodeForGhost(code) {
    // Process the code to make it more helpful as ghost text

    // Remove multi-line comments
    let processedCode = code.replace(/\/\*[\s\S]*?\*\//g, '');

    // Remove single-line comments
    processedCode = processedCode.replace(/\/\/.*$/gm, '');

    // Replace complex expressions with simpler placeholders
    // For example, replace complex lambda expressions with simpler ones
    processedCode = processedCode.replace(/\(\s*[^\)]+\s*\)\s*->\s*\{[\s\S]*?\}/g, '() -> { /* code */ }');

    // Replace complex method bodies with placeholders while keeping structure
    processedCode = processedCode.replace(/\{([\s\S]*?)\}/g, function(match, body) {
      // If the body is more than 5 lines, simplify it
      if ((body.match(/\n/g) || []).length > 5) {
        // Keep the first line and last line, replace middle with a comment
        const lines = body.split('\n');
        if (lines.length > 2) {
          const firstLine = lines[0];
          const lastLine = lines[lines.length - 1];
          return '{ ' + firstLine + '\n  // ... more code ...\n' + lastLine + ' }';
        }
      }
      return match; // Keep shorter method bodies as is
    });

    return processedCode;
  }
});

// Add CSS for ghost text
const style = document.createElement('style');
style.textContent = `
.ghost-text-container {
  position: relative;
  width: 100%;
  margin-bottom: 10px;
  overflow: hidden;
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
}

.ghost-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 10px;
  font-family: monospace;
  font-size: 14px;
  color: rgba(120, 120, 120, 0.5);
  white-space: pre;
  overflow: auto;
  pointer-events: none;
  z-index: 1;
  box-sizing: border-box;
  line-height: 1.5;
  background-color: rgba(0, 0, 0, 0.2);
  letter-spacing: normal !important;
  word-spacing: normal !important;
}

/* Make scrollbars visible and usable */
textarea::-webkit-scrollbar,
.ghost-text::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: #222;
}

textarea::-webkit-scrollbar-thumb,
.ghost-text::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: 5px;
}

textarea::-webkit-scrollbar-thumb:hover,
.ghost-text::-webkit-scrollbar-thumb:hover {
  background-color: #777;
}

/* Add a hint about the ghost text */
.method:hover .ghost-text-container::before {
  content: 'Type to practice, ghost text will guide you';
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

  .method:hover .ghost-text-container::before {
    font-size: 10px;
    top: -16px;
  }

  textarea::-webkit-scrollbar,
  .ghost-text::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
}
`;
document.head.appendChild(style);
