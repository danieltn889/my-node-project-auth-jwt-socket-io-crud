const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const bookRoutes = require('./routes/book-routes');
const userRoutes = require('./routes/auth-router');
const homeRoutes = require('./routes/home-router');
const adminRoutes = require('./routes/admin-router');
const imageRoutes = require('./routes/image-router');
const productRoutes = require('./routes/product-router');
const authorRoutes = require('./routes/author-router');

// Import database connection
const connectDB = require('./database/db');

const http=require('http');
const server=http.createServer(app);
const socketIO=require('socket.io');
const io=socketIO(server);

app.use(express.static('public'));

// Socket.io
require('./socket')(io);


// Connect database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/home', homeRoutes);   
app.use('/api/admin', adminRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/products', productRoutes);
app.use('/api/authors', authorRoutes);

// Server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Client available at http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api`);
});