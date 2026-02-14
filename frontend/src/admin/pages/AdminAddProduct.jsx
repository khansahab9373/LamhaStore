import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PackagePlus, Image, Video, X, ChevronDown } from "lucide-react";
import api from "../../services/api";
import { useAlert } from "../../context/AlertContext";

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // BASIC
  const [productName, setProductName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [category, setCategory] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");

  // PRICE & STOCK
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [stockStatus, setStockStatus] = useState("in_stock");
  const [minOrderQuantity, setMinOrderQuantity] = useState(1);

  // WATCH SPECS
  const [watchType, setWatchType] = useState("");
  const [strapMaterial, setStrapMaterial] = useState("");
  const [strapColor, setStrapColor] = useState("");
  const [dialColor, setDialColor] = useState("");
  const [displayType, setDisplayType] = useState("");
  const [waterResistance, setWaterResistance] = useState("");
  const [movementType, setMovementType] = useState("");
  const [glassType, setGlassType] = useState("");
  const [warrantyPeriod, setWarrantyPeriod] = useState("");

  // SHIPPING
  const [shippingCharges, setShippingCharges] = useState(0);
  const [deliveryTime, setDeliveryTime] = useState("");
  const [returnPolicy, setReturnPolicy] = useState("");

  // MEDIA
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [video, setVideo] = useState(null);

  // UI
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full min-w-0 box-border rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  const sectionClass =
    "bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4 overflow-x-hidden";

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((p) => [...p, ...files]);
    setImagePreviews((p) => [
      ...p,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
    e.target.value = null;
  };

  const removeImage = (i) => {
    setImages((p) => p.filter((_, x) => x !== i));
    setImagePreviews((p) => p.filter((_, x) => x !== i));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();

      // BASIC
      fd.append("productName", productName);
      fd.append("brandName", brandName);
      fd.append("category", category);
      fd.append("shortDescription", shortDescription);
      fd.append("fullDescription", fullDescription);

      // PRICE
      fd.append("price", price);
      fd.append("discountPrice", discountPrice);
      fd.append("stockQuantity", stockQuantity);
      fd.append("stockStatus", stockStatus);
      fd.append("minOrderQuantity", minOrderQuantity);

      // SPECS
      fd.append("watchType", watchType);
      fd.append("strapMaterial", strapMaterial);
      fd.append("strapColor", strapColor);
      fd.append("dialColor", dialColor);
      fd.append("displayType", displayType);
      fd.append("waterResistance", waterResistance);
      fd.append("movementType", movementType);
      fd.append("glassType", glassType);
      fd.append("warrantyPeriod", warrantyPeriod);

      // SHIPPING
      fd.append("shippingCharges", shippingCharges);
      fd.append("deliveryTime", deliveryTime);
      fd.append("returnPolicy", returnPolicy);

      images.forEach((img) => fd.append("images", img));
      if (video) fd.append("productVideo", video);

      await api.post("/products", fd);
      showAlert("Product added successfully", "success");
      navigate("/admin/products");
    } catch (err) {
      showAlert(err.response?.data?.message || "Failed to add product", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-full md:max-w-6xl mx-auto p-4 bg-white dark:bg-gray-900 rounded-2xl shadow overflow-x-hidden">
      <h1 className="text-xl font-bold flex items-center gap-2 mb-4">
        <PackagePlus className="text-blue-600" />
        Add Product
      </h1>

      <form onSubmit={submitHandler} className="space-y-6">
        {/* BASIC */}
        <div className={sectionClass}>
          <h2 className="font-semibold">Basic Info</h2>
          <input className={inputClass} placeholder="Product Name"  onChange={(e)=>setProductName(e.target.value)} />
          <input className={inputClass} placeholder="Brand Name"  onChange={(e)=>setBrandName(e.target.value)} />
          <input className={inputClass} placeholder="Category"  onChange={(e)=>setCategory(e.target.value)} />
          <textarea className={inputClass} placeholder="Short Description" />
          <textarea rows="4" className={inputClass} placeholder="Full Description" />
        </div>

        {/* PRICE */}
        <div className={sectionClass}>
          <h2 className="font-semibold">Price & Stock</h2>
          <input type="number" className={inputClass} placeholder="Price"  onChange={(e)=>setPrice(e.target.value)} />
          <input type="number" className={inputClass} placeholder="Discount Price" onChange={(e)=>setDiscountPrice(e.target.value)} />
          <input type="number" className={inputClass} placeholder="Stock Quantity"  onChange={(e)=>setStockQuantity(e.target.value)} />
          <select className={inputClass} onChange={(e)=>setStockStatus(e.target.value)}>
            <option value="in_stock">In Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>

        {/* ADVANCED TOGGLE */}
        <button
          type="button"
          onClick={() => setShowAdvanced((p) => !p)}
          className="w-full flex items-center justify-between px-4 py-2 border rounded-lg"
        >
          Advanced Details
          <ChevronDown
            className={`transition ${showAdvanced ? "rotate-180" : ""}`}
          />
        </button>

        {showAdvanced && (
          <div className={sectionClass}>
            <h2 className="font-semibold">Watch Specs & Shipping</h2>
            <input className={inputClass} placeholder="Watch Type" onChange={(e)=>setWatchType(e.target.value)} />
            <input className={inputClass} placeholder="Strap Material" onChange={(e)=>setStrapMaterial(e.target.value)} />
            <input className={inputClass} placeholder="Dial Color" onChange={(e)=>setDialColor(e.target.value)} />
            <input className={inputClass} placeholder="Movement Type" onChange={(e)=>setMovementType(e.target.value)} />
            <input className={inputClass} placeholder="Glass Type" onChange={(e)=>setGlassType(e.target.value)} />
            <input className={inputClass} placeholder="Warranty Period" onChange={(e)=>setWarrantyPeriod(e.target.value)} />
            <input type="number" className={inputClass} placeholder="Shipping Charges" onChange={(e)=>setShippingCharges(e.target.value)} />
            <input className={inputClass} placeholder="Delivery Time" onChange={(e)=>setDeliveryTime(e.target.value)} />
            <textarea className={inputClass} placeholder="Return Policy" onChange={(e)=>setReturnPolicy(e.target.value)} />
          </div>
        )}

        {/* MEDIA */}
       {/* MEDIA */}
<div className={sectionClass}>
  <h2 className="font-semibold text-lg flex items-center gap-2">
    <Image size={18} />
    Media
  </h2>

  {/* UPLOAD BUTTONS */}
  <div className="flex flex-wrap gap-4">
    {/* IMAGES */}
    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition">
      <Image size={18} />
      Upload Images
      <input
        type="file"
        multiple
        accept="image/*"
        hidden
        onChange={handleImageChange}
      />
    </label>

    {/* VIDEO */}
    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-800 text-white cursor-pointer transition">
      <Video size={18} />
      Upload Video
      <input
        type="file"
        accept="video/*"
        hidden
        onChange={(e) => setVideo(e.target.files[0])}
      />
    </label>
  </div>

  {/* IMAGE PREVIEWS */}
  {imagePreviews.length > 0 && (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-4">
      {imagePreviews.map((img, i) => (
        <div
          key={i}
          className="relative rounded-lg overflow-hidden border"
        >
          <img
            src={img}
            alt="preview"
            className="h-24 w-full object-cover"
          />

          <button
            type="button"
            onClick={() => removeImage(i)}
            className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )}

  {/* VIDEO PREVIEW */}
  {video && (
    <div className="mt-4 relative max-w-sm">
      <video
        src={URL.createObjectURL(video)}
        controls
        className="w-full rounded-lg border"
      />
      <button
        type="button"
        onClick={() => setVideo(null)}
        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full"
      >
        <X size={14} />
      </button>
    </div>
  )}
</div>


        <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold">
          {loading ? "Saving..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AdminAddProduct;
