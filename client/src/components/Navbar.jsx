import { FaBars, FaMoon, FaSun, FaSearch } from "react-icons/fa";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { toast } from "react-toastify";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";


export const Navbar = () => {

    const { currentUser } = useSelector((state) => state.user);
    const { theme } = useSelector((state) => state.theme);
    const [searchTerm, setSearchTerm] = useState('');
    //console.log(theme);
    //console.log(currentUser);
    //console.log(searchTerm);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

    const handleSignout = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST'
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data);
                dispatch(signoutSuccess());
            } else {
                toast.error('SignOut Error');
            }
        } catch (error) {
            console.log('Signout Error');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    return (
        <>

            <header className="shadow-md w-full transition-all ease-in-out duration-300 transform">
                <div className="navbar">
                    <div className="navbar-start">
                        <div className="dropdown">
                            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                                <FaBars />
                            </div>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-base-100 rounded-box w-52">
                                <li><NavLink to="/">Home</NavLink></li>
                                <li>
                                    <p>Search <FaSearch /></p>
                                    <ul className="p-2">
                                        <li>
                                            <form onSubmit={handleSubmit}>
                                                <input type="text" placeholder="Search..." className="w-full font-Montserrat text-sm bg-slate-200 p-2 rounded-lg"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                            </form>
                                        </li>

                                    </ul>
                                </li>

                                <li><NavLink to="/about">About Us</NavLink></li>
                                <li><button onClick={() => dispatch(toggleTheme())}>Theme: <span>{theme === 'light' ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}</span></button></li>
                            </ul>
                        </div>
                        <a className="btn btn-ghost font-Pacifico text-xl lg:text-3xl lg:p-2">Blogs</a>

                    </div>
                    <div className="navbar-center hidden lg:flex font-Montserrat">
                        <ul className="menu menu-horizontal px-1 text-xl">
                            <li><NavLink to="/">Home</NavLink></li>

                            <li><NavLink to="/about">About Us</NavLink></li>
                            <li><button onClick={() => dispatch(toggleTheme())} className="btn btn-ghost">
                                {theme === 'light' ? <FaSun className="w-8 h-8" /> : <FaMoon className="w-8 h-8" />}
                            </button></li>
                        </ul>
                    </div>
                    <div className="navbar-end font-Montserrat">
                        <form onSubmit={handleSubmit}>
                            <input type="text" placeholder="Search..." className="lg:p-2 rounded-xl border-2 border-dashed border-gray-800 dark:border-bg-100 focus:border-0 max-lg:hidden"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}

                            />
                        </form>

                        {currentUser ?
                            (
                                <div className="dropdown dropdown-end mt-1">
                                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                        <div className="w-10 rounded-full">
                                            <img alt="Your profile" src={currentUser.userdata.profilePicture} />
                                        </div>
                                    </div>
                                    <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 font-Montserrat text-md">
                                        <li className="font-bold">
                                            <p className="justify-between">
                                                {currentUser.userdata.username}
                                            </p>
                                            <p className="truncate">
                                                {currentUser.userdata.email}
                                            </p>
                                            <hr />

                                        </li>
                                        <Link to={'dashboard?tab=profile'} className="hover:bg-slate-300 rounded-xl p-1">Profile</Link>
                                        <li><button className="m-0 hover:bg-slate-300 rounded-xl p-1" onClick={handleSignout}>Sign Out</button></li>
                                    </ul>
                                </div>
                            )
                            :
                            (
                                <div className="xl:m-4 lg:flex lg:flex-row">
                                    <NavLink to="login">
                                        <button className="btn btn-info lg:ml-2 mr-2 mb-1 text-white hover:bg-blue-600">
                                            Login
                                        </button>
                                    </NavLink>
                                    <NavLink to="sign-up">
                                        <button className="btn btn-info text-white hover:bg-blue-600 max-sm:hidden">
                                            Register
                                        </button>
                                    </NavLink>
                                </div>

                            )}



                    </div>
                </div>
            </header>


        </>
    )
}
