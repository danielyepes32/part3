const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

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

if(process.argv.length == 3){
    Person.find({}).select('-_id').then(result => {
        console.log('PhoneBook')
        result.forEach(person => {
          console.log(person.name,person.number)
        })
        mongoose.connection.close()
      })
}else if(process.argv.length == 5){

    const person = new Person({
        id: getRandomInt(1, 1000),
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then(result => {
        console.log('added ' + person.name + ' number ' + person.number + 'to phonebook')
        mongoose.connection.close()
    })
}