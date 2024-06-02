import {Route, Routes} from "react-router-dom";
import Main from "./_root/pages/Main/Main";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Authorization from "./_root/pages/Autorization/Authorization";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import Profile from "./_root/pages/Profile/Profile";
import CreateCompetition from "./_root/pages/Competitions/CreateCompetition";
import AllCompetitions from "./_root/pages/Competitions/AllCompetitions";
import Competition from "./_root/pages/Competitions/Competition";

function App() {
    return (
        <>
            <Header/>
            <main>
                <Routes>
                    {/* Auth Routes */}
                    <Route element={<AuthLayout/>}>
                        <Route path={`/auth/:type`} element={<Authorization/>}/>
                    </Route>

                    {/* Public Routes */}
                    <Route path="/" element={<Main/>}/>

                    {/* Private Routes */}
                    <Route element={<RootLayout/>}>
                        <Route path={`/profile/:id`} element={<Profile/>}/>
                        <Route path={`/createCompetition`} element={<CreateCompetition/>}/>
                        <Route path={`/AllCompetitions/:type`} element={<AllCompetitions/>}/>
                        <Route path={`/competition/:id/:type`} element={<Competition/>}/>
                    </Route>
                </Routes>
            </main>
            <Footer/>
            <ToastContainer position="bottom-right"/>
        </>
    );
}

export default App;
