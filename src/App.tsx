import { Route, Routes } from "react-router-dom";
import Main from "./_root/pages/Main/Main";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Authorization from "./_root/pages/Autorization/Authorization";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path={`auth/:type`} element={<Authorization />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="bottom-right"/>
    </>
  );
}

export default App;
