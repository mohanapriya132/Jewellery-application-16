import { dashboardStats, orderStatusColors } from "../../data/adminData";
import { products } from "../../data/products";
import { formatPrice } from "../../utils/formatPrice";

const statCards = [
  { label: "Total Revenue", value: formatPrice(dashboardStats.totalRevenue), color: "text-gold" },
  { label: "Total Orders", value: dashboardStats.totalOrders, color: "text-obsidian" },
  { label: "Customers", value: dashboardStats.totalCustomers, color: "text-obsidian" },
  { label: "Products", value: products.length, color: "text-obsidian" },
];

export default function AdminDashboard() {
  return (
    <div>
      <h2 className="font-display text-3xl font-light text-obsidian mb-8">Dashboard</h2>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white border border-obsidian/10 p-6">
            <p className="text-[10px] tracking-widest uppercase text-obsidian/40 font-body mb-2">{stat.label}</p>
            <p className={`font-display text-3xl font-light ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-obsidian/10 p-6">
          <h3 className="font-display text-xl font-light text-obsidian mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-obsidian/10">
                  <th className="text-left py-2 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">Order</th>
                  <th className="text-left py-2 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">Customer</th>
                  <th className="text-left py-2 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">Amount</th>
                  <th className="text-left py-2 text-[10px] tracking-widest uppercase text-obsidian/40 font-body">Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboardStats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-obsidian/5">
                    <td className="py-3 font-body text-obsidian">{order.id}</td>
                    <td className="py-3 font-body text-obsidian/70">{order.customer}</td>
                    <td className="py-3 font-body text-obsidian">{formatPrice(order.amount)}</td>
                    <td className="py-3">
                      <span className={`text-[10px] tracking-widest uppercase px-2 py-1 font-body ${orderStatusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-obsidian/10 p-6">
          <h3 className="font-display text-xl font-light text-obsidian mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-obsidian/5">
              <span className="text-sm font-body text-obsidian/60">Pending Reviews</span>
              <span className="font-display text-2xl font-light text-gold">{dashboardStats.pendingReviews}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-obsidian/5">
              <span className="text-sm font-body text-obsidian/60">Avg. Order Value</span>
              <span className="font-body font-medium text-obsidian">
                {formatPrice(Math.round(dashboardStats.totalRevenue / dashboardStats.totalOrders))}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm font-body text-obsidian/60">Active Products</span>
              <span className="font-body font-medium text-obsidian">{products.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
