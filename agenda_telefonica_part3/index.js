require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')


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

    Person.find({ name: body.name }).then(persons => {
      console.log(persons);
      if (persons.length > 0) { // Verifica si se encontraron personas con el mismo nombre
        console.log(persons);
        return response.status(400).json({ 
          error: 'name must be unique' 
        });
      } else {

        const person = new Person({
          name: body.name,
          number: body.number,
        })
      
        person.save().then(savedPerson => {
          response.json(savedPerson)
        })}
    })
  

  })

//eliminar una nota
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  }) 
  
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: person.number })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
})
  
//asignacion de puerto y escucha
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

