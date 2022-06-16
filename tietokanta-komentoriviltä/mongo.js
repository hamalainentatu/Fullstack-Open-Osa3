const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

const Person = mongoose.model('Person', personSchema)

  

if (process.argv.length===3) {
    const password = process.argv[2]

    const url =
     `mongodb+srv://hamaltat:${password}@cluster0.dacz6.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

    mongoose.connect(url)

    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })

    

  }

if (process.argv.length===5) {
    const password = process.argv[2]
    const name = process.argv[3]
    const number = process.argv[4]

    const url =
      `mongodb+srv://hamaltat:${password}@cluster0.dacz6.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

    mongoose.connect(url)

    const person = new Person({
        name: name,
        number: number,
      })

    person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
    })
  }





