import Song from '../models/Song';

export const addSong = async (req, res) => {
	if (!req.user) {
		// Handle the case where the user is not authenticated
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

export const getSongs = async (req, res) => {
	if (!req.user) {
		// Handle the case where the user is not authenticated
		res.status(401).json({ error: 'Unauthorized' });
		return;
	}

	const songs = await Song.find({ user: req.user._id });
	res.status(200).json(songs);
};

export const removeSong = async (req, res) => {
	const { id } = req.params;
	await Song.findByIdAndDelete(id);
	res.status(204).end();
};
