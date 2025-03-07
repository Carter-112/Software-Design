document.addEventListener('DOMContentLoaded', function() {
    // Define all navigation links by category
    const navigationStructure = {
        "Java Data Structures": [
            { name: "Singly Linked List", url: "singly.html" },
            { name: "Doubly Linked List", url: "doubly.html" },
            { name: "ArrayList", url: "arraylist.html" },
            { name: "HashMap", url: "hashmap.html" },
            { name: "HashSet", url: "hashset.html" },
            { name: "Binary Search Tree", url: "bst.html" },
            { name: "Streams & Lambdas", url: "streams.html" }
        ],
        "Python Data Structures": [
            { name: "Lists", url: "python-lists.html" },
            { name: "Dictionaries", url: "python-dictionaries.html" },
            { name: "Sets", url: "python-sets.html" },
            { name: "Tuples", url: "python-tuples.html" },
            { name: "Comprehensions", url: "python-comprehensions.html" }
        ],
        "SQL Topics": [
            { name: "SELECT Queries", url: "sql-select.html" },
            { name: "JOINs", url: "sql-joins.html" },
            { name: "Aggregation", url: "sql-aggregation.html" },
            { name: "Subqueries", url: "sql-subqueries.html" },
            { name: "Transactions", url: "sql-transactions.html" }
        ],
        "Web Development": [
            { name: "HTML Structure", url: "web-html.html" },
            { name: "CSS Styling", url: "web-css.html" },
            { name: "JavaScript DOM", url: "web-js-dom.html" },
            { name: "JavaScript Events", url: "web-js-events.html" },
            { name: "Responsive Design", url: "web-responsive.html" }
        ],
        "Language Fundamentals": [
            { name: "Java Basics", url: "javabasics.html" },
            { name: "Python Basics", url: "pythonbasics.html" },
            { name: "SQL Basics", url: "sqlbasics.html" },
            { name: "HTML/CSS/JS Basics", url: "webbasics.html" }
        ],
        "Random Practice": [
            { name: "Java Random Practice", url: "random.html" },
            { name: "Python Random Practice", url: "pythonrandom.html" },
            { name: "SQL Random Practice", url: "sqlrandom.html" },
            { name: "Web Dev Random Practice", url: "webrandom.html" }
        ]
    };

    // Function to build the navigation menu
    function buildNavigation() {
        // Check if header already exists
        let header = document.querySelector('header');
        if (!header) {
            header = document.createElement('header');
            // Add header at the beginning of the body
            document.body.insertBefore(header, document.body.firstChild);
        }

        // Clear existing header content to avoid duplicates
        header.innerHTML = '';

        // Create navbar structure
        const navbar = document.createElement('div');
        navbar.className = 'navbar';
        
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown';
        
        const dropbtn = document.createElement('button');
        dropbtn.className = 'dropbtn';
        dropbtn.textContent = 'Navigation ▼';
        
        const dropdownContent = document.createElement('div');
        dropdownContent.className = 'dropdown-content';
        
        // Add home link
        const homeLink = document.createElement('a');
        homeLink.href = 'index.html';
        homeLink.textContent = 'Home';
        dropdownContent.appendChild(homeLink);

        // Add category links
        for (const category in navigationStructure) {
            // Add category header
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'nav-category';
            categoryDiv.textContent = category;
            dropdownContent.appendChild(categoryDiv);
            
            // Add links for this category
            navigationStructure[category].forEach(item => {
                const link = document.createElement('a');
                link.href = item.url;
                link.textContent = item.name;
                dropdownContent.appendChild(link);
            });
        }
        
        // Assemble the navbar
        dropdown.appendChild(dropbtn);
        dropdown.appendChild(dropdownContent);
        navbar.appendChild(dropdown);
        header.appendChild(navbar);
    }

    // Build the navigation when the page loads
    buildNavigation();
}); 