import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="overflow-hidden bg-[#151627]">
      <Navbar />
      <div>
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;
