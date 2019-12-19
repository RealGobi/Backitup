const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

//Bodyparser Middleware

app.use(express.json());

//cors-error handeling
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
   next(); 
});

// Connect to Mongo

mongoose
.connect('mongodb+srv://dinner:' + process.env.db_pass + '@letdodinner-d3sve.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

// Use routes 
app.use('/api/recipe', require('./routes/api/recipe'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on ${port}`));
