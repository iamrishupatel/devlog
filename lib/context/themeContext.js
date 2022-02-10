import { createContext } from "react";
import { useState, useLayoutEffect } from "react";

export const ThemeContext = createContext();

const ThemeProvider = props => {
  const [theme, setTheme] = useState("light");
  const themeColors = {
    light: {
      colorBg: "#eef0f1",
      colorText: "#08090a",
      colorPrimary: "#fff",
      colorBorder: "#c0c0cf",
      colorBtn: "#c0c0cf",
    },
    dark: {
      colorBg: "#08090a",
      colorText: "#f6f6f6",
      colorPrimary: "#1e1e1e",
      colorBorder: "#30303f",
      colorBtn: "#30303f",
    },
  };

  const changeTheme = name => {
    document.body.style.setProperty("--color-bg", themeColors[name].colorBg);
    document.body.style.setProperty(
      "--color-text",
      themeColors[name].colorText
    );
    document.body.style.setProperty(
      "--color-primary",
      themeColors[name].colorPrimary
    );
    document.body.style.setProperty(
      "--color-border",
      themeColors[name].colorBorder
    );
    document.body.style.setProperty("--color-btn", themeColors[name].colorBtn);

    setTheme(name);
    // save theme to local localStorage
    localStorage.setItem("devlog-theme", JSON.stringify(name));
  };

  // check theme before rendering anything to DOM
  useLayoutEffect(() => {
    // check what theme was selected on a previous login
    const localTheme = JSON.parse(localStorage.getItem("devlog-theme"));
    console.log(localTheme);
    if (localTheme) return changeTheme(localTheme);

    // if there isn't a theme selected already then check for prefered theme
    const darkOS = window.matchMedia("(prefers-color-scheme: dark)").matches;
    changeTheme(darkOS ? "dark" : "light");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
