import React, { Component } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { Redirect } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import axios from "axios";
import { LEAVE_TYPES, LEAVE_TYPE_OPTIONS, mapLegacyType } from '../constants/leaveTypes';

export default class Application extends Component {

  constructor(props) {
    super(props);
    this.state = {
      type: "",
      startDate: null,
      endDate: null,
      reason: "",
      approvedBy: "",
      businessLeavePurpose: "",
      businessLeaveDestination: "",
      hasError: false,
      errMsg: "",
      completed: false
    };
  }

  validateForm = () => {
    const { type, startDate, endDate, reason, approvedBy, businessLeavePurpose, businessLeaveDestination } = this.state;

    // Basic validation
    if (!type || !startDate || !endDate || !reason || !approvedBy) {
      return false;
    }

    // Additional validation for Business Leave
    if (type === "business_leave" && (!businessLeavePurpose || !businessLeaveDestination)) {
      return false;
    }

    return true;
  };
  mapLeaveTypeToApi = (type) => {
    return mapLegacyType(type);
  };
  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.setState({ hasError: false, errMsg: "", completed: false });

    const userId = JSON.parse(localStorage.getItem('user')).id;
    const {
      type,
      startDate,
      endDate,
      reason,
      approvedBy,
      businessLeavePurpose,
      businessLeaveDestination
    } = this.state;

    // Format dates to YYYY-MM-DD
    const formatDate = (date) => {
      return date ? new Date(date).toISOString().split('T')[0] : null;
    };

    const application = {
      userId,
      type: this.mapLeaveTypeToApi(type),
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      reason,
      approvedBy,
      ...(type === 'business_leave' && {
        businessLeavePurpose,
        businessLeaveDestination
      })
    };

    axios({
      method: "post",
      url: "/api/applications",
      data: application,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'application/json'
      },
    })
      .then((res) => {
        this.setState({ completed: true });
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || 'An error occurred while submitting the application';
        this.setState({
          hasError: true,
          errMsg: errorMsg
        });
        window.scrollTo(0, 0);
      });
  };

  render() {
    return (
      <div className="container-fluid pt-4">
        {this.state.hasError ? (
          <Alert variant="danger" className="m-3" block>
            {this.state.errMsg}
          </Alert>
        ) : this.state.completed ? (
          <Redirect to="/application-list" />
        ) : (<></>)}
        <Card className="mb-3 main-card">
          <Card.Header className="bg-danger">
            <b>Make Application</b>
          </Card.Header>
          <Card.Body>
            <Card.Title>General Leave Notification Guidelines</Card.Title>
            <Card.Text>
              <Alert className="mb-4" style={{ backgroundColor: '#fff3cd' }}>
                <ul className="mb-0">
                  <li>All employees <strong>must notify</strong> their team leader and HR <strong>before 9:00 AM</strong> on the day they take any leave (except planned Annual Leave).</li>
                  <li>Employees must fill out the leave form completely and include the reason for the leave.</li>
                  <li>For <strong>Annual Leave / Holiday / Vacation</strong>, employees must submit their leave request at least <strong>2 months in advance</strong>.</li>
                  <li><strong>Business Leave</strong> applies when an employee needs to be out of the office for work-related reasons such as farm sourcing, client visits, or other field assignments. Employees must first discuss and get approval from their team leader. After approval, inform HR before the day of the business leave.</li>
                  <li>HR will notify the entire staff by updating all relevant calendars and staff groups immediately after leave approval or notification. This ensures smooth planning and coordination.</li>
                </ul>
              </Alert>
              <Form onSubmit={this.onSubmit}>
                <Form.Group controlId="formDepartmentName">
                  <Form.Label>
                    Type of Leave
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="type"
                    style={{ width: "50%" }}
                    value={this.state.type}
                    onChange={this.handleChange}
                    required
                  >
                    <option value="">Choose one</option>
                    <option value="sick_with_document">Sick Leave with document</option>
                    <option value="sick_home">Sick Leave without document (deducts from annual leave)</option>
                    <option value="remote_work">Remote Work</option>
                    <option value="annual_leave">Annual Leave (deducts from annual leave balance)</option>
                    <option value="bereavement">Bereavement Leave</option>
                    <option value="unexcused_absence">Unexcused Absence (HR/Supervisor only)</option>
                    <option value="business_leave">Business Leave (Field Work / Official Travel)</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Row>
                    <DatePicker
                      selected={this.state.startDate}
                      className="form-control ml-1"
                      onChange={newDate => this.setState({ startDate: newDate })}
                      required
                    />
                  </Form.Row>
                </Form.Group>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Row>
                    <DatePicker
                      selected={this.state.endDate}
                      className="form-control ml-1"
                      onChange={newDate => this.setState({ endDate: newDate })}
                      required
                    />
                  </Form.Row>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Name of the person (Leader) that approved your leave</Form.Label>
                  <Form.Control
                    type="text"
                    name="approvedBy"
                    value={this.state.approvedBy}
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Reason <span className="text-muted">(Comments)</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="reason"
                    value={this.state.reason}
                    onChange={this.handleChange}
                  />
                </Form.Group>
                {this.state.type === 'business_leave' && (
                  <>
                    <Form.Group>
                      <Form.Label>Business Purpose <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="businessLeavePurpose"
                        value={this.state.businessLeavePurpose}
                        onChange={this.handleChange}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Business Destination <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="businessLeaveDestination"
                        value={this.state.businessLeaveDestination}
                        onChange={this.handleChange}
                      />
                    </Form.Group>
                  </>
                )}
                <Button
                  type="submit"
                  className="mt-3 bg-danger border-danger"
                  disabled={!this.validateForm()}
                >
                  Submit Application
                </Button>
              </Form>
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    );
  }
}