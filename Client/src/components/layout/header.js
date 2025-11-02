import { useAuth } from "../../context/auth-context";

/**
 * Header component.
 * 
 * @param {Function} handleToggle - Function to toggle the navigation.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function Header({ handleToggle }) {

  // Hooks
  const { letter } = useAuth();

  return (
    <header className="header container">
      <div className="header_content flex">
        <a href="#?" className="app_logo">
          <h3>Assigna</h3>
        </a>
        <div className="user_wrap">
          <div className="user_letter">
            <span>{letter}</span>
          </div>
          <div className="header_toggle">
            <span
              className="material-symbols-outlined icon"
              id="header-toggle"
              role="button"
              onClick={() => handleToggle()}
            >
              menu
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
