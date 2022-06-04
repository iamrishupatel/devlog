import { Fragment, useContext, useState } from "react";
import Link from "next/link";
import s from "./styles/Comments.module.css";
import { UserContext } from "../../lib/context/userContext";
import { db, auth } from "../../lib/firebase";
import { useDocument, useDocumentData } from "react-firebase-hooks/firestore";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import { RiChat1Line } from "react-icons/ri";
import { HiDotsVertical } from "react-icons/hi";
import { FiEdit } from "react-icons/fi";
import { getFormatedTimestamp } from "../../lib/helpers";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-hot-toast";
import Form from "./Form";
import PopConfirm from "../PopConfirm";
import AuthCheck from "../AuthCheck";
import {
  doc,
  writeBatch,
  updateDoc,
  serverTimestamp,
  addDoc,
  collection,
  increment,
  arrayUnion,
} from "firebase/firestore";

import MarkdownPreview from "../../components/MarkdownPreview";

export default function Comment({
  comment,
  postRef,
  level,
  setIsAlertLoginVisible,
}) {
  const commentRef = doc(postRef, "comments", comment.id);

  const [showReply, setShowReply] = useState(false);

  const alertForLogin = () => {
    setIsAlertLoginVisible(true);
  };

  /**
   * check if comment has nested children
   * if yes then render replies
   *
   * */
  let replies;
  if (comment.replies.length > 0) {
    replies = comment.replies.map(commentRef => (
      <Reply
        key={commentRef.id}
        commentRef={commentRef}
        postRef={postRef}
        level={level}
        setIsAlertLoginVisible={setIsAlertLoginVisible}
      />
    ));
  }

  return (
    <Fragment>
      <div className={s.container}>
        {/* user image */}
        <img src={comment.author.photoURL || "/user.svg"} alt="" />

        {/* === Comment body === */}
        <div className={s.comment}>
          <div className={s.header}>
            <Link href={`/${comment.author.username}`}>
              <h4>{comment.author.displayName}</h4>
            </Link>
            <span className={s.timestamp}>
              {getFormatedTimestamp(comment.createdAt)}
            </span>
            {/* ----- show delete & edit buttons iff user owns the comment -----*/}
            {auth.currentUser &&
              comment.author.uid === auth.currentUser.uid && (
                <DropDown
                  commentRef={commentRef}
                  postRef={postRef}
                  comment={comment}
                />
              )}
          </div>
          <MarkdownPreview content={comment.body} />
        </div>

        {/* ===== Actions (hearts and reply) ==== */}
        <AuthCheck
          fallback={
            <div className={s.actions}>
              <button onClick={alertForLogin}>
                <AiOutlineHeart className={s.icon} />
                {comment.heartCount}
                <span> Heart</span>
              </button>
              <button onClick={alertForLogin}>
                <RiChat1Line className={s.icon} />
                <span>Reply</span>
              </button>
            </div>
          }
        >
          <Actions
            commentRef={commentRef}
            comment={comment}
            level={level}
            setShowReply={setShowReply}
          />
        </AuthCheck>

        {/* ----- show the reply form based on the state ----- */}
        {showReply && (
          <div className={s.addReply}>
            <ReplyForm
              commentRef={commentRef}
              postRef={postRef}
              setShowReply={setShowReply}
            />
          </div>
        )}
      </div>

      {comment.replies.length > 0 && <div className={s.replies}>{replies}</div>}
    </Fragment>
  );
}

const DropDown = ({ postRef, commentRef, comment }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownVisible(prevState => !prevState);
  };

  const deleteComment = () => {
    /* FIXME: make your own component that shows alert messages
     * make a drawer component
     */
    confirmAlert({
      overlayClassName: "confirm-overlay",
      customUI: ({ onClose }) => {
        return (
          <PopConfirm
            heading="Are you sure?"
            description="You want to delete this comment"
            onClose={onClose}
            onConfirm={async () => {
              const batch = writeBatch(db);
              batch.delete(commentRef);

              if (comment.parentId === postRef.id) {
                batch.update(postRef, { commentCount: increment(-1) });
              }

              await batch.commit();

              setIsDropdownVisible(prevState => !prevState);
              toast.success("Comment deleted successfully");
            }}
          />
        );
      },
    });
  };

  const initialValues = {
    body: comment.body,
  };
  const showEditForm = () => {
    /* FIXME: make your own component that shows this edit form
     * make a drawer component
     */
    confirmAlert({
      overlayClassName: "confirm-overlay",
      customUI: ({ onClose }) => {
        const handleSubmit = async (values, actions) => {
          try {
            await updateDoc(commentRef, {
              body: values.body,
            });
            toast.success("Comment edited successfully");
            onClose();
            setIsDropdownVisible(false);
          } catch (e) {
            toast.error("Unable to edit comment");
            console.log(e);
          }
        };
        return (
          <div className={s.editComment}>
            <h2>Edit Comment</h2>
            <Form
              initialValues={initialValues}
              handleSubmit={handleSubmit}
              areActionAlwaysVisible={true}
              onDismiss={onClose}
            />
          </div>
        );
      },
    });
  };

  return (
    <div className={s.wrapper}>
      <div className={s.dropdown} onClick={toggleDropdown}>
        <HiDotsVertical />
      </div>
      {isDropdownVisible && (
        <div className={s.dropdownContent}>
          <button onClick={showEditForm}>
            <FiEdit />
            Edit
          </button>
          <button onClick={deleteComment}>
            <MdOutlineDelete className={s.icon} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

const Actions = ({ commentRef, comment, level, setShowReply }) => {
  const heartRef = doc(commentRef, "hearts", auth.currentUser.uid);
  const [heartDoc] = useDocument(heartRef);

  const handleAddReply = () => {
    setShowReply(prevState => !prevState);
  };

  const addHeart = async () => {
    const uid = auth.currentUser.uid;
    const batch = writeBatch(db);

    batch.update(commentRef, { heartCount: increment(1) });
    batch.set(heartRef, { uid });

    await batch.commit();
  };

  const removeHeart = async () => {
    const batch = writeBatch(db);

    batch.update(commentRef, { heartCount: increment(-1) });
    batch.delete(heartRef);

    await batch.commit();
  };

  return (
    <div className={s.actions}>
      {/** ---- heart icon --- */}
      {heartDoc && heartDoc.exists() ? (
        <button onClick={removeHeart} className={s.hearted}>
          <AiFillHeart className={s.icon} />
          {comment.heartCount}
          <span> Heart</span>
        </button>
      ) : (
        <button onClick={addHeart}>
          <AiOutlineHeart className={s.icon} />
          {comment.heartCount}
          <span> Heart</span>
        </button>
      )}

      {/* ----- show reply button if not nested below level 3 -----*/}
      {level < 3 && (
        <button onClick={handleAddReply}>
          <RiChat1Line className={s.icon} />
          <span>Reply</span>
        </button>
      )}
    </div>
  );
};

const Reply = ({ commentRef, postRef, level, setIsAlertLoginVisible }) => {
  const [comment] = useDocumentData(commentRef, {
    idField: "id",
  });

  if (comment) {
    return (
      <Comment
        key={comment.id}
        comment={comment}
        postRef={postRef}
        level={level + 1}
        setIsAlertLoginVisible={setIsAlertLoginVisible}
      />
    );
  } else return null;
};

const ReplyForm = ({ commentRef, postRef, setShowReply }) => {
  const { user, username } = useContext(UserContext);

  const initialValues = {
    body: "",
    heartCount: 0,
    replies: [],
    createdAt: serverTimestamp(),
    parentId: commentRef.id,
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
    // add a new comment inside the comments collection
    const docRef = await addDoc(collection(postRef, "comments"), data);
    await updateDoc(commentRef, {
      replies: arrayUnion(docRef),
    });
    actions.resetForm({
      ...values,
      body: "",
    });
    setShowReply(false);
  };

  const hideReplyForm = () => {
    setShowReply(false);
  };

  return (
    <Form
      initialValues={initialValues}
      handleSubmit={handleSubmit}
      onDismiss={hideReplyForm}
      areActionAlwaysVisible={true}
    />
  );
};
