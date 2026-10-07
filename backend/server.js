const dotenv = require('dotenv');
dotenv.config(); // Load .env file contents into process.env

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const path = require('path');
const childRoutes = require('./routes/child');
const nutritionRoutes = require('./routes/nutritionRoutes');
const mealPlanRoutes = require('./routes/mealPlanRoutes');
const metricsRoutes = require('./routes/metricsRoutes');






const app = express();

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




// Middleware
app.use(bodyParser.json());
//app.use(cors());
/*app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));*/
// Adjust CORS options to allow specific origins
const corsOptions = {
    origin: ['http://localhost:3000', 'http://10.101.112.173:3000'],
    optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/child', childRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/mealplans', mealPlanRoutes);
app.use('/api/metrics', metricsRoutes);



// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
