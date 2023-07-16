const express = require("express");
const cors = require("cors");
const Person = require("./modules/phonebook");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

app.get("/", function (req, res) {
  res.send("<h2>Phonebook Backend</h2>");
});

//get all people from the phonebook
app.get("/api/people", function (req, res, next) {
  Person.find({})
    .then((results) => {
      res.json(results);
    })
    .catch((error) => {
      next(error);
    });
});

//get a specific person from phonebook
app.get("/api/people/:id", function (req, res, next) {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

//adding a new person to the phonebook
app.post("/api/people/", function (req, res, next) {
  const body = req.body;
  if (!body.name) {
    return res.status(400).json({
      error: "Name missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save({ validateBeforeSave: true })
    .then(() => {
      console.log("Person added to the phonebook");
      res.json(person);
    })
    .catch((error) => {
      next(error);
    });
});

//delete a specific person from phonebook
app.delete("/api/people/:id", function (req, res, next) {
  Person.findByIdAndRemove(req.params.id)
    .then((person) => {
      res.json(person);
    })
    .catch((error) => {
      next(error);
    });
});

//updating a person from phonebook
app.patch("/api/people/:id", function (req, res, next) {
  const body = req.body;
  const id = req.params.id;
  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(id, person, { new: true })
    .then((updatedPerson) => {
      console.log("Person updated successfully");
      console.log(updatedPerson);
      res.json(updatedPerson);
    })
    .catch((error) => {
      next(error);
    });
});

const errorHandler = (error, req, res, next) => {
  if (error.name === "CastError") {
    res.status(400).send({ error: "malformatted id" });
  }
  if (error.name === "ValidationError") {
    res.status(400).send({ error });
  } else {
    console.log("Error", error);
  }

  next(error);
};

app.use(errorHandler);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
