// eslint-disable-next-line no-undef
// Express
const express = require('express');
const app = express();

// Volleyball Middleware
const volleyball = require('volleyball');
app.use(volleyball);

// Static Middleware
const path = require('path');
const staticMiddleware = express.static(path.join(__dirname, 'public'));
app.use(staticMiddleware);

// Body Parsers
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware used for DELETE request
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const { db, Bookmark, Category } = require('./server');

// DELETE /bookmarks/:id route that deletes a bookmark from the database based on its PK.
app.delete('/bookmarks/:id', async (req, res) => {
	console.log('Delete endpoint hit');
	const pk = +req.params.id;
	const bookmark = await Bookmark.findByPk(pk);
	console.log(`Grabbed bookmark: ${bookmark}`);
	await bookmark.destroy();

	res.redirect(`/`);
});

app.get('/categories/:id', async (req, res) => {
	const id = +req.params.id;
	const categoryObject = await Category.findByPk(id);

	const bookmarks = await Bookmark.findAll();

	const filteredBookmarks = bookmarks.filter(
		(bookmark) => bookmark.dataValues.categoryId === id
	);
	//res.send(filteredBookmarks);

	res.send(
		`
<!DOCTYPE html>
<html lang="en">
	<head>
		<link rel="stylesheet" href="/style.css" />
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Bookmarks of a certain category</title>
	</head>
	<body>
	<h1> Bookmarks of category <span>${categoryObject.name}</span> </h1>
		
		<ul>
			${filteredBookmarks
				.map(
					(bookmark) =>
						`
						<div class="bookmark-card">
							
							<form method="post" action="/bookmarks/${bookmark.id}?_method=DELETE">
							<button type="submit">X</button>
							</form>

							<h2>${bookmark.name}</h2>
							<li>Primary Key id: ${bookmark.id}</li>
							<li>URL: ${bookmark.url}</li>
							<li>Category: ${categoryObject.name}</li>
							<li>CategoryID: ${bookmark.categoryId}</li>
							</div>
							`
				)
				.join('')}
		</ul>
		
		<a href="../"> Back </a>
	</body>
</html>
`
	);
});

// POST bookmarks
app.post('/bookmarks', async (req, res) => {
	const categoryString = req.body.category.toLowerCase();

	// See if given category exists already, and get its instance.
	let [categoryInstance] = await Category.findAll({
		where: { name: categoryString },
	});

	// If not, we need to INSERT into Category table.
	if (!categoryInstance) {
		categoryInstance = await Category.create({
			name: categoryString,
		});
	}

	// Insert bookmark
	await Bookmark.create({
		name: req.body.name,
		url: req.body.url,
		categoryId: categoryInstance.id,
	});

	res.redirect('/bookmarks');
});

// GET /
app.get('/', async (req, res) => {
	//Set up the GET / route, which should redirect to the GET /bookmarks route.
	res.redirect('/bookmarks');
});

// GET all bookmarks
app.get('/bookmarks', async (req, res) => {
	//const allCategories = await Category.findAll();
	const bookmarks = await Bookmark.findAll();

	res.send(
		`
<!DOCTYPE html>
<html lang="en">
	<head>
    <link rel="stylesheet" href="/style.css">
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Bookmark</title>

	</head>
	<body>

	<form method="post" action="/bookmarks">
	<label for="name">Name</label>
	<input type="text" name="name" />

	<label for="url">URL</label>
	<input type="text" name="url" />

	<label for="category">Category</label>
	<input type="text" name="category" />

	<button type="submit">Submit</button>
</form>
		<ul>
      ${bookmarks
				.map(
					(bookmark) =>
						`
						<div class="bookmark-card">
        			<h1>${bookmark.name}</h1>
							<li>primary key id === ${bookmark.id}</li>
							<li>${bookmark.url}</li>
							<li>categoryId === ${bookmark.categoryId}</li>
						</div>
        		`
				)
				.join('')}
		</ul>
	</body>
</html>
`
	);
});

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Listening to port ${PORT}`);
});
