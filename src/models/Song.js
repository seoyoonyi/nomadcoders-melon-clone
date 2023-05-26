import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
	title: String,
	thumbnail: String,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
});

const Song = mongoose.model('Song', songSchema);

export default Song;
