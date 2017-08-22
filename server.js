const express = require('express');
const morgan =  require('morgan');

const blogPostRouter = require('./blogPostRouter');

const app = express();

app.use(morgan('common'));
app.use(express.static('public'));

app.use('/blog-posts', blogPostRouter)

app.get('/:id', (req, res) => {
	console.log("Hello", req.params.id);
})

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});