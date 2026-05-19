const express = require('express');
const mongoose = require('mongoose');

// Importamos nuestras rutas
const birdRoutes = require('./routes/birdRoutes');
const cageRoutes = require('./routes/cageRoutes');
const taskRoutes = require('./routes/taskRoutes');
const aiRoutes = require('./routes/aiRoutes');
const nestRoutes = require('./routes/nestRoutes');
const authRoutes = require('./routes/authRoutes');
const protect = require('./middleware/authMiddleware');

const app = express();
app.use(express.json()); 

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://avicare-mongo:27017/avicare')
  .then(() => console.log('✅ Base de datos MongoDB Conectada con éxito'))
  .catch(err => console.error('❌ Error conectando a MongoDB:', err));


// Rutas Oficiales
app.use('/api/auth', authRoutes); // Todas las peticiones a /api/auth se van a authRoutes
app.use('/api/birds', protect, birdRoutes); // Todas las peticiones a /api/birds se van a birdRoutes
app.use('/api/cages', protect, cageRoutes); // Todas las peticiones a /api/cages se van a cageRoutes
app.use('/api/tasks', protect, taskRoutes); // Todas las peticiones a /api/tasks se van a taskRoutes
app.use('/api/ai', protect, aiRoutes); // Todas las peticiones a /api/ai se van a aiRoutes
app.use('/api/nests', protect, nestRoutes); // Todas las peticiones a /api/nests se van a nestRoutes


app.get('/', (req, res) => {
  res.send('¡Backend de AviCare volando alto! 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor volando en el puerto ${PORT} 🐦`));