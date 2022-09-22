const express = require('express');
const app = express();

const path = require('path');
const staticMiddleware = express.static(path.join(__dirname, 'public'));
app.use(staticMiddleware);

const { db, Bookmark, Category } = require('./server');

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
        <li>${bookmark.id}</li>
        <li>${bookmark.url}</li>
        <li>${bookmark.categoryId}</li>
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
