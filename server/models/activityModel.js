const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const actSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  line: { type: String, required: true },
  date: { type: Number, required: true}, //date in epoch time in seconds
  selected: { type: Boolean, required: false },
  color: {type: String, required: false}
});

module.exports = mongoose.model('Activity', actSchema);