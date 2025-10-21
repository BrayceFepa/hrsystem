import React, { Component } from "react";
import { loadTree } from '../menuTreeHelper';
import { NavLink } from 'react-router-dom';

export default class SidebarManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      collapsed: localStorage.getItem('sidebarCollapsed') === 'true'
    };
    this.toggleSidebar = this.toggleSidebar.bind(this);
  }

  componentDidMount() {
    try {
      const storedData = localStorage.getItem('user');
      console.log('Stored user data:', storedData); // Debug log
      
      if (storedData) {
        const userData = JSON.parse(storedData);
        console.log('Parsed user data:', userData); // Debug log
        
        // Handle both direct user object and nested user object
        const user = userData.user || userData;
        console.log('Extracted user:', user); // Debug log
        
        if (user) {
          this.setState({ user });
        }
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    
    loadTree();
  }

  toggleSidebar() {
    const newState = !this.state.collapsed;
    this.setState({ collapsed: newState });
    localStorage.setItem('sidebarCollapsed', newState);
  }

  render() {
    const { collapsed } = this.state;
    const sidebarClass = `main-sidebar sidebar-white elevation-4 ${collapsed ? 'sidebar-collapse' : ''}`;

    return (
      <>
        <div className="sidebar-overlay" onClick={this.toggleSidebar}></div>
        <aside className={sidebarClass}>
          <div className="brand-link d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <img 
                src={process.env.PUBLIC_URL + '/Logo.png'} 
                alt="CHIP CHIP HRMS Logo" 
                className="brand-image"
              />
            </div>
            <button 
              className="btn btn-link text-white" 
              onClick={this.toggleSidebar}
              style={{padding: '0.5rem'}}
            >
              <i className={`fa fa-${collapsed ? 'bars' : 'times'}`} />
            </button>
          </div>
          
          <div className="sidebar">
            <div className="user-panel mt-3 pb-3 mb-3 d-flex">
              <div className="image">
                <img
                  src={process.env.PUBLIC_URL + '/user-64.png'}
                  className="img-circle elevation-2"
                  alt="User"
                />
              </div>
              {!collapsed && (
                <div className="info">
                  <a href="#" className="d-block text-danger text-bold">
                    {this.state.user.fullname || 'User'}
                  </a>
                  <small className="text-danger text-center">Manager</small>
                </div>
              )}
            </div>

            <nav className="mt-2">
              <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu">
                <li className="nav-item">
                  <NavLink exact to="/" className="nav-link">
                    <i className="nav-icon fas fa-tachometer-alt" />
                    <p>Dashboard</p>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink exact to="/employee-list" className="nav-link">
                    <i className="nav-icon fas fa-users" />
                    <p>My Employees</p>
                  </NavLink>
                </li>
                <li className="nav-item has-treeview">
                  <a href="#" className="nav-link">
                    <i className="nav-icon fas fa-file-alt" />
                    <p>
                      Applications
                      <i className="right fas fa-angle-left" />
                    </p>
                  </a>
                  <ul className="nav nav-treeview">
                    <li className="nav-item">
                      <NavLink to="/application" className="nav-link">
                        <i className="fas fa-plus nav-icon" />
                        <p>Add Application</p>
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/application-list" className="nav-link">
                        <i className="fas fa-list nav-icon" />
                        <p>Application List</p>
                      </NavLink>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <NavLink to="/job-list" className="nav-link">
                    <i className="nav-icon fas fa-briefcase" />
                    <p>Job List</p>
                  </NavLink>
                </li>
                {/* <li className="nav-item">
                  <NavLink exact to="/salary-details" className="nav-link">
                    <i className="nav-icon fas fa-euro-sign" />
                    <p>Salary Details</p>
                  </NavLink>
                </li> */}
                <li className="nav-item">
                  <NavLink exact to="/announcement" className="nav-link">
                    <i className="nav-icon fa fa-bell" />
                    <p>Announcements</p>
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </aside>
      </>
    );
  }
}