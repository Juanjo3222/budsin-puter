const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

// 1. Habilitar CORS para que tu frontend local (aunque esté bloqueado) pueda hablar con Render
app.use(cors());

// 2. Ruta de prueba (opcional) - Si entras a https://onrender.com verás este mensaje
app.get('/', (req, res) => {
    res.send('Proxy de Budsin-Puter funcionando correctamente.');
});

// 3. Proxy para la IA (Chat/Modelos)
// Este redirige a la interfaz compatible con OpenAI de Puter
app.use('/puterai', createProxyMiddleware({
    target: 'https://puter.com',
    changeOrigin: true,
    pathRewrite: { '^/puterai': '/puterai/openai' },
    onProxyReq: (proxyReq) => {
        // Engañamos a Puter para que crea que la petición viene de su propio dominio
        proxyReq.setHeader('Origin', 'https://puter.com');
    }
}));

// 4. Proxy para la API general (Base de datos, Key-Value, etc.)
app.use('/api', createProxyMiddleware({
    target: 'https://puter.com',
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
}));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Proxy corriendo en puerto ${PORT}`);
});
