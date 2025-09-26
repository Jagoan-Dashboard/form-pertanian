import { Outlet } from "react-router";
import { SiderbarMenu } from "../components/SiderbarMenu";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-[#F8F3F5]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-[300px,1fr] gap-6">
          {/* Sidebar Menu */}
          <SiderbarMenu />

          {/* Main Content */}
          <main className="space-y-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}