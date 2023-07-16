import React from 'react';
import { Card, Badge, Button } from 'antd';
import moment from 'moment';
import api from '../helper/RestApiHelper';
import {
  MessageFilled,
  EditFilled,
  DeleteFilled
} from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';


const MyPostItem = ({ post, refreshPostList }) => {
  let navigate = useNavigate();
  const formattedDate = moment(post.createdAt).fromNow();

  const postDetail =()=> {
    
    navigate("/writeBlog/" + post.id);
    
  }

  const deletePost =async ()=> {
    
    try {
      const response = await api.delete("posts/deletepost/" + post.id, {
        headers: { requireToken: true },
      });

      refreshPostList(true);
      
    } catch (error) {
      
      
    }
    
  }

  return (
    <div className="masonry-grid-item">
      <Card
            cover={
              (post.photo && post.photo != "" && post.photo != "null") && <img
              alt="example"
              src={"http://localhost:3000/api/posts/showPostPhoto?postId=" + post.id}
            />
            }
          >
            <h3>{post.title}</h3>

            <p className='text-small muted-text'><MessageFilled /> { post.commentCount } Comments</p>

            

            {
              post.status ? 
              <>
                <Badge status="success" /> &nbsp; <span className='text-bold muted-text text-small'>Published</span>
              </>
              : <><Badge status="processing" /> &nbsp; <span className='text-bold muted-text text-small'>Draft</span></>
            }
            <br /><br />
            
            <Button type='primary' style={{background: "#faad14"}} onClick={postDetail}><EditFilled /></Button> &nbsp;
            <Button type='primary' danger onClick={deletePost}><DeleteFilled /></Button>

          </Card>
    </div>
  );
};

export default MyPostItem;
