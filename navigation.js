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
            { name: "Lazy Binary Search Tree", url: "lazybst.html" },
            { name: "Red-Black Tree", url: "redblacktree.html" },
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

    // Function to save scroll position to localStorage
    function saveScrollPosition() {
        // Get the current page URL
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        // Save current scroll position
        localStorage.setItem(`scrollPos_${currentPage}`, window.scrollY);
        console.log(`Saved scroll position ${window.scrollY} for ${currentPage}`);
    }

    // Function to restore scroll position
    function restoreScrollPosition() {
        // Get the current page URL
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        // Check if we have a saved position for this page
        const savedPosition = localStorage.getItem(`scrollPos_${currentPage}`);
        if (savedPosition !== null) {
            // Use setTimeout to ensure DOM is fully loaded before scrolling
            setTimeout(() => {
                window.scrollTo({
                    top: parseInt(savedPosition),
                    behavior: 'auto'
                });
                console.log(`Restored scroll position ${savedPosition} for ${currentPage}`);
            }, 100);
        }
    }

    // Function to build the navigation menu
    function buildNavigation() {
        // Check if header already exists
        let header = document.querySelector('header');
        if (!header) {
            header = document.createElement('header');
            // Add header at the beginning of the body
            document.body.insertBefore(header, document.body.firstChild);
        }

        // Get the current page filename
        const currentPage = window.location.pathname.split('/').pop();

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
        if (currentPage === 'index.html' || currentPage === '') {
            homeLink.className = 'active-page';
        }
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
                // Highlight current page
                if (currentPage === item.url) {
                    link.className = 'active-page';
                }
                // Add click event to save scroll position before navigating
                link.addEventListener('click', function(e) {
                    // Save position before navigating
                    saveScrollPosition();

                    // Store destination page in sessionStorage
                    const destinationPage = this.getAttribute('href');
                    sessionStorage.setItem('lastNavigation', destinationPage);
                });
                dropdownContent.appendChild(link);
            });
        }

        // Assemble the navbar
        dropdown.appendChild(dropbtn);
        dropdown.appendChild(dropdownContent);
        navbar.appendChild(dropdown);
        header.appendChild(navbar);

        // Add click event to home link
        homeLink.addEventListener('click', function(e) {
            saveScrollPosition();
        });

        // Add hover effects for better UX
        const navLinks = document.querySelectorAll('.dropdown-content a');
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                if (!this.classList.contains('active-page')) {
                    this.style.backgroundColor = '#555';
                }
            });
            link.addEventListener('mouseleave', function() {
                if (!this.classList.contains('active-page')) {
                    this.style.backgroundColor = '';
                }
            });
        });

        // Add style for active page and moving border animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes borderPulse {
                0% { border-color: #e78c11; }
                50% { border-color: #ff5722; }
                100% { border-color: #e78c11; }
            }

            @keyframes glowPulse {
                0% { box-shadow: 0 0 5px rgba(231, 140, 17, 0.5); }
                50% { box-shadow: 0 0 15px rgba(231, 140, 17, 0.8); }
                100% { box-shadow: 0 0 5px rgba(231, 140, 17, 0.5); }
            }

            .active-page {
                background-color: #333 !important;
                color: #e78c11 !important;
                font-weight: bold;
                border-left: 3px solid #e78c11 !important;
                animation: borderPulse 2s infinite, glowPulse 3s infinite;
                position: relative;
                overflow: hidden;
            }

            .active-page::before {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 2px;
                background: linear-gradient(to right, transparent, #e78c11, transparent);
                animation: moveLeft 2s infinite linear;
            }

            @keyframes moveLeft {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }

            .nav-category {
                background-color: #333;
                color: white;
                padding: 8px 16px;
                font-weight: bold;
                border-bottom: 1px solid #555;
            }

            .dropdown-content {
                max-height: 80vh;
                overflow-y: auto;
            }
        `;
        document.head.appendChild(style);
    }

    // Build the navigation when the page loads
    buildNavigation();

    // Restore scroll position after page is fully loaded
    window.addEventListener('load', function() {
        // Check if we came from another page in the site
        const referrer = document.referrer;
        const currentHost = window.location.host;

        // Only restore if we're navigating within the same site
        if (referrer.includes(currentHost) || sessionStorage.getItem('lastNavigation')) {
            restoreScrollPosition();
        }
    });

    // Save scroll position when dropdown is closed
    document.addEventListener('click', function(e) {
        // Check if the dropdown is open
        const dropdown = document.querySelector('.dropdown-content');
        if (dropdown && window.getComputedStyle(dropdown).display !== 'none') {
            // If click is outside the dropdown
            if (!dropdown.contains(e.target) && !e.target.classList.contains('dropbtn')) {
                saveScrollPosition();
            }
        }
    });

    // Save scroll position before page unload (when navigating away)
    window.addEventListener('beforeunload', function() {
        saveScrollPosition();
    });

    // Save scroll position when scrolling stops
    let scrollTimer;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function() {
            saveScrollPosition();
        }, 300); // Save position 300ms after scrolling stops
    });
});