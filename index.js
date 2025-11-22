const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    discriminator INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW()
  )
`);

app.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) return res.json({ error: "Faltan datos" });

    const userCheck = await pool.query("SELECT * FROM users WHERE username ILIKE $1", [username]);
    if (userCheck.rows.length > 0) return res.json({ error: "Nombre de usuario ya existe" });

    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING id, username",
      [email, hash, username]
    );

    const token = jwt.sign({ id: result.rows[0].id }, "zephiryx-secret-2025");
    res.json({ token, username: result.rows[0].username });
  } catch (e) {
    res.json({ error: "Error del servidor" });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) return res.json({ error: "Usuario no encontrado" });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ error: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user.id }, "zephiryx-secret-2025");
    res.json({ token, username: user.username });
  } catch (e) {
    res.json({ error: "Error del servidor" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Zephiryx backend en " + PORT));
