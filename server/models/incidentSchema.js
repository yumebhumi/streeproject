const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['mistreatment', 'hooligans', 'cat-calling', 'shady-area'],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    default: '',
  },
  isAnonymous: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ['submitted', 'published', 'rejected'],
    default: 'submitted',
  },
}, { timestamps: true });

IncidentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Incident', IncidentSchema);
