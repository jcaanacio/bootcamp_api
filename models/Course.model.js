const Mongoose = require('mongoose');


const CourseSchema = new Mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a course title']
      },
      description: {
        type: String,
        required: [true, 'Please add a description']
      },
      weeks: {
        type: String,
        required: [true, 'Please add number of weeks']
      },
      tuition: {
        type: Number,
        required: [true, 'Please add a tuition cost']
      },
      minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
      },
      scholarshipAvailable: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      bootcamp: {
        type: Mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
      },
    //   user: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'User',
    //     required: true
    //   }
});

module.exports = Mongoose.model('Course', CourseSchema);