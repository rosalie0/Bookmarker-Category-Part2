const express = require('express');
const app = express();

const path = require('path');
const staticMiddleware = express.static(path.join(__dirname, 'public'));
app.use(staticMiddleware);

const { db, Bookmark, Category } = require('./server');

app.get('/categories/:id', async (req, res, next) => {
	const id = +req.params.id;
	// const categoryObject = await Category.findByPk(id);

	const bookmarks = await Bookmark.findAll();

	const filteredBookmarks = bookmarks.filter(
		(bookmark) => bookmark.dataValues.categoryId === id
	);
	console.log(filteredBookmarks);
	//res.send(filteredBookmarks);

	res.send(
		`
<!DOCTYPE html>
<html lang="en">
	<head>
		<link rel="stylesheet" href="style.css" />
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Bookmarks of a certain category</title>
	</head>
	<body>
	<h1> Bookmarks of category ${id}
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
	</body>
</html>
`
	);
});

app.get('/', async (req, res, next) => {
	//const allCategories = await Category.findAll();
	const bookmarks = await Bookmark.findAll();

	res.send(
		`
<!DOCTYPE html>
<html lang="en">
	<head>
    <link rel="stylesheet" href="style.css">
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Bookmark</title>

	</head>
	<body>
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
