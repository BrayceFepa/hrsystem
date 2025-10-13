import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import { Modal, Button, Form, Alert } from "react-bootstrap";
import moment from 'moment';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default class JobEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      jobTitle: "",
      startDate: null,
      endDate: null,
      departmentId: null,
      showAlert: false,
      errorMsg: "",
      done: false,
      isLoading: false
    };
  }

  componentDidMount() {
    this.setState({
      id: this.props.data.id,
      jobTitle: this.props.data.jobTitle,
      startDate: moment(this.props.data.startDate).toDate(),
      endDate: moment(this.props.data.endDate).toDate(),
      departmentId: this.props.data.user?.departmentId
    });
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    this.setState({ isLoading: true, showAlert: false });

    try {
      const job = {
        jobTitle: this.state.jobTitle,
        startDate: this.state.startDate,
        endDate: this.state.endDate,
      };

      await axios({
        method: 'put',
        url: `/api/jobs/${this.state.id}`,
        data: job,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      this.setState({ done: true });
    } catch (err) {
      this.setState({
        showAlert: true,
        errorMsg: err.response?.data?.message || 'An error occurred while updating the job.'
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { showAlert, done, errorMsg, isLoading } = this.state;
    
    if (done) {
      return <Redirect to={{ pathname: '/job-list', state: { selectedDepartment: this.state.departmentId } }} />;
    }

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
            Edit Job
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-6">
          {showAlert && (
            <div className="mb-4 p-3 rounded-md bg-red-100 text-red-800 border border-red-200">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {errorMsg}
            </div>
          )}
          
          <Form onSubmit={this.onSubmit} className="space-y-4">
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
                  onChange={startDate => this.setState({ startDate })}
                  minDate={new Date()}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
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
                  onChange={endDate => this.setState({ endDate })}
                  minDate={this.state.startDate || new Date()}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
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
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center justify-center min-w-[100px]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-1"></i> Update Job
                  </>
                )}
              </button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}