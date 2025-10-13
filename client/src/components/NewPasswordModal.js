import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import { Modal, Button, Form, Alert } from "react-bootstrap";
import moment from 'moment';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default class NewPasswordModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: "",
      newPassword: "",
      newPasswordCheck: null,
      showAlert: false,
      completed: false,
      hasError: false,
      errMsg: "",
      showOldPassword: false,
      showNewPassword: false,
      showNewPasswordCheck: false
    };
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    if (this.state.newPassword !== this.state.newPasswordCheck) {
        this.setState({ showAlert: true });
    } else {
        let userId = JSON.parse(localStorage.getItem('user')).id
        let data = {
          oldPassword: this.state.oldPassword,
          newPassword: this.state.newPassword
        }
        axios({
            method: 'put',
            url: 'api/users/changePassword/' + userId,
            data: data,
            headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
        })
        .then(res => {
          this.setState({completed: true, showAlert: false, hasError: false})
        })
        .catch(err => {
          console.log(err)
          this.setState({hasError: true, errMsg: err.response.data.message})
        })
    }
  };

  render() {
    const {showAlert, completed, hasError, errMsg} = this.state  
    return (
        <Modal
          {...this.props}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="font-sans"
        >
          <Modal.Header closeButton className="bg-gradient-to-r from-red-600 to-red-800 text-white border-b border-red-500">
            <Modal.Title id="contained-modal-title-vcenter" className="text-xl font-semibold">
              Change Password
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-6">
            {completed && (
              <div className="mb-4 p-3 rounded-md bg-green-100 text-green-800 border border-green-200">
                <i className="fas fa-check-circle mr-2"></i>
                Password changed successfully.
              </div>
            )}
            {showAlert && (
              <div className="mb-4 p-3 rounded-md bg-yellow-100 text-yellow-800 border border-yellow-200">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                Passwords don't match.
              </div>
            )}
            {hasError && (
              <div className="mb-4 p-3 rounded-md bg-red-100 text-red-800 border border-red-200">
                <i className="fas fa-exclamation-circle mr-2"></i>
                {errMsg}
              </div>
            )}
            
            <Form onSubmit={this.onSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
                  Old Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="oldPassword"
                    type={this.state.showOldPassword ? "text" : "password"}
                    placeholder="Enter old password"
                    className="w-full pl-3 pr-10 py-2 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-red-500 focus:ring-0"
                    name="oldPassword"
                    value={this.state.oldPassword}
                    onChange={this.handleChange}
                    style={{
                      borderColor: document.activeElement.id === 'oldPassword' ? '#ef4444' : '#d1d5db',
                      boxShadow: document.activeElement.id === 'oldPassword' ? '0 0 0 2px rgba(239, 68, 68, 0.25)' : 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#ef4444';
                      e.target.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.25)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    onClick={() => this.setState({ showOldPassword: !this.state.showOldPassword })}
                  >
                    <i className={`fas ${this.state.showOldPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-1">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={this.state.showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="w-full pl-3 pr-10 py-2 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-red-500 focus:ring-0"
                    name="newPassword"
                    value={this.state.newPassword}
                    onChange={this.handleChange}
                    style={{
                      borderColor: document.activeElement.id === 'newPassword' ? '#ef4444' : '#d1d5db',
                      boxShadow: document.activeElement.id === 'newPassword' ? '0 0 0 2px rgba(239, 68, 68, 0.25)' : 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#ef4444';
                      e.target.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.25)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    onClick={() => this.setState(prevState => ({ showNewPassword: !prevState.showNewPassword }))}
                  >
                    <i className={`fas ${this.state.showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-1">
                <label htmlFor="newPasswordCheck" className="block text-sm font-medium text-gray-700">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="newPasswordCheck"
                    type={this.state.showNewPasswordCheck ? "text" : "password"}
                    placeholder="Repeat new password"
                    className="w-full pl-3 pr-10 py-2 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-red-500 focus:ring-0"
                    name="newPasswordCheck"
                    value={this.state.newPasswordCheck || ''}
                    onChange={this.handleChange}
                    style={{
                      borderColor: document.activeElement.id === 'newPasswordCheck' ? '#ef4444' : '#d1d5db',
                      boxShadow: document.activeElement.id === 'newPasswordCheck' ? '0 0 0 2px rgba(239, 68, 68, 0.25)' : 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#ef4444';
                      e.target.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.25)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    onClick={() => this.setState(prevState => ({ showNewPasswordCheck: !prevState.showNewPasswordCheck }))}
                  >
                    <i className={`fas ${this.state.showNewPasswordCheck ? 'fa-eye-slash' : 'fa-eye'}`} />
                  </button>
                </div>
              </div>

              <div className="text-xs text-gray-500 mt-1">
                <span className="text-red-500">*</span> Required fields
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={this.props.onHide}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Update Password
                </button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
    );
  }
}