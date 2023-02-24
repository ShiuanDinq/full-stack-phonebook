const Persons = (props) => {
  const { persons, filter, deleteName } = props;
  return (
    <ul>
      {persons
        .filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase())
        )
        .map((person) => (
          <li className="person" id={person.id}>
            <p>
              {person.name} {person.number}
            </p>
            <button onClick={deleteName}>delete</button>
          </li>
        ))}
    </ul>
  );
};

export default Persons;
