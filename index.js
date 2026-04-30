const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

// Habilitar CORS para peticiones desde tu red local
app.use(cors());

// Ruta de estado
app.get('/', (req, res) => {
    res.send('✅ Proxy Budsin-Puter está ONLINE');
});

// Proxy para IA y Chat (Ruta corregida a api.puter.com)
app.use('/puterai', createProxyMiddleware({
    target: 'https://api.puter.com',
    changeOrigin: true,
    secure: true,
    pathRewrite: { 
        '^/puterai': '/puterai/openai' 
    },
    onProxyReq: (proxyReq) => {
        // Forzamos los headers para que la API nos acepte
        proxyReq.setHeader('Origin', 'https://js.puter.com');
        proxyReq.setHeader('Referer', 'https://js.puter.com/');
        // Tu token de sesión
        proxyReq.setHeader('Cookie', 'puter_auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoic2Vzc2lvbiIsInZlcnNpb24iOiIwLjAuMCIsInV1aWQiOiI5MTYzN2JhZi03M2U5LTQ5OGUtOGI0NC03Yzc3OGYzOTdiMmQiLCJ1c2VyX3VpZCI6ImFhODY2MTlkLWQwZDUtNDZiMC1iODE0LWI1NGUzMDc2NjJhOCIsImlhdCI6MTc3NzQ3NjY3NX0.BpCsPNolKzvES2TXaueO24DKu6O1cHt64wf-2ECIEHc');
    },
    onError: (err, req, res) => {
        res.status(500).send('Error en el Proxy: ' + err.message);
    }
}));

// Proxy para servicios generales de API
app.use('/api', createProxyMiddleware({
    target: 'https://api.puter.com',
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
    onProxyReq: (proxyReq) => {
        proxyReq.setHeader('Origin', 'https://js.puter.com');
    }
}));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`IA Endpoint: https://onrender.com`);
});
