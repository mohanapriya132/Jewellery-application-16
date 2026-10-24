import { useState } from "react";
import { useSupabaseProducts } from "../../hooks/useSupabaseProducts";
import { supabase } from "../../supabaseClient";
import { badgeColor } from "../../data/products";

export default function AdminProducts() {
  const { products, loading, error, refetch } = useSupabaseProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    priceNum: 0,
    sku: "",
    badge: "",
    image: "",
    stock: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || "",
        category: product.category || "",
        price: product.price || "",
        priceNum: product.priceNum || 0,
        sku: product.sku || "",
        badge: product.badge || "",
        image: product.image || "",
        stock: product.stock || 0,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        category: "",
        price: "",
        priceNum: 0,
        sku: "",
        badge: "",
        image: "",
        stock: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        price: formData.price,
        price_num: Number(formData.priceNum),
        sku: formData.sku,
        badge: formData.badge,
        image: formData.image,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert([{ ...payload, user_id: (await supabase.auth.getUser()).data.user?.id }]);
        if (error) throw error;
      }

      await refetch();
      handleCloseModal();
    } catch (err) {
      alert("Error saving product: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) throw error;
        await refetch();
      } catch (err) {
        alert("Error deleting product: " + err.message);
      }
    }
  };

  if (loading) return <div className="p-8 text-obsidian">Loading products...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="font-display text-3xl font-light text-obsidian">Products</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-obsidian text-gold text-xs tracking-widest uppercase px-6 py-3 font-body hover:bg-gold hover:text-obsidian transition-colors"
        >
          Add Product
        </button>
      </div>

      <div className="bg-white border border-obsidian/10 overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="border-b border-obsidian/10 bg-mist/50">
              <th className="text-left py-4 px-4 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">Product</th>
              <th className="text-left py-4 px-4 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">Category</th>
              <th className="text-left py-4 px-4 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">Price</th>
              <th className="text-left py-4 px-4 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">SKU</th>
              <th className="text-left py-4 px-4 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">Badge</th>
              <th className="text-right py-4 px-4 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-obsidian/5 hover:bg-mist/30 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-12 h-12 object-cover flex-shrink-0" />
                    <span className="font-body text-obsidian">{product.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4 font-body text-obsidian/70">{product.category}</td>
                <td className="py-4 px-4 font-body font-medium text-obsidian">{product.price}</td>
                <td className="py-4 px-4 font-body text-obsidian/50 text-xs">{product.sku}</td>
                <td className="py-4 px-4">
                  {product.badge && (
                    <span className={`text-[9px] tracking-widest uppercase px-2 py-1 font-body ${badgeColor[product.badge] || 'bg-gray-100 text-gray-800'}`}>
                      {product.badge}
                    </span>
                  )}
                </td>
                <td className="py-4 px-4 text-right space-x-2">
                  <button 
                    onClick={() => handleOpenModal(product)}
                    className="text-xs text-obsidian hover:text-gold transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="text-xs text-red-500 hover:text-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="6" className="py-8 text-center text-obsidian/50">No products found. Add one to get started.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-obsidian/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-obsidian/10 flex justify-between items-center">
              <h3 className="font-display text-xl">{editingProduct ? "Edit Product" : "Add Product"}</h3>
              <button onClick={handleCloseModal} className="text-obsidian/50 hover:text-obsidian">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Name</label>
                <input required name="name" value={formData.name} onChange={handleChange} className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Category</label>
                  <select required name="category" value={formData.category} onChange={handleChange} className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none bg-white">
                    <option value="" disabled>Select Category</option>
                    <option value="Rings">Rings</option>
                    <option value="Necklaces">Necklaces</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Bracelets">Bracelets</option>
                    <option value="Pendants">Pendants</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">SKU</label>
                  <input required name="sku" value={formData.sku} onChange={handleChange} className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Price (Display)</label>
                  <input required name="price" value={formData.price} onChange={handleChange} placeholder="e.g. ₹1,24,999" className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Price (Numeric)</label>
                  <input required type="number" name="priceNum" value={formData.priceNum} onChange={handleChange} className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Badge</label>
                <select name="badge" value={formData.badge} onChange={handleChange} className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none bg-white">
                  <option value="">None</option>
                  <option value="Bestseller">Bestseller</option>
                  <option value="New">New</option>
                  <option value="Sale">Sale</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Image URL</label>
                <input required name="image" value={formData.image} onChange={handleChange} className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none" />
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button type="button" onClick={handleCloseModal} className="px-6 py-2 border border-obsidian/20 text-sm hover:bg-mist transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-obsidian text-gold text-sm hover:bg-gold hover:text-obsidian transition-colors">
                  {isSubmitting ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
