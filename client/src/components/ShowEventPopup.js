import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import { Modal, Button, Form, Alert } from "react-bootstrap";
import moment from 'moment'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"


export default class ShowEventPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
        title: '',
        description: '',
        startDate: null,
        endDate: null,
        done: false
    }
  }

  componentDidMount() {
     this.setState({
        id: this.props.data.id,
        title: this.props.data.title,
        description: this.props.data.description,
        startDate: this.props.data.start,
        endDate: this.props.data.end
    }) 
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  deleteEvent = (e) => {
    e.preventDefault()
    axios({
        method: 'delete',
        url: `/api/personalEvents/${this.state.id}`,
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
    })
    .then(res => {
        if(res.status !== 200) {
            alert(res.data)
        } else {
            this.setState({done: true})
        }
    })
  }

  onSubmit = (e) => {
    e.preventDefault();
    if (this.state.startDate > this.state.endDate) {
      this.setState({ showAlert: true });
    } else {
      let userId = JSON.parse(localStorage.getItem("user")).id;
      this.setState(
        {
          event: {
            eventTitle: this.state.title,
            eventDescription: this.state.description,
            eventStartDate: moment(this.state.startDate).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            eventEndDate: moment(this.state.endDate).format(
              "YYYY-MM-DD HH:mm:ss"
            )
          },
        },
        () => {
          axios({
            method: "put",
            url: `/api/personalEvents/${this.state.id}`,
            data: this.state.event,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
            .then((res) => {
              if (res.status !== 200) {
                alert(res.data);
              } else {
                this.setState({done: true})
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      );
    }
  };

  render() {
    const {showAlert, done} = this.state  
    return (
      <Modal
        {...this.props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="shadow-lg"
      >
        <Modal.Header closeButton className="bg-gradient-to-r from-red-600 to-red-800 text-white border-b border-red-500">
          <Modal.Title id="contained-modal-title-vcenter" className="text-xl font-semibold">
            Event Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
            {done ? <Redirect to="/" /> : null}
            {showAlert && (
                <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 rounded-md text-sm">
                    End Date should be after Start Date
                </div>
            )}
            <Form onSubmit={this.onSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        placeholder="Enter a Title"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-red-500 focus:ring-0"
                        name="title"
                        value={this.state.title}
                        onChange={this.handleChange}
                        style={{
                            borderColor: document.activeElement && document.activeElement.id === 'title' ? '#ef4444' : '#d1d5db',
                            boxShadow: document.activeElement && document.activeElement.id === 'title' ? '0 0 0 2px rgba(239, 68, 68, 0.25)' : 'none',
                            backgroundColor: 'white',
                            borderRadius: '0.375rem'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#ef4444';
                            e.target.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.25)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#d1d5db';
                            e.target.style.boxShadow = 'none';
                        }}
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <input
                        type="text"
                        id="description"
                        placeholder="Enter a Description"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-red-500 focus:ring-0"
                        name="description"
                        value={this.state.description}
                        onChange={this.handleChange}
                        style={{
                            borderColor: document.activeElement && document.activeElement.id === 'description' ? '#ef4444' : '#d1d5db',
                            boxShadow: document.activeElement && document.activeElement.id === 'description' ? '0 0 0 2px rgba(239, 68, 68, 0.25)' : 'none',
                            backgroundColor: 'white',
                            borderRadius: '0.375rem'
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
                </div>

                <div className="space-y-1">
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                        Start Date <span className="text-red-500">*</span>
                    </label>
                    <DatePicker
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-red-500 focus:ring-0"
                        id="startDate"
                        selected={this.state.startDate}
                        onChange={newStartDate => this.setState({ startDate: newStartDate })}
                        showTimeSelect
                        timeFormat="HH:mm"
                        name="startDate"
                        timeIntervals={30}
                        timeCaption="time"
                        dateFormat="yyyy-MM-dd HH:mm"
                        placeholderText="Select Start Date"
                        autoComplete="off"
                        required
                        style={{
                            borderColor: document.activeElement && document.activeElement.id === 'startDate' ? '#ef4444' : '#d1d5db',
                            boxShadow: document.activeElement && document.activeElement.id === 'startDate' ? '0 0 0 2px rgba(239, 68, 68, 0.25)' : 'none',
                            backgroundColor: 'white',
                            borderRadius: '0.375rem'
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
                </div>

                <div className="space-y-1">
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                        End Date <span className="text-red-500">*</span>
                    </label>
                    <DatePicker
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-red-500 focus:ring-0"
                        id="endDate"
                        selected={this.state.endDate}
                        onChange={newEndDate => this.setState({ endDate: newEndDate })}
                        showTimeSelect
                        timeFormat="HH:mm"
                        name="endDate"
                        timeIntervals={30}
                        timeCaption="time"
                        dateFormat="yyyy-MM-dd HH:mm"
                        placeholderText="Select End Date"
                        autoComplete="off"
                        required
                        style={{
                            borderColor: document.activeElement && document.activeElement.id === 'endDate' ? '#ef4444' : '#d1d5db',
                            boxShadow: document.activeElement && document.activeElement.id === 'endDate' ? '0 0 0 2px rgba(239, 68, 68, 0.25)' : 'none',
                            backgroundColor: 'white',
                            borderRadius: '0.375rem'
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
                </div>

                <div className="flex space-x-2 pt-2">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-200 text-blue-800 rounded-md hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Update Event
                    </button>
                    
                    <button
                        type="button"
                        onClick={this.deleteEvent}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Delete Event
                    </button>
                </div>
            </Form>
        </Modal.Body>
      </Modal>
    );
  }
}
