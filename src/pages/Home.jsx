import React, { useEffect, useState } from 'react'

import appwriteService from '../appwrite/config'
import { Container, PostCard } from '../components/index';
import { useSelector } from 'react-redux';


function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    //if user is loged-in or not
    const status =useSelector((state)=>state.auth.status);

    useEffect(() => {
        if(status){
            setLoading(true);
            appwriteService.getPosts().then((posts) => {
                if (posts) {
                    setPosts(posts.documents);
                    setLoading(false);
                    // console.log(posts.documents);
                }
            })
        }
        
    }, [])


    if (posts.length === 0) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                {(loading)? "Please Wait..." : ""}
                                {(!loading && status)? "Sorry No Active Post Available! You can create post" : ""}
                                {(!status)? "Login to read posts" : ""}
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
    
    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
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

export default Home