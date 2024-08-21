import React, { useEffect, useState } from 'react'
import './Posts.css'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Posts = ({ username }) => {

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
                const sortedPosts = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setPosts(sortedPosts);
              })
          }, []);
      
        const handleOnChange = (e) => {
            const {name, value} = e.target;
            setPostData(
              {
                ...postData,
                [name]: value, 
                date: new Date().toISOString() 
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
                    setValue(0);
                    navigate('/posts');
                    window.location.reload();
                    
                  })
                }
          }


          const deletePost = (id) =>{
            axios.delete(`http://localhost:3001/posts/${id}`)
            .then(response => {
              setPostData(posts.filter(post => post.id !== id));
            })
            .catch(error => {
              alert(error);
            });
            alert(`Post has been deleted successfully`)
            window.location.reload();
         }

          const [currentPage, setCurrentPage] = useState(1);
          const itemsPerPage = 5;
        
          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const paginatedItems = posts.slice(startIndex, endIndex);
          const totalPages = Math.ceil(posts.length / itemsPerPage);

          const handlePageChange = (newPage) => {
            setCurrentPage(newPage);
          };

          const formatDate = (dateString) => {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${day}-${month}-${year} | ${hours}:${minutes}`;
          };
          

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
             {paginatedItems.length === 0 ? (
              <p style={{color:'white'}}>No Posts Found</p>
            ) : (
              paginatedItems.map((post) => (
                <Accordion
                  className='post-content'
                  sx={{ width: '850px', background: 'rgba(255, 255, 255, 0.6)' }}
                  key={post.id}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    <div className='accordian-summary'>
                      <h2>Title: {post.title.toUpperCase()}</h2>
                      <p className='post-created'>Created on: {formatDate(post.date)}</p>
                      {username === 'admin' && (
                        <p className='delete-post' onClick={() => deletePost(post.id)}>Delete post</p>
                      )}
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <p>{post.content}</p>
                  </AccordionDetails>
                </Accordion>
              ))
            )}

        
           <div className={`pagination ${currentPage === 1 ? 'align-right' : ''}`}>
              {currentPage > 1 && (
                <button onClick={() => handlePageChange(currentPage - 1)}>Previous page</button>
              )}
              {currentPage < totalPages && (
                <button onClick={() => handlePageChange(currentPage + 1)}>Next page</button>
              )}
          </div> </>
        
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