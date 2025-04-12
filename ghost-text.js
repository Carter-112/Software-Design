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

    // Find the common prefix between user text and full code
    let commonLength = 0;
    while (commonLength < userText.length &&
           commonLength < fullCode.length &&
           userText[commonLength] === fullCode[commonLength]) {
      commonLength++;
    }

    // Get the remaining code to show as ghost text
    let remainingCode = fullCode.substring(commonLength);

    // If user has typed something that doesn't match, don't show ghost text
    if (userText.length > 0 && commonLength < userText.length) {
      remainingCode = '';
    }

    // Update ghost text content
    ghostElement.textContent = remainingCode;

    // Position ghost text to align with textarea
    ghostElement.style.top = textarea.offsetTop + 'px';
    ghostElement.style.left = textarea.offsetLeft + 'px';
    ghostElement.style.width = textarea.offsetWidth + 'px';
    ghostElement.style.height = textarea.offsetHeight + 'px';

    // Scroll ghost text to match textarea scroll position
    ghostElement.scrollTop = textarea.scrollTop;
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
}

textarea {
  background: transparent !important;
  position: relative;
  z-index: 2;
  color: white;
  caret-color: #ff9800; /* Make cursor more visible */
  font-family: monospace;
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

  .method:hover .ghost-text-container::before {
    font-size: 10px;
    top: -16px;
  }
}
`;
document.head.appendChild(style);
