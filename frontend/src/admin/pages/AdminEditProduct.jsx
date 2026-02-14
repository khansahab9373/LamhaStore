import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  Image,
  Video,
  X,
  ChevronDown,
  PackagePlus,
} from "lucide-react";
import api from "../../services/api";
import { useAlert } from "../../context/AlertContext";

const AdminEditProduct = () => {
  const { id } = useParams();
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
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [video, setVideo] = useState(null);
  const [existingVideo, setExistingVideo] = useState(null);

  // UI
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const inputClass =
    "w-full min-w-0 box-border rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  const sectionClass =
    "bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4 overflow-x-hidden";

  // FETCH PRODUCT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);

        setProductName(data.productName);
        setBrandName(data.brandName);
        setCategory(data.category);
        setShortDescription(data.shortDescription || "");
        setFullDescription(data.fullDescription || "");

        setPrice(data.price);
        setDiscountPrice(data.discountPrice || "");
        setStockQuantity(data.stockQuantity || "");
        setStockStatus(data.stockStatus || "in_stock");
        setMinOrderQuantity(data.minOrderQuantity || 1);

        setWatchType(data.watchType || "");
        setStrapMaterial(data.strapMaterial || "");
        setStrapColor(data.strapColor || "");
        setDialColor(data.dialColor || "");
        setDisplayType(data.displayType || "");
        setWaterResistance(data.waterResistance || "");
        setMovementType(data.movementType || "");
        setGlassType(data.glassType || "");
        setWarrantyPeriod(data.warrantyPeriod || "");

        setShippingCharges(data.shippingCharges || 0);
        setDeliveryTime(data.deliveryTime || "");
        setReturnPolicy(data.returnPolicy || "");

        setExistingImages(data.images || []);
        setExistingVideo(data.productVideo?.url || null);
      } catch {
        showAlert("Failed to load product", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, showAlert]);

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((p) => [...p, ...files]);
    setNewImagePreviews((p) => [
      ...p,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
    e.target.value = null;
  };

  const removeNewImage = (i) => {
    setNewImages((p) => p.filter((_, x) => x !== i));
    setNewImagePreviews((p) => p.filter((_, x) => x !== i));
  };

  const removeExistingImage = (i) => {
    setExistingImages((p) => p.filter((_, x) => x !== i));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setSaving(true);

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

      // EXISTING IMAGES (keep)
      fd.append(
        "existingImages",
        JSON.stringify(existingImages)
      );

      // NEW IMAGES
      newImages.forEach((img) =>
        fd.append("images", img)
      );

      // VIDEO
      if (video) fd.append("productVideo", video);

      await api.put(`/products/${id}`, fd);

      showAlert("Product updated successfully", "success");
      navigate("/admin/products");
    } catch (err) {
      showAlert(
        err.response?.data?.message ||
          "Update failed",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <p className="p-6 text-center">
        Loading product...
      </p>
    );

  return (
    <div className="w-full max-w-full md:max-w-6xl mx-auto p-4 bg-white dark:bg-gray-900 rounded-2xl shadow overflow-x-hidden">
      <h1 className="text-xl font-bold flex items-center gap-2 mb-4">
        <PackagePlus className="text-blue-600" />
        Edit Product
      </h1>

      <form onSubmit={submitHandler} className="space-y-6">
        {/* BASIC */}
        <div className={sectionClass}>
          <h2 className="font-semibold">
            Basic Info
          </h2>
          <input className={inputClass} value={productName} onChange={(e)=>setProductName(e.target.value)} placeholder="Product Name" />
          <input className={inputClass} value={brandName} onChange={(e)=>setBrandName(e.target.value)} placeholder="Brand Name" />
          <input className={inputClass} value={category} onChange={(e)=>setCategory(e.target.value)} placeholder="Category" />
          <textarea className={inputClass} placeholder="Short Description" value={shortDescription} onChange={(e)=>setShortDescription(e.target.value)} />
          <textarea rows="4" className={inputClass} placeholder="Full Description" value={fullDescription} onChange={(e)=>setFullDescription(e.target.value)} />
        </div>

        {/* PRICE */}
        <div className={sectionClass}>
          <h2 className="font-semibold">
            Price & Stock
          </h2>
          <input type="number" className={inputClass} value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="Price" />
          <input type="number" className={inputClass} value={discountPrice} onChange={(e)=>setDiscountPrice(e.target.value)} placeholder="Discount Price" />
          <input type="number" className={inputClass} value={stockQuantity} onChange={(e)=>setStockQuantity(e.target.value)} placeholder="Stock Quantity" />
          <select className={inputClass} value={stockStatus} onChange={(e)=>setStockStatus(e.target.value)}>
            <option value="in_stock">In Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>

        {/* ADVANCED */}
        <button
          type="button"
          onClick={() => setShowAdvanced((p) => !p)}
          className="w-full flex items-center justify-between px-4 py-2 border rounded-lg"
        >
          Advanced Details
          <ChevronDown
            className={`transition ${
              showAdvanced ? "rotate-180" : ""
            }`}
          />
        </button>

        {showAdvanced && (
          <div className={sectionClass}>
            <h2 className="font-semibold">
              Watch Specs & Shipping
            </h2>
            <input className={inputClass} placeholder="Watch Type" value={watchType} onChange={(e)=>setWatchType(e.target.value)} />
            <input className={inputClass} placeholder="Strap Material" value={strapMaterial} onChange={(e)=>setStrapMaterial(e.target.value)} />
            <input className={inputClass} placeholder="Strap Color" value={strapColor} onChange={(e)=>setStrapColor(e.target.value)} />
            <input className={inputClass} placeholder="Dial Color" value={dialColor} onChange={(e)=>setDialColor(e.target.value)} />
            <input className={inputClass} placeholder="Movement Type" value={movementType} onChange={(e)=>setMovementType(e.target.value)} />
            <input className={inputClass} placeholder="Glass Type" value={glassType} onChange={(e)=>setGlassType(e.target.value)} />
            <input className={inputClass} placeholder="Warranty Period" value={warrantyPeriod} onChange={(e)=>setWarrantyPeriod(e.target.value)} />
            <input type="number" className={inputClass} placeholder="Shipping Charges" value={shippingCharges} onChange={(e)=>setShippingCharges(e.target.value)} />
            <input className={inputClass} placeholder="Delivery Time" value={deliveryTime} onChange={(e)=>setDeliveryTime(e.target.value)} />
            <textarea className={inputClass} placeholder="Return Policy" value={returnPolicy} onChange={(e)=>setReturnPolicy(e.target.value)} />
          </div>
        )}

        {/* MEDIA */}
        <div className={sectionClass}>
          <h2 className="font-semibold">
            Media
          </h2>

          {/* EXISTING IMAGES */}
          {existingImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {existingImages.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img.url} className="h-24 w-full object-cover rounded border" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(i)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* UPLOAD */}
          <div className="flex flex-wrap gap-4 mt-3">
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
              <Image size={18} />
              Upload Images
              <input type="file" multiple hidden onChange={handleNewImages} />
            </label>

            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-800 text-white cursor-pointer">
              <Video size={18} />
              Upload Video
              <input type="file" accept="video/*" hidden onChange={(e)=>setVideo(e.target.files[0])} />
            </label>
          </div>

          {/* NEW IMAGE PREVIEW */}
          {newImagePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-4">
              {newImagePreviews.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} className="h-24 w-full object-cover rounded border" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* VIDEO PREVIEW */}
          {(video || existingVideo) && (
            <div className="mt-4 max-w-sm">
              <video
                src={video ? URL.createObjectURL(video) : existingVideo}
                controls
                className="w-full rounded border"
              />
            </div>
          )}
        </div>

        <button
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
        >
          <Save size={18} />
          {saving ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default AdminEditProduct;
