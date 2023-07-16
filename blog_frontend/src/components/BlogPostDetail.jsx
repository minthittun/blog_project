import React, { useState, useEffect } from "react";
import { Input, Alert, Card, Avatar, Row, Col } from "antd";
import moment from "moment";
import api from "../helper/RestApiHelper";
import { MessageFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

const { TextArea } = Input;

const BlogPostDetail = ({ postId, post }) => {
  let navigate = useNavigate();
  const formattedDate = moment(post.createdAt).fromNow();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("comments/posts/" + postId, {
        headers: { requireToken: true },
      });
      const data = response.data;
      setComments((comments) => [...comments, ...data]);
    } catch (error) {
      setError("An error occurred while fetching data.");
    }

    setLoading(false);
  }

  const handleRefreshCommentFromCommentForm = (childData) => {
    if (childData) {
      setComments([]);
      fetchData();
    }
  };

  const handleRefreshCommentFromCommentItem = (childData) => {
    if (childData) {
      setComments([]);
      fetchData();
    }
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={12} lg={12} xl={12}>
        <Card>
          {post.User && (
            <table>
              <tbody>
                <tr>
                  <td style={{ verticalAlign: "top" }}>
                    <Avatar style={{ verticalAlign: "middle" }} size="large">
                      {post.User.fullName.charAt(0)}
                    </Avatar>
                  </td>
                  <td>&nbsp;</td>
                  <td>
                    <span>{post.User.fullName}</span> <br />
                    <span className="text-small muted-text">
                      {formattedDate}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          )}
          <br />

          {
            (post.photo && post.photo != "" && post.photo != "null") &&
            <>
              <img
                alt="post detail"
                src={"http://localhost:3000/api/posts/showPostPhoto?postId=" + post.id}
                style={{ width: "100%" }}
              />
              <br />
              <br />
            </>
          }
          
          

          <h3>{post.title}</h3>

          <p className="text-small muted-text">
            <MessageFilled /> {post.commentCount} Comments
          </p>
          <p className="paragraph-justify">{post.content}</p>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={12} lg={12} xl={12}>
        <CommentForm
          postId={postId}
          refreshCommentList={handleRefreshCommentFromCommentForm}
        />

        <br />
        <Card>
          <h1 className="text-bold">Comments</h1>

          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} refreshCommentList={handleRefreshCommentFromCommentItem} />
          ))}

          {loading && <b>Loading ....</b>}
          {error && <Alert message={error} type="error" />}
        </Card>
      </Col>
    </Row>
  );
};

export default BlogPostDetail;
