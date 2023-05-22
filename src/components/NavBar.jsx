import React, { useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";
import Sen from "../Assets/sen.png";

const NavBar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className={`navbar-${theme}`} id="NavBar">
      <div className="mainSide">
        <img className="logo" src={Sen} alt="" />
        <h2>Senior.Az</h2>
      </div>
      {/* toggle-button - nin active-i  background-color: blue oldugu ucun active olanda mavi reng edecek */}
      {/* toggle-icon - nun active-i color white oldugu ucun active olanda ag reng edecek */}

      <div className="buttons">
        <button
          onClick={() => toggleTheme("dark")}
          className={`toggle-button ${theme === "dark" ? "active" : ""}`}
        >
          <FaSun
            className={`toggle-icon ${theme === "dark" ? "active" : ""}`}
          />
        </button>

        <button
          onClick={() => toggleTheme("light")}
          className={`toggle-button ${theme === "light" ? "active" : ""}`}
        >
          <FaMoon
            className={`toggle-icon ${theme === "light" ? "active" : ""}`}
          />
          {/* click olan vaxti temasi active olsun */}
        </button>
      </div>
    </div>
  );
};

export default NavBar;
