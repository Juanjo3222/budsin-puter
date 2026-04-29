const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.send('Proxy de Budsin-Puter funcionando correctamente.');
});

app.use('/puterai', createProxyMiddleware({
    target: 'https://puter.com',
    changeOrigin: true,
    pathRewrite: { '^/puterai': '/puterai/openai' },
    onProxyReq: (proxyReq) => {
        proxyReq.setHeader('Origin', 'https://puter.com');
        proxyReq.setHeader('Referer', 'https://puter.com/');
        proxyReq.setHeader('Cookie', 'puter_auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoic2Vzc2lvbiIsInZlcnNpb24iOiIwLjAuMCIsInV1aWQiOiI5MTYzN2JhZi03M2U5LTQ5OGUtOGI0NC03Yzc3OGYzOTdiMmQiLCJ1c2VyX3VpZCI6ImFhODY2MTlkLWQwZDUtNDZiMC1iODE0LWI1NGUzMDc2NjJhOCIsImlhdCI6MTc3NzQ3NjY3NX0.BpCsPNolKzvES2TXaueO24DKu6O1cHt64wf-2ECIEHc');
    }
}));

app.use('/api', createProxyMiddleware({
    target: 'https://puter.com',
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
}));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Proxy corriendo en puerto ${PORT}`);
});
