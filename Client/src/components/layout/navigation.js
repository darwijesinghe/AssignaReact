import { NavLink, Link } from "react-router-dom";

import { useAuth } from "../../context/auth-context";
import { useTaskCounts } from "../../context/task-counts";

/**
 * Navigation component.
 * 
 * @param {boolean} show  - Flag to show or hide the navigation.
 * 
 * @returns {JSX.Element} The rendered component.
 */
const Navigation = ({ show }) => {

  // Hooks
  const { logout } = useAuth();
  const { counts } = useTaskCounts();

  // Show and hide navigation
  const showOverlay    = show ? 'nav_overlay nav_visible' : 'nav_overlay';
  const showNavigation = show ? 'nav_content show_navigate' : 'nav_content';

  // Handle logout
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="navigate" id="navigate">
      <div className={showOverlay} id="nav_overlay"></div>
      <nav className={showNavigation} id="nav_content">
        <div className="nav_list">
          <div className="nav_links">
            <NavLink to="/add-task" className={({ isActive }) => isActive ? "n_link active" : 'n_link'} role="link">
              <div className="link_title">
                <span className="material-symbols-outlined icon">add</span>
                New Task
              </div>
            </NavLink >

            <NavLink to="/tasks" className={({ isActive }) => isActive ? "n_link active" : 'n_link'} role="link">
              <div className="link_title">
                <span className="material-symbols-outlined icon">fact_check</span>
                All Tasks
              </div>
              <small className="tsk_count">{counts?.data?.allTask ?? 0}</small>
            </NavLink >

            <NavLink to="/pending" className={({ isActive }) => isActive ? "n_link active" : 'n_link'} role="link">
              <div className="link_title">
                <span className="material-symbols-outlined icon">schedule</span>
                Pending
              </div>
              <small className="tsk_count" id="pendings">{counts?.data?.pending ?? 0}</small>
            </NavLink >

            <NavLink to="/complete" className={({ isActive }) => isActive ? "n_link active" : 'n_link'} role="link">
              <div className="link_title">
                <span className="material-symbols-outlined icon">assignment_turned_in</span>
                Complete
              </div>
              <small className="tsk_count" id="completes">{counts?.data?.complete ?? 0}</small>
            </NavLink >

            <div className="break"></div>

            <NavLink to="/high-priority" className={({ isActive }) => isActive ? "n_link active" : 'n_link'} role="link">
              <div className="link_title">
                <span className="material-symbols-outlined icon">assignment_late</span>
                High Priority
              </div>
              <small className="tsk_count">{counts?.data?.highPriority ?? 0}</small>
            </NavLink >

            <NavLink to="/medium-priority" className={({ isActive }) => isActive ? "n_link active" : 'n_link'} role="link">
              <div className="link_title">
                <span className="material-symbols-outlined icon">assignment_late</span>
                Medium Priority
              </div>
              <small className="tsk_count">{counts?.data?.mediumPriority ?? 0}</small>
            </NavLink >

            <NavLink to="/low-priority" className={({ isActive }) => isActive ? "n_link active" : 'n_link'} role="link">
              <div className="link_title">
                <span className="material-symbols-outlined icon">assignment_late</span>
                Low Priority
              </div>
              <small className="tsk_count">{counts?.data?.lowPriority ?? 0}</small>
            </NavLink >

          </div>
          <div className="break"></div>
          <div className="log_out">
            <Link className="n_link" role="link" onClick={handleLogout}>
              <div className="link_title">
                <span className="material-symbols-outlined icon">logout</span>
                Logout
              </div>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

// Default props
Navigation.defaultProps = {
  show: false
};

export default Navigation;
