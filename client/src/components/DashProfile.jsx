import { useEffect, useRef } from "react";
import { useState } from "react";
import { useSelector } from "react-redux"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure,deleteUserStart,deleteUserSuccess,deleteUserFailure,signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { MdOutlineWarningAmber } from "react-icons/md";
import { toast } from "react-toastify"; 
import { Link } from "react-router-dom";


export const DashProfile = () => {

    const { currentUser,loading } = useSelector((state) => state.user);

    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imgFileUploadingProgress, setImgFileUploadingProgress] = useState(null);
    const [imgFileUploadError, setImgFileUploadError] = useState(null);
    const [imgFileUploading, setImgFileUploading] = useState(false);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [formData, setFormData] = useState({});
    const filePickerRef = useRef();
    const dispatch = useDispatch();
    //console.log(imgFileUploadingProgress,'upload error->',imgFileUploadError);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }

    };
    //console.log(imageFile,'URL->',imageFileUrl);
    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);

    const uploadImage = async () => {
        //console.log(`uploading img ...`);
        setImgFileUploading(true);
        setImgFileUploadError(null);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImgFileUploadingProgress(progress.toFixed(0));
            },
            (error) => {
                setImgFileUploadError('Could not upload image (File must be less than 2 MB)');
                setImgFileUploadingProgress(null);
                setImageFile(null);
                setImageFileUrl(null);
                setImgFileUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                    setFormData({ ...formData, profilePicture: downloadURL });
                    setImgFileUploading(false);
                });
            }
        );

    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };
    //console.log(formData);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);

        if (Object.keys(formData).length === 0) {
            setUpdateUserError("No changes Made");
            return;
        }
        //console.log(imgFileUploading);
        if (imgFileUploading) {
            setUpdateUserError("Please wait for the image to upload");
            return;
        }
        try {
            //console.log(formData);
            dispatch(updateStart());
            const res = await fetch(`/api/user/update/${currentUser.userdata._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (res.ok) {

                setUpdateUserSuccess("User's Profile updated successfully")
                dispatch(updateSuccess(data));
            } else {

                setUpdateUserError(data.extraDetails ? data.extraDetails : data.message);
                dispatch(updateFailure());
            }
        } catch (error) {
            setUpdateUserError("Internal Server error");
            dispatch(updateFailure());
            console.log('Updating user Error', error);
        }
    };

    const handleDeleteUser=async()=>{
        try {
            dispatch(deleteUserStart());
            const res= await fetch(`/api/user/delete/${currentUser.userdata._id}`,{
                method:'DELETE',

            });
            const data=await res.json();
            if(!res.ok){
                dispatch(deleteUserFailure());
            }else{
              dispatch(deleteUserSuccess(data));
              toast.success(data);  
            }
            
        } catch (error) {
            dispatch(deleteUserFailure());
        }
    };

    const handleSignout=async()=>{
        try {
            const res= await fetch('/api/user/signout',{
                method: 'POST'
            });
            const data=await res.json();
            if(res.ok){
                toast.success(data);
                dispatch(signoutSuccess());
            }else{
                toast.error('SignOut Error');
            }
        } catch (error) {
            console.log('Signout Error');
        }
    };

    return (
        <div className="max-w-lg mx-auto ">
            <h1 className="text-center font-RobotoSlab font-bold my-7 text-3xl">Profile</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-Montserrat">
                <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden />

                <div className="relative w-32 h-32 self-center cursor-pointer" onClick={() => filePickerRef.current.click()}>
                    {imgFileUploadingProgress &&
                        (<CircularProgressbar value={imgFileUploadingProgress || 0} text={`${imgFileUploadingProgress}%`}
                            strokeWidth={5}
                            styles={{
                                root: {
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                },
                                path: {
                                    stroke: `rgb(62,152,199, ${imgFileUploadingProgress / 100})`,
                                }
                            }}
                        />)
                    }
                    <img src={imageFileUrl || currentUser.userdata.profilePicture} alt="profile image"
                        className={`rounded-full w-full h-full object-cover border-8 border-gray-300 cursor-pointer shadow-md overflow-hidden"
                        ${imgFileUploadingProgress && imgFileUploadingProgress < 100 && 'opacity-60'}`}
                    />
                </div>

                {imgFileUploadError &&
                    <div role="alert" className="alert alert-error font-bold">
                        <span>🚧 {imgFileUploadError}</span>
                    </div>
                }

                <input type="text" id="username" placeholder="Username..." defaultValue={currentUser.userdata.username} onChange={handleChange} className="p-2 rounded-xl border-2 border-blue-400" />
                <input type="text" id="email" placeholder="Email..." defaultValue={currentUser.userdata.email} onChange={handleChange} className="p-2 rounded-xl border-2 border-blue-400" />
                <input type="text" id="password" placeholder="Pasword" onChange={handleChange} className="p-2 rounded-xl border-2 border-blue-400" />

                <button className="btn btn-info focus:scale-75"
                disabled={loading || imgFileUploading}
                >
                    {loading?'Loading...':'Update'}
                </button>
                
                {currentUser.userdata.isAdmin &&(
                    <Link to={'/create-post'}>
                    <button className="btn btn-accent w-full">Create a new Post</button>
                    </Link>
                )}
            </form>
            <div className="mt-5 text-red-500 font-Montserrat font-semibold flex justify-between">
                <span onClick={() => document.getElementById('my_modal_2').showModal()} className="cursor-pointer ml-2">Delete Account</span>
                <dialog id="my_modal_2" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg"><MdOutlineWarningAmber className="h-12 w-12 text-red-600"/><span>Are you sure you want to delete your account?</span></h3>
                        <div className="flex flex-row justify-between">
                            <button className="w-full mt-2 btn btn-error text-white" onClick={handleDeleteUser}>Yes, Delete</button>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
                
                <span className="cursor-pointer mr-3" onClick={handleSignout}>SignOut</span>
            </div>
            {updateUserSuccess && (
                <div role="alert" className="alert alert-success mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Your Profile Updated Successfully!</span>
                </div>
            )}
            {updateUserError && (
                <div role="alert" className="alert alert-error mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{updateUserError}</span>
                </div>
            )}



        </div>
    )
}
