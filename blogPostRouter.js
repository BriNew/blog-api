const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create('cows', 'You will never expect these 10 cow things', 'Cow Expert', '01/01/2017');
BlogPosts.create('dogs', 'You will never expect these 10 dogs things', 'Dog Expert', '01/02/2017');

router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});
router.get('/:id', jsonParser, (req, res) => {
	console.log("Hello", req.params.id);
  let results = BlogPosts.get(req.params.id);
  res.json(results);
})
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author', 'publishDate'];//no publish date?
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = BlogPosts.create(req.body.name, req.body.ingredients);
  res.status(201).json(item);
});

router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author', 'publishDate'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post \`${req.params.id}\``);
  const updatedItem = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    author: req.body.author,
    publishDate: req.body.publishDate
  });
  res.status(204).json(updatedItem);
})


router.delete('/:id', (req, res) => {
  Recipes.delete(req.params.id);
  console.log(`Deleted shopping list item \`${req.params.ID}\``);
  res.status(204).end();
});

module.exports = router;
