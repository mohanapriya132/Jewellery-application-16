import { useState } from "react";
import { useSupabaseData } from "../../hooks/useSupabaseData";
import { supabase } from "../../supabaseClient";

export default function AdminOffers() {
  const { data: offers, loading, error, refetch } = useSupabaseData("offers", [], {
    orderBy: { column: "sort_order", ascending: true },
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    discount_text: "",
    image_url: "",
    sort_order: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = (offer = null) => {
    if (offer) {
      setEditingOffer(offer);
      setFormData({
        title: offer.title || "",
        discount_text: offer.discount_text || offer.off || "",
        image_url: offer.image_url || offer.img || "",
        sort_order: offer.sort_order || 0,
      });
    } else {
      setEditingOffer(null);
      setFormData({
        title: "",
        discount_text: "",
        image_url: "",
        sort_order: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOffer(null);
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
        title: formData.title,
        discount_text: formData.discount_text,
        image_url: formData.image_url,
        sort_order: Number(formData.sort_order),
      };

      if (editingOffer) {
        const { error } = await supabase
          .from("offers")
          .update(payload)
          .eq("id", editingOffer.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("offers").insert([{ ...payload, user_id: (await supabase.auth.getUser()).data.user?.id }]);
        if (error) throw error;
      }

      await refetch();
      handleCloseModal();
    } catch (err) {
      alert("Error saving offer: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      try {
        const { error } = await supabase.from("offers").delete().eq("id", id);
        if (error) throw error;
        await refetch();
      } catch (err) {
        alert("Error deleting offer: " + err.message);
      }
    }
  };

  if (loading) return <div className="p-8 text-obsidian">Loading offers...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  const validOffers = offers || [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="font-display text-3xl font-light text-obsidian">Offers</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-obsidian text-gold text-xs tracking-widest uppercase px-6 py-3 font-body hover:bg-gold hover:text-obsidian transition-colors"
        >
          Add Offer
        </button>
      </div>

      <div className="bg-white border border-obsidian/10 overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="border-b border-obsidian/10 bg-mist/50">
              <th className="text-left py-4 px-4 text-[10px] tracking-widest uppercase text-obsidian/40 font-body w-16">Sort</th>
              <th className="text-left py-4 px-4 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">Offer Title</th>
              <th className="text-left py-4 px-4 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">Discount Text</th>
              <th className="text-right py-4 px-4 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">Actions</th>
            </tr>
          </thead>
          <tbody>
            {validOffers.map((offer) => (
              <tr key={offer.id} className="border-b border-obsidian/5 hover:bg-mist/30 transition-colors">
                <td className="py-4 px-4 font-body text-obsidian/50">{offer.sort_order}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <img src={offer.image_url || offer.img} alt={offer.title} className="w-12 h-12 object-cover flex-shrink-0" />
                    <span className="font-body text-obsidian">{offer.title}</span>
                  </div>
                </td>
                <td className="py-4 px-4 font-body text-obsidian/70">{offer.discount_text || offer.off}</td>
                <td className="py-4 px-4 text-right space-x-2">
                  <button onClick={() => handleOpenModal(offer)} className="text-xs text-obsidian hover:text-gold transition-colors">Edit</button>
                  <button onClick={() => handleDelete(offer.id)} className="text-xs text-red-500 hover:text-red-700 transition-colors">Delete</button>
                </td>
              </tr>
            ))}
            {validOffers.length === 0 && (
              <tr>
                <td colSpan="4" className="py-8 text-center text-obsidian/50">No offers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-obsidian/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-obsidian/10 flex justify-between items-center">
              <h3 className="font-display text-xl">{editingOffer ? "Edit Offer" : "Add Offer"}</h3>
              <button onClick={handleCloseModal} className="text-obsidian/50 hover:text-obsidian">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Title</label>
                <input required name="title" value={formData.title} onChange={handleChange} className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Discount Text</label>
                <input required name="discount_text" value={formData.discount_text} onChange={handleChange} placeholder="e.g. 25% OFF" className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Image URL</label>
                <input required name="image_url" value={formData.image_url} onChange={handleChange} className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Sort Order</label>
                <input required type="number" name="sort_order" value={formData.sort_order} onChange={handleChange} className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none" />
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button type="button" onClick={handleCloseModal} className="px-6 py-2 border border-obsidian/20 text-sm hover:bg-mist transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-obsidian text-gold text-sm hover:bg-gold hover:text-obsidian transition-colors">
                  {isSubmitting ? "Saving..." : "Save Offer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
