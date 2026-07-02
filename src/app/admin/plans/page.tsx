import { prisma } from "@/lib/db/prisma";
import { createPlan, updatePlan } from "@/app/actions/plan.actions";
import { Package } from "lucide-react";

export default async function AdminPlansPage() {
  const plans = await prisma.plan.findMany({
    orderBy: { price: "asc" }
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscription Plans</h1>
          <p className="text-gray-500 mt-2">Manage pricing tiers and credit allocations.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Create New Plan</h2>
        <form action={createPlan} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
            <input type="text" name="name" placeholder="e.g. Enterprise" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
            <input type="number" step="1" name="price" placeholder="4999" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Credits Yield</label>
            <input type="number" step="1" name="credits" placeholder="10000" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <input type="text" name="description" placeholder="For large teams" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500" required />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 h-10">
            Create Plan
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
            {!plan.isActive && <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">Archived</div>}
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-blue-500" />
                {plan.name}
              </h3>
              <p className="text-sm text-gray-500 h-10">{(plan.features as any)?.description || "No description"}</p>
              
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-gray-900">₹{plan.price}</span>
                <span className="text-gray-500">/mo</span>
              </div>
              
              <div className="mt-4 bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                <span className="font-bold text-blue-700">{plan.credits} Credits</span>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <form action={updatePlan.bind(null, plan.id)} className="flex items-center justify-between">
                <input type="hidden" name="name" value={plan.name} />
                <input type="hidden" name="price" value={plan.price} />
                <input type="hidden" name="credits" value={plan.credits} />
                <input type="hidden" name="description" value={(plan.features as any)?.description || ""} />
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="isActive" defaultChecked={plan.isActive} className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
                
                <button type="submit" className="text-sm text-blue-600 hover:underline font-medium">
                  Update
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
