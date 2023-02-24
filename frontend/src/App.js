import { useEffect, useState } from "react";
import "./App.css";
import Filter from "./Components/Filter";
import PersonForm from "./Components/PersonForm";
import Persons from "./Components/Persons";
import axios from "axios";
import personService from "./services/persons";
import Notification from "./Components/Notification";
const App = () => {
  const [persons, setPersons] = useState([]);
  useEffect(() => {
    personService.getAll().then((response) => {
      console.log("promise fulfilled");
      setPersons(response.data);
    });
  }, []);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const addName = (event) => {
    event.preventDefault();
    const personObject = { name: newName, number: newNumber };
    if (hasDuplicate(newName)) {
      window.confirm(
        `${newName} is already added to the phonebook, replace the old number?`
      );
      const updatedPerson = persons.find((person) => person.name === newName);
      personService.update(updatedPerson.id, personObject);
      const updatedPersons = persons.map((person) => {
        if (person.id === updatedPerson.id) {
          return { ...updatedPerson, number: newNumber };
        }
        return person;
      });
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      setPersons(updatedPersons);
    } else {
      personService.create(personObject).then((response) => {
        setPersons([...persons, response.data]);
      });
      setNotificationMessage(`Added ${newName}`);
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    }
  };

  const deleteName = async (event) => {
    event.preventDefault();
    const id = event.target.parentNode.id;
    const deletedPerson = persons.find((person) => person.id === id);
    window.confirm(`Delete ${deletedPerson.name}?`);
    try {
      personService.remove(id);
      const filteredPersons = persons.filter((person) => person.id !== id);
      setPersons(filteredPersons);
    } catch (error) {
      setErrorMessage(`Information has already been removed from server`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const hasDuplicate = (name) => {
    return persons.some((person) => person.name === name);
  };

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Phonebook</h2>
      <Notification message={errorMessage} error={true} />
      <Notification message={notificationMessage} error={false} />
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addName={addName}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} deleteName={deleteName} />
    </div>
  );
};

export default App;
