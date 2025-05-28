const express = require('express');
const app = express();
const cors = require('cors');
const comparisonRoutes = require('./Routes/comparison');

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend port
  methods: ['POST', 'GET'],
  credentials: true
}));

app.use('/', comparisonRoutes);
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});