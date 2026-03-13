const express = require('express');
const healthRoutes = require('./routes/health.routes');
const bookRoutes = require('./routes/books.routes');
const userRoutes = require('./routes/users.routes');
const authRouter = require('./routes/auth.routes');
const meRouter = require('./routes/me.routes');
const borrowsRouter = require('./routes/borrows.routes');
const returnsRouter = require('./routes/returns.routes');

const app = express();
app.use(express.json());

app.use('/health', healthRoutes);
app.use('/books', bookRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRouter);
app.use('/me', meRouter);
app.use('/borrows', borrowsRouter);
app.use('/returns', returnsRouter);



module.exports = app;