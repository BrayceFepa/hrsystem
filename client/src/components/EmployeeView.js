import React, { Component } from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'

export default class EmployeeView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        user_personal_info: {},
        user_financial_info: {},
        department: {},
        jobs: []
      },
      falseRedirect: false,
      editRedirect: false
    };
  }

  componentDidMount() {
    if (this.props.location.state) {
      axios({
        method: 'get',
        url: 'api/users/' + this.props.location.state.selectedUser.id,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => {
          const user = res.data;
          // Format date of birth if it exists
          if (user.user_personal_info?.dateOfBirth) {
            user.user_personal_info.dateOfBirth = moment(user.user_personal_info.dateOfBirth).format('D MMM YYYY');
          }
          // Format job start and end dates if they exist
          if (user.jobs && user.jobs.length > 0) {
            user.jobs = user.jobs.map(job => ({
              ...job,
              formattedStartDate: job.startDate ? moment(job.startDate).format('D MMM YYYY') : null,
              formattedEndDate: job.endDate ? moment(job.endDate).format('D MMM YYYY') : null
            }));
          }
          this.setState({ user });
        })
        .catch(err => {
          console.error('Error fetching user data:', err);
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
                                                                    <span className="text-muted me-2" style={{minWidth: '100px'}}>Employee ID:</span>
                                                                    <span className="fw-medium">{this.state.user.id}</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6 mb-2">
                                                                <div className="d-flex align-items-center">
                                                                    <span className="text-muted me-2" style={{minWidth: '100px'}}>Username:</span>
                                                                    <span className="fw-medium">{this.state.user.username || 'N/A'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6 mb-2">
                                                                <div className="d-flex align-items-center">
                                                                    <span className="text-muted me-2" style={{minWidth: '100px'}}>Department:</span>
                                                                    <span className="fw-medium">{this.state.user.department?.departmentName || 'N/A'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6 mb-2">
                                                                <div className="d-flex align-items-center">
                                                                    <span className="text-muted me-2" style={{minWidth: '100px'}}>Job Title:</span>
                                                                    <span className="fw-medium">
                                                                        {this.state.user.jobs?.[0]?.jobTitle || 'N/A'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6 mb-2">
                                                                <div className="d-flex align-items-center">
                                                                    <span className="text-muted me-2" style={{minWidth: '100px'}}>Status:</span>
                                                                    <span className={`badge ${this.state.user.active ? 'bg-success' : 'bg-secondary'}`}>
                                                                        {this.state.user.active ? 'Active' : 'Inactive'}
                                                                    </span>
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
                                                <Card.Header className="bg-danger">Personal Details</Card.Header>
                                                <Card.Body>
                                                    <Card.Text id="emp-view-personal">
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Date of Birth: 
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.user.user_personal_info?.dateOfBirth || 'N/A'}
                                                            </span>
                                                        </Form.Group>
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Gender: 
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.user.user_personal_info?.gender || 'N/A'}
                                                            </span>
                                                        </Form.Group>
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Marital Status: 
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.user.user_personal_info?.maritalStatus || 'N/A'}
                                                            </span>
                                                        </Form.Group>
                                                        {/* <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Father's Name: 
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.user.user_personal_info?.fatherName || 'N/A'}
                                                            </span>
                                                        </Form.Group> */}
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                National ID / Passport number:
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.user.user_personal_info?.idNumber || 'N/A'}
                                                            </span>
                                                        </Form.Group>
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Emergency Contact:
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.user.user_personal_info?.emergencyContact || 'N/A'}
                                                            </span>
                                                        </Form.Group>
                                                        {/* <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Branch:
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.user.user_financial_info?.branch || 'N/A'}
                                                            </span>
                                                        </Form.Group> */}
                                                        <Form.Group as={Row} className="mb-3">
                                                            <Form.Label className="label fw-bold">
                                                                ID/Passport Copy:
                                                            </Form.Label>
                                                            <div className="d-flex align-items-center">
                                                                {this.state.user.user_personal_info?.idCopy ? (
                                                                    <a 
                                                                        href={`${process.env.REACT_APP_API_URL}/${this.state.user.user_personal_info.idCopy.replace(/\\/g, '/')}`} 
                                                                        target="_blank" 
                                                                        rel="noopener noreferrer"
                                                                        className="btn btn-outline-danger btn-sm me-2 ml-2"
                                                                    >
                                                                        <i className="far fa-id-card me-1"></i> View ID/Passport
                                                                    </a>
                                                                ) : (
                                                                    <span className="text-muted">No file uploaded</span>
                                                                )}
                                                            </div>
                                                        </Form.Group>
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
                                                                {[this.state.user.user_personal_info?.city, this.state.user.user_personal_info?.country]
                                                                    .filter(Boolean).join(', ') || 'N/A'}
                                                            </span>
                                                        </Form.Group>
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Address: 
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.user.user_personal_info?.address || 'N/A'}
                                                            </span>
                                                        </Form.Group>
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Phone: 
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.user.user_personal_info?.phone || 'N/A'}
                                                            </span>
                                                        </Form.Group>
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Email Address: 
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.user.user_personal_info?.emailAddress || 'N/A'}
                                                            </span>
                                                        </Form.Group>
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Emergency Contact: 
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.user.user_personal_info?.emergencyContact || 'N/A'}
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
                                                <Card.Header className="bg-danger">Official Status</Card.Header>
                                                <Card.Body>
                                                    <Card.Text id="emp-view-official-status">
                                                        {/* <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Employee ID:
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.user.id || 'N/A'}
                                                            </span>
                                                        </Form.Group> */}
                                                        {/* <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Password:
                                                            </Form.Label>
                                                            <span>
                                                                ********
                                                            </span>
                                                        </Form.Group> */}
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Department:
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.user.department?.departmentName || 'N/A'}
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
                                                <Card.Header className="bg-danger">Bank Information</Card.Header>
                                                <Card.Body>
                                                    <Card.Text id="emp-view-bank">
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Bank Name: 
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.user.user_financial_info?.bankName || 'N/A'}
                                                            </span>
                                                        </Form.Group>
                                                        {/* <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Account Name: 
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.user.user_financial_info?.accountName || 'N/A'}
                                                            </span>
                                                        </Form.Group> */}
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Account Number: 
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.user.user_financial_info?.accountNumber || 'N/A'}
                                                            </span>
                                                        </Form.Group>
                                                        <Form.Group as={Row}>
                                                            <Form.Label className="label">
                                                                Branch: 
                                                            </Form.Label>
                                                            <span>
                                                                {this.state.user.user_financial_info?.branch || 'N/A'}
                                                            </span>
                                                        </Form.Group>
                                                    </Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col sm={6}>
                                        <Card className="secondary-card">
                                            <Card.Header className="bg-danger">Job</Card.Header>
                                            <Card.Body>
                                                <Card.Text id="emp-view-job">
                                                    {this.state.user.jobs?.length > 0 ? (
                                                        this.state.user.jobs.map((job, index) => (
                                                            <React.Fragment key={index}>
                                                                <Form.Group as={Row}>
                                                                    <Form.Label className="label">
                                                                        Job Title:
                                                                    </Form.Label>
                                                                    <span>
                                                                        {job.jobTitle || 'N/A'}
                                                                    </span>
                                                                </Form.Group>
                                                                <Form.Group as={Row}>
                                                                    <Form.Label className="label">
                                                                        Employment Type:
                                                                    </Form.Label>
                                                                    <span>
                                                                        {job.empType || 'N/A'}
                                                                    </span>
                                                                </Form.Group>
                                                                <Form.Group as={Row}>
                                                                    <Form.Label className="label">
                                                                        Status:
                                                                    </Form.Label>
                                                                    <span>
                                                                        {job.empStatus || 'N/A'}
                                                                    </span>
                                                                </Form.Group>
                                                                <Form.Group as={Row}>
                                                                    <Form.Label className="label">
                                                                        Direct Supervisor:
                                                                    </Form.Label>
                                                                    <span>
                                                                        {job.directSupervisor || 'N/A'}
                                                                    </span>
                                                                </Form.Group>
                                                                <Form.Group as={Row}>
                                                                    <Form.Label className="label fw-bold">
                                                                        Employment Contract:
                                                                    </Form.Label>
                                                                    <div className="d-flex align-items-center">
                                                                        {job.contract ? (
                                                                            <a 
                                                                                href={`${process.env.REACT_APP_API_URL}/${job.contract.replace(/\\/g, '/')}`}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="btn btn-outline-danger btn-sm me-2 ml-2"
                                                                            >
                                                                                <i className="fa fa-file-contract me-1 "></i> View Contract
                                                                            </a>
                                                                        ) : (
                                                                            <span className="text-muted">No contract uploaded</span>
                                                                        )}
                                                                    </div>
                                                                </Form.Group>
                                                                <Form.Group as={Row} className="mb-3">
                                                                    <Form.Label className="label fw-bold">
                                                                        Professional Certificate:
                                                                    </Form.Label>
                                                                    <div className="d-flex align-items-center">
                                                                        {job.certificate ? (
                                                                            <a 
                                                                                href={`${process.env.REACT_APP_API_URL}/${job.certificate.replace(/\\/g, '/')}`}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="btn btn-outline-danger btn-sm me-2 ml-2"
                                                                            >
                                                                                <i className="fas fa-certificate me-1"></i> View Certificate
                                                                            </a>
                                                                        ) : (
                                                                            <span className="text-muted">No certificate uploaded</span>
                                                                        )}
                                                                    </div>
                                                                </Form.Group>
                                                                <Form.Group as={Row}>
                                                                    <Form.Label className="label">
                                                                        Start Date:
                                                                    </Form.Label>
                                                                    <span>
                                                                        {job.formattedStartDate || 'N/A'}
                                                                    </span>
                                                                </Form.Group>
                                                                {job.endDate && (
                                                                    <Form.Group as={Row}>
                                                                        <Form.Label className="label">
                                                                            End Date:
                                                                        </Form.Label>
                                                                        <span>
                                                                            {job.formattedEndDate}
                                                                        </span>
                                                                    </Form.Group>
                                                                )}
                                                            </React.Fragment>
                                                        ))
                                                    ) : (
                                                        <p>No job information available</p>
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