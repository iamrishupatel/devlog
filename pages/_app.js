import "../styles/globals.css";
import Navbar from "../components/Navbar";

import { Toaster } from "react-hot-toast";
import ThemeProvider from "../lib/context/themeContext";
import UserProvider from "../lib/context/userContext";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <ThemeProvider>
        <Navbar />
        <Component {...pageProps} />
        <Toaster />
      </ThemeProvider>
    </UserProvider>
  );
}

export default MyApp;
