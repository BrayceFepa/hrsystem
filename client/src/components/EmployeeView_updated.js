import React, { Component } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { FiFileText } from 'react-icons/fi';

export default class EmployeeView extends Component {
  // ... existing code ...

  render() {
    return (
      <div className="container-fluid pt-3">
        {this.state.falseRedirect ? <Redirect to="/" /> : null}
        {this.state.editRedirect ? (
          <Redirect to={{ pathname: "/employee-edit", state: { selectedUser: this.state.user } }} />
        ) : null}
        <Row>
          <Col sm={12}>
            <Card className="border-danger">
              <Card.Header className="bg-danger d-flex justify-content-between align-items-center">
                <b className="text-medium">Employee Detail</b>
                <div>
                  <Link 
                    to={{
                      pathname: "/employee/certificates",
                      state: { 
                        userId: this.state.user.id, 
                        userName: this.state.user.fullName 
                      }
                    }}
                    className="btn btn-outline-light btn-sm me-2"
                  >
                    <FiFileText className="me-1" /> View Certificates
                  </Link>
                  <span 
                    className="text-medium text-white" 
                    style={{ cursor: 'pointer' }} 
                    onClick={this.onEdit}
                  >
                    <i className="far fa-edit me-1"></i> Edit
                  </span>
                </div>
              </Card.Header>
              {/* Rest of the component remains the same */}
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
