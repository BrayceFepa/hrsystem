import React, { Component } from "react";
import { loadTree } from '../menuTreeHelper';
import { NavLink } from 'react-router-dom';
import './SidebarAdmin.css';

export default class SidebarHR extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: {},
      collapsed: localStorage.getItem('sidebarCollapsed') === 'true',
      activeMenu: ''
    };

    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  componentDidMount() {
    const userData = JSON.parse(localStorage.getItem('user')) || {};
    this.setState({ user: userData });
    loadTree();
    this.updateActiveMenu();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location?.pathname !== prevProps?.location?.pathname) {
      this.updateActiveMenu();
    }
  }

  updateActiveMenu() {
    const { pathname } = window.location;
    const menuItems = this.getMenuItems();
    
    for (const item of menuItems) {
      if (item.children) {
        const activeChild = item.children.find(child => 
          pathname === child.to || 
          (child.to !== '/' && pathname.startsWith(child.to))
        );
        
        if (activeChild) {
          this.setState({ activeMenu: item.id });
          return;
        }
      } else if (item.to && (pathname === item.to || 
                 (item.to !== '/' && pathname.startsWith(item.to)))) {
        this.setState({ activeMenu: item.id });
        return;
      }
    }
    
    this.setState({ activeMenu: '' });
  }
  
  getMenuItems() {
    return [
      { 
        id: 'dashboard', 
        title: 'Dashboard', 
        icon: 'tachometer-alt', 
        to: '/', 
        exact: true 
      },
      { 
        id: 'departments', 
        title: 'Departments', 
        icon: 'building', 
        to: '/departments' 
      },
      {
        id: 'employee',
        title: 'Employee',
        icon: 'user',
        children: [
          { title: 'Add Employee', to: '/employee-add', icon: 'user-plus' },
          { title: 'Employee List', to: '/employee-list', icon: 'users' }
        ]
      },
      { 
        id: 'jobs', 
        title: 'Job List', 
        icon: 'briefcase', 
        to: '/job-list' 
      },
      {
        id: 'applications',
        title: 'Applications',
        icon: 'rocket',
        children: [
          { title: 'Add Application', to: '/application', icon: 'plus' },
          { title: 'Application List', to: '/application-list', icon: 'list-ul' }
        ]
      }
    ];
  }

  toggleSidebar() {
    const collapsed = !this.state.collapsed;
    this.setState({ collapsed });
    localStorage.setItem('sidebarCollapsed', collapsed);
    // Trigger window resize to update layout
    window.dispatchEvent(new Event('resize'));
  }

  toggleMenu(menuId) {
    this.setState(prevState => ({
      activeMenu: prevState.activeMenu === menuId ? '' : menuId
    }));
  }

  renderMenuItems() {
    return this.getMenuItems().map((item) => (
      <li 
        key={item.id} 
        className={`${this.state.activeMenu === item.id ? 'menu-open' : ''} nav-item`}
      >
        {item.children ? (
          <>
            <a 
              href="#" 
              className="nav-link" 
              onClick={(e) => {
                e.preventDefault();
                this.toggleMenu(item.id);
              }}
            >
              <i className={`nav-icon fas fa-${item.icon}`} />
              <p>
                {item.title}
                <i className="right fas fa-angle-left" />
              </p>
            </a>
            <ul className="nav nav-treeview">
              {item.children.map((child) => (
                <li className="nav-item" key={child.to}>
                  <NavLink 
                    to={child.to} 
                    className="nav-link"
                    activeClassName="active"
                  >
                    <i className={`far fa-${child.icon} nav-icon`} />
                    <p>{child.title}</p>
                  </NavLink>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <NavLink 
            to={item.to} 
            className="nav-link"
            activeClassName="active"
            exact={item.exact}
          >
            <i className={`nav-icon fas fa-${item.icon}`} />
            <p>{item.title}</p>
          </NavLink>
        )}
      </li>
    ));
  }

  render() {
    const { collapsed, user } = this.state;
    
    return (
      <aside className={`main-sidebar sidebar-dark-primary elevation-4 ${collapsed ? 'sidebar-collapse' : ''}`}>
        <a href="#" className="brand-link">
          <span className="brand-text font-weight-light">HR System</span>
        </a>

        <div className="sidebar">
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <i className="fas fa-user-circle fa-2x img-circle elevation-2" style={{ color: '#fff' }} />
            </div>
            <div className="info">
              <a href="#" className="d-block">
                {user.firstName} {user.lastName}
              </a>
              <small className="text-muted">HR</small>
            </div>
          </div>

          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu">
              {this.renderMenuItems()}
            </ul>
          </nav>
        </div>
      </aside>
    );
  }
}
