import { useEffect, useState } from 'react';
import Notification from './components/Notification';
import noteService from './services/notes'
import Note from './components/Note';
import axios from 'axios';
const App = () => {
  const [notes, setNotes] = useState([])

  const [newNote, setNewNote] = useState('') 

  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)  

  const toggleImportanceOf = (id) => {
    const url = `http://localhost:3001/api/notes/${id}`
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
       setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        alert(`the note '${note.content}' was already deleted from server`)
        setErrorMessage(`Note '${note.content}' was already removed from server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(note => note.id !== id))
      })
  }

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/notes')
    noteService
      .getAll()
      .then(initialNotes => {
        console.log('promise fulfilled')
        setNotes(initialNotes)
      })
  }, [])

  console.log('render', notes.length, 'notes')

  const addNote = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  const changeInputValue = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value)
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <ul>
        {notes.map(note => 
          <Note 
            key={note.id} 
            note={note} 
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={changeInputValue} />
        <button type="submit">save</button>
      </form>   
    </div>
  )
}
export default App;