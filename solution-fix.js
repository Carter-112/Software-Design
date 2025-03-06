// Script to fix solution display issues

document.addEventListener('DOMContentLoaded', function() {
  // Store reference to any existing toggleSolution function
  const originalToggleSolution = window.toggleSolution;
  
  // Find all check answer buttons
  const checkButtons = document.querySelectorAll('.check-btn');
  
  // Add click event listeners to all buttons
  checkButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      // Extract the solution ID from the onclick attribute
      const onclickAttr = this.getAttribute('onclick');
      if (!onclickAttr) return;
      
      const match = onclickAttr.match(/'([^']+)'/);
      if (!match || !match[1]) return;
      
      const solutionId = match[1];
      const solution = document.getElementById(solutionId);
      
      if (!solution) return;
      
      // Add a small delay to ensure the display style is updated
      setTimeout(function() {
        if (solution.style.display === 'block') {
          // Force scrollTop to 0 to show the beginning of the solution
          solution.scrollTop = 0;
          
          // Make sure the solution is visible in the viewport
          solution.scrollIntoView({ behavior: 'smooth', block: 'start' });
          
          // Ensure the solution background extends to all content
          solution.style.minHeight = Math.max(solution.scrollHeight, 100) + 'px';
          
          // Force re-paint for better rendering
          solution.style.opacity = '0.99';
          setTimeout(() => { solution.style.opacity = '1'; }, 10);
          
          // Add specific CSS fix for the solution label
          const solutionLabel = solution.querySelector('::before');
          if (solutionLabel) {
            solutionLabel.style.display = 'block';
          }
        }
      }, 50);
    });
  });
  
  // Override toggleSolution function to improve solution display
  window.toggleSolution = function(id) {
    // Call original function if it exists
    if (originalToggleSolution) {
      originalToggleSolution(id);
    } else {
      // Default implementation if original doesn't exist
      const solution = document.getElementById(id);
      if (!solution) return;
      
      // Toggle display
      if (solution.style.display === 'block') {
        solution.style.display = 'none';
      } else {
        solution.style.display = 'block';
      }
    }
    
    // Additional enhancements after toggle
    const solution = document.getElementById(id);
    if (!solution) return;
    
    if (solution.style.display === 'block') {
      // Reset scroll position
      solution.scrollTop = 0;
      
      // Make sure it's visible
      solution.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Ensure background is tall enough
      solution.style.minHeight = Math.max(solution.scrollHeight, 100) + 'px';
      
      // Force render update
      solution.style.opacity = '0.99';
      setTimeout(() => { 
        solution.style.opacity = '1';
        
        // Add inline style to solution for better visibility
        solution.style.position = 'relative';
        solution.style.paddingTop = '80px';
        solution.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
      }, 10);
    }
  };
  
  // Add styles programmatically to ensure solution label visibility
  const style = document.createElement('style');
  style.textContent = `
    pre {
      position: relative;
      padding-top: 80px !important;
      background-color: rgba(0, 0, 0, 0.95) !important;
      min-height: 150px;
    }
    pre::before {
      display: block !important;
      position: absolute !important;
      top: 10px !important;
      left: 15px !important;
      z-index: 1000 !important;
      background-color: #FF5722 !important;
      color: white !important;
      padding: 8px 15px !important;
      font-weight: bold !important;
      font-size: 14px !important;
      width: auto !important; 
      border-radius: 4px !important;
      box-shadow: 0 2px 5px rgba(0,0,0,0.5) !important;
    }
  `;
  document.head.appendChild(style);
}); 