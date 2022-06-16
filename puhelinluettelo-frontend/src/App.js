import { useEffect, useState } from 'react'
import axios from 'axios'
import personService from './services/persons'
import './index.css'

const Person = (props) => {
  return (
    <div>
      <p>
        {props.person.name} {props.person.number}
        <button onClick={() => props.handleClick(props.person)}>delete</button>
      </p>
    </div>
  )
}

const Filter = (props) => {
  return (
    <div>
        filter shown with<input 
        value = {props.space} 
        onChange = {props.handleChange}
        />
    </div>
  )
}

const Form = (props) => {
  return (
    <div>
        <form onSubmit={props.onSubmit}>
        <div>
          name: <input 
          value = {props.nameValue} 
          onChange = {props.onNameChange}
          />
        </div>
        <div>
          number: <input 
          value = {props.numberValue} 
          onChange = {props.onNumberChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="success">
      {message}
    </div>
  )
}

const Notification2 = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    if (persons.find(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const id = persons.find(person => person.name === newName).id
        personService
        .updateNumber(personObject, id)
        .then(response => {
          setPersons(persons.map(oldPerson => oldPerson.name !== response.name ? oldPerson : response))
          setNewName('')
          setNewNumber('')
          setSuccessMessage(`Phone number of ${response.name} replaced`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })
        .catch(error => {
          //setErrorMessage(`Information of ${personObject.name} has already been removed from server`)
          setErrorMessage(error.response.data.error)
          //setPersons(persons.filter(oldPerson => oldPerson.name !== personObject.name))
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          
          //console.log(error.response.data)
        })

      } else {
        setNewName('')
        setNewNumber('')
        return
      }
    } else {

      personService
        .create(personObject)
        .then(response => {
          setPersons(persons.concat(response))
          setNewName('')
          setNewNumber('')
          setSuccessMessage(`Added ${response.name}`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })
        .catch(error => {
          setErrorMessage(error.response.data.error)
          // pääset käsiksi palvelimen palauttamaan virheilmoitusolioon näin
          //console.log(error.response.data.error)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const handleClick = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
      .deletePerson(person)
      .then(response => {
        setPersons(persons.filter(oldPerson => oldPerson.name !== person.name))
        setSuccessMessage(`Deleted ${person.name}`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
      })
    }
    
    
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} />
      <Notification2 message={errorMessage} />
      <Filter space={newFilter} handleChange={handleFilterChange}/>

      <h2>add a new</h2>

      <Form onSubmit={addPerson} nameValue = {newName} onNameChange = {handleNameChange} numberValue = {newNumber} onNumberChange = {handleNumberChange}/>
      
      <h2>Numbers</h2>
      {persons.filter(person => person.name.toLowerCase().includes(newFilter) || person.number.includes(newFilter)).map(person => 
        <Person key = {person.name} person={person} handleClick={handleClick}/>
      )}
    </div>
  )

}

export default App