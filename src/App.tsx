import { Route, Routes } from "react-router-dom";
import Main from "./_root/pages/Main/Main";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Authorization from "./_root/pages/Autorization/Authorization";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path={`/auth/:type`} element={<Authorization />} />
          </Route>

          {/* Public Routes */}
          <Route path="/" element={<Main />} />

          {/* Private Routes */}
          <Route element={<RootLayout />}>
            <Route path="/private" element={<div>Private route</div>} />
          </Route>
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;
