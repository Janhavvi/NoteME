class NoteCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isFlipped = false;
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    render() {
        const noteText = this.getAttribute('text');
        const noteColor = this.getAttribute('color');
        const editIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A4645" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
        const deleteIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A4645" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`;
        const saveIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A4645" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
                :host {
                    display: block;
                    perspective: 1200px;
                    min-height: 220px;
                    animation: fadeIn 0.5s ease-in-out;
                    box-sizing: border-box;
                }

                *, *:before, *:after {
                    box-sizing: inherit;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .card-inner {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transition: transform 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55);
                    transform-style: preserve-3d;
                }

                :host(.flipped) .card-inner {
                    transform: rotateY(180deg);
                }

                .card-front, .card-back {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    -webkit-backface-visibility: hidden;
                    backface-visibility: hidden;
                    display: flex;
                    flex-direction: column;
                    padding: 1.5rem;
                    border-radius: 15px;
                    border: 1px solid rgba(0,0,0,0.05);
                    background-color: ${noteColor};
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
                }

                .card-back {
                    transform: rotateY(180deg);
                    gap: 1rem;
                }

                .content p {
                    font-family: 'Inter', sans-serif;
                    font-size: 1.1rem;
                    line-height: 1.5;
                    color: #4A4645;
                    margin: 0;
                }

                .actions {
                    margin-top: auto;
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.5rem;
                }

                button {
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transition: background-color 0.3s;
                }

                button:hover {
                    background: rgba(0, 0, 0, 0.08);
                }

                textarea {
                    flex-grow: 1;
                    width: 100%;
                    border: 1px solid rgba(0,0,0,0.1);
                    border-radius: 12px;
                    padding: 1rem;
                    font-family: 'Inter', sans-serif;
                    resize: none;
                    font-size: 1.1rem;
                    background: rgba(255, 255, 255, 0.5);
                    color: #4A4645;
                }
            </style>
            <div class="card-inner">
                <div class="card-front">
                    <div class="content">
                        <p>${noteText}</p>
                    </div>
                    <div class="actions">
                        <button class="edit-btn">${editIcon}</button>
                        <button class="delete-btn">${deleteIcon}</button>
                    </div>
                </div>
                <div class="card-back">
                     <textarea class="edit-textarea">${noteText}</textarea>
                    <div class="actions">
                        <button class="save-btn">${saveIcon}</button>
                    </div>
                </div>
            </div>
        `;
    }

    addEventListeners() {
        this.shadowRoot.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.dispatchEvent(new CustomEvent('delete-note', { bubbles: true, composed: true }));
        });

        this.shadowRoot.querySelector('.edit-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.flipCard();
        });

        this.shadowRoot.querySelector('.save-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const newText = this.shadowRoot.querySelector('.edit-textarea').value;
            if (newText.trim() !== '') {
                this.setAttribute('text', newText);
                this.shadowRoot.querySelector('.card-front .content p').textContent = newText;
                this.dispatchEvent(new CustomEvent('update-note', {
                    bubbles: true,
                    composed: true,
                    detail: { newText }
                }));
                this.flipCard();
            } else {
                 alert('Please enter a note.');
            }
        });
    }

    flipCard() {
        this.isFlipped = !this.isFlipped;
        this.classList.toggle('flipped', this.isFlipped);
    }
}

customElements.define('note-card', NoteCard);

const addNoteForm = document.getElementById('add-note-form');
const noteText = document.getElementById('note-text');
const notesContainer = document.getElementById('notes-container');
const addNewBtn = document.getElementById('add-new-btn');

const noteColors = ['#FFFFFF', '#EAE3D9', '#D3B8A5', '#A9C2B5', '#F2D2A2'];

const getNotes = () => JSON.parse(localStorage.getItem('notes')) || [];
const saveNotes = (notes) => localStorage.setItem('notes', JSON.stringify(notes));

const renderNotes = () => {
    const notes = getNotes();
    notesContainer.innerHTML = '';
    notes.forEach((note, index) => {
        const noteCard = document.createElement('note-card');
        noteCard.setAttribute('text', note.text);
        noteCard.setAttribute('color', note.color);
        noteCard.dataset.index = index;
        notesContainer.appendChild(noteCard);
    });
};

addNoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newNoteText = noteText.value.trim();
    if (newNoteText) {
        const notes = getNotes();
        const randomColor = noteColors[Math.floor(Math.random() * noteColors.length)];
        notes.push({ text: newNoteText, color: randomColor });
        saveNotes(notes);
        noteText.value = '';
        addNoteForm.classList.add('hidden');
        renderNotes();
    } else {
        alert('Please enter a note.');
    }
});

notesContainer.addEventListener('delete-note', (e) => {
    const noteCard = e.target.closest('note-card');
    const index = noteCard.dataset.index;
    const notes = getNotes();
    notes.splice(index, 1);
    saveNotes(notes);
    renderNotes();
});

notesContainer.addEventListener('update-note', (e) => {
    const noteCard = e.target.closest('note-card');
    const index = noteCard.dataset.index;
    const { newText } = e.detail;
    const notes = getNotes();
    notes[index].text = newText;
    saveNotes(notes);
});

addNewBtn.addEventListener('click', () => {
    addNoteForm.classList.toggle('hidden');
});

// Reminder Functionality
const setReminderBtn = document.getElementById('set-reminder-btn');
const reminderModal = document.getElementById('reminder-modal');
const closeBtn = document.querySelector('.close-btn');
const reminderForm = document.getElementById('reminder-form');
const reminderNoteSelect = document.getElementById('reminder-note-select');
const reminderTimeInput = document.getElementById('reminder-time');

const populateReminderNotes = () => {
    const notes = getNotes();
    reminderNoteSelect.innerHTML = '';
    if (notes.length === 0) {
        const option = document.createElement('option');
        option.textContent = 'No notes available to set a reminder.';
        option.disabled = true;
        reminderNoteSelect.appendChild(option);
        return;
    }
    notes.forEach((note, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = note.text.substring(0, 50) + (note.text.length > 50 ? '...' : '');
        reminderNoteSelect.appendChild(option);
    });
};

setReminderBtn.addEventListener('click', () => {
    populateReminderNotes();
    reminderModal.classList.remove('hidden');
});

closeBtn.addEventListener('click', () => {
    reminderModal.classList.add('hidden');
});

window.addEventListener('click', (e) => {
    if (e.target == reminderModal) {
        reminderModal.classList.add('hidden');
    }
});

reminderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const noteIndex = reminderNoteSelect.value;
    const reminderTime = reminderTimeInput.value;
    const notes = getNotes();
    
    if (notes.length === 0 || !reminderTime) {
        alert('Please create a note and select a time.');
        return;
    }
    
    const selectedNote = notes[noteIndex];
    const [hours, minutes] = reminderTime.split(':');
    const now = new Date();
    const reminderDate = new Date();
    
    reminderDate.setHours(hours);
    reminderDate.setMinutes(minutes);
    reminderDate.setSeconds(0);

    if (reminderDate < now) {
        reminderDate.setDate(reminderDate.getDate() + 1);
    }

    const timeToReminder = reminderDate.getTime() - now.getTime();

    setTimeout(() => {
        alert(`Reminder: ${selectedNote.text}`);
    }, timeToReminder);

    reminderModal.classList.add('hidden');
    alert(`Reminder set for "${selectedNote.text.substring(0, 20)}..."!`);
});

renderNotes();