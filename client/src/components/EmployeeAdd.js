import React, { Component } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from "moment";

// Custom styles for file upload buttons and form controls
const customFileUploadStyles = `
  .custom-file-upload .custom-file-label::after {
    content: 'Browse';
    background-color: #dc3545;
    color: white;
    border-color: #dc3545;
    transition: all 0.2s ease-in-out;
  }
  
  .custom-file-upload .custom-file-label:hover::after {
    background-color: #c82333;
    border-color: #bd2130;
    cursor: pointer;
  }
  
  .react-datepicker-popper {
    z-index: 10 !important;
  }
  
  .react-datepicker {
    z-index: 10 !important;
  }
  
  /* Red border for active input fields */
  .form-control:focus {
    border-color: #dc3545 !important;
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
  }
  
  .custom-select:focus {
    border-color: #dc3545 !important;
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
  }
  
  .custom-file-input:focus ~ .custom-file-label {
    border-color: #dc3545 !important;
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
  }
  
  .react-datepicker-wrapper input:focus {
    border-color: #dc3545 !important;
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
  }
`;

// Add the styles to the document head
const styleElement = document.createElement('style');
styleElement.textContent = customFileUploadStyles;
document.head.appendChild(styleElement);

export default class EmployeeAdd extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastname: "",
      dateOfBirth: "",
      gender: "",
      maritalStatus: "",
      // fathername: "",
      idNumber: "",
      bankName: "",
      accountName: "",
      accountNumber: "",
      branch: "",
      address: "",
      country: "",
      city: "",
      // mobile: null,
      phone: null,
      email: "",
      username: "",
      password: "",
      role: "",
      department: "",
      departmentId: null,
      startDate: "",
      empType: "",
      empStatus: "",
      endDate: "",
      departments: [],
      jobTitle: null,
      // joiningDate: "",
      idCopy: null,
      contract: null,
      nationalIdNumber: "",
      certificate: null,
      hasError: false,
      errMsg: "",
      completed: false,
      emergencyContact: "",
    };
  }

  componentDidMount() {
    axios({
      method: "get",
      url: "/api/departments",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        // Check if response has items array, otherwise use empty array as fallback
        const departments = Array.isArray(res.data?.items) ? res.data.items : [];
        this.setState({ departments });
      })
      .catch((err) => {
        console.error("Error fetching departments:", err);
        // Set empty array as fallback
        this.setState({ departments: [] });
      });
  }

  handleChange = (event) => {
    const { value, name, type, files } = event.target;
    
    if (type === 'file') {
      this.setState({
        [name]: files[0]
      });
    } else {
      this.setState({
        [name]: value,
      });
    }
  };

handleFileUpload = (file, apiEndpoint, userId, fieldName = 'file') => {
  if (!file) return Promise.resolve();
  
  const formData = new FormData();
  formData.append(fieldName, file);
  formData.append('userId', userId);
  
  return axios({
    method: 'post',
    url: `/api/${apiEndpoint}`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
};

onSubmit = (e) => {
  e.preventDefault();
  this.setState({ hasError: false, errorMsg: "", completed: false });

    let user = {
      username: this.state.username,
      password: this.state.password,
      fullname: this.state.firstName + " " + this.state.lastname,
      role: this.state.role,
      departmentId: this.state.departmentId,
      active: 1,
      emergencyContact: this.state.emergencyContact,
    };

    e.preventDefault();
    
    // Function to get error message from error response
    const getErrorMessage = (error) => {
      if (error.response) {
        return error.response.data?.message || 'An error occurred while processing your request';
      } else if (error.request) {
        return 'No response received from server. Please check your connection.';
      } else {
        return error.message || 'An error occurred';
      }
    };

    // 1. Create User
    axios({
      method: "post",
      url: "/api/users",
      data: user,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}` 
      },
    })
    .then((res) => {
      const userData = res.data?.data || res.data; // Handle both { data: {...} } and direct response
      const userId = userData.id;

      if (!userId) {
        throw new Error('User ID not found in response');
      }

      // 2. Prepare Personal Information FormData
      const personalInfoFormData = new FormData();
      
      // Add all personal info fields to formData
      const personalInfoFields = {
        dateOfBirth: this.state.dateOfBirth,
        gender: this.state.gender,
        maritalStatus: this.state.maritalStatus,
        fatherName: this.state.fathername,
        idNumber: this.state.idNumber,
        address: this.state.address,
        city: this.state.city,
        country: this.state.country,
        phone: this.state.phone,
        emailAddress: this.state.email,
        emergencyContact: this.state.emergencyContact,
        userId: userId,
        nationalIdNumber: this.state.nationalIdNumber,
      };

      // Append all fields to formData
      Object.entries(personalInfoFields).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          personalInfoFormData.append(key, value);
        }
      });

      // Append ID copy file if exists
      if (this.state.idCopy) {
        personalInfoFormData.append('idCopy', this.state.idCopy);
      }

      // 3. Create Personal Information with file upload
      return axios({
        method: 'post',
        url: '/api/personalInformations',
        data: personalInfoFormData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(() => userId); // Return userId for next then
    })
    .then((userId) => {
      // 4. Create Financial Information
      const userFinancialInfo = {
        bankName: this.state.bankName,
        accountName: this.state.accountName,
        accountNumber: this.state.accountNumber,
        branch: this.state.branch,  // Added branch field
        iban: this.state.iBan,
        userId: userId,
      };

      return Promise.all([
        axios({
          method: 'post',
          url: '/api/financialInformations',
          data: userFinancialInfo,
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
          },
        }),
        userId // Pass userId to next then
      ]);
    })
    .then(([financialInfoRes, userId]) => {
      // 5. Create Job with FormData to support file uploads
      const jobFormData = new FormData();
      
      // Add all job fields to formData
      const jobFields = {
        jobTitle: this.state.jobTitle,
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        empType: this.state.empType,
        empStatus: 'Active',
        directSupervisor: this.state.directSupervisor, // Ensure directSupervisor is always sent
        userId: userId,
      };

      // Append all job fields to formData
      Object.entries(jobFields).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          // Convert to string to ensure proper form data handling
          jobFormData.append(key, String(value));
        }
      });

      // Append contract file if exists
      if (this.state.contract) {
        jobFormData.append('contract', this.state.contract);
      }

      // Append certificate file if exists
      if (this.state.certificate) {
        jobFormData.append('certificate', this.state.certificate);
      }

      // Create job with file uploads
      return axios({
        method: 'post',
        url: '/api/jobs',
        data: jobFormData,
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
      });
    })
    .then(() => {
      this.setState({ 
        completed: true,
        hasError: false,
        errMsg: ""
      });
      window.scrollTo(0, 0);
    })
    .catch((err) => {
      console.error("Error creating employee:", err);
      this.setState({ 
        hasError: true, 
        errMsg: getErrorMessage(err),
        completed: false
      });
      window.scrollTo(0, 0);
    });
  };

  pushDepartments = () => {
    let items = [];
    this.state.departments.map((dept, index) => {
      items.push(
        <option key={index} value={dept.id}>
          {dept.departmentName}
        </option>
      );
    });
    return items;
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <div className="row">
          {this.state.hasError ? (
            <Alert variant="danger" className="m-3" block>
              {this.state.errMsg}
            </Alert>
          ) : this.state.completed ? (
            <Alert variant="success" className="m-3" block>
              Employee has been inserted.
            </Alert>
          ) : (
            <></>
          )}

          {/* Main Card */}
          <Card className="col-sm-12 main-card mb-3 border-danger">
            <Card.Header className="bg-danger">
              <b className="text-medium">Add Employee</b>
            </Card.Header>
            <Card.Body>
              <div className="row">
                {/* Personal Details Card */}
                <div className="col-sm-6">
                  <Card className="secondary-card">
                    <Card.Header className="bg-danger">Personal Details</Card.Header>
                    <Card.Body>
                      <Card.Text>
                        <Form.Group controlId="formFirstName">
                          <Form.Label className="text-muted required">
                            First Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter first Name"
                            name="firstName"
                            value={this.state.firstName}
                            onChange={this.handleChange}
                            required
                          />
                        </Form.Group>

                        <Form.Group controlId="formLastName">
                          <Form.Label className="text-muted required">
                            Last Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Last Name"
                            name="lastname"
                            value={this.state.lastname}
                            onChange={this.handleChange}
                            required
                          />
                        </Form.Group>
                        <Form.Group controlId="formUsername">
                          <Form.Label className="text-muted required">
                            Username
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Username"
                            name="username"
                            value={this.state.username}
                            onChange={this.handleChange}
                            required
                          />
                        </Form.Group>

                        <Form.Group controlId="formDateofBirth">
                          <Form.Label className="text-muted required">
                            Date of Birth
                          </Form.Label>
                          <Form.Row>
                            <DatePicker
                              selected={this.state.dateOfBirth}
                              onChange={(dateOfBirth) =>
                                this.setState({ dateOfBirth })
                              }
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              timeFormat="HH:mm"
                              name="dateOfBirth"
                              timeIntervals={30}
                              timeCaption="time"
                              dateFormat="yyyy-MM-dd"
                              className="form-control ml-1"
                              placeholderText="Select Date Of Birth"
                              autoComplete="off"
                              required
                            />
                          </Form.Row>
                        </Form.Group>

                        <Form.Group controlId="formGender">
                          <Form.Label className="text-muted required">
                            Gender
                          </Form.Label>
                          <Form.Control
                            as="select"
                            value={this.state.gender}
                            onChange={this.handleChange}
                            name="gender"
                            required
                          >
                            <option value="">Choose...</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formMaritalStatus">
                          <Form.Label className="text-muted required">
                            Marital Status
                          </Form.Label>
                          <Form.Control
                            as="select"
                            value={this.state.maritalStatus}
                            onChange={this.handleChange}
                            name="maritalStatus"
                            required
                          >
                            <option value="">Choose...</option>
                            <option value="married">Married</option>
                            <option value="single">Single</option>
                          </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formId">
                          <Form.Label className="text-muted required">
                            National ID / Passport number
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter ID Number"
                            name="nationalIdNumber"
                            value={this.state.nationalIdNumber}
                            onChange={this.handleChange}
                            required
                          />
                        </Form.Group>
                        <Form.Group controlId="formIdCopy">
                          <Form.Label className="text-muted required">
                            ID Copy / Passport Copy
                          </Form.Label>
                          <Form.File
                            id="idCopy"
                            label={this.state.idCopy ? this.state.idCopy.name : "Choose file"}
                            custom
                            onChange={(e) => this.setState({ idCopy: e.target.files[0] })}
                            className="custom-file-upload"
                          />
                        </Form.Group>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-sm-6">
                  <Card className="secondary-card">
                    <Card.Header className="bg-danger">Contact Details</Card.Header>
                    <Card.Body>
                      <Card.Text>
                        <Form.Group controlId="formAddress">
                          <Form.Label className="text-muted required">
                            Address
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={this.state.address}
                            onChange={this.handleChange}
                            name="address"
                            placeholder="Enter Address"
                            required
                          />
                        </Form.Group>
                        <Form.Group controlId="formCountry">
                          <Form.Label className="text-muted required">
                            Country
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={this.state.country}
                            onChange={this.handleChange}
                            name="country"
                            placeholder="Enter Country"
                            required
                          />
                        </Form.Group>
                        <Form.Group controlId="formCity">
                          <Form.Label className="text-muted required">
                            City
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={this.state.city}
                            onChange={this.handleChange}
                            name="city"
                            placeholder="Enter City"
                            required
                          />
                        </Form.Group>
                        <Form.Group controlId="formPhone">
                          <Form.Label className="text-muted required">
                            Phone number
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={this.state.phone}
                            onChange={this.handleChange}
                            name="phone"
                            placeholder="Enter Phone Number"
                            required
                          />
                        </Form.Group>
                        <Form.Group controlId="formEmergencyContact">
                          <Form.Label className="text-muted required">
                            Emergency Contact
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Emergency Contact"
                            name="emergencyContact"
                            value={this.state.emergencyContact}
                            onChange={this.handleChange}
                            required
                          />
                        </Form.Group>
                        {/* <Form.Group controlId="formPhone">
                          <Form.Label className="text-muted">Phone</Form.Label>
                          <Form.Control
                            type="text"
                            value={this.state.phone}
                            onChange={this.handleChange}
                            name="phone"
                            placeholder="Enter Phone"
                          />
                        </Form.Group> */}
                        <Form.Group controlId="formEmail">
                          <Form.Label className="text-muted required">
                            Email
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={this.state.email}
                            onChange={this.handleChange}
                            name="email"
                            placeholder="Enter Email"
                            required
                          />
                        </Form.Group>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <Card className="secondary-card">
                    <Card.Header className="bg-danger">Job</Card.Header>
                    <Card.Body>
                      <Card.Text>
                        <Form.Group controlId="formJobTitle">
                          <Form.Label className="text-muted required">
                            Job Title
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={this.state.jobTitle}
                            onChange={this.handleChange}
                            name="jobTitle"
                            placeholder="Enter Job Title"
                          />
                        </Form.Group>
                        <Form.Group controlId="formEmploymentType">
                          <Form.Label className="text-muted required">
                            Employment Type
                          </Form.Label>
                          <Form.Control
                            as="select"
                            value={this.state.empType}
                            onChange={this.handleChange}
                            name="empType"
                            required
                          >
                            <option value="">Choose...</option>
                            <option value="Full Time">Full Time</option>
                            <option value="Part Time">Part Time</option>
                            <option value="Contract">Contract</option>
                            <option value="Probation">Probation</option>
                          </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formDirectSupervisor">
                          <Form.Label className="text-muted required">
                            Direct Supervisor
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={this.state.directSupervisor}
                            onChange={this.handleChange}
                            name="directSupervisor"
                            placeholder="Enter Direct Supervisor"
                          />
                        </Form.Group>
                        {/* <Form.Group controlId="formEmploymentStatus">
                          <Form.Label className="text-muted required">
                            Status
                          </Form.Label>
                          <Form.Control
                            as="select"
                            value={this.state.empSatus}
                            onChange={this.handleChange}
                            name="empStatus"
                            required
                          >
                            <option value="">Choose...</option>
                            <option value="Active">Active</option>
                            <option value="Probation">Probation</option>
                            <option value="Resigned">Resigned</option>
                            <option value="Probation">Terminated</option>
                            <option value="On Leave">On Leave</option>
                          </Form.Control>
                        </Form.Group> */}
                        <Form.Group controlId="formContract">
                          <Form.Label className="text-muted required">
                            Employment Contract
                          </Form.Label>
                          <Form.File
                            id="contract"
                            label={this.state.contract ? this.state.contract.name : "Upload Contract"}
                            custom
                            onChange={(e) => this.setState({ contract: e.target.files[0] })}
                            className="mb-3 custom-file-upload"
                          />
                        </Form.Group>
                        <Form.Group controlId="formCertificate">
                          <Form.Label className="text-muted required">
                            Professional Certificates
                          </Form.Label>
                          <Form.File
                            id="certificate"
                            label={this.state.certificate ? this.state.certificate.name : "Upload Certificates"}
                            custom
                            onChange={(e) => this.setState({ certificate: e.target.files[0] })}
                            className="mb-3 custom-file-upload"
                          />
                        </Form.Group>
                        <Form.Group controlId="formJobStart">
                          <Form.Label className="text-muted required">
                            Start Date
                          </Form.Label>
                          <Form.Row>
                            <DatePicker
                              selected={this.state.startDate}
                              onChange={(startDate) =>
                                this.setState({ startDate })
                              }
                              dropdownMode="select"
                              timeFormat="HH:mm"
                              name="startDate"
                              timeCaption="time"
                              dateFormat="yyyy-MM-dd"
                              className="form-control ml-1"
                              placeholderText="Select Start Date"
                              autoComplete="off"
                              required
                            />
                          </Form.Row>
                        </Form.Group>
                        <Form.Group controlId="formJobEnd">
                          <Form.Label className="text-muted ">
                            End Date <span className="italic text-gray-400 ">(Not required)</span> 
                          </Form.Label>
                          <Form.Row>
                            <DatePicker
                              selected={this.state.endDate}
                              onChange={(endDate) => this.setState({ endDate })}
                              dropdownMode="select"
                              timeFormat="HH:mm"
                              name="endDate"
                              timeCaption="time"
                              dateFormat="yyyy-MM-dd"
                              className="form-control ml-1"
                              placeholderText="Select End Date"
                              autoComplete="off"
                            />
                          </Form.Row>
                        </Form.Group>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-sm-6">
                  <Card className="secondary-card">
                    <Card.Header className="bg-danger">Official Status</Card.Header>
                    <Card.Body>
                      <Card.Text>
                        <Form.Group controlId="formEmployeeId">
                          <Form.Label className="text-muted required">
                            Employee ID
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={this.state.idNumber}
                            onChange={this.handleChange}
                            name="idNumber"
                            placeholder="Enter Employee ID"
                            required
                          />
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                          <Form.Label className="text-muted required">
                            Password
                          </Form.Label>
                          <Form.Control
                            type="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                            name="password"
                            placeholder="Enter Password"
                            required
                          />
                        </Form.Group>
                        <Form.Group controlId="formDepartment">
                          <Form.Label className="text-muted required">
                            Department
                          </Form.Label>
                          <Form.Control
                            as="select"
                            value={this.state.departmentId}
                            onChange={this.handleChange}
                            name="departmentId"
                            required
                          >
                            <option value="" defaultValue>
                              Choose...
                            </option>
                            {this.pushDepartments()}
                          </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formRole">
                          <Form.Label className="text-muted required">
                            Role
                          </Form.Label>
                          <Form.Control
                            as="select"
                            value={this.state.role}
                            onChange={this.handleChange}
                            name="role"
                            required
                          >
                            <option value="">Choose...</option>
                            <option value="ROLE_ADMIN">Admin</option>
                            <option value="ROLE_MANAGER">Manager</option>
                            <option value="ROLE_EMPLOYEE">Employee</option>
                          </Form.Control>
                        </Form.Group>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <Button variant="danger" type="submit" block>
                    Submit
                  </Button>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <Card className="secondary-card">
                    <Card.Header className="bg-danger">Bank Information</Card.Header>
                    <Card.Body>
                      <Card.Text>
                        <Form.Group controlId="formBankName">
                          <Form.Label className="text-muted required">
                            Bank Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={this.state.bankName}
                            onChange={this.handleChange}
                            name="bankName"
                            placeholder="Enter Bank name"
                          />
                        </Form.Group>
                        {/* <Form.Group controlId="formAccountName">
                          <Form.Label className="text-muted">
                            Account Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={this.state.accountName}
                            onChange={this.handleChange}
                            name="accountName"
                            placeholder="Enter Account name"
                          />
                        </Form.Group> */}
                        <Form.Group controlId="formAccountNumber">
                          <Form.Label className="text-muted required">
                            Account Number
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={this.state.accountNumber}
                            onChange={this.handleChange}
                            name="accountNumber"
                            placeholder="Enter Account number"
                          />
                        </Form.Group>
                        <Form.Group controlId="formBranch">
                          <Form.Label className="text-muted required">Branch</Form.Label>
                          <Form.Control
                            type="text"
                            value={this.state.branch}
                            onChange={this.handleChange}
                            name="branch"
                            placeholder="Enter Branch"
                          />
                        </Form.Group>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Form>
    );
  }
}
