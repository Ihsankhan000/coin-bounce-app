import styles from './Blog.module.css'
import { useState, useEffect } from 'react';
import Loader from '../../components/Loader/Loader';
import { getAllBlogs } from '../../api/internal';
import { useNavigate } from 'react-router-dom';


function Blog () {
    
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
     (async function getAllBlogsApiCall(){
        const response = await getAllBlogs();
        console.log(response.data.blogs);
        setBlogs(response.data.blogs);

        // if(response.status === 200){
        //     setBlogs(response.data.blogs)
        // }
     })();
    //  setBlogs([]);
    }, [])

    if(blogs.length === 0){
        return <Loader text="blogs" />
    }
    

    return(
        <div className={styles.blogsWrapper}>
            {
                blogs.map((blog) => (
                    <div id={blog._id} className={styles.blog} onClick={() => navigate(`/blog/${blog._id}`)} >
                        <img src={blog.photo}  />
                        <h1>{blog.title}</h1>
                        <p>{blog.content}</p>
                    </div>
                ))
            }
        </div>
    )
}

export default Blog ;