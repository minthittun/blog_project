import React, { useState, useEffect } from "react";
import { Alert, Button, Empty } from "antd";
import api from "../helper/RestApiHelper";
import Masonry from "react-masonry-css";
import { Link } from 'react-router-dom';
import {
  FileTextFilled
} from "@ant-design/icons";
import { useParams } from 'react-router-dom';
import MyPostItem from "../components/MyPostItem";



function MyBlogPage() {
  const { userId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  async function fetchPosts() {
    setLoading(true);
      setError(null);

      try {
        const response = await api.get(`posts/users/${userId}?page=${currentPage}&limit=10`, {
          headers: { requireToken: true },
        });
        const data = response.data;
        setPosts(posts => [...posts, ...data.rows]);
      } catch (error) {
        setError("An error occurred while fetching posts.");
      }

      setLoading(false);
  }

  const handlePageChange = () => {
    let page = currentPage
    page += 1;
    setCurrentPage(page);
  };

  const resetData = () => {
    setCurrentPage(1);
    setPosts([])
  };

  const handlePostRefreshFromChild = (data) => {
    setPosts([])
    setCurrentPage(1);
    fetchPosts();
  };
  

  return (
    <div className="main-content-padding fade-in">
      
      <div className="left-right-container">
        <span className="muted-text">What is in your mind? </span>
        <Link to="/writeBlog">
        <Button  type="primary" ><FileTextFilled /> Write a blog</Button>
      </Link>
        
      </div>
      <br />
      <h1 className="text-large-ex text-bold">My Post</h1> <br />

      {

        (posts.length > 0) ?
        <>
        <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {posts.map((post) => (
          <MyPostItem 
          refreshPostList={handlePostRefreshFromChild}
          post={post} 
          key={post.id} />
        ))}
      </Masonry>

      <div style={{textAlign: 'center'}}>
        <Button type="primary" onClick={handlePageChange}>Load More</Button>
        { /*<Button type="primary" onClick={resetData}>Reset</Button>*/}
      </div>
        </>:
        <div style={{textAlign: 'center'}}> 
          <br /><br /><br />
          <Empty />
        </div>

      }

      {loading && <b>Loading ....</b>}
      {error && <Alert message={error} type="error" />}
    </div>
  );
}

export default MyBlogPage;
