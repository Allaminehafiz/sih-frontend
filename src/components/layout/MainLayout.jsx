import Sidebar from "./Sidebar";
import Header from "./Header";

const MainLayout = ({ children, activePage, onNavigate, onLogout, user }) => {
  console.log("MainLayout user:", user);
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activePage={activePage} onNavigate={onNavigate} onLogout={onLogout} user={user} />
      <div className="lg:ml-64">
        <Header user={user} />
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;