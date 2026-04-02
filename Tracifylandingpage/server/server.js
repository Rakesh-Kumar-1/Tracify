const express = require('express');
const connectDB = require('./dbConnection/db');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Database Connection
connectDB();

// Routes
app.use('/api', userRoutes);

// Root Route
app.get('/', (req, res) => {
    res.send(`Tracify Backend Running`);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
