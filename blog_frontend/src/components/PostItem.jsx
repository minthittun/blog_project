import React from 'react';
import { Card, Avatar } from 'antd';
import moment from 'moment';
import {
  MessageFilled
} from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';


const PostItem = ({ post }) => {
  let navigate = useNavigate();
  const formattedDate = moment(post.createdAt).fromNow();

  const postDetail =()=> {
    navigate("/postDetail/" + post.id);
  }

  return (
    <div className="masonry-grid-item">
      <Card
          onClick={postDetail}
            hoverable
            cover={
              (post.photo && post.photo != "" && post.photo != "null") && <img
              alt="example"
              src={"http://localhost:3000/api/posts/showPostPhoto?postId=" + post.id}
            />
            }
          >
            <h3>{post.title}</h3>

            <p className='text-small muted-text'><MessageFilled /> { post.commentCount } Comments</p>

            <table >
              <tbody>
                <tr>
                  <td style={{verticalAlign: "top"}}>
                  <Avatar style={{  verticalAlign: 'middle' }} size="large">{ post.User.fullName.charAt(0) }</Avatar>
                  </td>
                  <td>&nbsp;</td>
                  <td>
                  <span>{post.User.fullName}</span> <br />
                  <span className='text-small muted-text'>{formattedDate}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            
            
          </Card>
    </div>
  );
};

export default PostItem;
