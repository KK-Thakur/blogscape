import React, { useEffect, useState } from 'react'
import appwriteService from '../appwrite/config'
import { Container, PostCard } from '../components/index'
import { Query } from 'appwrite';
import { useSelector } from 'react-redux';


function AllPosts() {
    const [posts, setPosts]= useState([]);
    const userData = useSelector((state)=> state.auth.userData);
    
    useEffect(()=>{
        appwriteService.getPosts([Query.equal('userId', userData.$id)]).then((posts)=>{
            console.log(posts);
            if(posts){
                setPosts(posts.documents);
            }
        })
    },[])
    return (
        <div className='w-full py-8'>
        <Container>
            <div className='flex flex-wrap'>
                {posts.map((post)=>(
                    <div key={post.$id} className='p-2 w-1/4'>
                        {/* <PostCard post={post} /> */}
                        <PostCard {...post} />
                    </div>
                ))}
            </div>
        </Container>
        </div>
    )
}

export default AllPosts