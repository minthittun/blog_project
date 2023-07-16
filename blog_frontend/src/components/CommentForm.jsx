import React, { useState } from "react";
import { Input, Button, Card, Alert } from "antd";
import AuthHelper from "../helper/AuthHelper";
import api from "../helper/RestApiHelper";

const { TextArea } = Input;

const CommentForm = ({ postId, refreshCommentList }) => {
  // Comments
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const [commentData, setCommentData] = useState({
    postId: parseInt(postId),
    userId: AuthHelper.getAuth().userId,
    content: "",
  });

  const handleChange = (e) => {
    setCommentData({ ...commentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    if (commentData.content != "") {
      await api
        .post("comments", commentData, { headers: { requireToken: true } })
        .then((res) => {
          if (res.status === 200) {
            setSaved(true);
            refreshCommentList(true);

            // reset data
            setCommentData({ ...commentData, content: "" })
          } else {
            setError("Unknown error occurred.");
          }
        })
        .catch(function (error) {
          
          setError("Unknown error occurred.");
        });
    } else {
      setError("Please enter required fields.");
    }

    setLoading(false);
  };

  // Comments

  return (
    <Card style={{ width: "100%" }}>
      <h1 className="text-bold">Write Comment:</h1>

      <form onSubmit={handleSubmit}>
        <TextArea
          rows={3}
          type="text"
          name="content"
          value={commentData.content}
          onChange={handleChange}
          placeholder="Content"
        />

        <br />
        <br />
        <Button type="primary" htmlType="submit" disabled={loading}>
          {loading ? "Saving ...." : "Save"}
        </Button>
      </form>
      <br />
      {saved && <Alert message="Comment successfully saved." type="success" />}
      {error && <Alert message={error} type="error" />}
    </Card>
  );
};

export default CommentForm;
