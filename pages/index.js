import { useState } from "react";
import PostFeed from "../components/PostFeed";
import Metatags from "../components/Metatags";
import Loader from "../components/Loader";
import { db, postToJSON } from "../lib/firebase";
import {
  collectionGroup,
  query,
  orderBy,
  where,
  limit,
  getDocs,
  Timestamp,
  startAfter,
} from "firebase/firestore";

// Max post to query per page
const LIMIT = 10;

export async function getServerSideProps(context) {
  const postsRef = collectionGroup(db, "posts");
  const q = query(
    postsRef,
    where("published", "==", true),
    orderBy("createdAt", "desc"),
    limit(LIMIT)
  );
  const posts = (await getDocs(q)).docs.map(postToJSON);

  return {
    props: { posts }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  // Get next page in pagination query
  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor =
      typeof last.createdAt === "number"
        ? Timestamp.fromMillis(last.createdAt)
        : last.createdAt;

    const q = query(
      collectionGroup(db, "posts"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      startAfter(cursor),
      limit(LIMIT)
    );

    const newPosts = (await getDocs(q)).docs.map(doc => doc.data());

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <main>
      <Metatags
        title="Devlog | Home"
        description="Get the latest posts on our site"
      />

      <div className="card card-info">
        <h2>💡 Welcome to Devlog</h2>
        <p>
          Welcome! This app is built with Next.js and Firebase and is loosely
          inspired by Dev.to
        </p>
        <p>
          Sign up for an 👨‍🎤 account, ✍️ write posts, then 💖 heart content
          created by other users. All public content is server-rendered and
          search-engine optimized.
        </p>
      </div>

      <PostFeed posts={posts} />

      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load more</button>
      )}

      <Loader show={loading} />

      {postsEnd && "You have reached the end!"}
    </main>
  );
}
