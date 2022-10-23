const {createProxyMiddleware} = require("http-proxy-middleware")

module.exports = app => {
    app.use(createProxyMiddleware('/wws', {
        target: 'http://127.0.0.1:8000',
        ws: true,
        changeOrigin: true,
    }));
}