const express = require('express');
const app = express();

const path = require('path');
const staticMiddleware = express.static(path.join(__dirname, 'public'));
app.use(staticMiddleware);

const { db, Bookmark, Category } = require('./server');

// parses url-encoded bodies
app.use(express.urlencoded({ extended: false }));
// parses json bodies
app.use(express.json());

app.get('/categories/:id', async (req, res, next) => {
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
			<h1>${bookmark.name}</h1>
			<li>primary key id === ${bookmark.id}</li>
			<li>${bookmark.url}</li>
			<li>categoryId === ${bookmark.categoryId}</li>
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

app.post('/bookmarks', async (req, res, next) => {
	const submittedName = req.body.name;
	const submittedUrl = req.body.url;
	const submittedCategory = req.body.category;
	console.log(submittedName, submittedUrl, submittedCategory);
	res.send('Bookmark Submitted!');
});

app.get('/', async (req, res, next) => {
	//Set up the GET / route, which should redirect to the GET /bookmarks route.
	res.redirect('/bookmarks');
});
app.get('/bookmarks', async (req, res, next) => {
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
        <h1>${bookmark.name}</h1>
        <li>primary key id === ${bookmark.id}</li>
        <li>${bookmark.url}</li>
        <li>categoryId === ${bookmark.categoryId}</li>
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
