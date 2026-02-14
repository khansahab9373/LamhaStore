import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { useAlert } from "../../context/AlertContext";

// MUI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const AdminProductList = () => {
  const { showAlert } = useAlert();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data);
      } catch (err) {
        showAlert(
          err.response?.data?.message || "Failed to load products",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [showAlert]);

  const deleteHandler = async () => {
    try {
      await api.delete(`/products/${selectedProductId}`);
      setProducts((prev) =>
        prev.filter((p) => p._id !== selectedProductId)
      );
      showAlert("Product deleted successfully", "success");
    } catch (err) {
      showAlert(err.response?.data?.message || "Delete failed", "error");
    } finally {
      setOpenDeleteDialog(false);
      setSelectedProductId(null);
    }
  };

  if (loading) {
    return (
      <p className="p-6 text-center text-gray-500 dark:text-gray-400">
        Loading products...
      </p>
    );
  }

  return (
    <>
      <div className="p-6 space-y-6 overflow-x-hidden">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package />
            Products
          </h1>

          <Link to="/admin/products/add">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
              <Plus size={18} />
              Add Product
            </button>
          </Link>
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow border dark:border-gray-800">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-t dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="px-4 py-3">
                    <img
                      src={product.images?.[0]?.url}
                      alt={product.productName}
                      className="w-14 h-14 object-cover rounded-lg border"
                    />
                  </td>

                  <td className="px-4 py-3 font-medium">
                    {product.productName}
                  </td>

                  <td className="px-4 py-3 font-semibold">
                    ₹{product.price}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-4">
                      <Link
                        to={`/admin/products/${product._id}/edit`}
                        className="flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <Pencil size={16} />
                        Edit
                      </Link>

                      <button
                        className="flex items-center gap-1 text-red-600 hover:underline"
                        onClick={() => {
                          setSelectedProductId(product._id);
                          setOpenDeleteDialog(true);
                        }}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <p className="p-6 text-center text-gray-500">
              No products found
            </p>
          )}
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden space-y-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white dark:bg-gray-900 rounded-xl shadow border dark:border-gray-800 p-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={product.images?.[0]?.url}
                  alt={product.productName}
                  className="w-16 h-16 object-cover rounded-lg border"
                />

                <div className="flex-1">
                  <p className="font-semibold">
                    {product.productName}
                  </p>
                  <p className="text-sm text-gray-500">
                    ₹{product.price}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-4 text-sm">
                <Link
                  to={`/admin/products/${product._id}/edit`}
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <Pencil size={16} />
                  Edit
                </Link>

                <button
                  className="flex items-center gap-1 text-red-600 hover:underline"
                  onClick={() => {
                    setSelectedProductId(product._id);
                    setOpenDeleteDialog(true);
                  }}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <p className="text-center text-gray-500">
              No products found
            </p>
          )}
        </div>
      </div>

      {/* DELETE DIALOG */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Product</DialogTitle>

        <DialogContent>
          Are you sure you want to delete this product?
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={deleteHandler}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminProductList;
