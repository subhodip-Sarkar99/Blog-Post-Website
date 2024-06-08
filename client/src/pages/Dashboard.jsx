import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import { DashSidebar } from "../components/DashSidebar";
import { DashProfile } from "../components/DashProfile";
import { DashPosts } from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashboardComp from "../components/DashboardComp";

export const Dashboard = () => {
    const location= useLocation();
    const [tab,setTab]=useState('');
    
    
    useEffect(()=>{
        const urlParams=new URLSearchParams(location.search);
        const tabFromUrl=urlParams.get('tab');
        if(tabFromUrl){
        setTab(tabFromUrl);
        }
        //console.log(urlParams,' ->',tabFromUrl);
    },[location.search]);
  return (
    <div className="flex flex-col md:flex-row justify-start">
        <div>
            {/* Sidebar */}
            <DashSidebar/>
        </div>
        <div className="p-3 w-full">
            {/* profile */}
            {tab==='profile'&& <DashProfile />}
            
            
            
            {/* Posts */}
            { tab==='posts' && <DashPosts />}

            {/* Users */}
            {tab==='users' && <DashUsers />}

            {/* Comments */}
            {tab==='comments' && <DashComments />}

            {/*Admin Dashboard Component */}
            {tab==='dash' && <DashboardComp />}

            
          </div>
    </div>
  )
}
