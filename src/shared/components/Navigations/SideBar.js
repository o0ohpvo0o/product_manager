import ReactDOM from "react-dom";
import { NavLink } from "react-router-dom";
import "./SideBar.css";

const SideBar = (props) => {
  const content = (
    <nav className={`sidebar ${props.isDisplayed ? "open" : ""}`} onClick={props.onCloseSidebar}>
      <ul className="mobile-nav__items">
        <li className="mobile-nav__item">
          <NavLink to="/home">
            <span className="icon__home"></span> HOME
          </NavLink>
        </li>
        <li className="mobile-nav__item">
          <NavLink to="/others-manager">
            <span className="icon__leads"></span> DATA
          </NavLink>
        </li>
        <li className="mobile-nav__item">
          <NavLink to="/settings">
            <span className="add-new__icon"></span> SETTINGS
          </NavLink>
        </li>
      </ul>
    </nav>
  );

  return ReactDOM.createPortal(content, document.getElementById("sidebar-hook"));
};

export default SideBar;
