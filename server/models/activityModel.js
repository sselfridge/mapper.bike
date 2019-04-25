const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const actSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  line: { type: String, required: true },
  date: { type: Number, required: true}, //date in epoch time in seconds
  color: { type: String, required: true },
  selected: { type: Boolean, required: false },
  weight: { type: String, required: false },
  zIndex: {type: Number, required: false}
});

module.exports = mongoose.model('Activity', actSchema);