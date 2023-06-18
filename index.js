const express = require("express");
const app = express();

app.use(express.json());

const morgan = require("morgan");
morgan.token("postData", (req, res) => JSON.stringify(req.body));

app.use(
	morgan(
		":method :url :status :res[content-length] - :response-time ms :postData"
	)
);

let persons = [
	{
		name: "Arto Hellas",
		number: "040-123456",
		id: 1,
	},
	{
		name: "Ada Lovelace",
		number: "39-44-5323523",
		id: 2,
	},
	{
		name: "Dan Abramov",
		number: "12-43-234345",
		id: 3,
	},
	{
		name: "Mary Poppendieck",
		number: "39-23-6423122",
		id: 4,
	},
	{
		name: "Grace Hopper",
		number: "39-23-6423134",
		id: 5,
	},
];

app.get("/info", (req, res) => {
	res.send(
		`<div>Phonebook has info for ${persons.length} people.</div>
		<br />
		<div>${new Date()}</div>`
	);
});

app.get("/api/persons", (req, res) => {
	res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id);
	const person = persons.find((p) => p.id === id);

	if (person) {
		res.json(person);
	} else {
		res.status(404).end();
	}
});

app.delete("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	const status = persons.some((p) => p.id === id) ? 204 : 404;
	persons = persons.filter((p) => p.id !== id);
	response.status(status).end();
});

const generateId = () => {
	let id;
	do {
		id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
	} while (persons.some((p) => p.id === id));
	return id;
};

app.post("/api/persons", (request, response) => {
	const body = request.body;

	if (!body.name || !body.number) {
		return response.status(400).json({
			error: "Content missing",
		});
	}
	if (persons.some((p) => p.name === body.name)) {
		return response.status(409).json({
			error: "Name must be unique",
		});
	}

	const person = {
		name: body.name,
		number: body.number,
		id: generateId(),
	};

	persons = persons.concat(person);

	response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
