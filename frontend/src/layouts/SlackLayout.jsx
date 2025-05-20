// layouts/SlackLayout.jsx
import Sidebar from '../components/Sidebar';

const SlackLayout = ({ topbar, children }) => {
  return (
    <div className="flex h-screen bg-[#1e1f22] text-white">
      <Sidebar />
      <div className="flex flex-col flex-1 bg-[#2c2d31]">
        {/* Top bar */}
        <div className="h-12 px-4 flex items-center border-b border-[#3a3b40] bg-[#2c2d31]">
          {topbar}
        </div>
        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
};

export default SlackLayout;
