require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const app = express();

// Create database connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Test database connection
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Successfully connected to database');
});

// 1. Retrieve all patients
app.get('/patients', (req, res) => {
    const query = `
        SELECT patient_id, first_name, last_name, date_of_birth 
        FROM patients
    `;
    
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// 2. Retrieve all providers
app.get('/providers', (req, res) => {
    const query = `
        SELECT first_name, last_name, provider_specialty 
        FROM providers
    `;
    
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// 3. Filter patients by First Name
app.get('/patients/search', (req, res) => {
    const firstName = req.query.firstName;
    
    if (!firstName) {
        res.status(400).json({ error: 'First name parameter is required' });
        return;
    }

    const query = `
        SELECT * FROM patients 
        WHERE first_name LIKE ?
    `;
    
    connection.query(query, [`%${firstName}%`], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// 4. Retrieve all providers by their specialty
app.get('/providers/specialty/:specialty', (req, res) => {
    const specialty = req.params.specialty;
    
    const query = `
        SELECT * FROM providers 
        WHERE provider_specialty = ?
    `;
    
    connection.query(query, [specialty], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// Listen to the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});