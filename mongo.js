const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model("person", personSchema);

const person = new Person({
  name: "Steve magnus",
  number: 1033456,
});

person.save().then((result) => {
  console.log("person saved!", result);
  mongoose.connection.close();
});

Person.find({})
  .then((result) => {
    console.log(result);
    mongoose.connection.close();
  })
  .catch((error) => error);
