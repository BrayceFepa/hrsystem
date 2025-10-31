import React, { Component } from "react";
import { loadTree } from '../menuTreeHelper';
import { NavLink } from 'react-router-dom';
// Using Font Awesome icons that come with AdminLTE
import './SidebarAdmin.css';

export default class SidebarAdmin extends Component {

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
    // Update active menu when route changes
    if (this.props.location?.pathname !== prevProps?.location?.pathname) {
      this.updateActiveMenu();
    }
  }

  updateActiveMenu() {
    const { pathname } = window.location;
    const menuItems = this.getMenuItems();

    // Find the active menu by checking all items and their children
    for (const item of menuItems) {
      if (item.children) {
        // Check if any child matches the current path
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

    // If no match found, clear active menu
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
          { title: 'Employee List', to: '/employee-list', icon: 'users' },
          { title: 'Terminated Employees', to: '/terminated-employees', icon: 'user-times' }
        ]
      },
      {
        id: 'applications',
        title: 'Applications',
        icon: 'file-alt',
        children: [
          { title: 'Add Application', to: '/application', icon: 'user-plus' },
          { title: 'Application List', to: '/application-list', icon: 'users' },
        ]
      },
      {
        id: 'jobs',
        title: 'Job List',
        icon: 'briefcase',
        to: '/job-list'
      },

      {
        id: 'payroll',
        title: 'Payroll Management',
        icon: 'euro-sign',
        children: [
          { title: 'Manage Salary Details', to: '/salary-details', icon: 'euro-sign' },
          { title: 'Employee Salary List', to: '/salary-list', icon: 'users' },
          { title: 'Make Payment', to: '/payment', icon: 'money-check' }
        ]
      },
      {
        id: 'expense',
        title: 'Expense Management',
        icon: 'money-bill',
        children: [
          { title: 'Make Expense', to: '/expense', icon: 'shopping-cart' },
          { title: 'Expense Report', to: '/expense-report', icon: 'file-invoice' }
        ]
      },
      {
        id: 'announcements',
        title: 'Announcements',
        icon: 'bell',
        to: '/announcement',
        exact: true
      }
    ];
  }

  toggleSidebar() {
    const newState = !this.state.collapsed;
    this.setState({ collapsed: newState });
    localStorage.setItem('sidebarCollapsed', newState);
  }

  toggleMenu(menu) {
    this.setState(prevState => ({
      activeMenu: prevState.activeMenu === menu ? '' : menu
    }));
  }

  renderMenuItems() {
    const { collapsed, activeMenu } = this.state;
    const menuItems = this.getMenuItems();

    return menuItems.map(item => {
      if (item.children) {
        const isActive = activeMenu === item.id;
        return (
          <li key={item.id} className={`nav-item has-treeview ${isActive ? 'menu-open' : ''}`}>
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
                <span className="right">
                  <i className={`fas fa-chevron-${isActive ? 'down' : 'right'}`} />
                </span>
              </p>
            </a>
            <ul className="nav nav-treeview">
              {item.children.map(child => (
                <li key={child.to} className="nav-item">
                  <NavLink
                    to={child.to}
                    className="nav-link"
                    isActive={(match, location) => {
                      if (match) return true;
                      // Handle nested routes
                      return location.pathname.startsWith(child.to) && child.to !== '/';
                    }}
                    activeClassName="active"
                    onClick={() => collapsed && this.toggleSidebar()}
                  >
                    <i className={`fas fa-${child.icon} nav-icon`} />
                    <p>{child.title}</p>
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>
        );
      }

      return (
        <li key={item.id} className="nav-item">
          <NavLink
            exact={item.exact}
            to={item.to}
            className="nav-link"
            activeClassName="active"
            onClick={() => collapsed && this.toggleSidebar()}
          >
            <i className={`nav-icon fas fa-${item.icon}`} />
            <p>{item.title}</p>
          </NavLink>
        </li>
      );
    });
  }

  render() {
    const { collapsed } = this.state;
    const currentPath = window.location.pathname;
    const sidebarClass = `main-sidebar sidebar-white elevation-4 ${collapsed ? 'sidebar-collapse' : ''}`;

    return (
      <>
        <div className="sidebar-overlay" onClick={this.toggleSidebar}></div>
        <aside className={sidebarClass}>
          {/* Brand Logo */}
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
              style={{ padding: '0.5rem' }}
            >
              {/* <i className={`fa fa-${collapsed ? 'bars' : 'times'}`} /> */}
            </button>
          </div>

          {/* Sidebar */}
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
                <div className="info d-flex flex-column">
                  <a href="#" className="text-danger text-bold">
                    {this.state.user.fullname || ''}
                  </a>
                  <small className="text-danger text-center">Admin</small>
                </div>
              )}
            </div>

            {/* Sidebar Menu */}
            <nav className="mt-2">
              <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu">
                {this.renderMenuItems()}
              </ul>
            </nav>
          </div>
        </aside>
      </>
    );
  }
}
