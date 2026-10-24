import { useState } from "react";
import { useSupabaseData } from "../../hooks/useSupabaseData";
import { supabase } from "../../supabaseClient";
import { formatPrice } from "../../utils/formatPrice";

export default function AdminCustomers() {
  const { data: customers, loading, error, refetch } = useSupabaseData("customers");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orders: 0,
    spent: 0,
    joined: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        orders: customer.orders || 0,
        spent: customer.spent || 0,
        joined: customer.joined || "",
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        orders: 0,
        spent: 0,
        joined: new Date().toISOString().split('T')[0],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
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
        email: formData.email,
        phone: formData.phone,
        orders: Number(formData.orders),
        spent: Number(formData.spent),
        joined: formData.joined,
      };

      if (editingCustomer) {
        const { error } = await supabase
          .from("customers")
          .update(payload)
          .eq("id", editingCustomer.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("customers").insert([{ ...payload, user_id: (await supabase.auth.getUser()).data.user?.id }]);
        if (error) throw error;
      }

      await refetch();
      handleCloseModal();
    } catch (err) {
      alert("Error saving customer: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        const { error } = await supabase.from("customers").delete().eq("id", id);
        if (error) throw error;
        await refetch();
      } catch (err) {
        alert("Error deleting customer: " + err.message);
      }
    }
  };

  if (loading) return <div className="p-8 text-obsidian">Loading customers...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  const validCustomers = customers || [];
  const totalOrders = validCustomers.reduce((sum, c) => sum + (c.orders || 0), 0);
  const totalSpent = validCustomers.reduce((sum, c) => sum + (c.spent || 0), 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="font-display text-3xl font-light text-obsidian">Customers</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-obsidian text-gold text-xs tracking-widest uppercase px-6 py-3 font-body hover:bg-gold hover:text-obsidian transition-colors"
        >
          Add Customer
        </button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-obsidian/10 p-6">
          <p className="text-[10px] tracking-widest uppercase text-obsidian/40 font-body mb-1">Total Customers</p>
          <p className="font-display text-3xl font-light text-obsidian">{validCustomers.length}</p>
        </div>
        <div className="bg-white border border-obsidian/10 p-6">
          <p className="text-[10px] tracking-widest uppercase text-obsidian/40 font-body mb-1">Total Orders</p>
          <p className="font-display text-3xl font-light text-obsidian">{totalOrders}</p>
        </div>
        <div className="bg-white border border-obsidian/10 p-6">
          <p className="text-[10px] tracking-widest uppercase text-obsidian/40 font-body mb-1">Total Spent</p>
          <p className="font-display text-3xl font-light text-gold">{formatPrice(totalSpent)}</p>
        </div>
      </div>

      <div className="bg-white border border-obsidian/10 overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="border-b border-obsidian/10 bg-mist/50">
              <th className="text-left py-4 px-4 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">Name</th>
              <th className="text-left py-4 px-4 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">Email</th>
              <th className="text-left py-4 px-4 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">Phone</th>
              <th className="text-left py-4 px-4 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">Orders</th>
              <th className="text-left py-4 px-4 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">Total Spent</th>
              <th className="text-left py-4 px-4 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">Joined</th>
              <th className="text-right py-4 px-4 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">Actions</th>
            </tr>
          </thead>
          <tbody>
            {validCustomers.map((customer) => (
              <tr key={customer.id} className="border-b border-obsidian/5 hover:bg-mist/30 transition-colors">
                <td className="py-4 px-4 font-body font-medium text-obsidian">{customer.name}</td>
                <td className="py-4 px-4 font-body text-obsidian/70">{customer.email}</td>
                <td className="py-4 px-4 font-body text-obsidian/50">{customer.phone}</td>
                <td className="py-4 px-4 font-body text-obsidian">{customer.orders}</td>
                <td className="py-4 px-4 font-body font-medium text-obsidian">{formatPrice(customer.spent)}</td>
                <td className="py-4 px-4 font-body text-obsidian/50">{customer.joined}</td>
                <td className="py-4 px-4 text-right space-x-2">
                  <button onClick={() => handleOpenModal(customer)} className="text-xs text-obsidian hover:text-gold transition-colors">Edit</button>
                  <button onClick={() => handleDelete(customer.id)} className="text-xs text-red-500 hover:text-red-700 transition-colors">Delete</button>
                </td>
              </tr>
            ))}
            {validCustomers.length === 0 && (
              <tr>
                <td colSpan="7" className="py-8 text-center text-obsidian/50">No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-obsidian/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-obsidian/10 flex justify-between items-center">
              <h3 className="font-display text-xl">{editingCustomer ? "Edit Customer" : "Add Customer"}</h3>
              <button onClick={handleCloseModal} className="text-obsidian/50 hover:text-obsidian">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Name</label>
                <input required name="name" value={formData.name} onChange={handleChange} className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Email</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Phone</label>
                <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Orders</label>
                  <input required type="number" name="orders" value={formData.orders} onChange={handleChange} className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Total Spent</label>
                  <input required type="number" name="spent" value={formData.spent} onChange={handleChange} className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Joined Date</label>
                <input required name="joined" value={formData.joined} onChange={handleChange} placeholder="e.g. Jan 2025" className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none" />
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button type="button" onClick={handleCloseModal} className="px-6 py-2 border border-obsidian/20 text-sm hover:bg-mist transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-obsidian text-gold text-sm hover:bg-gold hover:text-obsidian transition-colors">
                  {isSubmitting ? "Saving..." : "Save Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
