const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Create User Schema
const userSchema = new mongoose.Schema(
  {
    // userName: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    type: { type: String, required: true },
    details: { type: mongoose.Schema.Types.Mixed },
    lastLogin: { type: Date },
    verified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationCodeExpiry: { type: Date },
    passwordResetCode: { type: String },
    passwordResetCodeExpiry: { type: Date },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    suspended: { type: Boolean, default: false },
    suspendReason: { type: String },
    suspendAt: { type: Date },
  },
  { timestamps: true, minimize: false }
);

// Encrypt the Password before Saving to DB
userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  const hash = await bcrypt.hash(user.password, 10);
  this.password = hash;
  next();
});

// Encrypt the Password before Updating
userSchema.pre('findOneAndUpdate', async function (next) {
  const updatedInfo = this.getUpdate();
  if (updatedInfo.password) {
    this._update.password = await bcrypt.hash(updatedInfo.password, 10);
  }
  next();
});

// Check if the password is correct
userSchema.methods.isValidPassword = async function (password) {
  const compare = await bcrypt.compare(password, this.password);
  return compare;
};

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
