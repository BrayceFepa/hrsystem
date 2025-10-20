import React, { Component } from "react";
import { loadTree } from '../menuTreeHelper';
import { NavLink } from 'react-router-dom';

export default class SidebarFinance extends Component {
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

        if (pathname === '/' || pathname === '/dashboard') {
            this.setState({ activeMenu: 'dashboard' });
            return;
        }

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
            }
        }

        for (const item of menuItems) {
            if (item.to &&
                item.to !== '/' &&
                (pathname === item.to || pathname.startsWith(item.to + '/'))) {
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
                id: 'employee',
                title: 'Employee',
                icon: 'user',
                children: [
                    // { title: 'Add Employee', to: '/employee-add', icon: 'user-plus' },
                    { title: 'Employee List', to: '/employee-list', icon: 'users' }
                ]
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
        const collapsed = !this.state.collapsed;
        this.setState({ collapsed });
        localStorage.setItem('sidebarCollapsed', collapsed);
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
                                        <i className={`fas fa-${child.icon} nav-icon`} />
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
        const { collapsed } = this.state;

        return (
            <aside className={`main-sidebar sidebar-white elevation-4 ${collapsed ? 'sidebar-collapse' : ''}`}>
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
                        <i className={`fas fa-${collapsed ? 'indent' : 'dedent'}`}></i>
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
                                    {this.state.user.fullname || ''}
                                </a>
                            </div>
                        )}
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
