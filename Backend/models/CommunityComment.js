import mongoose from 'mongoose';

const communityCommentSchema = mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'CommunityPost',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    commentContent: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CommunityComment = mongoose.model(
  'CommunityComment',
  communityCommentSchema
);

export default CommunityComment;
