const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

//this lets us use *should* style syntax in our tests
//so we can do things like '(1 + 1).should.equal(2);'
const should = chai.should();

//this let's us make HTTP requests
//in our tests.
chai.use(chaiHttp);

describe('Blog Posts', function() {
	//Before our tests run, we activate the server. Our `runServer`
	//function returns a promise, and we return that promise by 
	//doing `return runServer`. If we didn't return a promise here, 
	//there's a possibility of a race condition where our tests start
	//running before our server has started.
	before(function() {
		return runServer();
	});
	//although we only have one test module at the moment, we'll
	//close our server at the end of these tests. Otherwise, 
	//if we add another test module that also has a `before` block
	//that starts our server, it will cause an error because the
	//server would still be running from the previous tests.
	after(function() {
		return closeServer();
	});

	it('should list items on GET', function() {
		//for Mocha tests, when we're dealing with asynchronous operations, 
		//we must either return a Promise object or else call a `done` callback
		//at the end of the test. The `chai.request(server).get...` call is asynchronous
		//and returns a Promise, so we just return it.
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body.length.should.be.at.least(1);
				const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
				res.body.forEach(function(item) {
					item.should.be.a('object');
					item.should.include.keys(expectedKeys);
				});
			});
	});

	// test strategy:
	// 1. make a POST request with data fr a new item
	// 2. inspect response object and prove it has right
	// status code and that the returned object has an `id`
	it('should add a blog post on POST', function() {
		const newPost = {'title': 'dogs', 'content': 'top ten dog things', 'author': 'Barbara Woodhouse', 'publishDate': '01/01/1985'};
		return chai.request(app)
			.post('/blog-posts')
			.send(newPost)
			.then(function(res) {
				res.should.have.status(201);
				res.should.be.json;
				res.should.be.a('object');
				const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
				res.body.should.include.keys('expectedKeys');
				res.body.id.should.not.be.null;
				res.body.title.should.equal(newPost.title);
				res.body.content.should.equal(newPost.content);
				res.body.author.should.equal(newPost.author);
				res.body.author.should.equal(newpost.publishDate);
			});
	});

	//  it('should error if POST missing expected values', function() {
  //   const badRequestData = {};
  //   return chai.request(app)
  //     .post('/blog-posts')
  //     .send(badRequestData)
  //     .catch(function(res) {
  //       res.should.have.status(400);
  //     });
  // });

  it('should update blog posts on PUT', function() {
  	const updateBlogPosts = {'title': 'foo'};
  	return chai.request(app)
  		.get('/blog-posts')
  		.then(function(res) {
  			updateBlogPosts.id = res.body[0].id;
  			return chai.request(app)
  				.put(`/blog-posts/${updateBlogPosts.id}`);
  				.send(updateBlogPosts);
  		})
  		.then(function(res) {
  			res.should.have.status(200);
  			res.should.be.json;
  			res.body.should.be.a('object');
  			res.body.should.deep.equal(updateBlogPosts);
  		});
  });



  it('should delete blog posts on DELETE', function() {
  	return chai.request(app)
  		.get('/blog-posts')
  		.then(function(res) {
  			return chai.request(app)
  				.delete(`/blog-posts/${res.body[0].id}`)
  		})
  		.then(function(res) {
  			res.should.have.status(204);
  		});
  });
});
