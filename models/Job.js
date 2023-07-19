const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Please, provide company name.'],
    maxlength: [20, 'Max. 20 characters']
  },
  position: {
    type: String,
    required: [true, 'Please, provide job position'],
    maxlength: [50, 'Max. 50 characters']
  },
  status: {
    type: String,
    enum: ['interview', 'declined', 'pending'],
    default: 'pending'
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'remote', 'internship'],
    default: 'full-time'
  },
  jobLocation: {
    type: String,
    required: true,
    default: 'Calgary'
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Must provide a user.']
  }
},
{ timestamps: true}
);

module.exports = mongoose.model('Job', JobSchema);
