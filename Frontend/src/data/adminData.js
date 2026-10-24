export const adminOrders = [
  { id: "ORD-1001", customer: "Priya Sharma", email: "priya@email.com", product: "Celestial Diamond Ring", amount: 124999, status: "Delivered", date: "2025-06-01" },
  { id: "ORD-1002", customer: "Rohit Mehta", email: "rohit@email.com", product: "Pearl Cascade Necklace", amount: 89500, status: "Shipped", date: "2025-06-05" },
  { id: "ORD-1003", customer: "Ananya Krishnan", email: "ananya@email.com", product: "Ruby Drop Earrings", amount: 67000, status: "Processing", date: "2025-06-10" },
  { id: "ORD-1004", customer: "Vikram Patel", email: "vikram@email.com", product: "Gold Tennis Bracelet", amount: 98000, status: "Delivered", date: "2025-06-12" },
  { id: "ORD-1005", customer: "Meera Reddy", email: "meera@email.com", product: "Sapphire Halo Ring", amount: 215000, status: "Pending", date: "2025-06-15" },
  { id: "ORD-1006", customer: "Kavya Nair", email: "kavya@email.com", product: "Emerald Stud Earrings", amount: 78500, status: "Shipped", date: "2025-06-18" },
];

export const adminCustomers = [
  { id: 1, name: "Priya Sharma", email: "priya@email.com", phone: "+91 98765 43210", orders: 3, spent: 389500, joined: "Jan 2024" },
  { id: 2, name: "Rohit Mehta", email: "rohit@email.com", phone: "+91 87654 32109", orders: 2, spent: 156500, joined: "Mar 2024" },
  { id: 3, name: "Ananya Krishnan", email: "ananya@email.com", phone: "+91 76543 21098", orders: 5, spent: 512000, joined: "Nov 2023" },
  { id: 4, name: "Vikram Patel", email: "vikram@email.com", phone: "+91 65432 10987", orders: 1, spent: 98000, joined: "May 2025" },
  { id: 5, name: "Meera Reddy", email: "meera@email.com", phone: "+91 54321 09876", orders: 4, spent: 445000, joined: "Aug 2024" },
  { id: 6, name: "Kavya Nair", email: "kavya@email.com", phone: "+91 43210 98765", orders: 2, spent: 145500, joined: "Feb 2025" },
];

export const adminReviews = [
  { id: 1, product: "Celestial Diamond Ring", author: "Priya S.", rating: 5, text: "Absolutely breathtaking. The diamond is so brilliant.", date: "March 2025", status: "Approved" },
  { id: 2, product: "Pearl Cascade Necklace", author: "Meera R.", rating: 5, text: "The most beautiful necklace I've ever owned.", date: "April 2025", status: "Approved" },
  { id: 3, product: "Ruby Drop Earrings", author: "Kavya N.", rating: 5, text: "Stunning in person. The rubies have such a deep red.", date: "May 2025", status: "Pending" },
  { id: 4, product: "Gold Tennis Bracelet", author: "Riya B.", rating: 5, text: "Wore it to my sister's wedding. Truly stunning.", date: "April 2025", status: "Approved" },
  { id: 5, product: "Rose Gold Bangle Set", author: "Rima S.", rating: 4, text: "Lovely set. Great value for the quality.", date: "March 2025", status: "Pending" },
];

export const dashboardStats = {
  totalRevenue: 2847500,
  totalOrders: 156,
  totalCustomers: 89,
  totalProducts: 8,
  pendingReviews: 2,
  recentOrders: adminOrders.slice(0, 5),
};

export const orderStatusColors = {
  Delivered: "bg-green-100 text-green-800",
  Shipped: "bg-blue-100 text-blue-800",
  Processing: "bg-yellow-100 text-yellow-800",
  Pending: "bg-orange-100 text-orange-800",
};

export const reviewStatusColors = {
  Approved: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Rejected: "bg-red-100 text-red-800",
};
