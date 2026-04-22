import { InstructorSidebar } from "@/Components/Instructor/Sidebar";
import { InstructorHeader } from "@/Components/Instructor/Header";

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <InstructorSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <InstructorHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
