// Script to remove placeholders from all textareas
document.addEventListener('DOMContentLoaded', function() {
  // Find all textareas with the placeholder "Type your code here..."
  const textareas = document.querySelectorAll('textarea[placeholder="Type your code here..."]');
  
  // Remove the placeholder from each textarea
  textareas.forEach(textarea => {
    textarea.removeAttribute('placeholder');
  });
});
