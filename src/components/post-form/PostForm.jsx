import React, { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import appwriteService from '../../appwrite/config';
import {Button, Input, RTE, Select} from '../index'


function PostForm({ post }) {
        const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
            defaultValues: {
                slug: post?.$id || "",
                title: post?.title || "",
                content: post?.content || "",
                status: post?.status || "active",
                featuredImage: post?.featuredImage || ''
            },
        });

        const navigate = useNavigate();
        const userData = useSelector((state) => state.auth.userData);

        //below data we will get from react-form-hook in object form only
        const submit = async (data) => {
            //Always firstly update file in storage so that you can use updated file_id to update image/video in database
            //first upload new file(here image) to storage and delete previos one beacuse there is no option of update file in storage, this will give new fileData and we can use its id to update featured image of database
            const fileData = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

            //if post is already there that is user need to update previous post otherwise create new post
            if (post) {

                //if new file upload we must delete previos one
                if (fileData) {
                    appwriteService.deleteFile(post.featuredImage);
                }

                //now update post
                const updatedDBPost = await appwriteService.updatePost(
                    post.$id,
                    { ...data, featuredImage: fileData ? fileData.$id : undefined }
                );

                if (updatedDBPost) {
                    navigate(`/post/${updatedDBPost.$id}`);
                }
            }
            else {
                data.featuredImage = fileData ? fileData.$id : undefined;
                const createdDBPost = await appwriteService.createPost({ ...data, userId: userData.$id });

                if (createdDBPost) {
                    navigate(`/post/${createdDBPost.$id}`);
                }
            }
        }

        //function to ttransform title to slug
        const slugTransform = useCallback((value) => {
            if (value && typeof value === 'string') {
                /*const slug = value.trim().toLowerCase().replace(/ /g, '-');
                //setValue('slug',slug);
                return slug
                */
                //or
                return value.trim().toLowerCase().replace(/[^a-zA-Z\d\s]+/g, "-").replace(/\s/g, "-");
            }
            return "";
        }, [])

        useEffect(() => {
            const subscription = watch((value, { name }) => {
                if (name === "title") {
                    setValue("slug", slugTransform(value.title), { shouldValidate: true });
                }
            });

            return () => subscription.unsubscribe();
        }, [watch, slugTransform, setValue])


        return (
            <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
                <div className="w-2/3 px-2">
                    <Input
                        label="Title :"
                        placeholder="Title"
                        className="mb-4"
                        {...register("title", { required: true })}
                    />
                    <Input
                        label="Slug :"
                        placeholder="Slug"
                        className="mb-4"
                        {...register("slug", { required: true })}
                        onInput={(e) => {
                            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                        }}
                    />
                    <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
                </div>
                <div className="w-1/3 px-2">
                    <Input
                        label="Featured Image :"
                        type="file"
                        className="mb-4"
                        accept="image/png, image/jpg, image/jpeg, image/gif"
                        {...register("image", { required: !post })}
                    />
                    {post && (
                        <div className="w-full mb-4">
                            <img
                                src={appwriteService.getFilePreview(post.featuredImage)}
                                alt={post.title}
                                className="rounded-lg"
                            />
                        </div>
                    )}
                    <Select
                        options={["active", "inactive"]}
                        label="Status"
                        className="mb-4"
                        {...register("status", { required: true })}
                    />
                    <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                        {post ? "Update" : "Submit"}
                    </Button>
                </div>
            </form>
        )
    }

export default PostForm