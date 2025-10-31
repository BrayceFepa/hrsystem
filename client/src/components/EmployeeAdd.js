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
      nationalIdNumber: "",

      // Financial Information
      bankName: "",
      accountName: "",
      accountNumber: "",
      branch: "",
      iban: "",
      empType: "",
      salaryBasic: "",
      salaryGross: "",
      salaryNet: "",
      allowanceHouseRent: "",
      allowanceMedical: "",
      allowanceSpecial: "",
      allowanceFuel: "",
      allowancePhoneBill: "",
      allowanceOther: "",
      allowanceTotal: "",
      deductionProvidentFund: "",
      deductionTax: "",
      deductionOther: "",
      deductionTotal: "",

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
      certificate: null,
      hasError: false,
      errMsg: "",
      completed: false,
      emergencyContact: "",
      emergencyContactId: "",
      guarantorId: "",
      guarantorSignature: null,
      takenAssets: "",
      agreementType: "",
      guaranteeForm: null,
      companySupportLetter: null,
      remark: ""
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

  onSubmit = async (e) => {
    e.preventDefault();
    this.setState({ hasError: false, errorMsg: "", completed: false });

    try {
      // 1. Create User first
      const user = {
        username: this.state.username,
        password: this.state.password,
        fullname: `${this.state.firstName} ${this.state.lastname}`,
        role: this.state.role,
        departmentId: this.state.departmentId,
        active: 1,
        emergencyContact: this.state.emergencyContact,
      };

      // 2. Create user to get userId
      const userResponse = await axios({
        method: "post",
        url: "/api/users",
        data: user,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
      });

      const userData = userResponse.data?.data || userResponse.data;
      const userId = userData.id;

      if (!userId) {
        throw new Error('User ID not found in response');
      }

      // 3. Prepare FormData for personal information
      const personalInfoFormData = new FormData();

      // Add all personal info fields to formData
      const personalInfoFields = {
        dateOfBirth: this.state.dateOfBirth ? moment(this.state.dateOfBirth).format('YYYY-MM-DD') : null,
        gender: this.state.gender,
        maritalStatus: this.state.maritalStatus,
        nationalIdNumber: this.state.nationalIdNumber,
        address: this.state.address,
        city: this.state.city,
        country: this.state.country,
        phone: this.state.phone,
        emailAddress: this.state.email,
        emergencyContact: this.state.emergencyContact,
        emergencyContactId: this.state.emergencyContactId,
        guarantorId: this.state.guarantorId,
        remark: this.state.remark,
        userId: userId
      };

      // Append all fields to formData
      Object.entries(personalInfoFields).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          personalInfoFormData.append(key, value);
        }
      });

      // Append files if they exist
      if (this.state.idCopy) {
        personalInfoFormData.append('idCopy', this.state.idCopy);
      }
      if (this.state.guarantorSignature) {
        personalInfoFormData.append('guarantorSignature', this.state.guarantorSignature);
      }

      // 4. Create Personal Information with file uploads
      await axios({
        method: 'post',
        url: '/api/personalInformations',  // Note the plural form
        data: personalInfoFormData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // 5. Create Financial Information
      const financialInfo = {
        empType: this.state.empType,
        salaryBasic: parseFloat(this.state.salaryBasic) || 0,
        salaryGross: parseFloat(this.state.salaryGross) || 0,
        salaryNet: parseFloat(this.state.salaryNet) || 0,
        allowanceHouseRent: parseFloat(this.state.allowanceHouseRent) || 0,
        allowanceMedical: parseFloat(this.state.allowanceMedical) || 0,
        allowanceSpecial: parseFloat(this.state.allowanceSpecial) || 0,
        allowanceFuel: parseFloat(this.state.allowanceFuel) || 0,
        allowancePhoneBill: parseFloat(this.state.allowancePhoneBill) || 0,
        allowanceOther: parseFloat(this.state.allowanceOther) || 0,
        allowanceTotal: parseFloat(this.state.allowanceTotal) || 0,
        deductionProvidentFund: parseFloat(this.state.deductionProvidentFund) || 0,
        deductionTax: parseFloat(this.state.deductionTax) || 0,
        deductionOther: parseFloat(this.state.deductionOther) || 0,
        deductionTotal: parseFloat(this.state.deductionTotal) || 0,
        bankName: this.state.bankName,
        accountName: this.state.accountName,
        accountNumber: this.state.accountNumber,
        branch: this.state.branch,
        iban: this.state.iban,
        nationalIdNumber: this.state.nationalIdNumber,
        userId: userId,
      };

      await axios({
        method: 'post',
        url: '/api/financialInformations',  // Note the plural form
        data: financialInfo,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // 6. Create Job
      const jobFormData = new FormData();
      const jobFields = {
        jobTitle: this.state.jobTitle,
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        empType: this.state.empType,
        empStatus: 'Active',
        directSupervisor: this.state.directSupervisor,
        agreementType: this.state.agreementType,
        takenAssets: this.state.takenAssets,
        userId: userId,
      };

      // Append job fields to formData
      Object.entries(jobFields).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          jobFormData.append(key, value);
        }
      });

      // Append job-related files if they exist
      if (this.state.contract) {
        jobFormData.append('contract', this.state.contract);
      }
      if (this.state.certificate) {
        jobFormData.append('certificate', this.state.certificate);
      }
      if (this.state.guaranteeForm) {
        jobFormData.append('guaranteeForm', this.state.guaranteeForm);
      }
      if (this.state.companyGuaranteeSupportLetter) {
        jobFormData.append('companyGuaranteeSupportLetter', this.state.companyGuaranteeSupportLetter);
      }

      // Add documentScanned field
      jobFormData.append('documentScanned', this.state.documentScanned ? 'true' : 'false');

      await axios({
        method: 'post',
        url: '/api/jobs',
        data: jobFormData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // 7. Update state on success
      this.setState({
        completed: true,
        hasError: false,
        errMsg: ""
      }, () => {
        this.resetForm();
        window.scrollTo(0, 0);
      });

    } catch (error) {
      console.error("Error creating employee:", error);
      this.setState({
        hasError: true,
        errMsg: this.getErrorMessage(error),
        completed: false
      });
      window.scrollTo(0, 0);
    }
  };

  // Add this helper method if not already present
  getErrorMessage = (error) => {
    if (error.response) {
      return error.response.data?.message ||
        error.response.data?.error ||
        `Error: ${error.response.status} - ${error.response.statusText}`;
    } else if (error.request) {
      return 'No response from server. Please check your connection.';
    } else {
      return error.message || 'An error occurred while processing your request.';
    }
  };
  resetForm = () => {
    this.setState({
      firstName: "",
      lastname: "",
      dateOfBirth: "",
      gender: "",
      maritalStatus: "",
      nationalIdNumber: "",

      // Financial Information
      bankName: "",
      accountName: "",
      accountNumber: "",
      branch: "",
      iban: "",
      // empType: "Full Time",
      salaryBasic: "",
      salaryGross: "",
      salaryNet: "",
      allowanceHouseRent: "",
      allowanceMedical: "",
      allowanceSpecial: "",
      allowanceFuel: "",
      allowancePhoneBill: "",
      allowanceOther: "",
      allowanceTotal: "",
      deductionProvidentFund: "",
      deductionTax: "",
      deductionOther: "",
      deductionTotal: "",

      address: "",
      country: "",
      city: "",
      phone: "",
      email: "",
      username: "",
      password: "",
      role: "",
      directSupervisor: "",
      department: "",
      departmentId: null,
      startDate: "",
      empType: "",
      empStatus: "",
      endDate: "",
      jobTitle: "",
      idCopy: null,
      contract: null,
      certificate: null,
      emergencyContact: "",
      emergencyContactId: "",
      guarantorId: "",
      guarantorSignature: null,
      takenAssets: "",
      agreementType: "",
      guaranteeForm: null,
      companySupportLetter: null,
      remark: ""
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
      return null; // Add return to prevent warning
    });
    return items;
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <div className="row">
          {this.state.hasError ? (
            <Alert variant="danger" className="m-3 w-100">
              {this.state.errMsg}
            </Alert>
          ) : this.state.completed ? (
            <Alert variant="success" className="m-3 w-100">
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
                            accept=".pdf,.jpg,.jpeg,.png,.gif"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                // Check file type
                                const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
                                if (!validTypes.includes(file.type)) {
                                  alert('Invalid file type. Please upload a PDF, JPG, PNG, or GIF file.');
                                  e.target.value = null;
                                  return;
                                }
                                // Check file size (5MB max)
                                if (file.size > 5 * 1024 * 1024) {
                                  alert('File size exceeds 5MB limit');
                                  e.target.value = null;
                                  return;
                                }
                                this.setState({ idCopy: file });
                              }
                            }}
                            className="custom-file-upload"
                          />
                        </Form.Group>

                        <Form.Group controlId="formRemark">
                          <Form.Label className="text-muted">
                            Additional Notes
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter any additional notes or remarks"
                            name="remark"
                            value={this.state.remark}
                            onChange={this.handleChange}
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
                            placeholder="Jane Doe - +1234567890 (Sister)"
                            name="emergencyContact"
                            value={this.state.emergencyContact}
                            onChange={this.handleChange}
                            required
                          />
                        </Form.Group>

                        <Form.Group controlId="formEmergencyContactId">
                          <Form.Label className="text-muted">
                            Emergency Contact ID
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Emergency Contact ID"
                            name="emergencyContactId"
                            value={this.state.emergencyContactId}
                            onChange={this.handleChange}
                          />
                        </Form.Group>

                        <Form.Group controlId="formGuarantorId">
                          <Form.Label className="text-muted required">
                            Guarantor ID
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Guarantor ID"
                            name="guarantorId"
                            value={this.state.guarantorId}
                            onChange={this.handleChange}
                            required
                          />
                        </Form.Group>

                        <Form.Group controlId="formGuarantorSignature">
                          <Form.Label className="text-muted required">
                            Guarantor Signature
                          </Form.Label>
                          <Form.File
                            id="guarantorSignature"
                            label={this.state.guarantorSignature ? this.state.guarantorSignature.name : "Upload Guarantor Signature"}
                            custom
                            onChange={(e) => this.setState({ guarantorSignature: e.target.files[0] })}
                            className="mb-3 custom-file-upload"
                          /></Form.Group>
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
                          >
                            <option value="Full Time">Full Time</option>
                            <option value="Part Time">Part Time</option>
                            <option value="Internship">Internship</option>
                            <option value="Contractual">Contractual</option>
                          </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formTakenAssets">
                          <Form.Label className="text-muted">
                            Taken Assets
                          </Form.Label>
                          <Form.Control
                            type="text"
                            rows={3}
                            placeholder="List any assets taken by employee (e.g., Laptop, Phone, etc.)"
                            name="takenAssets"
                            value={this.state.takenAssets}
                            onChange={this.handleChange}
                          />
                        </Form.Group>

                        <Form.Group controlId="formGuaranteeForm">
                          <Form.Label className="text-muted required">
                            Guarantee Form
                          </Form.Label>
                          <Form.File
                            id="guaranteeForm"
                            label={this.state.guaranteeForm ? this.state.guaranteeForm.name : "Upload Guarantee Form"}
                            custom
                            onChange={(e) => this.setState({ guaranteeForm: e.target.files[0] })}
                            className="mb-3 custom-file-upload"
                            required
                          />
                        </Form.Group>

                        <Form.Group controlId="formDocumentScanned">
                          <Form.Label className="text-muted required">
                            Documents Scanned
                          </Form.Label>
                          <div className="mb-3">
                            <Form.Check
                              inline
                              type="radio"
                              id="docScannedYes"
                              label="Yes"
                              name="documentScanned"
                              checked={this.state.documentScanned === true}
                              onChange={() => this.setState({ documentScanned: true })}
                            />
                            <Form.Check
                              inline
                              type="radio"
                              id="docScannedNo"
                              label="No"
                              name="documentScanned"
                              checked={this.state.documentScanned === false}
                              onChange={() => this.setState({ documentScanned: false })}
                              className="ml-3"
                            />
                          </div>
                        </Form.Group>

                        <Form.Group controlId="formCompanyGuaranteeSupportLetter" className="mt-3">
                          <Form.Label className="text-muted required">
                            Company Guarantee/Support Letter
                          </Form.Label>
                          <Form.File
                            id="companyGuaranteeSupportLetter"
                            name="companyGuaranteeSupportLetter"
                            label={
                              <span className="text-truncate d-inline-block" style={{ maxWidth: '200px' }}>
                                {this.state.companyGuaranteeSupportLetter ?
                                  this.state.companyGuaranteeSupportLetter.name :
                                  "Upload Document"}
                              </span>
                            }
                            custom
                            onChange={this.handleChange}
                            className="custom-file-upload w-100"
                            accept=".pdf,.jpg,.jpeg,.png,.gif"
                            required
                          />
                          <Form.Text className="ml-2 text-muted">
                            Accepted file types: PDF, JPG, PNG, GIF (Max 5MB)
                          </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formDirectSupervisor" className="mt-3">
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
                            value={this.state.empStatus}
                            onChange={this.handleChange}
                            name="empStatus"
                            required
                          >
                            <option value="">Choose...</option>
                            <option value="Active">Active</option>
                            <option value="On Leave">On Leave</option>
                            <option value="Terminated">Terminated</option>
                            <option value="Resigned">Resigned</option>
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
                            value={this.state.nationalIdNumber}
                            onChange={this.handleChange}
                            name="nationalIdNumber"
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
                    <Card.Header className="bg-danger">Financial Information</Card.Header>
                    <Card.Body>
                      <Card.Text>
                        <div className="row">
                          <div className="col-md-6">
                            {/* <Form.Group controlId="formEmploymentType">
                              <Form.Label>Employment Type</Form.Label>
                              <Form.Control
                                as="select"
                                value={this.state.empType}
                                onChange={this.handleChange}
                                name="empType"
                              >
                                <option value="Full Time">Full Time</option>
                                <option value="Part Time">Part Time</option>
                              </Form.Control>
                            </Form.Group> */}

                            <Form.Group controlId="formSalaryBasic">
                              <Form.Label>Net Salary</Form.Label>
                              <Form.Control
                                type="number"
                                value={this.state.salaryNet}
                                onChange={this.handleChange}
                                name="salaryNet"
                                placeholder="0.00"
                                step="0.01"
                              />
                            </Form.Group>
                          </div>
                          {/* 
                          <div className="col-md-6">
                            <h5 className="mt-3">Allowances</h5>
                            <Form.Group controlId="formAllowanceHouseRent">
                              <Form.Control
                                type="number"
                                value={this.state.allowanceHouseRent}
                                onChange={this.handleChange}
                                name="allowanceHouseRent"
                                placeholder="House Rent"
                                step="0.01"
                                className="mb-2"
                              />
                            </Form.Group>
                            <Form.Group controlId="formAllowanceMedical">
                              <Form.Control
                                type="number"
                                value={this.state.allowanceMedical}
                                onChange={this.handleChange}
                                name="allowanceMedical"
                                placeholder="Medical"
                                step="0.01"
                                className="mb-2"
                              />
                            </Form.Group>
                            <Form.Group controlId="formAllowanceSpecial">
                              <Form.Control
                                type="number"
                                value={this.state.allowanceSpecial}
                                onChange={this.handleChange}
                                name="allowanceSpecial"
                                placeholder="Special"
                                step="0.01"
                                className="mb-2"
                              />
                            </Form.Group>
                            <Form.Group controlId="formAllowanceFuel">
                              <Form.Control
                                type="number"
                                value={this.state.allowanceFuel}
                                onChange={this.handleChange}
                                name="allowanceFuel"
                                placeholder="Fuel"
                                step="0.01"
                                className="mb-2"
                              />
                            </Form.Group>
                            <Form.Group controlId="formAllowancePhoneBill">
                              <Form.Control
                                type="number"
                                value={this.state.allowancePhoneBill}
                                onChange={this.handleChange}
                                name="allowancePhoneBill"
                                placeholder="Phone Bill"
                                step="0.01"
                                className="mb-2"
                              />
                            </Form.Group>
                            <Form.Group controlId="formAllowanceOther">
                              <Form.Control
                                type="number"
                                value={this.state.allowanceOther}
                                onChange={this.handleChange}
                                name="allowanceOther"
                                placeholder="Other Allowances"
                                step="0.01"
                                className="mb-2"
                              />
                            </Form.Group>
                            <Form.Group controlId="formAllowanceTotal">
                              <Form.Control
                                type="number"
                                value={this.state.allowanceTotal}
                                onChange={this.handleChange}
                                name="allowanceTotal"
                                placeholder="Total Allowances"
                                step="0.01"
                                className="mb-2 font-weight-bold"
                                readOnly
                              />
                            </Form.Group>

                            <h5 className="mt-3">Deductions</h5>
                            <Form.Group controlId="formDeductionProvidentFund">
                              <Form.Control
                                type="number"
                                value={this.state.deductionProvidentFund}
                                onChange={this.handleChange}
                                name="deductionProvidentFund"
                                placeholder="Provident Fund"
                                step="0.01"
                                className="mb-2"
                              />
                            </Form.Group>
                            <Form.Group controlId="formDeductionTax">
                              <Form.Control
                                type="number"
                                value={this.state.deductionTax}
                                onChange={this.handleChange}
                                name="deductionTax"
                                placeholder="Tax"
                                step="0.01"
                                className="mb-2"
                              />
                            </Form.Group>
                            <Form.Group controlId="formDeductionOther">
                              <Form.Control
                                type="number"
                                value={this.state.deductionOther}
                                onChange={this.handleChange}
                                name="deductionOther"
                                placeholder="Other Deductions"
                                step="0.01"
                                className="mb-2"
                              />
                            </Form.Group>
                            <Form.Group controlId="formDeductionTotal">
                              <Form.Control
                                type="number"
                                value={this.state.deductionTotal}
                                onChange={this.handleChange}
                                name="deductionTotal"
                                placeholder="Total Deductions"
                                step="0.01"
                                className="mb-2 font-weight-bold"
                                readOnly
                              />
                            </Form.Group>
                          </div> */}
                        </div>

                        <h5>Bank Information</h5>
                        <div className="row">
                          <div className="col-md-12">
                            <Form.Group controlId="formBankName">
                              <Form.Label>Bank Name</Form.Label>
                              <Form.Control
                                type="text"
                                value={this.state.bankName}
                                onChange={this.handleChange}
                                name="bankName"
                                placeholder="Enter Bank name"
                              />
                            </Form.Group>
                            <Form.Group controlId="formAccountNumber">
                              <Form.Label>Account Number</Form.Label>
                              <Form.Control
                                type="text"
                                value={this.state.accountNumber}
                                onChange={this.handleChange}
                                name="accountNumber"
                                placeholder="Enter Account number"
                              />
                            </Form.Group>
                            <Form.Group controlId="formBranch">
                              <Form.Label>Branch</Form.Label>
                              <Form.Control
                                type="text"
                                value={this.state.branch}
                                onChange={this.handleChange}
                                name="branch"
                                placeholder="Enter Branch"
                              />
                            </Form.Group>
                          </div>
                        </div>
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
