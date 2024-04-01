/* eslint-disable linebreak-style */
require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')


const cors = require('cors')
var morgan = require('morgan')

// Definir formato de token personalizado para Morgan
morgan.token('description', function(req) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body) // Suponiendo que las solicitudes POST envían datos en formato JSON
  } else {
    return '-'
  }
})

app.use(cors())
app.use(morgan(':method :url :status - :description - Response Time: :response-time ms'))
app.use(express.json())
app.use(express.static('dist'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

//informacion
app.get('/info', (request, response) => {

  const fecha = new Date()

  Person.countDocuments({})
    .then(count => {
      response.send('<p>Phonebook has info for '+ count + ' people</p>'
    +'<p>' + fecha +'</p>')
    })
    .catch(error => {
      response.status(400).json({
        error: 'Error obteniendo la cantidad de datos '+ error
      })
    })
})

//obtener todas las notas
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

//obtener una sola nota
app.get('/api/persons/:id', (request, response, next) => {

  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

//publicar una nota
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  Person.find({ name: body.name }).then(persons => {
    console.log(persons)
    if (persons.length > 0) { // Verifica si se encontraron personas con el mismo nombre
      console.log(persons)
      return response.status(400).json({
        error: 'name must be unique'
      })} else {
      const person = new Person({
        name: body.name,
        number: body.number,
      })
      person.save().then(savedPerson => {
        response.json(savedPerson)
      }).catch(error => next(error))
    }
  })
})

//eliminar una nota
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: number, runValidators: true, context: 'query' }
  ).then(updatedPerson => {
    response.json(updatedPerson)
  })
    .catch(error => next(error))
})

//asignacion de puerto y escucha
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// controlador de solicitudes con endpoint desconocido
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

// este debe ser el último middleware cargado
app.use(errorHandler)
