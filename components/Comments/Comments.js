import { Fragment, useContext, useState } from "react";
import { UserContext } from "../../lib/context/userContext";
import { serverTimestamp, increment } from "../../lib/firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Form from "./Form";
import Comment from "./Comment";
import AuthCheck from "../AuthCheck";
import LoginAlert from "../LoginAlert";
import formStyles from "./styles/Form.module.css";
import { toast } from "react-hot-toast";

export default function Comments({ postRef }) {
  const query = postRef
    .collection("comments")
    .orderBy("createdAt", "desc")
    .where("parentId", "==", postRef.id);

  const [comments] = useCollectionData(query, {
    idField: "id",
  });

  const [isAlertLoginVisible, setIsAlertLoginVisible] = useState(false);

  const alertForLogin = () => {
    setIsAlertLoginVisible(true);
  };

  return (
    <Fragment>
      {isAlertLoginVisible && (
        <LoginAlert setIsAlertLoginVisible={setIsAlertLoginVisible} />
      )}
      <div className="card">
        <h2>Comments</h2>

        <AuthCheck
          fallback={
            <div className={formStyles.container}>
              <img src="/user.svg" alt="user" />
              <div className={formStyles.form}>
                <textarea
                  name="body"
                  value=""
                  readOnly
                  placeholder="Add to the discussion..."
                  onClick={alertForLogin}
                />
              </div>
            </div>
          }
        >
          <AddComment postRef={postRef} />
        </AuthCheck>

        {comments &&
          comments.map(comment => (
            <Comment
              comment={comment}
              postRef={postRef}
              key={comment.id}
              setIsAlertLoginVisible={setIsAlertLoginVisible}
              level={1}
            />
          ))}
      </div>
    </Fragment>
  );
}

const AddComment = ({ postRef }) => {
  const { user, username } = useContext(UserContext);
  const initialValues = {
    body: "",
    heartCount: 0,
    replies: [],
    createdAt: serverTimestamp(),
    parentId: postRef.id,
  };

  const handleSubmit = async (values, actions) => {
    const data = {
      ...values,
      author: {
        username,
        displayName: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
      },
    };
    try {
      await postRef.collection("comments").add(data);
      await postRef.update({ commentCount: increment(1) });
      actions.resetForm();
      toast.success("Comment added successfully!");
    } catch (e) {
      console.log(e);
    }
  };
  return <Form initialValues={initialValues} handleSubmit={handleSubmit} />;
};
