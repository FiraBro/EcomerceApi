import Cart from "../models/cartModel.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

// Add item to cart
export const addToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  if (!productId || !quantity) {
    return next(new AppError("Product ID and quantity are required", 400));
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [{ product: productId, quantity }],
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
  }

  res.status(200).json({
    status: "success",
    data: cart,
  });
});

// Remove item from cart
export const removeFromCart = catchAsync(async (req, res, next) => {
  const { productId } = req.body;
  const userId = req.user.id;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Item removed from cart",
    data: cart,
  });
});

// Update cart quantity
export const updateCart = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  const item = cart.items.find((item) => item.product.toString() === productId);

  if (!item) {
    return next(new AppError("Product not found in cart", 404));
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
  } else {
    item.quantity = quantity;
  }

  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Cart updated",
    data: cart,
  });
});

export const getCart = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const cart = await Cart.findOne({ user: userId }).populate('items.product');

  if (!cart) {
    return next(new AppError('Cart is empty or not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: cart,
  });
});