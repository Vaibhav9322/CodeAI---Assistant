import Sidebar from "./Sidebar";

const Layout = ({ children }) => (
  <div className="flex min-h-screen bg-dark-900">
    <Sidebar />
    <main className="flex-1 overflow-hidden">{children}</main>
  </div>
);

export default Layout;
