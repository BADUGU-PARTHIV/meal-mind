import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function MainLayout({ children }) {

  return (

    <div className="d-flex">

      <Sidebar />

      <div className="main-content">

        <Navbar />

        <div className="p-4">

          {children}

        </div>

      </div>

    </div>

  );

}

export default MainLayout;
