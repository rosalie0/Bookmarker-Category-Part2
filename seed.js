const { db, Bookmark, Category } = require('./server');

const seedDb = async () => {
	// Drops tables
	await db.sync({ force: true, logging: false });

	// INSERTION INTO CATEGORY MODEL
	// We want to insert 'coding' 'search' and 'jobs' into category table
	const coding = await Category.create({
		name: 'coding',
	});

	const search = await Category.create({
		name: 'search',
	});

	const jobs = await Category.create({
		name: 'jobs',
	});

	// INSERTION INTO BOOKMARKS MODEL
	await Bookmark.create({
		name: 'Google',
		url: 'https://www.google.com/',
		categoryId: search.id,
	});

	await Bookmark.create({
		name: 'Bing',
		url: 'https://www.bing.com/',
		categoryId: search.id,
	});

	await Bookmark.create({
		name: 'Stack Overflow',
		url: 'https://www.stackoverflow.com/',
		categoryId: coding.id,
	});

	await Bookmark.create({
		name: 'LinkedIn',
		url: 'https://www.linkedin.com/',
		categoryId: jobs.id,
	});

	await Bookmark.create({
		name: 'Indeed',
		url: 'https://www.indeed.com/',
		categoryId: jobs.id,
	});

	await Bookmark.create({
		name: 'MDN',
		url: 'https://developer.mozilla.org/en-US/',
		categoryId: coding.id,
	});
};

seedDb();
