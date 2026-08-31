const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
require("dns").setServers(["8.8.8.8", "1.1.1.1"]);
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is running successfully"
  });
});

const routes = [
  { path: '/api/auth', file: './routes/authRoutes' },
  { path: '/api/documents', file: './routes/docRoutes' },
  { path: '/api/appointments', file: './routes/appointmentRoutes' },
  { path: '/api/reminders', file: './routes/reminderRoutes' },
  { path: '/api/admin', file: './routes/adminRoutes' },
  { path: '/api/doctors', file: './routes/doctorRoutes' } // புது route
];

routes.forEach(({ path, file }) => {
  try {
    const handler = require(file);

    if (typeof handler !== 'function') {
      console.error(
        `❌ ERROR in ${file}: Expected a router function, but got '${typeof handler}'.`
      );
    } else {
      console.log(`✅ Loaded: ${path} from ${file}`);
      app.use(path, handler);
    }
  } catch (err) {
    console.error(`❌ CRASH when loading ${file}:`, err.message);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});