import React, { useState, useEffect } from "react";
import { Input, Button, Alert, Card } from "antd";
import api from "../helper/RestApiHelper";
import AuthHelper from "../helper/AuthHelper";
import { useParams } from 'react-router-dom';


const { TextArea } = Input;

function WriteBlogPage() {
  const { id } = useParams();
  
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  

  const [postData, setPostData] = useState({
    file: "", photo: "", title: "", content: "", status: false, userId: AuthHelper.getAuth().userId
  });

  

  
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
        console.log(data);
        
      } catch (error) {
        setError("An error occurred while fetching posts.");
      }

      setLoading(false);
    };

    if(id){
      fetchPosts();
    }
  }, []);


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setPostData((prevData) => ({
      ...prevData,
      file: file,
    }));
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setPostData({ ...postData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    
    if(postData.title != "" && postData.content != ""){
      if(id) {
        updateData(id);
      } else {
        newData();
      }
    } else {
      setError("Please enter required fields.");
    }

    setLoading(false);
  };

  const newData =()=> {

    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    formData.append('status', postData.status);
    formData.append('userId', postData.userId);
    formData.append('file', postData.file);


    api.post("posts/addnew", 
    formData,
    { headers: { requireToken: true }}
    )
    .then(res => {
      
      if (res.status === 200) {
        setSaved(true);
      } else {
        setError('Unknown error occurred.');
      }
    }).catch(function(error){
      
      setError('Unknown error occurred.');

    });
  }

  const updateData =(id)=> {
    
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    formData.append('status', postData.status);
    formData.append('photo', postData.photo);
    formData.append('file', postData.file);
    
    api.put("posts/update/"+id, 
    formData,
    { headers: { requireToken: true }}
    )
    .then(res => {
      
      if (res.status === 200) {
        setSaved(true);
      } else {
        setError('Unknown error occurred.');
      }
    }).catch(function(error){
      
      setError('Unknown error occurred.');

    });
    
    
  }
  

  return (
    <div className="main-content-padding fade-in">
      <div className="left-right-container">
        <div>
          <div className="text-bold text-large-ex margin-default">Write blog</div>
          <p className="muted-text">What is in your mind? </p>
        </div>
        <div>
          
        
        </div>
      </div>
      <br />
      
      <Card>
        
        <form onSubmit={handleSubmit} >
          <input type="file" name="file" onChange={handleFileChange} /> <br /><br />

          <label>Title</label>
          <Input autoComplete="off" type="text" name="title" value={postData.title} onChange={handleChange} placeholder="Title" /> <br /><br />
          <label>Content</label>
          <TextArea rows={4} type="text" name="content" value={postData.content} onChange={handleChange} placeholder="Content" />
          <br /><br />
          <label>
            <input type="checkbox" name="status" checked={postData.status} onChange={handleChange} />
            &nbsp; Draft / Publish
          </label>
          <br /><br />
          <Button type="primary" htmlType="submit" disabled={loading} >
            {loading ? 'Saving ....' : 'Save'}
          </Button>
        </form>
        <br />

        {saved && <Alert message="Content successfully saved." type="success" />}
        {error && <Alert message={error} type="error" />}
      </Card>
    </div>
  );
}

export default WriteBlogPage;
