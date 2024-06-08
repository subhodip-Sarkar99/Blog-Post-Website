/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { motion, useInView } from "framer-motion";
import { useEffect, useRef } from 'react';

export default function PostCard({ post }) {

    //console.log(post);
    const ref = useRef();
    const isInView = useInView(ref,{once:true});
    useEffect(() => {
        //console.log(isInView);
    }, [isInView]);

    return (
        <motion.div
            initial={{
                y: -150,
            }}
            animate={{
                y: isInView && [180, -30],

            }}
            transition={{
                duration: 2,
                ease: "backInOut"
            }}
        >
            <div ref={ref} >
            <div className='group relative w-full border h-[400px] overflow-hidden rounded-lg sm:w-[350px] border-teal-500 hover:border-2 hover:h-[400px] transition-all mt-8'>
                <Link to={`/post/${post.slug}`} className='mb-4'>
                    <img src={post.image} alt={post.title} className='h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20' />
                    <div className='p-3 flex flex-col gap-2'>
                        <p className='font-RobotoSlab text-lg font-semibold line-clamp-2'>{post.title}</p><span className='italic text-sm'>{post.category}</span>
                        <p className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2 font-semibold'>
                            Read Article
                        </p>
                    </div>

                </Link>
            </div>
            </div>
        </motion.div>

    );
}
