const express = require('express')
const app = express()


const cors = require('cors')
var morgan = require('morgan')

// Definir formato de token personalizado para Morgan
morgan.token('description', function(req, res) {
    if (req.method === 'POST') {
      return JSON.stringify(req.body); // Suponiendo que las solicitudes POST envían datos en formato JSON
    } else {
      return '-';
    }
  })

  app.use(cors())
  app.use(morgan(':method :url :status - :description - Response Time: :response-time ms'))
  app.use(express.json())

let persons = [

    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
  ]


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

//informacion
app.get('/info', (request, response) => {
    const fecha = new Date()
    response.send('<p>Phonebook has info for '+ persons.length + ' people</p>'
    +'<p>' + fecha +'</p>')
    
  })

//obtener todas las notas
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

//obtener una sola nota
app.get('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }

  })

//funcion para generar id
  const generateId = () => {
    const randomID = Math.floor(Math.random() * 1000) + 1;

// Convertir el número entero a una cadena (string)
    return randomID
  }
  
//publicar una nota
app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }

    if(persons.find(person=>person.name == body.name)){
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }
  
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number
    }
  
    persons = persons.concat(person)
    response.json(person)
  })

//eliminar una nota
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  
  response.status(204).end()
    })  
  
//asignacion de puerto y escucha
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


