import { useState, Fragment } from "react";
import { useRouter } from "next/router";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import Link from "next/link";
import toast from "react-hot-toast";
import { confirmAlert } from "react-confirm-alert";

import s from "../../styles/Admin.module.css";
import { db, auth } from "../../lib/firebase";

import AuthCheck from "../../components/AuthCheck";
import ImageUploader from "../../components/ImageUploader";
import MarkdownPreview from "../../components/MarkdownPreview";
import Metatags from "../../components/Metatags";
import Loader from "../../components/Loader";

import { doc, updateDoc, serverTimestamp, deleteDoc } from "firebase/firestore";

export default function AdminPostEdit(props) {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  const userRef = doc(db, "users", auth.currentUser.uid);
  const postRef = doc(userRef, "posts", slug);

  const [post, loading] = useDocumentDataOnce(postRef);

  if (loading) {
    return (
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "35rem",
        }}
      >
        <Loader show />
      </main>
    );
  }
  if (!post) {
    router.push("/not-found");
  }

  return (
    <main className={s.container}>
      {post && (
        <Fragment>
          <Metatags title="Write Post" />
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
              slug={slug}
            />
          </section>

          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? "Edit" : "Preview"}
            </button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live view</button>
            </Link>
            <DeletePostButton postRef={postRef} />
          </aside>
        </Fragment>
      )}
    </main>
  );
}

function PostForm({ defaultValues, postRef, preview, slug }) {
  const { register, errors, handleSubmit, formState, reset, watch } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const { isValid, isDirty } = formState;

  const updatePost = async ({ content, published }) => {
    await updateDoc(postRef, {
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success("Post updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <MarkdownPreview content={watch("content")} />
        </div>
      )}

      <div className={preview ? s.hidden : s.controls}>
        <ImageUploader slug={slug} />

        <textarea
          name="content"
          ref={register({
            maxLength: { value: 20000, message: "content is too long" },
            minLength: { value: 10, message: "content is too short" },
            required: { value: true, message: "content is required" },
          })}
        ></textarea>

        {errors.content && (
          <p className="text-danger">{errors.content.message}</p>
        )}

        <fieldset>
          <input
            className={s.checkbox}
            name="published"
            type="checkbox"
            ref={register}
          />
          <label>Published</label>
        </fieldset>

        <button
          type="submit"
          className="btn-accent"
          disabled={!isDirty || !isValid}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

function DeletePostButton({ postRef }) {
  const router = useRouter();

  const deletePost = async () => {
    const toastId = toast.loading("Deleting..");
    await deleteDoc(postRef);
    router.push("/admin");
    toast.success("post annihilated ", { icon: "🗑️", id: toastId });
  };

  const handleClick = () => {
    confirmAlert({
      overlayClassName: "confirm-overlay",
      customUI: ({ onClose }) => {
        return (
          <div className="card">
            <h1>Are you sure?</h1>
            <p>You want to delete this Post?</p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button className="btn-green" onClick={onClose}>
                No
              </button>
              <button
                className="btn-red"
                onClick={async () => {
                  await deletePost();
                  onClose();
                }}
              >
                Yes, Delete it!
              </button>
            </div>
          </div>
        );
      },
    });
  };

  return (
    <button className="btn-red" onClick={handleClick}>
      Delete
    </button>
  );
}
