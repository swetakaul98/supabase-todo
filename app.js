const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3005;
connectDB();
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
routes(app);

// Sample data
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
];

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the MY API...' });
});

// Get all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Get a single user
app.get('/api/users/:id', (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id, 10));
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  return res.json(user);
});

// Create a new user
app.post('/api/users', (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email,
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
