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

    // Sync scrolling when ghost text is scrolled (for touch devices)
    ghostText.addEventListener('scroll', function() {
      textarea.scrollTop = ghostText.scrollTop;
      textarea.scrollLeft = ghostText.scrollLeft;
    });

    // Enable touch scrolling on the ghost text
    ghostText.style.pointerEvents = 'auto';
    ghostText.style.touchAction = 'auto';

    // Add touch event listeners for manual scrolling
    let touchStartY = 0;
    let touchStartX = 0;
    let scrollTopStart = 0;
    let scrollLeftStart = 0;

    ghostText.addEventListener('touchstart', function(e) {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      scrollTopStart = ghostText.scrollTop;
      scrollLeftStart = ghostText.scrollLeft;
      e.preventDefault(); // Prevent text selection
    });

    ghostText.addEventListener('touchmove', function(e) {
      const touchY = e.touches[0].clientY;
      const touchX = e.touches[0].clientX;
      const deltaY = touchStartY - touchY;
      const deltaX = touchStartX - touchX;

      ghostText.scrollTop = scrollTopStart + deltaY;
      ghostText.scrollLeft = scrollLeftStart + deltaX;
      textarea.scrollTop = ghostText.scrollTop;
      textarea.scrollLeft = ghostText.scrollLeft;

      e.preventDefault(); // Prevent page scrolling
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

    // Auto-scroll vertically if cursor is near the bottom edge
    if (currentLine > scrollTopInLines + visibleLines - 3) {
      textarea.scrollTop = (currentLine - visibleLines + 3) * parseInt(getComputedStyle(textarea).lineHeight);
    }

    // Auto-scroll vertically if cursor is near the top edge
    if (currentLine < scrollTopInLines + 3) {
      textarea.scrollTop = (currentLine - 3) * parseInt(getComputedStyle(textarea).lineHeight);
      if (textarea.scrollTop < 0) textarea.scrollTop = 0;
    }

    // Auto-scroll horizontally if cursor is near the right edge
    if (currentColumn > scrollLeftInColumns + visibleColumns - 10) {
      textarea.scrollLeft = (currentColumn - visibleColumns + 10) * 8;
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
      // Show the exact remaining code from the solution
      let formattedRemainingCode = escapeHTML(remainingCode);

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
  pointer-events: auto; /* Enable interaction for scrolling */
  z-index: 1;
  box-sizing: border-box;
  line-height: 1.5;
  background-color: rgba(0, 0, 0, 0.2);
  letter-spacing: normal !important;
  word-spacing: normal !important;
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

/* Add scroll indicators for touch devices */
.ghost-text-container::after {
  content: '';
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  background-color: rgba(255, 152, 0, 0.3);
  border-radius: 50%;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 3;
}

.ghost-text-container:hover::after {
  opacity: 1;
}

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
  }

  /* Add scroll indicators that are more visible on mobile */
  .ghost-text-container::after {
    width: 25px;
    height: 25px;
    opacity: 0.5;
    bottom: 10px;
    right: 10px;
  }

  /* Add horizontal scroll indicator */
  .ghost-text-container::before {
    content: '';
    position: absolute;
    bottom: 10px;
    right: 40px;
    width: 25px;
    height: 25px;
    background-color: rgba(255, 152, 0, 0.3);
    border-radius: 50%;
    pointer-events: none;
    opacity: 0.5;
    z-index: 3;
  }
}
`;
document.head.appendChild(style);
