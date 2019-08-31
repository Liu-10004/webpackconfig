// express

let express = require('express');
let webpack = require('webpack');

//中间件
let middle = require('webpack-dev-middleware');

let config = require('./webpack.base.js');

let complier = webpack(config)

let app = express();

app.use(middle(complier))

app.get('/api/user',(req,res)=>{
  res.json({name:'lbq'})
})

app.listen(3001);