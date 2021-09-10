const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('body', function (req, res) {
  if(req.method === 'POST')
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.json())

let persons = [
  { 
    id: 1,
    name: "Arto Hellas", 
    number: "040-123456"
  },
  { 
    id: 2,
    name: "Ada Lovelace", 
    number: "39-44-5323523"
  },
  { 
    id: 3,
    name: "Dan Abramov", 
    number: "12-43-234345"
  },
  { 
    id: 4,
    name: "Mary Poppendieck", 
    number: "39-23-6423122"
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  
  if(person) {
    res.json(person)
  }
  else {
    res.status(404).end()
  }
})

const generateId = () => Math.floor(Math.random() * 500)

app.post('/api/persons', (req, res) => {

  const body = req.body

  if(!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number is missing'
    })
  }
  
  if(persons.find(p => p.name === body.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }


  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)

  res.status(204).end() 
})

app.get('/info', (req, res) => {
  res.end(
    `<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`
    )
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})