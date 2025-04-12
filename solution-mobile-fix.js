// Fix for solution code blocks on mobile
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on a mobile device
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  
  if (isMobile) {
    // Find all pre elements with solution code
    const solutions = document.querySelectorAll('pre[id$="-solution"]');
    
    solutions.forEach(solution => {
      // Add mobile-specific class
      solution.classList.add('mobile-solution');
      
      // Find the code element inside
      const codeElement = solution.querySelector('code');
      if (codeElement) {
        // Add mobile-specific class
        codeElement.classList.add('mobile-code');
        
        // Replace certain characters that might cause horizontal overflow
        const content = codeElement.innerHTML;
        
        // Replace long generic type declarations with shorter versions
        // For example: HashMap<String, ArrayList<Integer>> becomes HashMap<...>
        const fixedContent = content
          .replace(/(\w+)&lt;[^&]*&gt;/g, '$1&lt;...&gt;')
          .replace(/(\w+)&lt;[^&]*&gt;/g, '$1&lt;...&gt;'); // Apply twice for nested generics
        
        // Only apply if it actually made a difference
        if (fixedContent !== content && fixedContent.length < content.length) {
          codeElement.innerHTML = fixedContent;
        }
      }
    });
  }
});
