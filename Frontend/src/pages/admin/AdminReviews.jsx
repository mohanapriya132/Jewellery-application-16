import { useState } from "react";
import { useSupabaseData } from "../../hooks/useSupabaseData";
import { supabase } from "../../supabaseClient";
import { reviewStatusColors } from "../../data/adminData";
import StarRating from "../../components/StarRating";

export default function AdminReviews() {
  const { data: reviews, loading, error, refetch } = useSupabaseData("product_reviews");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({
    product: "",
    author: "",
    rating: 5,
    text: "",
    date: "",
    status: "Pending",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = (review = null) => {
    if (review) {
      setEditingReview(review);
      setFormData({
        product: review.product || "",
        author: review.author || "",
        rating: review.rating || 5,
        text: review.text || "",
        date: review.date || "",
        status: review.status || "Pending",
      });
    } else {
      setEditingReview(null);
      setFormData({
        product: "",
        author: "",
        rating: 5,
        text: "",
        date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        status: "Pending",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReview(null);
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
        product: formData.product,
        author: formData.author,
        rating: Number(formData.rating),
        text: formData.text,
        date: formData.date,
        status: formData.status,
      };

      if (editingReview) {
        const { error } = await supabase
          .from("product_reviews")
          .update(payload)
          .eq("id", editingReview.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("product_reviews").insert([{ ...payload, user_id: (await supabase.auth.getUser()).data.user?.id }]);
        if (error) throw error;
      }

      await refetch();
      handleCloseModal();
    } catch (err) {
      alert("Error saving review: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        const { error } = await supabase.from("product_reviews").delete().eq("id", id);
        if (error) throw error;
        await refetch();
      } catch (err) {
        alert("Error deleting review: " + err.message);
      }
    }
  };

  const handleQuickStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase.from("product_reviews").update({ status: newStatus }).eq("id", id);
      if (error) throw error;
      await refetch();
    } catch (err) {
      alert("Error updating review status: " + err.message);
    }
  };

  if (loading) return <div className="p-8 text-obsidian">Loading reviews...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  const validReviews = reviews || [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="font-display text-3xl font-light text-obsidian">Reviews</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-obsidian text-gold text-xs tracking-widest uppercase px-6 py-3 font-body hover:bg-gold hover:text-obsidian transition-colors"
        >
          Add Review
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-obsidian/10 p-6">
          <p className="text-[10px] tracking-widest uppercase text-obsidian/40 font-body mb-1">Total Reviews</p>
          <p className="font-display text-3xl font-light text-obsidian">{validReviews.length}</p>
        </div>
        <div className="bg-white border border-obsidian/10 p-6">
          <p className="text-[10px] tracking-widest uppercase text-obsidian/40 font-body mb-1">Pending</p>
          <p className="font-display text-3xl font-light text-gold">
            {validReviews.filter((r) => r.status === "Pending").length}
          </p>
        </div>
        <div className="bg-white border border-obsidian/10 p-6">
          <p className="text-[10px] tracking-widest uppercase text-obsidian/40 font-body mb-1">Approved</p>
          <p className="font-display text-3xl font-light text-obsidian">
            {validReviews.filter((r) => r.status === "Approved").length}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {validReviews.length === 0 && (
          <div className="p-8 text-center text-obsidian/50 bg-white border border-obsidian/10">No reviews found.</div>
        )}
        {validReviews.map((review) => (
          <div key={review.id} className="bg-white border border-obsidian/10 p-6 relative group">
            <div className="absolute top-6 right-6 hidden group-hover:flex gap-2">
              <button onClick={() => handleOpenModal(review)} className="text-xs text-obsidian hover:text-gold transition-colors">Edit</button>
              <button onClick={() => handleDelete(review.id)} className="text-xs text-red-500 hover:text-red-700 transition-colors">Delete</button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3 pr-24">
              <div>
                <h3 className="font-body font-medium text-obsidian">{review.product}</h3>
                <p className="text-sm font-body text-obsidian/50">{review.author} · {review.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <StarRating rating={review.rating} />
                <span className={`text-[10px] tracking-widest uppercase px-2 py-1 font-body ${reviewStatusColors[review.status] || 'bg-gray-100 text-gray-800'}`}>
                  {review.status}
                </span>
              </div>
            </div>
            <p className="text-sm font-body text-obsidian/70 leading-relaxed">{review.text}</p>
            {review.status === "Pending" && (
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => handleQuickStatus(review.id, "Approved")}
                  className="text-[10px] tracking-widest uppercase px-4 py-2 bg-green-800 text-white font-body hover:bg-green-900 transition-colors"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleQuickStatus(review.id, "Rejected")}
                  className="text-[10px] tracking-widest uppercase px-4 py-2 border border-red-300 text-red-700 font-body hover:bg-red-50 transition-colors"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-obsidian/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-obsidian/10 flex justify-between items-center">
              <h3 className="font-display text-xl">{editingReview ? "Edit Review" : "Add Review"}</h3>
              <button onClick={handleCloseModal} className="text-obsidian/50 hover:text-obsidian">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Product Name</label>
                <input required name="product" value={formData.product} onChange={handleChange} className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Author</label>
                  <input required name="author" value={formData.author} onChange={handleChange} className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Rating (1-5)</label>
                  <input required type="number" min="1" max="5" name="rating" value={formData.rating} onChange={handleChange} className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Review Text</label>
                <textarea required name="text" value={formData.text} onChange={handleChange} rows="4" className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Date String</label>
                  <input required name="date" value={formData.date} onChange={handleChange} placeholder="e.g. May 2025" className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-obsidian/70 mb-2">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-obsidian/20 p-2 focus:border-gold outline-none">
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button type="button" onClick={handleCloseModal} className="px-6 py-2 border border-obsidian/20 text-sm hover:bg-mist transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-obsidian text-gold text-sm hover:bg-gold hover:text-obsidian transition-colors">
                  {isSubmitting ? "Saving..." : "Save Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
