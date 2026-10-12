import Link from "next/link";
import { LayoutDashboard, Store, Box, Users, Settings, LogOut } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-stone-100 flex text-sm font-sans text-stone-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-stone-200 flex flex-col fixed h-full">
        <div className="p-6 border-b border-stone-200">
          <h1 className="font-bold text-lg tracking-tight">Platform Admin</h1>
          <p className="text-xs text-stone-500 mt-1">Multi-Business Manager</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 bg-stone-100 text-black rounded-md font-medium">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-stone-50 rounded-md font-medium text-stone-600 transition-colors">
            <Store className="w-4 h-4" /> Businesses
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-stone-50 rounded-md font-medium text-stone-600 transition-colors">
            <Box className="w-4 h-4" /> Products
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-stone-50 rounded-md font-medium text-stone-600 transition-colors">
            <Users className="w-4 h-4" /> Customers
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-stone-50 rounded-md font-medium text-stone-600 transition-colors">
            <Settings className="w-4 h-4" /> Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-stone-200">
          <button className="flex items-center gap-3 px-3 py-2 w-full text-left text-red-600 hover:bg-red-50 rounded-md font-medium transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Overview</h2>
          <div className="flex gap-4">
            <Link href="/" className="px-4 py-2 border border-stone-300 rounded-md bg-white hover:bg-stone-50 transition-colors font-medium">
              View Profile
            </Link>
            <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-stone-800 transition-colors font-medium">
              + New Business
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <h3 className="text-stone-500 font-medium mb-1">Total Revenue</h3>
            <p className="text-3xl font-bold">PKR 450,200</p>
            <p className="text-xs text-emerald-600 mt-2 font-medium">+12.5% from last month</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <h3 className="text-stone-500 font-medium mb-1">Active Businesses</h3>
            <p className="text-3xl font-bold">1 <span className="text-lg font-normal text-stone-400">/ 3</span></p>
            <p className="text-xs text-stone-500 mt-2 font-medium">Perfume brand operating</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <h3 className="text-stone-500 font-medium mb-1">Total Orders</h3>
            <p className="text-3xl font-bold">124</p>
            <p className="text-xs text-emerald-600 mt-2 font-medium">4 pending fulfillment</p>
          </div>
        </div>

        {/* Business List */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-stone-200 flex justify-between items-center">
            <h3 className="font-bold text-lg">My Ventures</h3>
            <Link href="/admin/businesses" className="text-blue-600 hover:text-blue-700 font-medium">View All</Link>
          </div>
          <div className="divide-y divide-stone-200">
            <div className="p-6 flex justify-between items-center hover:bg-stone-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-stone-900 rounded-lg flex items-center justify-center text-white font-serif italic text-xl">A</div>
                <div>
                  <h4 className="font-bold text-base">Aura Fragrances</h4>
                  <p className="text-stone-500">E-commerce • Luxury Perfumes</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wide">Active</span>
                <Link href="/perfumes" className="text-stone-400 hover:text-black transition-colors">Open Store &rarr;</Link>
              </div>
            </div>
            
            <div className="p-6 flex justify-between items-center hover:bg-stone-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xl">Tech</div>
                <div>
                  <h4 className="font-bold text-base">Digital Services</h4>
                  <p className="text-stone-500">Agency • Web Development</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-bold uppercase tracking-wide">Draft</span>
                <button className="text-stone-400 hover:text-black transition-colors">Edit &rarr;</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
