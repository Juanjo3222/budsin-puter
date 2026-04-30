const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

// CORS permisivo - permite cualquier origen
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Responder preflight OPTIONS
app.options('*', cors());

// Ruta de estado
app.get('/', (req, res) => {
    res.send('✅ Proxy Budsin-Puter está ONLINE');
});

// Proxy para IA y Chat
app.use('/puterai', createProxyMiddleware({
    target: 'https://api.puter.com',
    changeOrigin: true,
    secure: true,
    pathRewrite: { 
        '^/puterai': '/puterai/openai' 
    },
    onProxyReq: (proxyReq) => {
        proxyReq.setHeader('Origin', 'https://js.puter.com');
        proxyReq.setHeader('Referer', 'https://js.puter.com/');
        proxyReq.setHeader('Cookie', 'puter_auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoic2Vzc2lvbiIsInZlcnNpb24iOiIwLjAuMCIsInV1aWQiOiI1MTljNWY2MC1kNzlmLTQ3ODktYjBjYy02Yzg3MDNlZTJmZGYiLCJ1c2VyX3VpZCI6Ijk0M2YxNDgyLThlNzktNGNkOS1hNDkxLWU5NjY2ODcwZGQ3YyIsImlhdCI6MTc3NzU2NjM2MX0.EGo79DKbAtf77BF7iZTW9oi_SYmTR0KRBPBmwvMQE-Y');
    },
    onProxyRes: (proxyRes) => {
        // Sobreescribir los headers CORS que devuelve Puter
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
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
    },
    onProxyRes: (proxyRes) => {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
}));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`IA Endpoint: https://budsin-puter.onrender.com/puterai/v1/chat/completions`);
});
