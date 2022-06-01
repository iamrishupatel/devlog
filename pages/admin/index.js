import s from "../../styles/Admin.module.css";
import AuthCheck from "../../components/AuthCheck";
import PostFeed from "../../components/PostFeed";
import { UserContext } from "../../lib/context/userContext";
import { db, auth } from "../../lib/firebase";

import { useContext, useState } from "react";
import { useRouter } from "next/router";

import { useCollection } from "react-firebase-hooks/firestore";
import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";
import Metatags from "../../components/Metatags";
import {
  query,
  doc,
  orderBy,
  collection,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

export default function AdminPostsPage(props) {
  return (
    <main className={s.dashboard}>
      <Metatags title="Admin Dashboard" />
      <AuthCheck>
        <CreateNewPost />
        <PostList />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const userRef = doc(db, "users", auth.currentUser.uid);
  const q = query(collection(userRef, "posts"), orderBy("createdAt"));
  const [querySnapshot] = useCollection(q);

  const posts = querySnapshot?.docs.map(doc => doc.data());
  return (
    <div>
      <h2>Manage your Posts</h2>
      <PostFeed posts={posts} admin />
    </div>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // Validate length
  const isValid = title.length > 3 && title.length < 100;

  // Create a new post in firestore
  const createPost = async e => {
    e.preventDefault();
    const uid = auth.currentUser.uid;

    const userRef = doc(db, "users", uid);
    const docRef = doc(userRef, "posts", slug);

    // give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "# hello world!",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
      commentCount: 0,
      saveCount: 0,
    };

    await setDoc(docRef, data);

    toast.success("Post created!");

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`);
  };

  return (
    <div className={s.createPost}>
      <h1>Create a post</h1>

      <form onSubmit={createPost}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="My Awesome Article!"
          className={s.input}
        />
        <p>
          <strong>Slug:</strong> {slug}
        </p>
        <button type="submit" disabled={!isValid} className="btn-accent">
          Create New Post
        </button>
      </form>
    </div>
  );
}
