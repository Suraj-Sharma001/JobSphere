import mongoose from 'mongoose';

const jobSchema = mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the User who posted the job (role: 'job')
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    criteria_branch: {
      type: String,
      required: false,
    },
    criteria_cgpa: {
      type: Number,
      required: false,
    },
    salary: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model('Job', jobSchema);

export default Job;
