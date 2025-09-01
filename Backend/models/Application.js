import mongoose from 'mongoose';

const applicationSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the student user
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Job', // Reference to the job applied for
    },
    status: {
      type: String,
      required: true,
      enum: ['Applied', 'Shortlisted', 'Ongoing', 'Placed', 'Rejected'],
      default: 'Applied',
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for improved query performance
applicationSchema.index({ student: 1 });
applicationSchema.index({ job: 1 });
applicationSchema.index({ status: 1 });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
