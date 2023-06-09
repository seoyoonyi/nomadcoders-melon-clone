import Song from '../models/Song';

export const addSongs = async (req, res) => {
	if (!req.user) {
		res.status(401).json({ error: 'Unauthorized' });
		return;
	}

	const { title, thumbnail, videoId, heartStatus } = req.body;
	const newSong = await Song.create({
		title,
		thumbnail,
		videoId,
		heartStatus,
		user: req.user._id,
	});

	res.status(201).json(newSong);
};

export const getSongs = async (req, res) => {
	if (!req.user) {
		res.status(401).json({ error: 'Unauthorized' });
		return;
	}

	const songs = await Song.find({ user: req.user._id });
	res.status(200).json(songs);
};

export const removeSongs = async (req, res) => {
	const { id } = req.params;
	await Song.findByIdAndDelete(id);
	res.status(204).end();
};
