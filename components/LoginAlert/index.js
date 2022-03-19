import Link from "next/link";
import s from "./LoginAlert.module.css";
import { FaTimes } from "react-icons/fa";

export default function LoginAlert({ setIsAlertLoginVisible }) {
  const handleClick = () => {
    setIsAlertLoginVisible(false);
  };
  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <div className={s.header}>
          <h2>Log in to continue</h2>
          <div className={s.close} onClick={handleClick}>
            <FaTimes style={{ display: "flex" }} />
          </div>
        </div>

        <p>
          We're a place where coders share, stay up-to-date and grow their
          careers.
        </p>
        <Link href="/signin">
          <button className="btn btn-accent">Login</button>
        </Link>
      </div>
    </div>
  );
}
