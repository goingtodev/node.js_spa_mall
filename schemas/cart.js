const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: String, // ObjectId이기 때문에, 문자열
    required: true, // 장바구니는 특정한 사용자만 사용할 수 있어서 userId가 꼭 필요함.
  },
  goodsId: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Cart', cartSchema);
