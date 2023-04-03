const express = require("express");
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
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

console.log("NEW PERSONS", persons);

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

  console.log(responseDate);
  console.log(infoCount);

  response.status(200).send({
    infoCount,
    responseDate,
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
