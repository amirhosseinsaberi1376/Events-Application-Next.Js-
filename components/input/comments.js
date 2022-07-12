import { useContext, useEffect, useState } from "react";
import NotificationContext from "../../store/notification-context";
import CommentList from "./comment-list";
import NewComment from "./new-comment";
import classes from "./comments.module.css";

function Comments(props) {
  const { eventId } = props;
  const ctx = useContext(NotificationContext);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (showComments) {
      ctx.showNotification({
        title: "Receiving",
        message: "Getting comments...",
        status: "Pending",
      });
      fetch("/api/comments/" + eventId)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          return response.json().then((data) => {
            throw new Error(data.message || "Something went wrong.");
          });
        })
        .then((data) => {
          setComments(data.comments);
          ctx.showNotification({
            title: "Success!",
            message: "Comments received successfully!",
            status: "Success",
          });
        })
        .catch((error) => {
          ctx.showNotification({
            title: "Error!",
            message: error.message || "Something went wrong.",
            status: "Error",
          });
        });
    }
  }, [showComments]);

  function toggleCommentsHandler() {
    setShowComments((prevStatus) => !prevStatus);
  }

  function addCommentHandler(commentData) {
    ctx.showNotification({
      title: "Sending",
      message: "Sending your comment...",
      status: "Pending",
    });
    fetch("/api/comments/" + eventId, {
      method: "POST",
      body: JSON.stringify(commentData),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return response.json().then((data) => {
          throw new Error(data.message || "Something went wrong.");
        });
      })
      .then((data) => {
        ctx.showNotification({
          title: "Success!",
          message: "Your comment sent successfully!",
          status: "Success",
        });
      })
      .catch((error) => {
        ctx.showNotification({
          title: "Error!",
          message: error.message || "Something went wrong.",
          status: "Error",
        });
      });
  }

  return (
    <section className={classes.comments}>
      <button onClick={toggleCommentsHandler}>
        {showComments ? "Hide" : "Show"} Comments
      </button>
      {showComments && <NewComment onAddComment={addCommentHandler} />}
      {showComments && <CommentList items={comments} />}
    </section>
  );
}

export default Comments;
