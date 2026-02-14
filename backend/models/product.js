import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Basic Details
    productName: {type: String,required: true,trim: true,
    },
    brandName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      maxlength: 500,
    },
    fullDescription: {
      type: String,
    },

    // Pricing & Stock
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    stockStatus: {
      type: String,
      enum: ["in_stock", "out_of_stock"],
      required: true,
    },
    minOrderQuantity: {
      type: Number,
      default: 1,
      min: 1,
    },

    // Watch Specifications
    watchType: {
      type: String,
      enum: ["Analog", "Digital", "Smart"],
    },
    strapMaterial: {
      type: String,
    },
    strapColor: {
      type: String,
    },
    dialColor: {
      type: String,
    },
    displayType: {
      type: String,
    },
    waterResistance: {
      type: String,
    },
    movementType: {
      type: String,
    },
    glassType: {
      type: String,
    },
    warrantyPeriod: {
      type: String,
    },

    // Shipping & Policy
    shippingCharges: {
      type: Number,
      default: 0,
    },
    deliveryTime: {
      type: String,
    },
    returnPolicy: {
      type: String,
    },

    // Images
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    // ✅ Product Video
    productVideo: {
      url: { type: String },
      public_id: { type: String },
    },
  },
  {
    timestamps: true,
  },
);

const product = mongoose.model("Product", productSchema);
export default product;


