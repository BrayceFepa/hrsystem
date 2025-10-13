import React, { Component } from "react";
import {Redirect} from "react-router-dom"
import NewPasswordModal from '../components/NewPasswordModal'

export default class Header extends Component {

  constructor(props) {
    super(props)

    this.state = {
      completed: false,
      showModal: false
    }
  }

  onLogout = (event) => {
    event.preventDefault()

    localStorage.removeItem('token');
    localStorage.removeItem('token')
    this.setState({completed: true})
  }

  newPassword = (event) => {
    event.preventDefault()

    this.setState({showModal: true})
  }

  render() {
    let closeModal = () => this.setState({showModal: false})
    return (
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        {this.state.completed ? <Redirect to="/" /> : null}
        {this.state.showModal ? <NewPasswordModal show={true} onHide={closeModal}/> : null}
        {/* Left navbar links */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="pushmenu"
              href="#"
              role="button"
            >
              {/* <i className="fas fa-bars" /> */}
            </a>
          </li>
          {/* <li className="nav-item d-none d-sm-inline-block">
            <a href="index3.html" className="nav-link">
              Home
            </a>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <a href="#" className="nav-link">
              Contact
            </a>
          </li> */}
        </ul>
        {/* SEARCH FORM */}
        {/* <form className="form-inline ml-3">
          <div className="input-group input-group-sm">
            <input
              className="form-control form-control-navbar"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <div className="input-group-append">
              <button className="btn btn-navbar" type="submit">
                <i className="fas fa-search" />
              </button>
            </div>
          </div>
        </form> */}
        {/* Right navbar links */}
        <ul className="navbar-nav ml-auto">
          {/* Messages Dropdown Menu */}
          {/* <li className="nav-item dropdown">
            <a className="nav-link" data-toggle="dropdown" href="#">
              <i className="far fa-comments" />
              <span className="badge badge-danger navbar-badge">3</span>
            </a>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
              <a href="#" className="dropdown-item">
                //Message Start
                <div className="media">
                  <img
                    src={process.env.PUBLIC_URL + '/dist/img/user1-128x128.jpg'}
                    alt="User Avatar"
                    className="img-size-50 mr-3 img-circle"
                  />
                  <div className="media-body">
                    <h3 className="dropdown-item-title">
                      Brad Diesel
                      <span className="float-right text-sm text-danger">
                        <i className="fas fa-star" />
                      </span>
                    </h3>
                    <p className="text-sm">Call me whenever you can...</p>
                    <p className="text-sm text-muted">
                      <i className="far fa-clock mr-1" /> 4 Hours Ago
                    </p>
                  </div>
                </div>
                // Message End
              </a>
              <div className="dropdown-divider" />
              <a href="#" className="dropdown-item">
                // Message Start
                <div className="media">
                  <img
                    src={process.env.PUBLIC_URL + '/dist/img/user8-128x128.jpg'}
                    alt="User Avatar"
                    className="img-size-50 img-circle mr-3"
                  />
                  <div className="media-body">
                    <h3 className="dropdown-item-title">
                      John Pierce
                      <span className="float-right text-sm text-muted">
                        <i className="fas fa-star" />
                      </span>
                    </h3>
                    <p className="text-sm">I got your message bro</p>
                    <p className="text-sm text-muted">
                      <i className="far fa-clock mr-1" /> 4 Hours Ago
                    </p>
                  </div>
                </div>
                // Message End
              </a>
              <div className="dropdown-divider" />
              <a href="#" className="dropdown-item">
                // Message Start
                <div className="media">
                  <img
                    src={process.env.PUBLIC_URL + '/dist/img/user3-128x128.jpg'}
                    alt="User Avatar"
                    className="img-size-50 img-circle mr-3"
                  />
                  <div className="media-body">
                    <h3 className="dropdown-item-title">
                      Nora Silvester
                      <span className="float-right text-sm text-warning">
                        <i className="fas fa-star" />
                      </span>
                    </h3>
                    <p className="text-sm">The subject goes here</p>
                    <p className="text-sm text-muted">
                      <i className="far fa-clock mr-1" /> 4 Hours Ago
                    </p>
                  </div>
                </div>
                // Message End
              </a>
              <div className="dropdown-divider" />
                See All Messages
              </a>
            </div>
          </li> */}
          {/* Notifications Dropdown Menu */}
          <li className="nav-item dropdown">
            <a className="nav-link" data-toggle="dropdown" href="#">
              <div className="d-flex align-items-center">
                <div className="user-image" style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '8px'
                }}>
                  <i className="fas fa-user" />
                </div>
                <span className="d-none d-md-inline">
                  {JSON.parse(localStorage.getItem('user')).fullname}
                  <i className="fas fa-chevron-down ml-1" style={{fontSize: '0.7em'}}></i>
                </span>
              </div>
            </a>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right" style={{
              border: 'none',
              borderRadius: '0.5rem',
              borderTop: '3px solid #dc3545',
              boxShadow: '0 0.15rem 1.75rem 0 rgba(0, 0, 0, 0.1)'
            }}>
              <div className="dropdown-header text-center" style={{
                padding: '0.75rem 1.5rem',
                color: '#dc3545',
                fontWeight: '600',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                <div className="text-center mb-2">
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#f8d7da',
                    color: '#dc3545',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    border: '3px solid #f1aeb5',
                    margin: '0 auto 10px'
                  }}>
                    <i className="fas fa-user"></i>
                  </div>
                </div>
                <div className="text-truncate">{JSON.parse(localStorage.getItem('user')).fullname}</div>
                <div className="text-muted small mt-1">User Profile</div>
              </div>
              <div className="dropdown-divider m-0"></div>
              <a onClick={this.newPassword} href="#" className="dropdown-item">
                <i className="fas fa-key mr-2" style={{color: '#dc3545'}}></i> Change Password
              </a>
              <div className="dropdown-divider m-0"></div>
              <a onClick={this.onLogout} href="#" className="dropdown-item text-danger">
                <i className="fas fa-sign-out-alt mr-2"></i> Log out
              </a>
            </div>
          </li>
          {/* <li className="nav-item">
            <a
              className="nav-link"
              data-widget="control-sidebar"
              data-slide="true"
              href="#"
              role="button"
            >
              <i className="fas fa-th-large" />
            </a>
          </li> */}
        </ul>
      </nav>
    );
  }
}
