import { useEffect, useState } from "react";

export const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null); // For editing products

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/admin/product");
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/admin/product", {
      method: "POST",
      body: JSON.stringify(newProduct),
    });
    if (response.ok) {
      alert("Product added successfully!");
      // Reload products after adding
      const updatedProducts = await response.json();
      setProducts((prevProducts) => [...prevProducts, updatedProducts]);
    }
  };
  const handleEditProduct = async (e, updatedProduct) => {
    e.preventDefault();
    const response = await fetch(`/api/admin/product/${updatedProduct._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    });

    if (response.ok) {
      const data = await response.json();
      alert(data.message);
      // Update the local state
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === updatedProduct._id ? data.product : product
        )
      );
      setEditingProduct(null); // Clear editing state
    } else {
      const errorData = await response.json();
      alert(errorData.message || "Failed to update product");
    }
  };

  const handleDeleteProduct = async (productId) => {
    const response = await fetch(`/api/admin/product/${productId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      alert("Product deleted successfully!");
      // Remove the deleted product from the state
      setProducts(products.filter((product) => product._id !== productId));
    }
  };

  if (loading)
    return (
      <div className="text-center py-10 text-xl text-[#674636]">Loading...</div>
    );
  if (error)
    return (
      <div className="text-center py-10 text-xl text-red-600">
        Error: {error}
      </div>
    );

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  return (
    <div>
      <h1>Products</h1>
      <form onSubmit={handleAddProduct}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleInputChange}
        ></textarea>
        <input
          type="number"
          name="price"
          placeholder="Price"
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="images"
          placeholder="Image URLs (comma-separated)"
          onChange={handleInputChange}
        />
        <button type="submit">Add Product</button>
      </form>

      {/* Edit Form */}
      {editingProduct && (
        <form onSubmit={(e) => handleEditProduct(e, editingProduct)}>
          <input
            type="text"
            name="name"
            value={editingProduct.name}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, name: e.target.value })
            }
          />
          <textarea
            name="description"
            value={editingProduct.description}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                description: e.target.value,
              })
            }
          ></textarea>
          <input
            type="number"
            name="price"
            value={editingProduct.price}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, price: e.target.value })
            }
          />
          <input
            type="number"
            name="stock"
            value={editingProduct.stock}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, stock: e.target.value })
            }
          />
          <input
            type="text"
            name="category"
            value={editingProduct.category}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, category: e.target.value })
            }
          />
          <input
            type="text"
            name="images"
            value={editingProduct.images}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, images: e.target.value })
            }
          />
          <button type="submit">Save Changes</button>
        </form>
      )}

      <div className="bg-[#FFF8E8] min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 text-center text-[#674636]">
            Product Listing
          </h1>

          {Object.entries(productsByCategory).map(
            ([category, categoryProducts]) => (
              <div key={category} className="mb-12">
                <h2 className="text-3xl font-semibold mb-6 text-[#674636] border-b-2 border-[#674636] pb-2">
                  {category}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
                  {categoryProducts.map((product) => (
                    <div
                      key={product._id}
                      className="w-full max-w-sm bg-[#F7EED3] rounded-lg p-6 shadow-lg h-full flex flex-col justify-between"
                    >
                      <div>
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-48 object-contain rounded-md mb-4"
                        />
                        <h3 className="text-xl font-semibold text-[#674636] mb-2">
                          {product.name}
                        </h3>
                        <p className="text-[#674636] opacity-80 mb-3 flex-grow">
                          {product.description}
                        </p>
                      </div>
                      <div className="mt-auto">
                        <div className="flex justify-between items-center">
                          <p className="text-lg font-bold text-[#674636]">
                            ${product.price}
                          </p>
                          <p className="text-sm text-[#674636] opacity-70">
                            Stock: {product.stock}
                          </p>
                        </div>
                        <div className="flex justify-between mt-4">
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            Delete
                          </button>
                          <button
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                            onClick={() => setEditingProduct(product)}
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
