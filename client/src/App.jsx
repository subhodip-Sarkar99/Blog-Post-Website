import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { FourOFour } from "./pages/FourOFour";
import { Navbar } from "./components/Navbar";
import { AboutUs } from "./pages/AboutUs";
import { TopPosts } from "./pages/TopPosts";
import { Dashboard } from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import { CreatePost } from "./pages/CreatePost";
import { UpdatePost } from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
import ScrollToTop from "./components/ScrollToTop";
import Search from "./pages/Search";
import Footer from "./components/Footer";

const App = () => {
  return (
    <>
    <BrowserRouter>
    <ScrollToTop/>
    <Navbar />
     <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/sign-up" element={<SignUp/>} />
        <Route path="/search" element={<Search/>} />
        <Route element={<PrivateRoute/>}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute/>}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="/about" element={<AboutUs/>}></Route>
        <Route path="/top-posts" element={<TopPosts/>}></Route>
        <Route path="/post/:postSlug" element={<PostPage/>}></Route>
        <Route path="*" element={<FourOFour />} />
     </Routes>
    </BrowserRouter>
    <Footer />
    </>
  )
}

export default App