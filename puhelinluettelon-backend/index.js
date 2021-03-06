const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
morgan.token('type', function (req, res) 
  { return JSON.stringify(req.body) }
)
app.use(morgan('tiny', { skip: function (req, res) { return req.method == 'POST' }}))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type',
  { skip: function (req, res) { return req.method !== 'POST' }}))
app.use(express.static('build'))

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
]

  app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
  })
  
  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

  app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  const generateId = () => {
    const id = getRandomInt(1000000)
    return id
  }

  app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name && !body.number) {
      return response.status(400).json({ 
        error: 'name and number missing' 
      })
    }

    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }

    if (!body.number) {
      return response.status(400).json({ 
        error: 'number missing' 
      })
    }

    if (persons.find(person => person.name === body.name)) {
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

  

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })