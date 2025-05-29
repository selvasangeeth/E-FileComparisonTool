const express = require('express');
const app = express();
const comparisonRoutes = require('./Routes/comparison');
const cors = require('cors');
const dotenv = require('dotenv');

app.use(express.json());

dotenv.config();
const PORT = process.env.PORT;
const ORIGIN_URL = process.env.ORIGIN_URL;

app.use(cors({
  origin: ORIGIN_URL,
  credentials: true
}));

app.use('/', comparisonRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});