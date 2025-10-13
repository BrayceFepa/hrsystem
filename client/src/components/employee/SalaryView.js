import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { Card, Row, Col, Form } from 'react-bootstrap';

export default class SalaryViewEmployee extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      currentJobTitle: null,
      isLoading: true
    };
  }

  componentDidMount() {
        let id = JSON.parse(localStorage.getItem('user')).id
        axios({
            method: 'get',
            url: 'api/users/' + id,
            headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
        })
        .then(res => {
            const userData = res.data;
            let currentTitle = null;
            
            if (userData.jobs) {
                userData.jobs.forEach(job => {
                    if (new Date(job.startDate).setHours(0) < new Date() && new Date(job.endDate).setHours(24) > new Date()) {
                        currentTitle = job.jobTitle;
                    }
                });
            }
            
            this.setState({
                user: userData,
                currentJobTitle: currentTitle,
                isLoading: false
            });
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            this.setState({ isLoading: false });
        })
        .catch(err => {
            console.log(err)
        })
  }

  render() {
    if (this.state.isLoading) {
      return <div>Loading...</div>;
    }
    
    if (!this.state.user) {
      return <div>Error loading user data. Please try again later.</div>;
    }
    
    return (
        <div className="container-fluid pt-3">
            <Row>
                <Col sm={12}>
                    <Card>
                        <Card.Header className="bg-danger">
                            Employee Salary Detail
                        </Card.Header>
                        <Card.Body>
                            <Card.Title><strong>{this.state.user.fullName}</strong></Card.Title>
                            <Card.Text>
                                <Row className="pt-4">
                                    <Col lg={3}>
                                        <img 
                                            className="img-circle elevation-1 bp-2" 
                                            src={`${process.env.PUBLIC_URL}/user-128.png`} 
                                            alt="User"
                                        />
                                    </Col>
                                    <Col className="pt-4" lg={9}>
                                        <div className="emp-view-list">
                                            <ul>
                                                <li><span>Employee ID: </span> {this.state.user.id}</li>
                                                <li><span>Department: </span> {this.state.user.department ? this.state.user.department.departmentName : 'N/A'}</li>
                                                <li><span>Job Title: </span> {this.state.currentJobTitle || 'N/A'}</li>
                                                <li>
                                                    <span>Role: </span>
                                                    {this.state.user.role === 'ROLE_ADMIN' 
                                                        ? 'Admin' 
                                                        : this.state.user.role === 'ROLE_MANAGER' 
                                                            ? 'Manager' 
                                                            : 'Employee'}
                                                </li>
                                            </ul>
                                        </div>
                                    </Col>
                                </Row>

                                <Row className="pt-4">
                                    <Col sm={6}>
                                        <Card className="secondary-card sal-view">
                                            <Card.Header className="bg-danger">Salary Details</Card.Header>
                                            <Card.Body>
                                                <div id="sal-view-details">
                                                    <Form.Group as={Row} className="mb-3">
                                                        <Form.Label column sm={6} className="label">
                                                            Employment Type: 
                                                        </Form.Label>
                                                        <Col sm={6}>
                                                            <span>{this.state.user.user_financial_info?.employmentType || 'N/A'}</span>
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} className="mb-3">
                                                        <Form.Label column sm={6} className="label">
                                                            Basic Salary: 
                                                        </Form.Label>
                                                        <Col sm={6}>
                                                            <span>$ {this.state.user.user_financial_info?.salaryBasic || '0.00'}</span>
                                                        </Col>
                                                    </Form.Group>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    <Col sm={6}>
                                        <Card className="secondary-card sal-view">
                                            <Card.Header className="bg-danger">Allowances</Card.Header>
                                            <Card.Body>
                                                <div id="sal-view-allowances">
                                                    <Form.Group as={Row} className="mb-2">
                                                        <Form.Label column sm={7} className="label">
                                                            House Rent Allowance: 
                                                        </Form.Label>
                                                        <Col sm={5}>
                                                            <span>$ {this.state.user.user_financial_info?.allowanceHouseRent || '0.00'}</span>
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} className="mb-2">
                                                        <Form.Label column sm={7} className="label">
                                                            Medical Allowance: 
                                                        </Form.Label>
                                                        <Col sm={5}>
                                                            <span>$ {this.state.user.user_financial_info?.allowanceMedical || '0.00'}</span>
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} className="mb-2">
                                                        <Form.Label column sm={7} className="label">
                                                            Special Allowance: 
                                                        </Form.Label>
                                                        <Col sm={5}>
                                                            <span>$ {this.state.user.user_financial_info?.allowanceSpecial || '0.00'}</span>
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} className="mb-2">
                                                        <Form.Label column sm={7} className="label">
                                                            Fuel Allowance: 
                                                        </Form.Label>
                                                        <Col sm={5}>
                                                            <span>$ {this.state.user.user_financial_info?.allowanceFuel || '0.00'}</span>
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} className="mb-2">
                                                        <Form.Label column sm={7} className="label">
                                                            Phone Bill Allowance: 
                                                        </Form.Label>
                                                        <Col sm={5}>
                                                            <span>$ {this.state.user.user_financial_info?.allowancePhoneBill || '0.00'}</span>
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} className="mb-2">
                                                        <Form.Label column sm={7} className="label">
                                                            Other Allowance: 
                                                        </Form.Label>
                                                        <Col sm={5}>
                                                            <span>$ {this.state.user.user_financial_info?.allowanceOther || '0.00'}</span>
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} className="mb-0">
                                                        <Form.Label column sm={7} className="label fw-bold">
                                                            Total Allowance: 
                                                        </Form.Label>
                                                        <Col sm={5}>
                                                            <span className="fw-bold">$ {this.state.user.user_financial_info?.allowanceTotal || '0.00'}</span>
                                                        </Col>
                                                    </Form.Group>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>

                                <Row className="pt-4">
                                    <Col sm={6}>
                                        <Card className="secondary-card">
                                            <Card.Header className="bg-danger">Deductions</Card.Header>
                                            <Card.Body>
                                                <div id="sal-view-deductions">
                                                    <Form.Group as={Row} className="mb-2">
                                                        <Form.Label column sm={7} className="label">
                                                            Tax Deduction: 
                                                        </Form.Label>
                                                        <Col sm={5}>
                                                            <span>$ {this.state.user.user_financial_info?.deductionTax || '0.00'}</span>
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} className="mb-0">
                                                        <Form.Label column sm={7} className="label">
                                                            Other Deduction: 
                                                        </Form.Label>
                                                        <Col sm={5}>
                                                            <span>$ {this.state.user.user_financial_info?.deductionOther || '0.00'}</span>
                                                        </Col>
                                                    </Form.Group>
                                                    <hr />
                                                    <Form.Group as={Row} className="mb-0">
                                                        <Form.Label column sm={7} className="label fw-bold">
                                                            Total Deduction: 
                                                        </Form.Label>
                                                        <Col sm={5}>
                                                            <span className="fw-bold">$ {this.state.user.user_financial_info?.deductionTotal || '0.00'}</span>
                                                        </Col>
                                                    </Form.Group>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    <Col sm={6}>
                                        <Card className="secondary-card">
                                            <Card.Header className="bg-danger">Total Salary Details</Card.Header>
                                            <Card.Body>
                                                <div id="sal-view-total">
                                                    <Form.Group as={Row} className="mb-2">
                                                        <Form.Label column sm={7} className="label">
                                                            Gross Salary: 
                                                        </Form.Label>
                                                        <Col sm={5}>
                                                            <span>$ {this.state.user.user_financial_info?.salaryGross || '0.00'}</span>
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} className="mb-2">
                                                        <Form.Label column sm={7} className="label">
                                                            Total Deduction: 
                                                        </Form.Label>
                                                        <Col sm={5}>
                                                            <span>$ {this.state.user.user_financial_info?.deductionTotal || '0.00'}</span>
                                                        </Col>
                                                    </Form.Group>
                                                    <hr />
                                                    <Form.Group as={Row} className="mb-0">
                                                        <Form.Label column sm={7} className="label fw-bold">
                                                            Net Salary: 
                                                        </Form.Label>
                                                        <Col sm={5}>
                                                            <span className="fw-bold text-success">$ {this.state.user.user_financial_info?.salaryNet || '0.00'}</span>
                                                        </Col>
                                                    </Form.Group>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
  }
}