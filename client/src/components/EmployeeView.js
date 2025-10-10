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
        departmentName: null
      },
      job: {
        jobTitle: null,
        employmentType: null,
        status: null,
        employmentContract: null,
        professionalCertificates: null,
        startDate: null,
        endDate: null
      },
      userPersonalInfo: {
        dateOfBirth: null,
        gender: null,
        maritalStatus: null,
        fatherName: null,
        country: null,
        address: null,
        mobile: null,
        emailAddress: null
      },
      userFinancialInfo: {
        bankName: null,
        accountName: null,
        accountNumber: null,
        iban: null
      },
      falseRedirect: false,
      editRedirect: false
    };
  }

  componentDidMount() {
      if(this.props.location.state) {
          axios({
              method: 'get',
              url: 'api/users/' + this.props.location.state.selectedUser.id,
              headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
          })
          .then(res => {
              let user = res.data
                this.setState({user: user}, () => {
                    if(user.jobs) {
                        let jobs = user.jobs
                        jobs.map(job => {
                            if(new Date(job.startDate) <= Date.now() && new Date(job.endDate) >= Date.now()) {
                                this.setState({job: job})
                            }
                        })
                    }
                    if(user.department) {
                        this.setState({department: user.department})
                    }
                    if(user.user_personal_info) {
                        if(user.user_personal_info.dateOfBirth) {
                            user.user_personal_info.dateOfBirth = moment(user.user_personal_info.dateOfBirth).format('D MMM YYYY')
                        }
                        this.setState({userPersonalInfo: user.user_personal_info})
                    }
                    if(user.user_financial_info) {
                        this.setState({userFinancialInfo: user.user_financial_info})
                    }
                })
          })
          .catch(err => {
              console.log(err)
          })
      } else {
          this.setState({falseRedirect: true})
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
                     <Card className="border-danger">
                         
             <Card.Header className="bg-danger">
               <b className="text-medium">Employee Detail</b>
                        <Form className="float-right">
                            <span className="text-medium" style={{ cursor: 'pointer'}} onClick={this.onEdit}><i className="far fa-edit">
                                </i> Edit</span>
                        </Form>

                        </Card.Header>
                        <Card.Body>
                            <Card.Title><strong>{this.state.user.fullName}</strong></Card.Title>
                            <Card.Text>
                                <Col lg={12}>
                                    <Card className="shadow-sm mb-4">
                                        <Card.Body className="p-4">
                                            <Row className="align-items-center">
                                                <Col md={3} className="text-center mb-4 mb-md-0">
                                                    <div className="position-relative d-inline-block">
                                                        <img 
                                                            className="img-fluid rounded-circle" 
                                                            src={process.env.PUBLIC_URL + '/user-128.png'} 
                                                            alt="Profile"
                                                            style={{
                                                                width: '150px',
                                                                height: '150px',
                                                                objectFit: 'cover',
                                                                border: '3px solid #f8f9fa',
                                                                boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)'
                                                            }}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={9}>
                                                    <div className="ps-md-4">
                                                        <h4 className="mb-4">Employee Information</h4>
                                                        <div className="row g-3">
                                                            <div className="col-md-6 mb-2">
                                                                <div className="d-flex align-items-center">
                                                                    <span className="text-muted me-2" style={{minWidth: '80px'}}>Employee ID:</span>
                                                                    <span className="fw-medium">{this.state.user.id}</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6 mb-2">
                                                                <div className="d-flex align-items-center">
                                                                    <span className="text-muted me-2" style={{minWidth: '80px'}}>Department:</span>
                                                                    <span className="fw-medium">{this.state.department.departmentName}</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6 mb-2">
                                                                <div className="d-flex align-items-center">
                                                                    <span className="text-muted me-2" style={{minWidth: '80px'}}>Job Title:</span>
                                                                    <span className="fw-medium">{this.state.job.jobTitle}</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6 mb-2">
                                                                <div className="d-flex align-items-center">
                                                                    <span className="text-muted me-2" style={{minWidth: '50px'}}>Role:</span>
                                                                    <span className={`badge ${
                                                                        this.state.user.role === 'ROLE_ADMIN' ? 'bg-danger' :
                                                                        this.state.user.role === 'ROLE_MANAGER' ? 'bg-primary' : 'bg-success'
                                                                    }`}>
                                                                        {this.state.user.role === 'ROLE_ADMIN' ? 'Admin' : 
                                                                         this.state.user.role === 'ROLE_MANAGER' ? 'Manager' : 'Employee'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    <Row>
                                        <Col sm={6}>
                                            <Card className="secondary-card emp-view">
                                                <Card.Header>Personal Details</Card.Header>
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
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                            National ID / Passport number:
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.userPersonalInfo.nationalIdNo}
                                                            </span>
                                                        </Form.Group>
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                ID/Passport Copy:
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.userPersonalInfo.idCopy ? (
                                                                    <a 
                                                                        href={`${process.env.REACT_APP_API_URL}/uploads/${this.state.userPersonalInfo.idCopy}`} 
                                                                        target="_blank" 
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        <img 
                                                                            src={`${process.env.REACT_APP_API_URL}/uploads/${this.state.userPersonalInfo.idCopy}`} 
                                                                            alt="ID/Passport Copy" 
                                                                            style={{maxWidth: '150px', maxHeight: '100px', border: '1px solid #ddd', padding: '5px'}}
                                                                        />
                                                                    </a>
                                                                ) : 'No file uploaded'}
                                                            </span>
                                                        </Form.Group>
                                                    </Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col sm={6}>
                                            <Card className="secondary-card emp-view">
                                                <Card.Header>Contact Details</Card.Header>
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
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                            Emergency Contact: 
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.userPersonalInfo.emergencyContact}
                                                            </span>
                                                        </Form.Group>
                                                    </Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={6}>
                                            <Card className="secondary-card">
                                                <Card.Header>Official Status</Card.Header>
                                                <Card.Body>
                                                    <Card.Text id="emp-view-official-status">
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Employee ID:
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.user.id || 'N/A'}
                                                            </span>
                                                        </Form.Group>
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Password:
                                                            </Form.Label>
                                                            <span>
                                                                ********
                                                            </span>
                                                        </Form.Group>
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Department:
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.department.departmentName || 'N/A'}
                                                            </span>
                                                        </Form.Group>
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Role:
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.user.role === 'ROLE_ADMIN' ? 'Admin' : 
                                                                 this.state.user.role === 'ROLE_MANAGER' ? 'Manager' : 'Employee'}
                                                            </span>
                                                        </Form.Group>
                                                    </Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col sm={6}>
                                            <Card className="secondary-card">
                                                <Card.Header>Bank Information</Card.Header>
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
                                                                Account Number: 
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.userFinancialInfo.accountNumber}
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
                                                        {/* <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                IBAN: 
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.userFinancialInfo.iban}
                                                            </span>
                                                        </Form.Group> */}
                                                    </Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col sm={6}>
                                        <Card className="secondary-card">
                                            <Card.Header>Job</Card.Header>
                                            <Card.Body>
                                                <Card.Text id="emp-view-job">
                                                    <Form.Group as={Row}>
                                                        <Form.Label className="label">
                                                            Job Title:
                                                        </Form.Label>
                                                        <span>
                                                            {this.state.job.jobTitle}
                                                        </span>
                                                    </Form.Group>
                                                    <Form.Group as={Row}>
                                                        <Form.Label className="label">
                                                            Employment Type:
                                                        </Form.Label>
                                                        <span>
                                                            {this.state.job.employmentType}
                                                        </span>
                                                    </Form.Group>
                                                    <Form.Group as={Row}>
                                                        <Form.Label className="label">
                                                            Status:
                                                        </Form.Label>
                                                        <span>
                                                            {this.state.job.status}
                                                        </span>
                                                    </Form.Group>
                                                    <Form.Group as={Row}>
                                                        <Form.Label className="label">
                                                            Employment Contract:
                                                        </Form.Label>
                                                        <span>
                                                            {this.state.job.employmentContract}
                                                        </span>
                                                    </Form.Group>
                                                    <Form.Group as={Row}>
                                                        <Form.Label className="label">
                                                            Professional Certificates:
                                                        </Form.Label>
                                                        <span>
                                                            {this.state.job.professionalCertificates}
                                                        </span>
                                                    </Form.Group>
                                                    <Form.Group as={Row}>
                                                        <Form.Label className="label">
                                                            Start Date:
                                                        </Form.Label>
                                                        <span>
                                                            {this.state.job.startDate ? moment(this.state.job.startDate).format('D MMM YYYY') : 'N/A'}
                                                        </span>
                                                    </Form.Group>
                                                    {this.state.job.endDate && (
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                End Date:
                                                            </Form.Label>
                                                            <span>
                                                                {moment(this.state.job.endDate).format('D MMM YYYY')}
                                                            </span>
                                                        </Form.Group>
                                                    )}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                        </Col>
                                    </Row>
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