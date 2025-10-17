import React, { Component } from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'

export default class EmployeeView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      department: {
        departmentName: 'N/A'
      },
      currentJob: {
        jobTitle: 'N/A',
        empType: 'N/A',
        empStatus: 'N/A',
        startDate: 'N/A',
        endDate: 'N/A',
        directSupervisor: 'N/A'
      },
      userPersonalInfo: {
        dateOfBirth: 'N/A',
        gender: 'N/A',
        maritalStatus: 'N/A',
        fatherName: 'N/A',
        country: 'N/A',
        city: 'N/A',
        address: 'N/A',
        phone: 'N/A',
        mobile: 'N/A',
        emailAddress: 'N/A',
        emergencyContact: 'N/A',
        idNumber: 'N/A',
        nationalIdNumber: 'N/A'
      },
      userFinancialInfo: {
        bankName: 'N/A',
        accountName: 'N/A',
        accountNumber: 'N/A',
        branch: 'N/A',
        iban: 'N/A',
        employmentType: 'N/A',
        salaryBasic: 'N/A',
        salaryGross: 'N/A',
        salaryNet: 'N/A'
      },
      falseRedirect: false,
      editRedirect: false,
      loading: true
    };
  }

  componentDidMount() {
    if (this.props.location?.state?.selectedUser?.id) {
      axios({
        method: 'get',
        url: `api/users/${this.props.location.state.selectedUser.id}`,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => {
        const user = res.data;
        const currentDate = new Date();
        
        // Find current or most recent job
        let currentJob = {
          jobTitle: 'N/A',
          empType: 'N/A',
          empStatus: 'N/A',
          startDate: 'N/A',
          endDate: 'N/A',
          directSupervisor: 'N/A'
        };

        if (user.jobs && user.jobs.length > 0) {
          // Try to find current job
          const activeJobs = user.jobs.filter(job => {
            const startDate = new Date(job.startDate);
            const endDate = job.endDate ? new Date(job.endDate) : new Date('9999-12-31');
            return startDate <= currentDate && endDate >= currentDate;
          });

          if (activeJobs.length > 0) {
            // Get the most recent active job
            currentJob = activeJobs.reduce((latest, current) => {
              return new Date(current.startDate) > new Date(latest.startDate) ? current : latest;
            });
          } else {
            // If no current job, get the most recent job
            const sortedJobs = [...user.jobs].sort((a, b) => 
              new Date(b.startDate) - new Date(a.startDate)
            );
            currentJob = sortedJobs[0] || currentJob;
          }
        }

        // Format dates
        if (currentJob.startDate) {
          currentJob.startDate = moment(currentJob.startDate).format('D MMM YYYY');
        }
        if (currentJob.endDate) {
          currentJob.endDate = moment(currentJob.endDate).format('D MMM YYYY');
        } else {
          currentJob.endDate = 'Present';
        }

        // Format personal info
        const userPersonalInfo = {
          ...this.state.userPersonalInfo,
          ...user.user_personal_info
        };

        if (userPersonalInfo.dateOfBirth) {
          userPersonalInfo.dateOfBirth = moment(userPersonalInfo.dateOfBirth).format('D MMM YYYY');
        }

        // Format financial info
        const userFinancialInfo = {
          ...this.state.userFinancialInfo,
          ...user.user_financial_info
        };

        // Format salary values
        const formatCurrency = (value) => {
          return value ? `$${parseFloat(value).toLocaleString()}` : 'N/A';
        };

        if (userFinancialInfo.salaryBasic) {
          userFinancialInfo.salaryBasic = formatCurrency(userFinancialInfo.salaryBasic);
        }
        if (userFinancialInfo.salaryGross) {
          userFinancialInfo.salaryGross = formatCurrency(userFinancialInfo.salaryGross);
        }
        if (userFinancialInfo.salaryNet) {
          userFinancialInfo.salaryNet = formatCurrency(userFinancialInfo.salaryNet);
        }

        this.setState({
          user,
          currentJob,
          department: user.department || this.state.department,
          userPersonalInfo,
          userFinancialInfo,
          loading: false
        });
      })
      .catch(err => {
        console.error('Error fetching employee data:', err);
        this.setState({ loading: false });
      });
    } else {
      this.setState({ falseRedirect: true });
    }
  }

  onEdit = () => {
    this.setState({editRedirect: true})
  }

  render() {
    return (
        <div className="container-fluid pt-3">
            {this.state.falseRedirect ? <Redirect to="/" /> : (<></>)}
            {this.state.editRedirect ? (<Redirect to={{pathname: "/employee-edit", state: {selectedUser: this.state.user}}} />) : null}
            <Row>
                <Col sm={12}>
                    <Card>
                        <Card.Header className="bg-danger">Employee Detail </Card.Header>
                        <Card.Body>
                            <Card.Title><strong>{this.state.user.fullName}</strong></Card.Title>
                            <Card.Text>
                                <Col lg={12}>
                                    <Row className="pt-4">
                                        <Col lg={3}>
                                            <img className="img-circle elevation-1 bp-2" src={process.env.PUBLIC_URL + '/user-128.png'}></img>
                                        </Col>
                                        <Col className="pt-4" lg={9}>
                                            <div className="emp-view-list">
                                                <ul>
                                                    <li><span>Username: </span> {this.state.user.username || 'N/A'}</li>
                                                    <li><span>Employee ID: </span> {this.state.user.id || 'N/A'}</li>
                                                    <li><span>Department: </span> {this.state.department?.departmentName || 'N/A'}</li>
                                                    <li><span>Job Title: </span> {this.state.currentJob.jobTitle}</li>
                                                    <li><span>Employment Type: </span> {this.state.currentJob.empType}</li>
                                                    <li><span>Status: </span> {this.state.currentJob.empStatus}</li>
                                                    {/* <li><span>Role: </span> {
                                                        this.state.user.role === 'ROLE_ADMIN' ? 'Admin' : 
                                                        this.state.user.role === 'ROLE_MANAGER' ? 'Manager' : 
                                                        'Employee'}
                                                    </li> */}
                                                </ul>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={6}>
                                            <Card className="secondary-card emp-view">
                                                <Card.Header className="bg-danger">Personal Details</Card.Header>
                                                <Card.Body>
                                                    <Card.Text id="emp-view-personal">
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Date of Birth: 
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.userPersonalInfo.dateOfBirth}
                                                            </span>
                                                        </Form.Group>
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Gender: 
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.userPersonalInfo.gender}
                                                            </span>
                                                        </Form.Group>
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Marital Status: 
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.userPersonalInfo.maritalStatus}
                                                            </span>
                                                        </Form.Group>
                                                        {/* <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Father's Name: 
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.userPersonalInfo.fatherName}
                                                            </span>
                                                        </Form.Group> */}
                                                    </Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col sm={6}>
                                            <Card className="secondary-card emp-view">
                                                <Card.Header className="bg-danger">Contact Details</Card.Header>
                                                <Card.Body>
                                                    <Card.Text id="emp-view-contact">
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Location: 
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.userPersonalInfo.country}, {this.state.userPersonalInfo.city}
                                                            </span>
                                                        </Form.Group>
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Address: 
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.userPersonalInfo.address}
                                                            </span>
                                                        </Form.Group>
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Mobile: 
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.userPersonalInfo.mobile} {this.state.userPersonalInfo.phone ? (' (' + this.state.userPersonalInfo.phone + ')') : null} 
                                                            </span>
                                                        </Form.Group>
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Email Address: 
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.userPersonalInfo.emailAddress}
                                                            </span>
                                                        </Form.Group>
                                                    </Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                    {/* Bank Information Section - Commented out
                                    <Row>
                                        <Col cm={6}>
                                            <Card className="secondary-card">
                                                <Card.Header className="bg-danger">Bank Information</Card.Header>
                                                <Card.Body>
                                                    <Card.Text id="emp-view-bank">
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Bank Name: 
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.userFinancialInfo.bankName}
                                                            </span>
                                                        </Form.Group>
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Branch: 
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.userFinancialInfo.branch}
                                                            </span>
                                                        </Form.Group>
                                                    </Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col sm={6}>
                                        </Col>
                                    </Row>
                                    */}
                                </Col>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
  }
}