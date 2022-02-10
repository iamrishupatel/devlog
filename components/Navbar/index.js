import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../../lib/context/userContext";
import { ThemeContext } from "../../lib/context/themeContext";
import { ImSun } from "react-icons/im";
import { BiMoon } from "react-icons/bi";
import s from "./Navbar.module.css";

// Top navbar
export default function Navbar() {
  const { user, username } = useContext(UserContext);
  const { theme, changeTheme } = useContext(ThemeContext);

  const handleThemeChange = () => {
    changeTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className={s.navbar}>
      <ul>
        <li className={s.brand}>
          <Link href="/" passHref>
            <img src="/devlog-logo.svg" height="56px" />
          </Link>
        </li>

        <li className="push-left">
          <div onClick={handleThemeChange} className={s.switch}>
            {theme === "light" ? <BiMoon /> : <ImSun />}
          </div>
        </li>
        {/* user is signed-in and has username */}
        {username && (
          <>
            <li>
              <Link href="/admin">
                <button className="btn-accent">Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <img
                  className="rounded"
                  src={user?.photoURL || "/user.svg"}
                  height="48px"
                  width="48px"
                />
              </Link>
            </li>
          </>
        )}

        {/* user is not signed OR has not created username */}
        {!username && (
          <li>
            <Link href="/signin">
              <button className="btn-accent">Log in</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
