const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

// Habilitar CORS para que tu frontend local pueda hablar con Render
app.use(cors());

// Proxy para la API de IA (Chat, modelos, etc)
app.use('/puterai', createProxyMiddleware({
    target: 'https://puter.com',
    changeOrigin: true,
    pathRewrite: { '^/puterai': '/puterai' },
    onProxyReq: (proxyReq, req, res) => {
        // Esto asegura que Puter crea que la petición viene de un sitio seguro
        proxyReq.setHeader('Origin', 'https://puter.com');
    }
}));

// Proxy para el resto de servicios de Puter
app.use('/api', createProxyMiddleware({
    target: 'https://puter.com',
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Proxy funcionando en el puerto ${PORT}`);
});
