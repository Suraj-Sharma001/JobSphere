import mongoose from 'mongoose';

const feedbackSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the student who submitted feedback
    },
    company_name: {
      type: String,
      required: true,
    },
    feedback_text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
