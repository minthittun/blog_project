import React, { useState, useEffect } from "react";
import { Card } from "antd";
import api from "../helper/RestApiHelper";
import AuthHelper from "../helper/AuthHelper";
import { useParams } from 'react-router-dom';
import BlogPostDetail from "../components/BlogPostDetail";


function BlogDetailPage() {
  const { id } = useParams();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  

  const [postData, setPostData] = useState({});

  

  
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get("posts/getbyid/" + id, {
          headers: { requireToken: true },
        });
        const data = response.data;
        setPostData(data);
        
      } catch (error) {
        setError("An error occurred while fetching posts.");
      }

      setLoading(false);
    };

    if(id){
      fetchPosts();
    }
  }, []);




  return (
    <div className="main-content-padding fade-in">
      <div className="left-right-container">
        <div>
          <div className="text-bold text-large-ex margin-default">Post Detail</div>
        </div>
        <div>
          
        
        </div>
      </div>
      <br />
      
      <BlogPostDetail postId={id} post={postData} />
      
      
    </div>
  );
}

export default BlogDetailPage;
