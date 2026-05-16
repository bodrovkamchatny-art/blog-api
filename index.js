require('dotenv').config();
const express = require('express');

const authRoutes  = require('./routes/auth');
const postsRoutes = require('./routes/posts');

const app = express();
app.use(express.json());

app.use('/auth',  authRoutes);
app.use('/posts', postsRoutes);
app.get('/test', (req, res) => {
  res.json({ message: "працює!" });
});

app.listen(3000, () => {
  console.log('Blog API запущено на порту 3000');
});