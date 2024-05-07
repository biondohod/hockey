import { Route, Routes } from "react-router-dom";
import Main from "./_root/pages/Main/Main";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Authorization from "./_root/pages/Autorization/Authorization";

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="authorization" element={<Authorization />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
