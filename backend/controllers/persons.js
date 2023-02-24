const personsRouter = require("express").Router();
const Person = require("../models/person");

personsRouter.get("/", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

personsRouter.get("/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).send({ error: "Person not found!" });
      }
    })
    .catch((error) => next(error));
});

personsRouter.delete("/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

personsRouter.post("/", (request, response, next) => {
  const { name, number } = request.body;

  if (!name || !number) {
    response.status(404).send({ error: "Missing detail!" });
  }

  Person.find({ name: name }).then((persons) => {
    if (persons.length > 0) {
      response.status(404).send({ error: "Person already exist in database" });
    }
  });

  const person = new Person({
    ...request.body,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

personsRouter.put("/:id", (request, response, next) => {
  Person.findByIdAndUpdate(request.params.id, request.body)
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

module.exports = personsRouter;
