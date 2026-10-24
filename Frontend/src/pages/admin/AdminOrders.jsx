import { useState } from "react";
import { useSupabaseData } from "../../hooks/useSupabaseData";
import { supabase } from "../../supabaseClient";
import { orderStatusColors } from "../../data/adminData";
import { formatPrice } from "../../utils/formatPrice";

export default function AdminOrders() {
  const { data: orders, loading, error, refetch } = useSupabaseData("orders");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    customer: "",
    email: "",
    product: "",
    amount: 0,
    status: "Pending",
    date: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = (order = null) => {
    if (order) {
      setEditingOrder(order);
      setFormData({
        customer: order.customer || "",
        email: order.email || "",
        product: order.product || "",
        amount: order.amount || 0,
        status: order.status || "Pending",
        date: order.date || "",
      });
    } else {
      setEditingOrder(null);
      setFormData({
        customer: "",
        email: "",
        product: "",
        amount: 0,
        status: "Pending",
        date: new Date().toISOString().split('T')[0],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
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
        customer: formData.customer,
        email: formData.email,
        product: formData.product,
        amount: Number(formData.amount),
        status: formData.status,
        date: formData.date,
      };

      if (editingOrder) {
        const { error } = await supabase
          .from("orders")
          .update(payload)
          .eq("id", editingOrder.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("orders").insert([{ ...payload, user_id: (await supabase.auth.getUser()).data.user?.id }]);
        if (error) throw error;
      }

      await refetch();
      handleCloseModal();
    } catch (err) {
      alert("Error saving order: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        const { error } = await supabase.from("orders").delete().eq("id", id);
        if (error) throw error;
        await refetch();
      } catch (err) {
        alert("Error deleting order: " + err.message);
      }
    }
  };

  if (loading) return <div className="p-8 text-obsidian">Loading orders...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="font-display text-3xl font-light text-obsidian">Orders</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-obsidian text-gold text-xs tracking-widest uppercase px-6 py-3 font-body hover:bg-gold hover:text-obsidian transition-colors"
        >
          Add Order
        </button>
      </div>

      <div className="bg-white border border-obsidian/10 overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="border-b border-obsidian/10 bg-mist/50">
              <th className="text-left py-4 px-4 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">Order ID</th>
              <th className="text-left py-4 px-4 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">Customer</th>
              <th className="text-left py-4 px-4 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">Product</th>
              <th className="text-left py-4 px-4 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">Amount</th>
              <th className="text-left py-4 px-4 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">Date</th>
              <th className="text-left py-4 px-4 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">Status</th>
              <th className="text-right py-4 px-4 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(orders || []).map((order) => (
              <tr key={order.id} className="border-b border-obsidian/5 hover:bg-mist/30 transition-colors">
                <td className="py-4 px-4 font-body font-medium text-obsidian">{order.id}</td>
                <td className="py-4 px-4">
                  <div className="font-body text-obsidian">{order.customer}</div>
                  <div className="text-xs text-obsidian/40">{order.email}</div>
                </td>
                <td className="py-4 px-4 font-body text-obsidian/70">{order.product}</td>
                <td className="py-4 px-4 font-body font-medium text-obsidian">{formatPrice(order.amount)}</td>
                <td className="py-4 px-4 font-body text-obsidian/50">{order.date}</td>
                <td className="py-4 px-4">
                  <span className={`text-[10px] tracking-widest uppercase px-2 py-1 font-body ${orderStatusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-right space-x-2">
                  <button onClick={() => handleOpenModal(order)} className="text-xs text-obsidian hover:text-gold transition-colors">Edit</button>
                  <button onClick={() => handleDelete(order.id)} className="text-xs text-red-500 hover:text-red-700 transition-colors">Delete</button>
                </td>
              </tr>
            ))}
            {(!orders || orders.length === 0) && (
              <tr>
                <td colSpan="7" className="py-8 text-center text-obsidian/50">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-obsidian/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-obsidian/10 flex justify-between items-center">
              <h3 className="font-display text-xl">{editingOrder ? "Edit Order" : "Add Order"}</h3>
              <button onClick={handleCloseModal} className="text-obsidian/50 hover:text-obsidian">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Customer Name</label>
                <input required name="customer" value={formData.customer} onChange={handleChange} className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Email</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Product Name</label>
                <input required name="product" value={formData.product} onChange={handleChange} className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Amount (Numeric)</label>
                  <input required type="number" name="amount" value={formData.amount} onChange={handleChange} className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Date</label>
                  <input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none">
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button type="button" onClick={handleCloseModal} className="px-6 py-2 border border-obsidian/20 text-sm hover:bg-mist transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-obsidian text-gold text-sm hover:bg-gold hover:text-obsidian transition-colors">
                  {isSubmitting ? "Saving..." : "Save Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
