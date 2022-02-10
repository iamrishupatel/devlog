import Link from "next/link";
import Metatags from "../components/Metatags";

export default function Custom404() {
  return (
    <main className="box-center notFound">
      <Metatags title="Not Found" />
      <h1>404 - That page does not seem to exist...</h1>
      <img src="/notFound.gif" height="300" />
      <Link href="/">
        <button className="btn-accent">Go home</button>
      </Link>
    </main>
  );
}
