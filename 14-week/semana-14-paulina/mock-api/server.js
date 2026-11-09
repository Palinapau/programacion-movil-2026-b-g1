// API de prueba (sin dependencias) para correr la app sin el backend real.
// Uso: npm run mock   →  http://localhost:3000/api
import http from 'node:http';
import { randomBytes } from 'node:crypto';

const USER = { id: 1, nombre: 'Paulina Diaz Perdomo', email: 'paulina@movierater.com', password: 'paulina123' };
const RESENAS = [
  { id: 1, pelicula_id_tmdb: 157336, calificacion: 5, comentario: 'Interstellar: me emocionó el final.' },
  { id: 2, pelicula_id_tmdb: 354912, calificacion: 4, comentario: 'Coco: muy bonita y muy musical.' },
  { id: 3, pelicula_id_tmdb: 438631, calificacion: 3, comentario: 'Dune: buena, pero un poco lenta.' },
];
const tokens = new Set();

const send = (res, status, body) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  });
  res.end(JSON.stringify(body));
};

http
  .createServer((req, res) => {
    if (req.method === 'OPTIONS') return send(res, 204, {});

    if (req.method === 'POST' && req.url === '/api/auth/login') {
      let raw = '';
      req.on('data', (c) => (raw += c));
      req.on('end', () => {
        let b = {};
        try { b = JSON.parse(raw); } catch {}
        if (b.email !== USER.email || b.password !== USER.password) {
          return send(res, 401, { message: 'Credenciales inválidas' });
        }
        const token = randomBytes(16).toString('hex');
        tokens.add(token);
        send(res, 200, { token, usuario: { id: USER.id, nombre: USER.nombre, email: USER.email } });
      });
      return;
    }

    if (req.method === 'GET' && req.url === '/api/resenas') {
      const token = (req.headers.authorization ?? '').replace('Bearer ', '');
      if (!tokens.has(token)) return send(res, 401, { message: 'Token inválido o vencido' });
      return send(res, 200, RESENAS);
    }

    send(res, 404, { message: 'No encontrado' });
  })
  .listen(3000, () => console.log('Mock API en http://localhost:3000/api  (paulina@movierater.com / paulina123)'));
