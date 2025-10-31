import React, { Component } from 'react';
import { Card, Table, Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import { FiPlus, FiDownload, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import axios from 'axios';
import moment from 'moment';

export default class EmployeeCertificates extends Component {
  state = {
    certificates: [],
    showAddModal: false,
    showEditModal: false,
    showDeleteModal: false,
    selectedCertificate: null,
    formData: {
      certificateType: 'Certificate',
      certificateName: '',
      issuingAuthority: '',
      issueDate: '',
      expiryDate: '',
      certificateNumber: '',
      file: null,
      remarks: ''
    },
    error: '',
    success: '',
    loading: true,
    userId: null
  };

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem('user'));
    this.setState({ userId: user.id }, this.fetchCertificates);
  }

  fetchCertificates = () => {
    this.setState({ loading: true, error: '' });
    
    axios({
      method: 'get',
      url: `/api/userCertificates/user/${this.state.userId}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => {
      this.setState({ 
        certificates: res.data,
        loading: false 
      });
    })
    .catch(err => {
      console.error('Error fetching certificates:', err);
      this.setState({ 
        error: 'Failed to load certificates. Please try again.',
        loading: false 
      });
    });
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [name]: value
      }
    }));
  };

  handleFileChange = (e) => {
    this.setState({
      formData: {
        ...this.state.formData,
        file: e.target.files[0]
      }
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { formData, userId } = this.state;
    
    const data = new FormData();
    data.append('userId', userId);
    data.append('certificateType', formData.certificateType);
    data.append('certificateName', formData.certificateName);
    data.append('issuingAuthority', formData.issuingAuthority);
    if (formData.issueDate) data.append('issueDate', formData.issueDate);
    if (formData.expiryDate) data.append('expiryDate', formData.expiryDate);
    if (formData.certificateNumber) data.append('certificateNumber', formData.certificateNumber);
    if (formData.remarks) data.append('remarks', formData.remarks);
    if (formData.file) data.append('filePath', formData.file);

    this.setState({ loading: true });

    axios({
      method: 'post',
      url: '/api/userCertificates',
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => {
      this.setState({
        showAddModal: false,
        formData: {
          certificateType: 'Certificate',
          certificateName: '',
          issuingAuthority: '',
          issueDate: '',
          expiryDate: '',
          certificateNumber: '',
          file: null,
          remarks: ''
        },
        success: 'Certificate added successfully!',
        error: ''
      }, this.fetchCertificates);
    })
    .catch(err => {
      console.error('Error adding certificate:', err);
      this.setState({
        error: 'Failed to add certificate. ' + (err.response?.data?.message || 'Please try again.'),
        success: '',
        loading: false
      });
    });
  };

  handleDelete = () => {
    const { selectedCertificate } = this.state;
    
    axios({
      method: 'delete',
      url: `/api/userCertificates/${selectedCertificate.id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(() => {
      this.setState({
        showDeleteModal: false,
        selectedCertificate: null,
        success: 'Certificate deleted successfully!',
        error: ''
      }, this.fetchCertificates);
    })
    .catch(err => {
      console.error('Error deleting certificate:', err);
      this.setState({
        error: 'Failed to delete certificate. ' + (err.response?.data?.message || 'Please try again.'),
        success: '',
        loading: false
      });
    });
  };

  renderCertificateTypeBadge = (type) => {
    const typeColors = {
      'Degree': 'primary',
      'Diploma': 'success',
      'Certificate': 'info',
      'ID Card': 'warning',
      'Passport': 'danger',
      'Other': 'secondary'
    };

    return (
      <span className={`badge bg-${typeColors[type] || 'secondary'}`}>
        {type}
      </span>
    );
  };

  render() {
    const { 
      certificates, loading, error, success, 
      showAddModal, showDeleteModal, formData 
    } = this.state;

    return (
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>My Certificates & Documents</h3>
          <Button 
            variant="primary" 
            onClick={() => this.setState({ showAddModal: true, error: '', success: '' })}
          >
            <FiPlus className="me-2" /> Add Certificate
          </Button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Card>
          <Card.Body>
            {loading ? (
              <div className="text-center p-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : certificates.length === 0 ? (
              <div className="text-center p-4">
                <p className="text-muted">No certificates found. Add your first certificate to get started.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Name</th>
                      <th>Issuing Authority</th>
                      <th>Issue Date</th>
                      <th>Expiry Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificates.map(cert => (
                      <tr key={cert.id}>
                        <td>{this.renderCertificateTypeBadge(cert.certificateType)}</td>
                        <td>{cert.certificateName}</td>
                        <td>{cert.issuingAuthority || '-'}</td>
                        <td>{cert.issueDate ? moment(cert.issueDate).format('DD MMM YYYY') : '-'}</td>
                        <td>{cert.expiryDate ? moment(cert.expiryDate).format('DD MMM YYYY') : 'N/A'}</td>
                        <td>
                          {cert.isActive ? (
                            <span className="badge bg-success">Active</span>
                          ) : (
                            <span className="badge bg-secondary">Inactive</span>
                          )}
                        </td>
                        <td>
                          {cert.filePath && (
                            <a 
                              href={`${process.env.REACT_APP_API_URL}/${cert.filePath.replace(/\\/g, '/')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-primary me-1"
                              title="View Document"
                            >
                              <FiEye />
                            </a>
                          )}
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => this.setState({ 
                              showDeleteModal: true, 
                              selectedCertificate: cert 
                            })}
                            title="Delete Certificate"
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Add Certificate Modal */}
        <Modal show={showAddModal} onHide={() => this.setState({ showAddModal: false })}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Certificate</Modal.Title>
          </Modal.Header>
          <Form onSubmit={this.handleSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Certificate Type</Form.Label>
                <Form.Select 
                  name="certificateType" 
                  value={formData.certificateType}
                  onChange={this.handleInputChange}
                  required
                >
                  <option value="Certificate">Certificate</option>
                  <option value="Degree">Degree</option>
                  <option value="Diploma">Diploma</option>
                  <option value="ID Card">ID Card</option>
                  <option value="Passport">Passport</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Certificate Name</Form.Label>
                <Form.Control
                  type="text"
                  name="certificateName"
                  value={formData.certificateName}
                  onChange={this.handleInputChange}
                  placeholder="e.g., Bachelor of Science in Computer Science"
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Issue Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="issueDate"
                      value={formData.issueDate}
                      onChange={this.handleInputChange}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Expiry Date (if any)</Form.Label>
                    <Form.Control
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={this.handleInputChange}
                      min={formData.issueDate || new Date().toISOString().split('T')[0]}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Issuing Authority</Form.Label>
                <Form.Control
                  type="text"
                  name="issuingAuthority"
                  value={formData.issuingAuthority}
                  onChange={this.handleInputChange}
                  placeholder="e.g., University of Technology"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Certificate Number (if any)</Form.Label>
                <Form.Control
                  type="text"
                  name="certificateNumber"
                  value={formData.certificateNumber}
                  onChange={this.handleInputChange}
                  placeholder="e.g., CER-12345"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Document (PDF, JPG, PNG, max 5MB)</Form.Label>
                <Form.Control
                  type="file"
                  onChange={this.handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <Form.Text className="text-muted">
                  Upload a scanned copy of the certificate/document.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="remarks"
                  value={formData.remarks}
                  onChange={this.handleInputChange}
                  placeholder="Any additional information..."
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button 
                variant="secondary" 
                onClick={() => this.setState({ showAddModal: false })}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Certificate'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => this.setState({ showDeleteModal: false })}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this certificate? This action cannot be undone.
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => this.setState({ showDeleteModal: false })}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={this.handleDelete}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
