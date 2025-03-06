// Script to handle external links redirected to our app
document.addEventListener('DOMContentLoaded', function() {
  // Check if this page was opened via an external link
  const urlParams = new URLSearchParams(window.location.search);
  const sourceUrl = urlParams.get('source');
  const linkType = urlParams.get('type');
  const codeSnippet = urlParams.get('code');
  const error = urlParams.get('error');
  
  // Only proceed if this is an external link redirect
  if (sourceUrl && linkType === 'external_link') {
    console.log('Processing external link from:', sourceUrl);
    
    // Create external link info container
    const container = document.createElement('div');
    container.className = 'external-link-container';
    container.style.cssText = `
      background-color: rgba(255, 100, 0, 0.1); 
      border-left: 4px solid #ff6400;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    `;
    
    // Add title
    const title = document.createElement('h3');
    title.textContent = 'External Content';
    title.style.margin = '0 0 10px 0';
    container.appendChild(title);
    
    // Add source info
    const source = document.createElement('div');
    source.innerHTML = `<strong>Source:</strong> <a href="${sourceUrl}" target="_blank">${sourceUrl}</a>`;
    container.appendChild(source);
    
    // If we have a code snippet from the external page
    if (codeSnippet) {
      const snippetContainer = document.createElement('div');
      snippetContainer.style.cssText = `
        margin-top: 15px;
        background: #1a1a1a;
        padding: 15px;
        border-radius: 4px;
        overflow-x: auto;
      `;
      
      const snippetTitle = document.createElement('div');
      snippetTitle.textContent = 'Code Snippet Found:';
      snippetTitle.style.marginBottom = '10px';
      snippetTitle.style.fontWeight = 'bold';
      snippetContainer.appendChild(snippetTitle);
      
      const pre = document.createElement('pre');
      pre.style.cssText = `
        margin: 0;
        white-space: pre-wrap;
        font-family: monospace;
        color: #f8f8f2;
      `;
      
      // Decode the code snippet
      let decodedSnippet = codeSnippet;
      try {
        decodedSnippet = decodeURIComponent(codeSnippet);
      } catch (e) {
        console.error('Error decoding snippet:', e);
      }
      
      pre.textContent = decodedSnippet;
      snippetContainer.appendChild(pre);
      container.appendChild(snippetContainer);
      
      // Add button to practice with this snippet
      const practiceBtn = document.createElement('button');
      practiceBtn.textContent = 'Practice with this snippet';
      practiceBtn.className = 'practice-btn';
      practiceBtn.style.cssText = `
        background-color: #ff6400;
        color: white;
        border: none;
        padding: 8px 15px;
        margin-top: 15px;
        border-radius: 4px;
        cursor: pointer;
      `;
      practiceBtn.onclick = function() {
        // Store the snippet in localStorage
        localStorage.setItem('external_snippet', decodedSnippet);
        localStorage.setItem('external_snippet_source', sourceUrl);
        
        // Navigate to random.html which will display this snippet
        window.location.href = '/random.html?external=true';
      };
      container.appendChild(practiceBtn);
    } else if (error === 'fetch_failed') {
      // If there was an error fetching the content
      const errorMsg = document.createElement('div');
      errorMsg.style.color = '#ff3333';
      errorMsg.style.marginTop = '10px';
      errorMsg.textContent = 'Could not fetch content from the external link.';
      container.appendChild(errorMsg);
    }
    
    // Find where to insert in the page (before the first main content)
    const firstContent = document.querySelector('.container') || 
                         document.querySelector('main') || 
                         document.querySelector('body');
    
    if (firstContent) {
      // Insert at the beginning of the content
      firstContent.insertBefore(container, firstContent.firstChild);
    }
  }
}); 