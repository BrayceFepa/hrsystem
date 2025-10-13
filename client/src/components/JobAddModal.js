import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import { Modal, Button, Form, Alert } from "react-bootstrap";
import moment from 'moment'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"


export default class JobAddModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      jobTitle: "",
      startDate: null,
      endDate: null,
      departments: [],
      users: [],
      selectedDepartment: null,
      selectedUser: null,
      showAlert: false,
      errorMsg: "",
      done: false
    };
  }

  componentDidMount() {
    this.fetchDepartments() 
  }

  fetchDepartments = () => {
    axios({
          method: 'get',
          url: 'api/departments',
          headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
      })
      .then(res => {
          this.setState({departments: res.data})
      })
  }

  fetchUsers = () => {
      let users = []
        this.state.departments.map(dept => {
        console.log(dept.id, this.state.selectedDepartment)
        if(dept.id == this.state.selectedDepartment) {
            dept.users.map((user, index) => {
                users.push(user)
            })
            this.setState({users: users})
        }
        })
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  onDepartmentChange = (event) => {
    this.setState({selectedDepartment: event.target.value}, () => {
        this.fetchUsers()
    })
  }

  onUserChange = (event) => {
    this.setState({selectedUser: event.target.value})
  }

  pushDepartments = () => {
      let items = []
      this.state.departments.map((dept, index) => {
        items.push(<option key={index} value={dept.id}>{dept.departmentName}</option>)
      })
      return items
  }

  pushUsers = () => {
      let items = []
      this.state.users.map((user, index) => {
          items.push(<option key={index} value={user.id}>{user.fullName}</option>)
      })
      return items
  }

  onSubmit = (e) => {

    e.preventDefault();

    let job = {
        jobTitle: this.state.jobTitle,
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        userId: this.state.selectedUser
    }

    axios({
        method: 'post',
        url: `/api/jobs`,
        data: job,
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
    })
    .then(res => {
        this.setState({done: true})
    })
    .catch(err => {
        this.setState({showAlert: true, errorMsg: err.response?.data?.message || 'An error occurred'});
    });
  }

  render() {
    const {showAlert, done, errorMsg} = this.state;  
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
            Add New Job
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-6">
          {done && (
            <div className="mb-4 p-3 rounded-md bg-green-100 text-green-800 border border-green-200">
              <i className="fas fa-check-circle mr-2"></i>
              Job added successfully.
            </div>
          )}
          {showAlert && (
            <div className="mb-4 p-3 rounded-md bg-red-100 text-red-800 border border-red-200">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {errorMsg}
            </div>
          )}
          
          <Form onSubmit={this.onSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                id="department"
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-red-500 focus:ring-0"
                value={this.state.selectedDepartment || ""}
                onChange={this.onDepartmentChange}
                style={{
                  borderColor: document.activeElement.id === 'department' ? '#ef4444' : '#d1d5db',
                  boxShadow: document.activeElement.id === 'department' ? '0 0 0 2px rgba(239, 68, 68, 0.25)' : 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ef4444';
                  e.target.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.25)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">Choose department...</option>
                {this.pushDepartments()}
              </select>
            </div>

            {this.state.selectedDepartment && (
              <div className="space-y-1">
                <label htmlFor="user" className="block text-sm font-medium text-gray-700">
                  User <span className="text-red-500">*</span>
                </label>
                <select
                  id="user"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-red-500 focus:ring-0"
                  value={this.state.selectedUser || ""}
                  onChange={this.onUserChange}
                  style={{
                    borderColor: document.activeElement.id === 'user' ? '#ef4444' : '#d1d5db',
                    boxShadow: document.activeElement.id === 'user' ? '0 0 0 2px rgba(239, 68, 68, 0.25)' : 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ef4444';
                    e.target.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.25)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Select user...</option>
                  {this.pushUsers()}
                </select>
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                id="jobTitle"
                type="text"
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-red-500 focus:ring-0"
                name="jobTitle"
                value={this.state.jobTitle}
                onChange={this.handleChange}
                autoComplete="off"
                required
                style={{
                  borderColor: document.activeElement.id === 'jobTitle' ? '#ef4444' : '#d1d5db',
                  boxShadow: document.activeElement.id === 'jobTitle' ? '0 0 0 2px rgba(239, 68, 68, 0.25)' : 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ef4444';
                  e.target.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.25)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="Enter job title"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  id="startDate"
                  selected={this.state.startDate}
                  onChange={startDate => this.setState({startDate: startDate})}
                  minDate={new Date()}
                  dateFormat="yyyy-MM-dd"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-red-500 focus:ring-0"
                  placeholderText="Select start date"
                  autoComplete="off"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  id="endDate"
                  selected={this.state.endDate}
                  onChange={endDate => this.setState({endDate: endDate})}
                  minDate={this.state.startDate || new Date()}
                  dateFormat="yyyy-MM-dd"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-red-500 focus:ring-0"
                  placeholderText="Select end date"
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={this.props.onHide}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Add Job
              </button>
            </div>
          </Form>
          {done && <Redirect to={{pathname: '/job-list', state: {selectedDepartment: this.state.departmentId}}} />}
        </Modal.Body>
      </Modal>
    );
  }
}