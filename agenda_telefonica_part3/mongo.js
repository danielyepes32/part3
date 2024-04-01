/* eslint-disable linebreak-style */
const mongoose = require('mongoose')

// eslint-disable-next-line no-undef
if (process.argv.length<3) {
  console.log('give password as argument')
  // eslint-disable-next-line no-undef
  process.exit(1)
}

// eslint-disable-next-line no-undef
const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@appmongodb.katevlp.mongodb.net/phoneAgency?retryWrites=true&w=majority&appName=AppMongoDB`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
})

const Person = mongoose.model('Persons', personSchema)

// Genera un número entero aleatorio entre un mínimo (min) y un máximo (max) inclusivos
function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// eslint-disable-next-line no-undef
if(process.argv.length === 3){
  Person.find({}).select('-_id').then(result => {
    console.log('PhoneBook')
    result.forEach(person => {
      console.log(person.name,person.number)
    })
    mongoose.connection.close()
  })
// eslint-disable-next-line no-undef
}else if(process.argv.length === 5){

  const person = new Person({
    id: getRandomInt(1, 1000),
    // eslint-disable-next-line no-undef
    name: process.argv[3],
    // eslint-disable-next-line no-undef
    number: process.argv[4],
  })
  // eslint-disable-next-line no-unused-vars
  person.save().then(result => {
    console.log('added ' + person.name + ' number ' + person.number + 'to phonebook')
    mongoose.connection.close()
  })
}