import mongoose from 'mongoose';

const AdminAuditSchema = mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    changes: { type: Object },
    reason: { type: String },
    ip: { type: String },
  },
  { timestamps: true }
);

const AdminAudit = mongoose.model('AdminAudit', AdminAuditSchema);

export default AdminAudit;
