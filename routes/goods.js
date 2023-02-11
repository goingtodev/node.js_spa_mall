const express = require('express');
const router = express.Router();
const Goods = require('../schemas/goods');

// 상품 목록 조회 API
router.get('/goods', async (req, res) => {
  const { category } = req.query;
  console.log(category); // 전체를 조회할 때, category변수에는 데이터가 존재하지 않는다.

  const goods = await Goods.find(category ? { category } : {}) // 카테고리 값이 존재할 때는 category 형태로 조회 / 존재 X일 때는 모든 데이터를 카테고리 상관없이 조회.
    .sort('-date') // 내림차순으로 정렬
    .exec();

  const results = goods.map((item) => {
    return {
      goodsId: item.goodsId,
      name: item.name,
      price: item.price,
      thumbnailUrl: item.thumbnailUrl,
      category: item.category,
    };
  });
  res.status(200).json({ goods: results });
});

// 상품 상세 조회 API
router.get('/goods/:goodsId', async (req, res) => {
  const { goodsId } = req.params;

  const goods = await Goods.findOne({ goodsId: goodsId })
    .sort('-date') // 내림차순으로 정렬
    .exec();

  const result = {
    goodsId: goods.goodsId,
    name: goods.name,
    price: goods.price,
    thumbnailUrl: goods.thumbnailUrl,
    category: goods.category,
  };
  res.status(200).json({ goods: result });
});

// 카트에 상품 추가
const Cart = require('../schemas/cart.js');
const goods = require('../schemas/goods');
router.post('/goods/:goodsId/cart', async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  const existsCarts = await Cart.find({ goodsId });
  if (existsCarts.length) {
    return res.status(400).json({
      success: false,
      errorMessage: '이미 장바구니에 해당하는 상품이 존재합니다.',
    });
  }

  await Cart.create({ goodsId, quantity });

  res.json({ result: 'success' });
});

// 카트 안의 상품 수량 업데이트
router.put('/goods/:goodsId/cart', async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  const existsCarts = await Cart.find({ goodsId });
  if (existsCarts.length) {
    await Cart.updateOne(
      { goodsId: goodsId },
      { $set: { quantity: quantity } }
    );
  }
  res.status(200).json({ success: true });
});

// 카트 안의 상품 제거
router.delete('/goods/:goodsId/cart', async (req, res) => {
  const { goodsId } = req.params;

  const existsCarts = await Cart.find({ goodsId });
  if (existsCarts.length) {
    await Cart.deleteOne({ goodsId });
  }

  res.json({ result: 'success' });
});

router.post('/goods/', async (req, res) => {
  const { goodsId, name, thumbnailUrl, category, price } = req.body;

  const goods = await Goods.find({ goodsId });

  if (goods.length) {
    return res.status(400).json({
      success: false,
      errorMessage: '이미 존재하는 GoodsId입니다.',
    });
  }

  const createdGoods = await Goods.create({
    goodsId,
    name,
    thumbnailUrl,
    category,
    price,
  });

  res.json({ goods: createdGoods });
});

module.exports = router;
