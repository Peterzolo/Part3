const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const Person = require("./models/person");

const app = express();

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck-----",
    number: "39-23-6423122",
  },
];

app.use(express.static("build"));
app.use(cors());

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(
    ":url :method :res[content-length] - :response-time ms :date[web] :body"
  )
);

app.use(express.json());
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const newPersons = persons;
  const now = new Date();
  const dayOfWeek = now.toLocaleString("en-US", { weekday: "long" });
  const month = now.toLocaleString("en-US", { month: "long" });
  const dayOfMonth = now.toLocaleString("en-US", { day: "numeric" });
  const year = now.getFullYear();
  const time = now.toLocaleTimeString("en-US", { hour12: false });
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const responseDate = ` ${dayOfWeek}, ${month} ${dayOfMonth}, ${year} at ${time} (${timezone})`;
  const infoCount = `The phonebook has info for ${newPersons.length} people`;

  response.status(200).send({
    infoCount,
    responseDate,
  });
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/delete/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.filter((person) => person.id !== id);
  if (person) {
    response.json("Delete was successful");
  } else {
    response.status(404).end("Could not delete");
  }
});

app.post("/api/persons", (req, res) => {
  const id = Math.floor(Math.random() * 1000000);

  if (req.body.name === "" || req.body.number === "") {
    return res.status(404).send("You have to enter your details");
  }

  const person = persons.find((person) => person.name === req.body.name);
  if (person) {
    res.status(409).send("Enter a unique name");
  } else {
    const newPerson = {
      id: id,
      name: req.body.name,
      number: req.body.number,
    };

    persons = persons.concat(newPerson);

    res.json(newPerson);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
