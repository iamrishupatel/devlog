// Loading Spinner
import s from "./Loader.module.css";

export default function Loader({ show }) {
  return show ? <div className={s.loader}></div> : null;
}
