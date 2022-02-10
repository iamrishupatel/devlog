import { useRouter } from "next/router";
import { auth } from "../../lib/firebase";
import { UserContext } from "../../lib/context/userContext";
import { useContext } from "react";
import s from "./UserProfile.module.css";

// UI component for user profile
export default function UserProfile({ user }) {
  const router = useRouter();
  const signOut = () => {
    auth.signOut();
    router.reload();
  };

  const { user: currentUser } = useContext(UserContext);
  return (
    <div className={s.user}>
      <img src={user.photoURL || "/user.svg"} />
      <p>
        <i>@{user.username}</i>
      </p>
      <h1>{user.displayName || "Anonymous User"}</h1>

      {currentUser && user.uid === currentUser.uid && (
        <button className="btn-red" onClick={signOut}>
          Sign out
        </button>
      )}
    </div>
  );
}
