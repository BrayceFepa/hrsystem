import React, { Component } from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'

export default class EmployeeViewEmployee extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        user_personal_info: {},
        user_financial_info: {},
        department: {}
      },
      loading: true,
      error: null
    };
  }

  componentDidMount() {
    this.fetchUserData();
  }

  fetchUserData = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem('user')).id;
      const response = await axios({
        method: 'get',
        url: `api/users/${userId}`,
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      });

      const userData = response.data;
      
      // Format date if it exists
      if (userData.user_personal_info?.dateOfBirth) {
        userData.user_personal_info.dateOfBirth = moment(
          userData.user_personal_info.dateOfBirth
        ).format('D MMM YYYY');
      }

      this.setState({ 
        user: userData,
        loading: false 
      });

    } catch (err) {
      console.error('Error fetching user data:', err);
      this.setState({ 
        error: 'Failed to load user data',
        loading: false 
      });
    }
  };

  renderRole = (role) => {
    switch(role) {
      case 'ROLE_ADMIN':
        return 'Admin';
      case 'ROLE_MANAGER':
        return 'Manager';
      case 'ROLE_EMPLOYEE':
        return 'Employee';
      case 'ROLE_FINANCE':
        return 'Finance';
      case 'ROLE_HR':
        return 'HR';
      default:
        return role;
    }
  };

  render() {
    const { user, loading, error } = this.state;
    const { user_personal_info, user_financial_info, department } = user;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div className="alert alert-danger">{error}</div>;
    }

    return (
      <Card>
        <Card.Header className="bg-danger">My Profile</Card.Header>
        <Card.Body>
          {/* <Card.Title><strong>{user.fullName}</strong></Card.Title> */}
          <Card.Text>
            <Col lg={12}>
              <Row className="align-items-center py-4 px-3 bg-white shadow-sm rounded-3">
                <Col lg={3} className="text-center">
                  <img
                    src={`${process.env.PUBLIC_URL}/user-128.png`}
                    alt={`${user.fullName || 'User'} profile`}
                    className="img-fluid rounded-circle border border-2 border-light shadow-sm"
                    style={{ width: "120px", height: "120px", objectFit: "cover" }}
                  />
                  {/* <h6 className="mt-3 mb-0 fw-semibold">{user.fullName || "Employee Name"}</h6> */}
                  <small className="text-muted">{this.renderRole(user.role)}</small>
                </Col>

                <Col lg={9}>
                  <div className="border-start ps-4 mt-3 mt-lg-0">
                    <h5 className="fw-semibold mb-3 text-danger">{user.fullName}</h5>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-2">
                        <strong className="text-muted">Employee ID:</strong> {user.id}
                      </li>
                      <li className="mb-2">
                        <strong className="text-muted">Department:</strong>{" "}
                        {department?.departmentName || "N/A"}
                      </li>
                      <li className="mb-2">
                        <strong className="text-muted">Role:</strong> {this.renderRole(user.role)}
                      </li>
                      <li className="mb-2">
                        <strong className="text-muted">Status:</strong>{" "}
                        <span
                          className={`badge ${
                            user.active ? "bg-green-200 text-green-600" : "bg-secondary"
                          } rounded-pill px-2 py-2`}
                        >
                          {user.active ? "Active" : "Inactive"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <Card className="secondary-card emp-view">
                    <Card.Header className="bg-danger">Personal Details</Card.Header>
                    <Card.Body>
                      <Card.Text id="emp-view-personal-dashboard">
                        <Form.Group as={Row}>
                          <Form.Label className="label">Date of Birth:</Form.Label>
                          <span>{user_personal_info?.dateOfBirth || 'N/A'}</span>
                        </Form.Group>
                        <Form.Group as={Row}>
                          <Form.Label className="label">Gender:</Form.Label>
                          <span>{user_personal_info?.gender || 'N/A'}</span>
                        </Form.Group>
                        <Form.Group as={Row}>
                          <Form.Label className="label">Marital Status:</Form.Label>
                          <span>{user_personal_info?.maritalStatus || 'N/A'}</span>
                        </Form.Group>
                        {/* <Form.Group as={Row}>
                          <Form.Label className="label">Father's Name:</Form.Label>
                          <span>{user_personal_info?.fatherName || 'N/A'}</span>
                        </Form.Group> */}
                        <Form.Group as={Row}>
                          <Form.Label className="label">ID Number:</Form.Label>
                          <span>{user_personal_info?.idNumber || 'N/A'}</span>
                        </Form.Group>
                        <Form.Group as={Row}>
                          <Form.Label className="label">National ID:</Form.Label>
                          <span>{user_personal_info?.nationalIdNumber || 'N/A'}</span>
                        </Form.Group>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={6}>
                  <Card className="secondary-card emp-view">
                    <Card.Header className="bg-danger">Contact Details</Card.Header>
                    <Card.Body>
                      <Card.Text id="emp-view-contact-dashboard">
                        <Form.Group as={Row}>
                          <Form.Label className="label">Address:</Form.Label>
                          <span>{user_personal_info?.address || 'N/A'}</span>
                        </Form.Group>
                        <Form.Group as={Row}>
                          <Form.Label className="label">City:</Form.Label>
                          <span>{user_personal_info?.city || 'N/A'}</span>
                        </Form.Group>
                        <Form.Group as={Row}>
                          <Form.Label className="label">Country:</Form.Label>
                          <span>{user_personal_info?.country || 'N/A'}</span>
                        </Form.Group>
                        <Form.Group as={Row}>
                          <Form.Label className="label">Mobile:</Form.Label>
                          <span>{user_personal_info?.mobile || 'N/A'}</span>
                        </Form.Group>
                        <Form.Group as={Row}>
                          <Form.Label className="label">Phone:</Form.Label>
                          <span>{user_personal_info?.phone || 'N/A'}</span>
                        </Form.Group>
                        <Form.Group as={Row}>
                          <Form.Label className="label">Email:</Form.Label>
                          <span>{user_personal_info?.emailAddress || 'N/A'}</span>
                        </Form.Group>
                        <Form.Group as={Row}>
                          <Form.Label className="label">Emergency Contact:</Form.Label>
                          <span>{user_personal_info?.emergencyContact || 'N/A'}</span>
                        </Form.Group>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              {/* <Row className="mt-4">
                <Col sm={12}>
                  <Card className="secondary-card">
                    <Card.Header className="bg-danger">Bank & Financial Information</Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <h5>Bank Details</h5>
                          <Form.Group as={Row}>
                            <Form.Label className="label">Bank Name:</Form.Label>
                            <span>{user_financial_info?.bankName || 'N/A'}</span>
                          </Form.Group>
                          <Form.Group as={Row}>
                            <Form.Label className="label">Account Number:</Form.Label>
                            <span>{user_financial_info?.accountNumber || 'N/A'}</span>
                          </Form.Group>
                          <Form.Group as={Row}>
                            <Form.Label className="label">Branch:</Form.Label>
                            <span>{user_financial_info?.branch || 'N/A'}</span>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <h5>Salary Details</h5>
                          <Form.Group as={Row}>
                            <Form.Label className="label">Basic Salary:</Form.Label>
                            <span>{user_financial_info?.salaryBasic ? `$${user_financial_info.salaryBasic}` : 'N/A'}</span>
                          </Form.Group>
                          <Form.Group as={Row}>
                            <Form.Label className="label">Gross Salary:</Form.Label>
                            <span>{user_financial_info?.salaryGross ? `$${user_financial_info.salaryGross}` : 'N/A'}</span>
                          </Form.Group>
                          <Form.Group as={Row}>
                            <Form.Label className="label">Net Salary:</Form.Label>
                            <span>{user_financial_info?.salaryNet ? `$${user_financial_info.salaryNet}` : 'N/A'}</span>
                          </Form.Group>
                          <h6 className="mt-3">Allowances</h6>
                          <Form.Group as={Row}>
                            <Form.Label className="label">Housing:</Form.Label>
                            <span>{user_financial_info?.allowanceHouseRent ? `$${user_financial_info.allowanceHouseRent}` : 'N/A'}</span>
                          </Form.Group>
                          <Form.Group as={Row}>
                            <Form.Label className="label">Medical:</Form.Label>
                            <span>{user_financial_info?.allowanceMedical ? `$${user_financial_info.allowanceMedical}` : 'N/A'}</span>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>     */}
            </Col>
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }
}