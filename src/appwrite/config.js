import conf from "../conf/conf";
import { Client, ID,Databases,Storage,Query } from "appwrite";

export class Service{
    client=new Client();
    databases;
    bucket;  //this is storage

    constructor(){
        this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);
        this.databases=new Databases(this.client);
        this.bucket=new Storage(this.client);
    }

    //work on database

    //note in below methods we are using slug as id of post, or we can use other methods like ID.unique()
    //to create document
    async createPost({title,slug,content,featuredImage,status,userId}){
        try{
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,  // we can give ID.unique(), instead of slug as documentId
                {title,content,featuredImage,status,userId}
            );
        }
        catch(error){
            console.log("Appwrite service :: createPost :: error ",error);
        }
    }
    
    //note in below methods we are using slug as id of post, or we can use other methods like ID.unique()
    async updatePost(slug,{title,content,featuredImage,status}){
        try{
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                }
            );
        }
        catch(error){
            console.log("Appwrite service :: updatePost :: error ",error);           
        }
    }

    async deletePost(slug){
        //slug is nothing but a post id
        try{
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );
            return true;
        }
        catch(error){
            console.log("Appwrite service :: deletePost :: error ",error);  
            return false;         
        }
    }

    //get single document we need to provide id of post
    async getPost(slug){
        //here slug is nothing but id of post
        try{
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );
        }
        catch(error){
            console.log("Appwrite service :: getPost :: error ",error);  
            return false;         
        }
    }

    //Get a list of all the user's documents 
    //note what ever indexes we have given to a specific collection we can use only that as key for query
    async getPosts(queries=[Query.equal('status', "active")]){
        try{
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
            );
        }
        catch(error){
            console.log("Appwrite service :: getPosts :: error ",error);  
            return false;         
        }
    }



    //Now:- bucket/storage for image

    //upload a file(i.e. image/video/..) and get resposnse as object which consist of fileId as $id
    async uploadFile(file){
        try{
            //it will return id of file uploaded
            //in this project we are uplaoding image so it will return image_id and this generated id we will use in database 
            const fileData= await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            );
            return fileData; //this fileData will be object consisting of $id
        }
        catch(error){
            console.log("Appwrite service :: uploadFile :: error ",error);  
            return false;         
        }
    }

    async deleteFile(fileId){
        try{
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true;
        }
        catch(error){
            console.log("Appwrite service :: deleteFile :: error ",error);  
            return false;         
        }
    }

    //
    getFilePreview(fileId){
        return this.bucket.getFilePreview(conf.appwriteBucketId,fileId);
    }
}

const service=new Service();

export default service;