import React, { Component } from "react";
import { loadTree } from '../menuTreeHelper';
import {NavLink} from 'react-router-dom'

export default class SidebarEmployee extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: {}
    }
  }

  componentDidMount() {
    let userData = JSON.parse(localStorage.getItem('user'))
    this.setState({user: userData})
    loadTree();
  }

  render() {
    return (
      <aside className="main-sidebar sidebar-white elevation-4" >
        {/* Brand Logo */}
        {/* <a href="/" className="brand-link">
          <span className="brand-text font-weight-light ml-1">HRMS Employee</span>
        </a> */}
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
              {/* <i className={`fa fa-${collapsed ? 'bars' : 'times'}`} /> */}
            </button>
          </div>
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img
                src={process.env.PUBLIC_URL + '/user-64.png'}
                className="img-circle elevation-2"
                alt="User Image"
              />
            </div>
            <div className="info">
              <a href="#" className="d-block text-danger text-bold">
                {this.state.user.fullname}
              </a>
            </div>
          </div>
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              {/* Add icons to the links using the .nav-icon class
         with font-awesome or any other icon font library */}
              <li className="nav-item">
                <NavLink exact to="/" className="nav-link">
                  <i className="nav-icon fas fa-tachometer-alt" />
                  <p>
                    Dashboard
                    {/* <span className="right badge badge-success">Home</span> */}
                  </p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink exact to="/salary-view" className="nav-link">
                  <i className="nav-icon fas fa-euro-sign" />
                  <p>
                    My Salary Details
                  </p>
                </NavLink>
              </li>
              <li className="nav-item has-treeview">
                <NavLink to="/fake-url" className="nav-link" activeClassName="nav-link">
                  <i className="nav-icon fa fa-rocket" />
                  <p>
                    Applications
                    <i className="right fas fa-angle-left" />
                  </p>
                </NavLink>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <NavLink to="/application" className="nav-link">
                      <i className="fa fa-plus nav-icon" />
                      <p>Application</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/application-list" className="nav-link">
                      <i className="fas fa-list-ul nav-icon" />
                      <p>My Applications</p>
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <NavLink exact to="/announcement" className="nav-link">
                  <i className="nav-icon fa fa-bell" />
                  <p>
                    Announcements
                  </p>
                </NavLink>
              </li>
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    );
  }
}