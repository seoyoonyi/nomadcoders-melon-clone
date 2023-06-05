import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
	title: String,
	thumbnail: String,
	videoId: String,
	heartStatus: String,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
});

songSchema.set('toJSON', {
	virtuals: true,
	versionKey: false,
	transform: function (doc, ret) {
		delete ret._id;
		ret.id = ret._id;
	},
});

const Song = mongoose.model('Song', songSchema);

export default Song;
