import Song from '../models/Song';

export const addLikedSongs = async (req, res) => {
	if (!req.user) {
		res.status(401).json({ error: 'Unauthorized' });
		return;
	}

	const { title, thumbnail } = req.body;
	const newSong = await Song.create({
		title,
		thumbnail,
		user: req.user._id,
	});

	console.log('newSong', newSong);
	res.status(201).json(newSong);
};

export const getLikedSongs = async (req, res) => {
	if (!req.user) {
		res.status(401).json({ error: 'Unauthorized' });
		return;
	}

	const songs = await Song.find({ user: req.user._id });
	res.status(200).json(songs);
};

export const removeLikedSongs = async (req, res) => {
	const { id } = req.params;
	await Song.findByIdAndDelete(id);
	res.status(204).end();
};
