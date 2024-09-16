// This code was created with the help of ChatGPT

// Initialize Index Page
document.addEventListener('DOMContentLoaded', () => {
    // Set up user interface texts
    document.getElementById('labTitle').textContent = MESSAGES.labTitle;
    document.getElementById('studentName').textContent = MESSAGES.studentName;
    document.getElementById('writerButton').textContent = MESSAGES.writerButton;
    document.getElementById('readerButton').textContent = MESSAGES.readerButton;

    // Event Listeners for Navigation
    document.getElementById('writerButton').addEventListener('click', () => {
        // Navigate to writer.html
        window.location.href = 'writer.html';
    });

    document.getElementById('readerButton').addEventListener('click', () => {
        // Navigate to reader.html
        window.location.href = 'reader.html';
    });
});
