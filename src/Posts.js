import React, { useEffect, useState } from 'react'
import './Posts.css'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Posts = () => {

    const [value, setValue] = useState(0);
    const [errors, setErrors] = useState({})
    


    const handleChange = (event, newValue) => {
        setValue(newValue);
      };

      
      const [postData,setPostData] = useState(
        {
          title: "",
          content: ""
        }
        )


        const [posts, setPosts] = useState([]);
        const navigate = useNavigate()

        useEffect(() => {
            axios.get('http://localhost:3001/posts')
              .then(response => {
                console.log('Fetched posts:', response.data);
                setPosts(response.data);
              })
          }, []);
      
        const handleOnChange = (e) => {
            const {name, value} = e.target;
            setPostData(
              {
                ...postData,
                [name]: value
              }
            )
          }

          const handlePost = (e) => {
            e.preventDefault();

            const newErrors = {};
            const existingTitle = posts.find(post => post.title === postData.title)
  
            if (existingTitle) {
              newErrors.title = 'Title already exists';
            }

            setErrors(newErrors);


            if (Object.keys(newErrors).length === 0) {
            axios.post("http://localhost:3001/posts", postData)
                  .then(res => {
                    console.log(res.data);
                    setValue(0);
                    navigate('/Posts');
                    window.location.reload();
                    
                  })
                }
          }

         

          const handleDelete = (index) => {
            console.log(index);
            axios.get("http://localhost:3001/posts")
              .then(response => {
                console.log('Fetched posts:', response.data);
                const updatedPosts = posts.filter((post, i) => i !== index);
                setPosts(updatedPosts);
                setPostData(updatedPosts);
                console.log('Updated posts:', updatedPosts);
                localStorage.setItem("Updated posts", updatedPosts)
                })
            }
        

  return (
    <>
    <div className="posts">

        <div className="post-container">
        <Box className='post-nav' sx={{ borderBottom: 1, borderColor: 'divider', background: 'rgba(255, 255, 255, 0.8)'}} >
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered sx={{ width: '1000px' }}>
                <Tab label="View posts" />
                <Tab label="Add post" />
            </Tabs>
        </Box>
        
        <div className="post-content-container">

        {value === 0 && (
            <>
            {posts.map((post,index) => (
                
                <Accordion className='post-content' sx={{ width: '800px', background: 'rgba(255, 255, 255, 0.6)'}}  key={post.id}>
                    
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                        
                        >
                        <div className='accordian-summary'>
                          <h2>Title: {post.title.toUpperCase()}</h2>
                          Read post
                        {/* <DeleteIcon className='delete-btn' role="button" onClick={() => handleDelete(index)}/> */}
                        </div>
                    </AccordionSummary>
                    
                    <AccordionDetails>
                    <p>{post.content}</p>                   
                    </AccordionDetails>
                    
                </Accordion>
                
        ))}
            </>
        )}
        
        {value === 1 && (
            <>
                <form  className="post-form"  onSubmit={handlePost}>
                    <div className='post-title'>Add Posts</div>
                    <input
                    className='input-field'
                    type="text"
                    name="title"
                    value={postData.title}
                    onChange={handleOnChange}
                    placeholder="Enter title for the post"
                    required> 
                    </input>
                    {errors.title && <p className="error">{errors.title}</p>}
                    <textarea
                    className='input-field'
                    type="text"
                    name="content"
                    value={postData.content}
                    onChange={handleOnChange}
                    placeholder="Type your content"
                    rows={5}
                    required
                    />
                    <button type='submit'>Post</button>
                </form>
            </>
        )}
        </div>
    </div>
    </div>
    </>
  )
}


export default Posts