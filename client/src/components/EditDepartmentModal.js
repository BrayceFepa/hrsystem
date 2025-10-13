import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

export default class AddEventModel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      departmentName: "",
      id: null,
      event: {},
      showAlert: false,
      errorMsg: "",
      done: false
    };
  }

  componentDidMount() {
    this.setState({
      departmentName: this.props.data.departmentName,
      id: this.props.data.id
    })
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  onSubmit = (e) => {

    e.preventDefault();

    let data = {
      departmentName: this.state.departmentName
    }

    axios({
      method: 'put',
      url: `/api/departments/${this.state.id}`,
      data: data,
      headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
    })
    .then(res => {
      this.setState({done: true})
    })
    .catch(err => {
      this.setState({showAlert: true, errorMsg: err.response.data.message
      })
    })

  };

  render() {
    const { showAlert, done } = this.state;
    
    if (done) {
      return <Redirect to="/departments" />;
    }

    return (
      <Modal
        show={true}
        onHide={this.props.onHide}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton className="bg-gradient-to-r from-red-600 to-red-800 text-white border-b border-red-500">
          <Modal.Title className="text-xl font-semibold">Edit Department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showAlert && (
            <div className="alert alert-warning">
              {this.state.errorMsg}
            </div>
          )}
          
          <Form onSubmit={this.onSubmit}>
            <Form.Group controlId="formDepartmentName">
              <Form.Label>Department Name</Form.Label>
              <Form.Control
                type="text"
                name="departmentName"
                value={this.state.departmentName}
                onChange={this.handleChange}
                autoComplete="off"
                required
                placeholder="Enter department name"
              />
            </Form.Group>
            
            <div className="mt-4 d-flex justify-content-end">
              <Button className="btn btn-secondary me-2" onClick={this.props.onHide}>
                Cancel
              </Button>
              <Button 
                className="btn btn-danger ml-2" 
                type="submit"
                style={{ outline: 'none', boxShadow: 'none' }}
                onFocus={(e) => e.target.style.boxShadow = 'none'}
              >
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}