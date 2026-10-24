import { useState } from "react";
import { useSupabaseData } from "../../hooks/useSupabaseData";
import { supabase } from "../../supabaseClient";

export default function AdminCategories() {
  const { data: categories, loading, error, refetch } = useSupabaseData("categories", [], {
    orderBy: { column: "sort_order", ascending: true },
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image_url: "",
    count: "",
    sort_order: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        title: category.title || "",
        subtitle: category.subtitle || "",
        image_url: category.image_url || category.image || "",
        count: category.count || "",
        sort_order: category.sort_order || 0,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        title: "",
        subtitle: "",
        image_url: "",
        count: "",
        sort_order: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
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
        subtitle: formData.subtitle,
        image_url: formData.image_url,
        count: formData.count,
        sort_order: Number(formData.sort_order),
      };

      if (editingCategory) {
        const { error } = await supabase
          .from("categories")
          .update(payload)
          .eq("id", editingCategory.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert([{ ...payload, user_id: (await supabase.auth.getUser()).data.user?.id }]);
        if (error) throw error;
      }

      await refetch();
      handleCloseModal();
    } catch (err) {
      alert("Error saving category: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const { error } = await supabase.from("categories").delete().eq("id", id);
        if (error) throw error;
        await refetch();
      } catch (err) {
        alert("Error deleting category: " + err.message);
      }
    }
  };

  if (loading) return <div className="p-8 text-obsidian">Loading categories...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  const validCategories = categories || [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="font-display text-3xl font-light text-obsidian">Categories</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-obsidian text-gold text-xs tracking-widest uppercase px-6 py-3 font-body hover:bg-gold hover:text-obsidian transition-colors"
        >
          Add Category
        </button>
      </div>

      <div className="bg-white border border-obsidian/10 overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="border-b border-obsidian/10 bg-mist/50">
              <th className="text-left py-4 px-4 text-[10px] tracking-widest uppercase text-obsidian/40 font-body w-16">Sort</th>
              <th className="text-left py-4 px-4 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">Category</th>
              <th className="text-left py-4 px-4 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">Subtitle</th>
              <th className="text-left py-4 px-4 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">Count Text</th>
              <th className="text-right py-4 px-4 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">Actions</th>
            </tr>
          </thead>
          <tbody>
            {validCategories.map((category) => (
              <tr key={category.id} className="border-b border-obsidian/5 hover:bg-mist/30 transition-colors">
                <td className="py-4 px-4 font-body text-obsidian/50">{category.sort_order}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <img src={category.image_url || category.image} alt={category.title} className="w-12 h-12 object-cover flex-shrink-0" />
                    <span className="font-body text-obsidian">{category.title}</span>
                  </div>
                </td>
                <td className="py-4 px-4 font-body text-obsidian/70">{category.subtitle}</td>
                <td className="py-4 px-4 font-body text-obsidian/70">{category.count}</td>
                <td className="py-4 px-4 text-right space-x-2">
                  <button onClick={() => handleOpenModal(category)} className="text-xs text-obsidian hover:text-gold transition-colors">Edit</button>
                  <button onClick={() => handleDelete(category.id)} className="text-xs text-red-500 hover:text-red-700 transition-colors">Delete</button>
                </td>
              </tr>
            ))}
            {validCategories.length === 0 && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-obsidian/50">No categories found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-obsidian/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-obsidian/10 flex justify-between items-center">
              <h3 className="font-display text-xl">{editingCategory ? "Edit Category" : "Add Category"}</h3>
              <button onClick={handleCloseModal} className="text-obsidian/50 hover:text-obsidian">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Title</label>
                <input required name="title" value={formData.title} onChange={handleChange} className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Subtitle</label>
                <input required name="subtitle" value={formData.subtitle} onChange={handleChange} className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Image URL</label>
                <input required name="image_url" value={formData.image_url} onChange={handleChange} className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Count Text</label>
                  <input name="count" value={formData.count} onChange={handleChange} placeholder="e.g. 142 pieces" className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Sort Order</label>
                  <input required type="number" name="sort_order" value={formData.sort_order} onChange={handleChange} className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button type="button" onClick={handleCloseModal} className="px-6 py-2 border border-obsidian/20 text-sm hover:bg-mist transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-obsidian text-gold text-sm hover:bg-gold hover:text-obsidian transition-colors">
                  {isSubmitting ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
