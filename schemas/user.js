const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // 동일한 이메일은 존재할 수 없으니까 unique 사용.
  },
  nickname: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.virtual('userId').get(function () {
  return this._id.toHexString();
});

UserSchema.set('toJSON', {
  virtuals: true, // JSON형태로 가공할 때, userId를 출력 시켜준다.
});

module.exports = mongoose.model('User', UserSchema);
