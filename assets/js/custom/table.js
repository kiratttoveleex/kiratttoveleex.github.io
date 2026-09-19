// Function to create table headers
function createTableHeaders() {
    const tableHeaders = document.querySelector('#table-header');
    const columnSelect = document.getElementById('column-select');
    columnSelect.innerHTML = ''; // Clear existing options
    tableHeaders.innerHTML = ''; // Clear existing headers

    header.forEach((headerText, index) => {
        // Create table header
        const createHeaderCell = (text) => {
            const th = document.createElement('th');
            th.textContent = text;
            return th;
        };

        tableHeaders.appendChild(createHeaderCell(headerText));

        // Create column selection options
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `Column ${index + 1}`;
        columnSelect.appendChild(option);
    });

    // Set default selected column
    columnSelect.value = defaultHighlightedColumn;
    document.getElementById('items').textContent = list.length;
}

// Function to display table data
function displayTable(page) {
    const tableBody = document.querySelector('#data-table tbody');
    tableBody.innerHTML = ''; // Clear the table content

    // Filter the list data based on the current category
    const filteredList = currentCategory !== null 
        ? list.filter(row => row[row.length - 1] === currentCategory.toString()) 
        : list;

    // Calculate start and end index for pagination
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedItems = filteredList.slice(start, end);

    // Populate the table with data
    paginatedItems.forEach(row => {
        const tr = document.createElement('tr');

        row.forEach((cell, index) => {
            const td = document.createElement('td');

            // Handle hyperlink logic: only apply to the specified column (hyperlinkColumnIndex)
            if (index === hyperlinkColumnIndex && index >= 1) {
                const cellContent = cell.toString();
                const link = document.createElement('a');
                
                // Search for content wrapped with <l></l> tags
                const match = cellContent.match(/<l>(.*?)<\/l>/);

                if (match) {
                    // If <l></l> is found, only make the wrapped content a hyperlink
                    const beforeLink = cellContent.split(match[0])[0]; // Text before the hyperlink
                    const afterLink = cellContent.split(match[0])[1];  // Text after the hyperlink
                    const linkText = match[1]; // Content inside <l></l>

                    link.href = `${hyperlinkURL}${linkText}`;
                    link.innerHTML = linkText;

                    td.innerHTML = `${beforeLink}`; // Insert text before the hyperlink
                    td.appendChild(link);           // Insert the hyperlink
                    td.innerHTML += `${afterLink}`; // Insert text after the hyperlink
                } else {
                    // If no <l></l> is found, make the entire cell content a hyperlink
                    link.href = `${hyperlinkURL}${cellContent}`;
                    link.innerHTML = cellContent;
                    td.appendChild(link);
                }
            } else {
                // For other columns, keep the original content
                td.innerHTML = cell;
            }

            // Handle highlighted column logic: apply red text style and hover effects
            if (index === highlightedColumn) {
                td.classList.add('colorful-text');
                td.onmouseover = () => td.classList.add('highlighted');
                td.onmouseout = () => td.classList.remove('highlighted');
            }

            tr.appendChild(td); // Append the cell to the row
        });

        tableBody.appendChild(tr); // Append the row to the table
    });

    // Update the pagination info
    const totalPages = Math.ceil(filteredList.length / rowsPerPage);
    document.getElementById('page-info').textContent = `${page} of ${totalPages}`;
}


// Function to display search results
function displaySearchResults() {
    const tableBody = document.querySelector('#search-results-table tbody');
    tableBody.innerHTML = '';
    let filteredList = list.filter(row => 
        row.some(cell => cell.toString().includes(searchQuery))
    );

    // Populate search results table with data
    filteredList.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach((cell, index) => {
            const td = document.createElement('td');
            if (index === hyperlinkColumnIndex && index >= 1) {
                // Add hyperlink to cell content
                const link = document.createElement('a');
                link.href = `${hyperlinkURL}${cell}`;
                link.innerHTML = cell; // Use innerHTML to allow HTML tags
                td.appendChild(link);
            } else {
                td.innerHTML = cell; // Use innerHTML to allow HTML tags
            }
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}

// Function to create category buttons
function createCategoryButtons() {
    if (noCategory) {
        currentCategory = null;
        categories = [];
    } else {
        categories = [...new Set(list.map(row => row[row.length - 1]))];
        categories.sort((a, b) => {
            for (let i = 0; i < Math.min(a.length, b.length); i++) {
                if (a[i] !== b[i]) {
                    return parseInt(a[i]) - parseInt(b[i]);
                }
            }
            return a.length - b.length;
        });
    }
    const categoriesDiv = document.querySelector('.categories');

    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = `${category}`;
        button.onclick = () => filterByCategory(category);
        categoriesDiv.appendChild(button);
    });

    // Add a button to show all categories
    const allButton = document.createElement('button');
    allButton.textContent = 'All';
    allButton.onclick = () => filterByCategory(null);
    categoriesDiv.appendChild(allButton);
}

// Function to filter data by category
function filterByCategory(category) {
    currentCategory = category;
    currentPage = 1;
    displayTable(currentPage);
}

// Function to navigate to previous page
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayTable(currentPage);
    }
}

// Function to navigate to next page
function nextPage() {
    const filteredList = currentCategory !== null 
        ? list.filter(row => row[row.length - 1] === currentCategory.toString()) 
        : list;

    if (currentPage < Math.ceil(filteredList.length / rowsPerPage)) {
        currentPage++;
        displayTable(currentPage);
    }
}

// Function to highlight selected column
function highlightColumn() {
    highlightedColumn = parseInt(document.getElementById('column-select').value);
    displayTable(currentPage);
}