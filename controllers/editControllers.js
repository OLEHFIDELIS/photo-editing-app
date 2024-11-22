const Edit = require('../models/Edit');
const { uploadToCloudinary } = require('../middleware/cloudinary');


exports.uploadImage = async (req, res) => {
  try {
    const imageUrl = await uploadToCloudinary(req.file.path);
    const edit = new Edit({ imageUrl, history: [imageUrl] });
    await edit.save();
    res.status(200).json(edit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.undoEdit = async (req, res) => {
  const { id } = req.params;
  const edit = await Edit.findById(id);
  if (edit.history.length > 1) {
    edit.history.pop(); // Remove last change
    await edit.save();
    res.json({ imageUrl: edit.history[edit.history.length - 1] });
  } else {
    res.status(400).json({ error: 'No more undo actions available' });
  }
};

exports.redoEdit = async (req, res) => {
  // Implement redo logic as needed
};