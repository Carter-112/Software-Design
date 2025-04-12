// Mobile navigation enhancement
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on a mobile device
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  
  if (isMobile) {
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');
    const dropbtn = document.querySelector('.dropbtn');
    
    if (dropdown && dropdownContent && dropbtn) {
      // Add tap functionality for mobile
      dropbtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Toggle dropdown visibility
        if (dropdownContent.style.display === 'block') {
          dropdownContent.style.display = 'none';
        } else {
          dropdownContent.style.display = 'block';
        }
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) {
          dropdownContent.style.display = 'none';
        }
      });
      
      // Close dropdown when clicking a link
      const links = dropdownContent.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('click', function() {
          dropdownContent.style.display = 'none';
        });
      });
    }
  }
});
