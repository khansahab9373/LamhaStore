import Order from "../models/order.js";

// create a new order
export const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// get logged-in user's orders
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// get order by ID
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product", "name image price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

//  ADMIN – GET ALL ORDERS
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate("user", "name email");
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();
  res.json(updatedOrder);
};

//  Update order to delivered (ADMIN)
 
export const updateOrderToDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();
  res.json(updatedOrder);
};

// USER – CANCEL ORDER
export const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // ensure order belongs to logged-in user
  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  // business rules
  if (order.isPaid) {
    return res
      .status(400)
      .json({ message: "Paid order cannot be cancelled" });
  }

  if (order.isDelivered) {
    return res
      .status(400)
      .json({ message: "Delivered order cannot be cancelled" });
  }

  if (order.isCancelled) {
    return res
      .status(400)
      .json({ message: "Order already cancelled" });
  }

  order.isCancelled = true;
  order.cancelledAt = Date.now();

  const updatedOrder = await order.save();
  res.json(updatedOrder);
};

// ADMIN – cancel order
export const cancelOrderByAdmin = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.isDelivered) {
    return res
      .status(400)
      .json({ message: "Delivered order cannot be cancelled" });
  }

  order.isCancelled = true;
  order.cancelledAt = Date.now();

  const updatedOrder = await order.save();
  res.json(updatedOrder);
};

// ADMIN – delete order permanently
export const deleteOrderByAdmin = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  await order.deleteOne();
  res.json({ message: "Order deleted successfully" });
};
