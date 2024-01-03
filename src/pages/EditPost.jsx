import React, { useEffect, useState } from 'react'
import { Container, PostForm } from '../components/index'
import appwriteService from '../appwrite/config'
import { useNavigate, useParams } from 'react-router-dom';

function EditPost() {
    const [post, setPost] = useState(null);

    const { slug } = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        //if there is slug then we need to store current data's of that post
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                // console.log(post , post.message);  //why not post.message here same as allposts
                if (post) {
                    setPost(post);
                }
            })
        }
        else {
            navigate('/');
        }
    }, [slug, navigate]);


    return (
        <>
            {post ? (
                <div className='py-8'>
                    <Container>
                        <PostForm post={post} />
                    </Container>
                </div>
            ) :
                null
            }
        </>
    )
}

export default EditPost