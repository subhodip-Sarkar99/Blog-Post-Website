import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"
import { toast } from "react-toastify";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";



export const DashSidebar = () => {
    const location = useLocation();
    const [tab, setTab] = useState('');
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
        //console.log(urlParams,' ->',tabFromUrl);
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

    return (
        <aside className="w-full p-6 sm:w-60 bg-gray-100 text-black font-Roboto font-bold md:min-h-screen">
            <nav className="space-y-8 text-sm">
                <div className="space-y-2">
                    <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-600"></h2>
                    <div className="flex flex-col space-y-1 text-lg">

                        {
                            currentUser && currentUser.userdata.isAdmin && (
                                <Link to='/dashboard?tab=dash' className="transition-all duration-150 hover:bg-slate-200 hover:rounded-xl p-1"
                                style={{ backgroundColor: tab === 'dash' ? 'gray' : '', borderRadius: '50px', padding: "0.35rem" }}
                            >
                                Dashboard
                            </Link>                             
                            )
                        }
                        <Link to='/dashboard?tab=profile' className="transition-all duration-150 hover:bg-slate-200 hover:rounded-xl p-1"
                            style={{ backgroundColor: tab === 'profile' ? 'gray' : '', borderRadius: '50px', padding: "0.35rem" }}
                        >
                            Profile
                        </Link>
                        {currentUser.userdata.isAdmin && (
                            <>
                                <Link to='/dashboard?tab=posts' className="transition-all duration-150 hover:bg-slate-200 hover:rounded-xl p-1"
                                    style={{ backgroundColor: tab === 'posts' ? 'gray' : '', borderRadius: '50px', padding: "0.35rem" }}
                                >
                                    Posts
                                </Link>

                                <Link to='/dashboard?tab=users' className="transition-all duration-150 hover:bg-slate-200 hover:rounded-xl p-1"
                                    style={{ backgroundColor: tab === 'users' ? 'gray' : '', borderRadius: '50px', padding: "0.35rem" }}
                                >
                                    Users
                                </Link>

                                <Link to='/dashboard?tab=comments' className="transition-all duration-150 hover:bg-slate-200 hover:rounded-xl p-1"
                                    style={{ backgroundColor: tab === 'comments' ? 'gray' : '', borderRadius: '50px', padding: "0.35rem" }}
                                >
                                    Comments
                                </Link>

                            </>
                        )}

                        <Link className="transition-all duration-150 hover:bg-slate-200 hover:rounded-xl p-1" onClick={handleSignout}>SignOut</Link>

                    </div>
                </div>
            </nav>
        </aside>
    )
}
