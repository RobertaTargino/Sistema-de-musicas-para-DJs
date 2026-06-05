const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const users = [];

app.post('/register', (req, res) => {
    const { email, password } = req.body;
    const user = { email, password };
    users.push(user);
    res.status(201).send('User registered');
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(
        u => u.email === email && u.password === password
    );

    if (user) {
        const token = jwt.sign(
            { email: user.email },
            'segredoJWT',
            { expiresIn: '1h' }
        );

        return res.json({ token });
    }

    res.status(401).send('Credenciais inválidas.');
});

const autenticarJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(403).send('Token não fornecido.');
    }

    try {
        const dados = jwt.verify(token, 'segredoJWT');
        req.user = dados;
        next();
    } catch {
        res.status(403).send('Token inválido.');
    }
};

app.get('/musicas', autenticarJWT, (req, res) => {
    res.json([
        { id: 1, titulo: 'Tattooed Heart', artista: 'Ariana Grande' },
        { id: 2, titulo: 'Titanium', artista: 'David Guetta' },
        { id: 3, titulo: 'Hear Me Now', artista: 'Alok' },
        { id: 4, titulo: 'On My Way', artista: 'Alan Walker' }
    ]);
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

app.use(express.static('public'));