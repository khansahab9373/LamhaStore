import Product from "../models/product.js";
import cloudinary from "../config/cloudinary.js";

// @desc   Get all products
// @route  GET /api/products
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc   Get single product
// @route  GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc   Create product
// @route  POST /api/products
export const createProduct = async (req, res, next) => {
  try {
    const {
      productName,
      brandName,
      category,
      shortDescription,
      fullDescription,
      price,
      discountPrice,
      stockQuantity,
      minOrderQuantity,

      watchType,
      strapMaterial,
      strapColor,
      dialColor,
      displayType,
      waterResistance,
      movementType,
      glassType,
      warrantyPeriod,

      shippingCharges,
      deliveryTime,
      returnPolicy,
    } = req.body;

    if (!req.files?.images || req.files.images.length === 0) {
      return res.status(400).json({ message: "Product images are required" });
    }

    if (discountPrice && Number(discountPrice) > Number(price)) {
      return res
        .status(400)
        .json({ message: "Discount price cannot be greater than price" });
    }

    const stockStatus =
      Number(stockQuantity) > 0 ? "in_stock" : "out_of_stock";

    // Images
    const images = req.files.images.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

    // Product Video (optional)
    let productVideo = null;
    if (req.files.productVideo?.length > 0) {
      productVideo = {
        url: req.files.productVideo[0].path,
        public_id: req.files.productVideo[0].filename,
      };
    }

    const product = await Product.create({
      productName,
      brandName,
      category,
      shortDescription,
      fullDescription,
      price: Number(price),
      discountPrice: Number(discountPrice) || 0,
      stockQuantity: Number(stockQuantity),
      stockStatus,
      minOrderQuantity,

      watchType,
      strapMaterial,
      strapColor,
      dialColor,
      displayType,
      waterResistance,
      movementType,
      glassType,
      warrantyPeriod,

      shippingCharges,
      deliveryTime,
      returnPolicy,

      images,
      productVideo,
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc   Update product
// @route  PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Basic fields
    Object.keys(req.body).forEach((key) => {
      product[key] = req.body[key] ?? product[key];
    });

    // Auto stock status
    if (req.body.stockQuantity !== undefined) {
      product.stockStatus =
        Number(req.body.stockQuantity) > 0
          ? "in_stock"
          : "out_of_stock";
    }

    // 🔥 Update images
    if (req.files?.images?.length > 0) {
      for (const img of product.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }

      product.images = req.files.images.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    // 🔥 Update product video
    if (req.files?.productVideo?.length > 0) {
      if (product.productVideo?.public_id) {
        await cloudinary.uploader.destroy(
          product.productVideo.public_id,
          { resource_type: "video" }
        );
      }

      product.productVideo = {
        url: req.files.productVideo[0].path,
        public_id: req.files.productVideo[0].filename,
      };
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// @desc   Delete product
// @route  DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete images
    for (const img of product.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    // Delete video
    if (product.productVideo?.public_id) {
      await cloudinary.uploader.destroy(product.productVideo.public_id, {
        resource_type: "video",
      });
    }

    await product.deleteOne();
    res.json({ message: "Product removed successfully" });
  } catch (error) {
    next(error);
  }
};

export const getProductsByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        message: "Product IDs array required",
      });
    }

    const products = await Product.find({
      _id: { $in: ids },
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch wishlist products",
    });
  }
};
