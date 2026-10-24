import { useEffect } from 'react'
import { supabase } from './supabaseClient'
import './index.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ApiTest from './components/ApiTest'
import Hero from './components/Hero'
import Categories from './components/Categories'
import Products from './components/Products'
import Offers from './components/Offers'
import Reviews from './components/Reviews'
import Brands from './components/Brands'
import Footer from './components/Footer'
import WeddingCollection from './pages/WeddingCollection'
import ProductDetail from './pages/ProductDetail'
import Contact from './pages/Contact'
import Wishlist from './pages/Wishlist'
import Cart from './pages/Cart'
import Search from './pages/Search'
import CustomJewelry from './pages/CustomJewelry'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import AdminLayout from './pages/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCustomers from './pages/admin/AdminCustomers'
import AdminReviews from './pages/admin/AdminReviews'
import AdminCategories from './pages/admin/AdminCategories'
import AdminOffers from './pages/admin/AdminOffers'
import UserProtectedRoute from './components/ProtectedRoute'

function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Categories />
      <Products />
      <Offers />
      <Reviews />
      <Brands />
      <Footer />
      <ApiTest />
    </div>
  )
}

function App() {
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*')
      if (error) {
        console.error("Supabase fetch error:", error)
      } else {
        console.log("Supabase fetched products:", data)
      }
    }
    fetchProducts()
  }, [])

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/collections/wedding" element={<WeddingCollection />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/wishlist" element={<UserProtectedRoute><Wishlist /></UserProtectedRoute>} />
      <Route path="/cart" element={<UserProtectedRoute><Cart /></UserProtectedRoute>} />
      <Route path="/search" element={<Search />} />
      <Route path="/custom-jewelry" element={<CustomJewelry />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/profile"
        element={
          <UserProtectedRoute>
            <Profile />
          </UserProtectedRoute>
        }
      />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <UserProtectedRoute>
            <AdminLayout />
          </UserProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="offers" element={<AdminOffers />} />
      </Route>
    </Routes>
  )
}

export default App
