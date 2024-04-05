document.addEventListener("DOMContentLoaded", function() {
    fetchBlogContent();
});

function fetchBlogContent() {
    fetch('https://raw.githubusercontent.com/yakikaki/yakikaki.github.io/main/blogs/') 
        .then(response => response.text())
        .then(text => {
            const parser = new DOMParser();
            const htmlDocument = parser.parseFromString(text, 'text/html');

            const links = htmlDocument.querySelectorAll('a');
            const fileNames = Array.from(links).map(link => link.href);

            const blogFileNames = fileNames.filter(fileName => !fileName.includes('..') && fileName.endsWith('.html'));

            Promise.all(blogFileNames.map(fileName => fetch(fileName).then(response => response.text())))
                .then(htmlContents => {
                    createAndSortBlogBlocks(htmlContents, blogFileNames);
                })
                .catch(error => {
                    console.error('Error fetching blog files:', error);
                });
        })
        .catch(error => {
            console.error('Error fetching blog folder:', error);
        });
}

function createAndSortBlogBlocks(htmlContents, fileNames) {
    const blogBlocks = [];

    htmlContents.forEach((htmlContent, index) => {
        const parser = new DOMParser();
        const htmlDocument = parser.parseFromString(htmlContent, 'text/html');
        const timestampElement = htmlDocument.querySelector('.blogTimestamp');
        const timestamp = timestampElement ? timestampElement.textContent : 'XX-XX-XXXX';

        blogBlocks.push({ timestamp: timestamp, fileName: fileNames[index], htmlContent: htmlContent });
    });

    blogBlocks.sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return dateB - dateA;
    });

    blogBlocks.forEach(blogBlock => {
        createBlogBlock(blogBlock.htmlContent, blogBlock.fileName);
    });
}

function createBlogBlock(htmlContent, fileName) {
    const blogContainer = document.createElement('a');
    blogContainer.classList.add('blogBlock');
    blogContainer.href = fileName; 

    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(htmlContent, 'text/html');

    const titleElement = htmlDocument.querySelector('.blog-title');
    const title = titleElement ? titleElement.textContent : 'Default Title';

    const timestampElement = htmlDocument.querySelector('.blog-timestamp');
    const timestamp = timestampElement ? timestampElement.textContent : 'XX-XX-XXXX';

    const descriptionElement = htmlDocument.querySelector('.blog-description');
    const description = descriptionElement ? descriptionElement.textContent : 'Default Description';

    // Extract the image source
    const imageElement = htmlDocument.querySelector('.blog-image');
    const imageUrl = imageElement ? imageElement.getAttribute('src') : 'assets/NoImage.png';

    // Extract the author information
    const authorElement = htmlDocument.querySelector('.blog-author');
    const author = authorElement ? authorElement.textContent : 'Unknown Author';

    // Create HTML elements to display the information
    const blogImage = document.createElement('img');
    blogImage.src = imageUrl;
    blogImage.alt = "Project Image";
    blogImage.classList.add('blogImage');
    blogImage.style.maxWidth = '100%';

    const blogContent = document.createElement('div');
    blogContent.classList.add('blogContent');

    const blogAuthor = document.createElement('div');
    blogAuthor.classList.add('blogAuthor');
    blogAuthor.textContent = author;

    const blogTitle = document.createElement('div');
    blogTitle.classList.add('blogTitle');
    blogTitle.textContent = title;

    const blogTimestamp = document.createElement('div');
    blogTimestamp.classList.add('blogTimestamp');
    blogTimestamp.textContent = timestamp;

    const blogDescription = document.createElement('div');
    blogDescription.classList.add('blogDescription');
    blogDescription.textContent = description;

    blogContent.appendChild(blogAuthor);
    blogContent.appendChild(blogTitle);
    blogContent.appendChild(blogTimestamp);
    blogContent.appendChild(blogDescription);

    blogContainer.appendChild(blogImage);
    blogContainer.appendChild(blogContent);

    const blogsContainer = document.querySelector('.blogsContainer');
    if (blogsContainer) {
        blogsContainer.appendChild(blogContainer);
    } else {
        console.error('Error: .blogsContainer not found.');
    }
}
