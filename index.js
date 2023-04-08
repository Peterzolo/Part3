const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const Person = require("./models/person");

const app = express();

// eslint-disable-next-line no-unused-vars
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

app.use(express.static(path.join(__dirname, "build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// app.use(
//   express.static("build", {
//     setHeaders: (res) => {
//       res.set("Content-Type", "application/javascript");
//     },
//   })
// );

// app.use(express.static("build"));
app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(cors());

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(
    ":url :method :res[content-length] - :response-time ms :date[web] :body"
  )
);

app.get("/api/persons", (req, res) => {
  Person.find({})
    .then((persons) => {
      if (persons) {
        const now = new Date();
        const dayOfWeek = now.toLocaleString("en-US", { weekday: "long" });
        const month = now.toLocaleString("en-US", { month: "long" });
        const dayOfMonth = now.toLocaleString("en-US", { day: "numeric" });
        const year = now.getFullYear();
        const time = now.toLocaleTimeString("en-US", { hour12: false });
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const responseDate = ` ${dayOfWeek}, ${month} ${dayOfMonth}, ${year} at ${time} (${timezone})`;
        const infoCount = `The phonebook has info for ${persons.length} people`;

        res.status(200).json({
          infoCount,
          responseDate,
          result: persons,
        });
      } else {
        res.status(400).json("No data found");
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = Person.findById(id)
    .then((response) => {
      if (!person) {
        return res.status(400).json("No data found");
      }
      console.log("SINGLE PERSON", response);
      res.status(200).json({ result: response });
    })
    .catch((error) => {
      console.error(error);
    });
});

app.get("/info", (req, res) => {
  Person.find({})
    .then((persons) => {
      if (persons) {
        const now = new Date();
        const dayOfWeek = now.toLocaleString("en-US", { weekday: "long" });
        const month = now.toLocaleString("en-US", { month: "long" });
        const dayOfMonth = now.toLocaleString("en-US", { day: "numeric" });
        const year = now.getFullYear();
        const time = now.toLocaleTimeString("en-US", { hour12: false });
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const responseDate = ` ${dayOfWeek}, ${month} ${dayOfMonth}, ${year} at ${time} (${timezone})`;
        const infoCount = `The phonebook has info for ${persons.length} people`;

        res.status(200).json({
          infoCount,
          responseDate,
          result: persons,
        });
      } else {
        res.status(400).json("No data found");
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name) {
    return res.status(404).json({ error: "name or phone is missing" });
  }
  if (!body.phone) {
    return res.status(404).json({ error: "name or phone is missing" });
  }

  const newUsewr = new Person({
    name: body.name,
    phone: body.phone,
  });

  newUsewr
    .save()
    .then((response) => {
      res.status(200).json({
        result: response,
      });
    })
    .catch((error) => {
      res.status(400).json(error.message);
    });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.findByIdAndRemove(id)
    .then(() => {
      res.status(204).json("Data deleted");
    })
    .catch((error) => error);
});

app.get("/api/persons/:id", (req, res) => {
  const userId = req.params.id;
  Person.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error fetching user", error });
    });
});

app.put("/api/persons/:id", (req, res) => {
  const userId = req.params.id;

  Person.findById(userId)
    .then((user) => {
      const updatePhoneOnly = {
        name: user.name,
        phone: req.body.phone,
      };

      const updateFullDetail = {
        name: req.body.name,
        phone: req.body.phone,
      };
      if (user.name === req.body.name) {
        Person.findByIdAndUpdate(userId, updatePhoneOnly, {
          new: true,
          runValidators: true,
          context: "query",
        }).then((result) => {
          res.status(200).json({ message: "Phone Number updated", result });
        });
      } else {
        Person.findByIdAndUpdate(userId, updateFullDetail, {
          new: true,
          runValidators: true,
          context: "query",
        }).then((result) => {
          res.status(200).json({ message: "User updated", result });
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Error fetching user", error });
    });
});
app.get("/", function (req, res) {
  res.setHeader("Content-Type", "application/javascript");
  // rest of your code to serve the JavaScript file
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
