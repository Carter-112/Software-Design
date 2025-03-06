// Diagnostic script to identify and fix common issues

document.addEventListener('DOMContentLoaded', function() {
  console.log('Diagnostic script running...');
  
  // Fix 1: Prevent zooming on input focus (common mobile issue)
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  if (viewportMeta) {
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
    console.log('Fix 1: Disabled zooming on input focus');
  }
  
  // Fix 2: Ensure all buttons have proper tap targets for mobile
  const allButtons = document.querySelectorAll('button');
  allButtons.forEach(button => {
    // Ensure buttons have adequate tap target size
    if (window.innerWidth <= 768) {
      button.style.minHeight = '44px';
      button.style.minWidth = '44px';
      
      // Add touch feedback
      button.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.97)';
      });
      
      button.addEventListener('touchend', function() {
        this.style.transform = 'scale(1)';
      });
    }
  });
  console.log('Fix 2: Enhanced button tap targets for mobile');
  
  // Fix 3: Fix scrolling issues with code blocks
  const preElements = document.querySelectorAll('pre');
  preElements.forEach(pre => {
    // Make pre blocks scrollable horizontally but not cause page to be wider
    pre.style.overflowX = 'auto';
    pre.style.maxWidth = '100%';
    pre.style.wordWrap = 'normal';
    pre.style.whiteSpace = 'pre';
    
    // Add horizontal scrolling indicators
    pre.addEventListener('scroll', function() {
      if (this.scrollLeft > 0) {
        this.classList.add('scrolling-horizontal');
      } else {
        this.classList.remove('scrolling-horizontal');
      }
    });
  });
  console.log('Fix 3: Fixed scrolling issues with code blocks');
  
  // Fix 4: Improve form elements and textarea accessibility
  const textareas = document.querySelectorAll('textarea');
  textareas.forEach(textarea => {
    // Make textareas more mobile-friendly
    textarea.addEventListener('focus', function() {
      // Add fixed header when keyboard appears
      document.querySelector('header')?.classList.add('fixed-while-typing');
      
      // Scroll to ensure the textarea is visible
      setTimeout(() => {
        this.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    });
    
    textarea.addEventListener('blur', function() {
      document.querySelector('header')?.classList.remove('fixed-while-typing');
    });
  });
  console.log('Fix 4: Improved textarea accessibility');
  
  // Add CSS fixes for the issues
  const style = document.createElement('style');
  style.textContent = `
    /* Fix for button accessibility */
    @media (max-width: 768px) {
      button {
        min-height: 44px;
        padding: 10px 15px;
        font-size: 16px;
        touch-action: manipulation;
      }
      
      /* Fix for textarea accessibility */
      textarea {
        font-size: 16px !important; /* Prevent iOS zoom */
        padding: 12px !important;
        border-radius: 4px !important;
      }
      
      /* Fix for header when keyboard appears */
      .fixed-while-typing {
        position: absolute !important;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 100;
      }
      
      /* Fix for horizontal scrolling indicators */
      pre.scrolling-horizontal::after {
        content: '→';
        position: absolute;
        right: 10px;
        bottom: 10px;
        color: var(--highlight-color);
        font-weight: bold;
      }
      
      /* Ensure solution label is always visible */
      pre::before {
        position: sticky !important;
        top: 0 !important;
        z-index: 1000 !important;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Check for common issues and report them
  checkForIssues();
});

// Function to identify common issues
function checkForIssues() {
  const issues = [];
  
  // Check for viewport meta tag
  if (!document.querySelector('meta[name="viewport"]')) {
    issues.push('Missing viewport meta tag');
  }
  
  // Check for tiny tap targets
  const tinyButtons = Array.from(document.querySelectorAll('button')).filter(
    button => {
      const rect = button.getBoundingClientRect();
      return rect.width < 44 || rect.height < 44;
    }
  );
  if (tinyButtons.length > 0) {
    issues.push(`${tinyButtons.length} buttons with tap targets too small`);
  }
  
  // Check for overflow issues
  const bodyWidth = document.body.scrollWidth;
  const windowWidth = window.innerWidth;
  if (bodyWidth > windowWidth) {
    issues.push(`Page is ${bodyWidth - windowWidth}px too wide, causing horizontal scroll`);
  }
  
  // Report issues
  if (issues.length > 0) {
    console.warn('Accessibility issues found:');
    issues.forEach(issue => console.warn(`- ${issue}`));
  } else {
    console.log('No major accessibility issues detected');
  }
} 