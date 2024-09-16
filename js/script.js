// This code was created with the help of ChatGPT

// Global Variables for notes and intervals
let notes = [];         // Array to hold note objects
let saveInterval;       // Interval ID for auto-saving notes
let loadInterval;       // Interval ID for auto-loading notes

/**
 * Note Class
 * Represents a single note with a text area and a remove button.
 */
class Note {
    /**
     * Constructor for Note class.
     * @param {number} id - Unique identifier for the note.
     * @param {string} content - Content of the note.
     */
    constructor(id, content = '') {
        this.id = id;               // Unique ID for the note
        this.content = content;     // Content of the note

        // Create note container element
        this.container = document.createElement('div');
        this.container.className = 'note';

        // Create text area for note content
        this.textArea = document.createElement('textarea');
        this.textArea.value = content;

        // Create remove button
        this.removeButton = document.createElement('button');
        this.removeButton.textContent = MESSAGES.removeButton;
        this.removeButton.className = 'remove-button';

        // Append text area and remove button to the note container
        this.container.appendChild(this.textArea);
        this.container.appendChild(this.removeButton);

        // Append note container to the notes container in the DOM
        const notesContainer = document.getElementById('notesContainer');
        notesContainer.appendChild(this.container);

        // Bind methods to this instance
        this.remove = this.remove.bind(this);
        this.updateContent = this.updateContent.bind(this);

        // Add event listeners
        this.removeButton.addEventListener('click', this.remove);
        this.textArea.addEventListener('input', this.updateContent);
    }

    /**
     * Method to remove the note.
     * Removes the note from the DOM and updates localStorage.
     */
    remove() {
        // Remove note from the DOM
        const notesContainer = document.getElementById('notesContainer');
        notesContainer.removeChild(this.container);

        // Remove note from the notes array
        notes = notes.filter(note => note.id !== this.id);

        // Update localStorage
        saveNotesToLocalStorage();
    }

    /**
     * Method to update the note content.
     * Saves the updated content to localStorage.
     */
    updateContent() {
        this.content = this.textArea.value;
        // Update localStorage
        saveNotesToLocalStorage();
    }
}

/**
 * Initializes the Writer Page.
 * Sets up event listeners and loads existing notes.
 */
function initializeWriterPage() {
    // Get elements from the DOM
    const addNoteButton = document.getElementById('addNoteButton');
    const backToIndex = document.getElementById('backToIndex');
    const writerTitle = document.getElementById('writerTitle');

    // Set up user interface texts
    addNoteButton.textContent = MESSAGES.addNoteButton;
    backToIndex.textContent = MESSAGES.backButton;
    writerTitle.textContent = MESSAGES.noteWriterTitle;

    // Event listener for Add Note button
    addNoteButton.addEventListener('click', () => {
        const id = Date.now();    // Generate unique ID based on timestamp
        const note = new Note(id); // Create new Note instance
        notes.push(note);         // Add note to notes array
        saveNotesToLocalStorage(); // Save notes to localStorage
    });

    // Event listener for Back button
    backToIndex.addEventListener('click', () => {
        // Redirect to index.html
        window.location.href = 'index.html';
    });

    // Load existing notes and start auto-saving
    loadNotesIntoWriter();
    startAutoSave();
}

/**
 * Loads existing notes into the Writer Page.
 * Retrieves notes from localStorage and displays them.
 */
function loadNotesIntoWriter() {
    // Clear existing notes in the DOM
    const notesContainer = document.getElementById('notesContainer');
    notesContainer.innerHTML = '';
    notes = []; // Reset notes array

    // Retrieve notes from localStorage
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];

    // Create Note instances for each saved note
    savedNotes.forEach(noteData => {
        const note = new Note(noteData.id, noteData.content);
        notes.push(note);
    });

    // Update the last saved timestamp
    updateSaveTimestamp();
}

/**
 * Saves the current notes to localStorage.
 */
function saveNotesToLocalStorage() {
    // Map notes to an array of note data
    const notesData = notes.map(note => ({ id: note.id, content: note.content }));
    // Save notes data as JSON string in localStorage
    localStorage.setItem('notes', JSON.stringify(notesData));
    // Update the last saved timestamp
    updateSaveTimestamp();
}

/**
 * Updates the last saved timestamp on the Writer Page.
 */
function updateSaveTimestamp() {
    const saveTime = new Date().toLocaleTimeString();
    const saveTimestamp = document.getElementById('saveTimestamp');
    saveTimestamp.textContent = `${MESSAGES.lastSavedAt} ${saveTime}`;
}

/**
 * Starts the auto-save interval on the Writer Page.
 */
function startAutoSave() {
    // Auto-save every 2 seconds
    saveInterval = setInterval(() => {
        saveNotesToLocalStorage();
    }, 2000);
}

/**
 * Stops the auto-save interval on the Writer Page.
 */
function stopAutoSave() {
    clearInterval(saveInterval);
}

/**
 * Initializes the Reader Page.
 * Sets up event listeners and starts auto-loading notes.
 */
function initializeReaderPage() {
    // Get elements from the DOM
    const backToIndex = document.getElementById('backToIndex');
    const readerTitle = document.getElementById('readerTitle');

    // Set up user interface texts
    backToIndex.textContent = MESSAGES.backButton;
    readerTitle.textContent = MESSAGES.noteReaderTitle;

    // Event listener for Back button
    backToIndex.addEventListener('click', () => {
        // Redirect to index.html
        window.location.href = 'index.html';
    });

    // Load notes and start auto-loading
    loadNotesIntoReader();
    startAutoLoad();
}

/**
 * Loads notes into the Reader Page.
 * Retrieves notes from localStorage and displays them.
 */
function loadNotesIntoReader() {
    // Retrieve notes from localStorage
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    const readerNotesContainer = document.getElementById('readerNotesContainer');

    // Clear existing notes in the DOM
    readerNotesContainer.innerHTML = '';

    // Display each note
    savedNotes.forEach(noteData => {
        const noteElement = document.createElement('div');
        noteElement.className = 'noteContent';
        noteElement.textContent = noteData.content;
        readerNotesContainer.appendChild(noteElement);
    });

    // Update the last loaded timestamp
    updateLoadTimestamp();
}

/**
 * Updates the last loaded timestamp on the Reader Page.
 */
function updateLoadTimestamp() {
    const loadTime = new Date().toLocaleTimeString();
    const loadTimestamp = document.getElementById('loadTimestamp');
    loadTimestamp.textContent = `${MESSAGES.lastLoadedAt} ${loadTime}`;
}

/**
 * Starts the auto-load interval on the Reader Page.
 */
function startAutoLoad() {
    // Auto-load every 2 seconds
    loadInterval = setInterval(() => {
        loadNotesIntoReader();
    }, 2000);
}

/**
 * Stops the auto-load interval on the Reader Page.
 */
function stopAutoLoad() {
    clearInterval(loadInterval);
}

// Event listener to stop intervals when the page is unloaded
window.addEventListener('beforeunload', () => {
    if (saveInterval) {
        stopAutoSave();
    }
    if (loadInterval) {
        stopAutoLoad();
    }
});
