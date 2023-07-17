const phonebookRouter = require("express").Router();
const Person = require("../models/phonebook");

//get all people from the phonebook
phonebookRouter.get("/", function (req, res, next) {
  Person.find({})
    .then((results) => {
      res.json(results);
    })
    .catch((error) => {
      next(error);
    });
});

//get a specific person from phonebook
phonebookRouter.get("/:id", function (req, res, next) {
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
phonebookRouter.post("/", function (req, res, next) {
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
phonebookRouter.delete("/:id", function (req, res, next) {
  Person.findByIdAndRemove(req.params.id)
    .then((person) => {
      res.json(person);
    })
    .catch((error) => {
      next(error);
    });
});

//updating a person from phonebook
phonebookRouter.patch("/:id", function (req, res, next) {
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

module.exports = phonebookRouter;
