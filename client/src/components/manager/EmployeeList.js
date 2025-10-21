import React, { Component } from "react";
import { Card, Badge, Button, Form, Modal } from "react-bootstrap";
import {Redirect} from 'react-router-dom'
import MaterialTable from 'material-table'
import axios from 'axios'
import { ThemeProvider } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles'

export default class EmployeeList extends Component {
  
  constructor(props) {
    super(props)

    this.state = {
      users: [],
      selectedUser: null,
      viewRedirect: false,
      viewSalaryRedirect: false,
      editRedirect: false,
      deleteModal: false
    }
  }

  componentDidMount() {
    let deptId = JSON.parse(localStorage.getItem('user')).departmentId;
    axios({
      method: 'get',
      url: '/api/users/department/' + deptId,
      headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
    })
    .then(res => {
      // Transform the data to match our new structure
      const employees = res.data.items.map(employee => ({
        id: employee.id,
        username: employee.username,
        fullName: employee.fullName,
        role: employee.role,
        active: employee.active,
        department: {
          id: employee.department.id,
          name: employee.department.departmentName
        },
        contact: {
          email: employee.user_personal_info?.emailAddress,
          phone: employee.user_personal_info?.phone,
          mobile: employee.user_personal_info?.mobile,
          emergencyContact: employee.user_personal_info?.emergencyContact
        },
        employment: this.getCurrentJob(employee.jobs),
        salary: {
          basic: employee.user_financial_info?.salaryBasic,
          gross: employee.user_financial_info?.salaryGross,
          net: employee.user_financial_info?.salaryNet
        }
      }));
      
      this.setState({ 
        users: employees,
        pagination: {
          totalItems: res.data.totalItems,
          totalPages: res.data.totalPages,
          currentPage: res.data.currentPage,
          pageSize: res.data.pageSize,
          hasNextPage: res.data.hasNextPage,
          hasPrevPage: res.data.hasPrevPage
        }
      });
    })
    .catch(err => {
      console.error('Error fetching employees:', err);
    });
  }

  getCurrentJob(jobs) {
    if (!jobs || jobs.length === 0) return {};
    
    // Find the current job (most recent active job)
    const currentDate = new Date();
    const currentJobs = jobs.filter(job => {
      const startDate = new Date(job.startDate);
      const endDate = job.endDate ? new Date(job.endDate) : new Date('9999-12-31');
      return startDate <= currentDate && endDate >= currentDate;
    });

    if (currentJobs.length > 0) {
      const latestJob = currentJobs.reduce((latest, current) => {
        return new Date(current.startDate) > new Date(latest.startDate) ? current : latest;
      });

      return {
        title: latestJob.jobTitle,
        employmentType: latestJob.empType,
        status: latestJob.empStatus,
        startDate: latestJob.startDate,
        endDate: latestJob.endDate,
        directSupervisor: latestJob.directSupervisor
      };
    }
    
    // If no current job, return the most recent job
    const sortedJobs = [...jobs].sort((a, b) => 
      new Date(b.startDate) - new Date(a.startDate)
    );
    
    return {
      title: sortedJobs[0]?.jobTitle || 'N/A',
      employmentType: sortedJobs[0]?.empType || 'N/A',
      status: sortedJobs[0]?.empStatus || 'N/A',
      startDate: sortedJobs[0]?.startDate,
      endDate: sortedJobs[0]?.endDate,
      directSupervisor: sortedJobs[0]?.directSupervisor
    };
  }

  onView = (user) => {
    return (event) => {
      event.preventDefault()

      this.setState({selectedUser: user, viewRedirect: true})
    } 
  }

  onSalaryView = (user) => {
    return (event) => {
      event.preventDefault()

      this.setState({selectedUser: {user: {id: user.id}}, viewSalaryRedirect: true})
    } 
  }

  render() {


    const theme = createMuiTheme({
        overrides: {
            MuiTableCell: {
                root: {
                    padding: '6px 6px 6px 6px'
                }
            }
        }
    })

    return (
      <div className="container-fluid pt-4">
        {this.state.viewRedirect ? (<Redirect to={{pathname: '/employee-view', state: {selectedUser: this.state.selectedUser}}}></Redirect>) : (<></>)}
        {this.state.viewSalaryRedirect ? (<Redirect to={{pathname: '/salary-view', state: {selectedUser: this.state.selectedUser}}}></Redirect>) : (<></>)}
        <div className="col-sm-12">
          <Card>
            <Card.Header className="bg-danger">
              <div className="panel-title">
                <strong>Employee List</strong>
              </div>
            </Card.Header>
            <Card.Body>
              <ThemeProvider theme={theme}>
                <MaterialTable 
                  columns={[
                    {
                      title: 'NO',
                      field: 'tableData.id',
                      width: 50,
                      render: (rowData) => rowData.tableData.id + 1,
                      cellStyle: {
                        textAlign: 'center',
                        verticalAlign: 'top'
                      },
                      headerStyle: {
                        textAlign: 'center'
                      }
                    },
                    { 
                      title: 'EMP ID', 
                      field: 'id',
                      width: 100
                    },
                    { 
                      title: 'Full Name', 
                      field: 'fullName',
                      render: rowData => (
                        <div>
                          <div>{rowData.fullName}</div>
                          <small className="text-muted">{rowData.username}</small>
                        </div>
                      )
                    },
                    { 
                      title: 'Department', 
                      field: 'department.name',
                      render: rowData => (
                        <div>
                          <div>{rowData.department?.name || 'N/A'}</div>
                          <small className="text-muted">ID: {rowData.department?.id || 'N/A'}</small>
                        </div>
                      )
                    },
                    {
                      title: 'Job Details', 
                      field: 'employment',
                      render: rowData => (
                        <div>
                          <div><strong>{rowData.employment?.title || 'N/A'}</strong></div>
                          <div><small>Type: {rowData.employment?.employmentType || 'N/A'}</small></div>
                          <div><small>Supervisor: {rowData.employment?.directSupervisor || 'N/A'}</small></div>
                        </div>
                      )
                    },
                    { 
                      title: 'Contact',
                      field: 'contact',
                      render: rowData => (
                        <div>
                          <div className="outline-danger"><i className="fas fa-phone"></i> {rowData.contact?.mobile || rowData.contact?.phone || 'N/A'}</div>
                          <div className="outline-danger"><i className="fas fa-envelope"></i> {rowData.contact?.email || 'N/A'}</div>
                        </div>
                      )
                    },
                    {
                      title: 'Employment Status', 
                      field: 'employment.status',
                      render: rowData => (
                        <div className="text-center">
                          {/* Account status (commented out as per request)
                          <div className="mb-1">
                            <span className="small text-muted">Account: </span>
                            {rowData.active ? (
                              <Badge pill variant="success">Active</Badge>
                            ) : (
                              <Badge pill variant="danger">Inactive</Badge>
                            )}
                          </div>
                          */}
                          <Badge 
                            variant={
                              rowData.employment?.status?.toLowerCase() === 'active' ? 'success' : 
                              rowData.employment?.status?.toLowerCase() === 'resigned' ? 'warning' :
                              rowData.employment?.status?.toLowerCase() === 'terminated' ? 'danger' : 'secondary'
                            }
                            className="px-3 py-2"
                            style={{ fontSize: '0.9em' }}
                          >
                            {rowData.employment?.status || 'N/A'}
                          </Badge>
                        </div>
                      )
                    },
                    {
                      title: 'Actions',
                      field: 'actions',
                      sorting: false,
                      render: rowData => (
                        <div className="d-flex">
                          <Button 
                            size="sm" 
                            variant="outline-danger" 
                            onClick={this.onView(rowData)}
                            title="View Details"
                            className="mr-1"
                          >
                            <i className="far fa-eye"></i>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline-danger" 
                            onClick={this.onSalaryView(rowData)}
                            title="View Salary"
                          >
                            <i className="fas fa-dollar-sign"></i>
                          </Button>
                        </div>
                      )
                    }
                  ]}
                  data={this.state.users}
                  options={{
                    rowStyle: (rowData, index) => ({
                      backgroundColor: index % 2 ? '#f8f9fa' : 'white',
                      verticalAlign: 'top'
                    }),
                    headerStyle: {
                      backgroundColor: '#f8f9fa',
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap'
                    },
                    pageSize: 10,
                    pageSizeOptions: [10, 20, 30, 50],
                    paginationType: 'stepped',
                    showFirstLastPageButtons: true,
                    emptyRowsWhenPaging: false,
                    padding: 'dense',
                    searchFieldAlignment: 'left',
                    actionsColumnIndex: -1
                  }}
                  title=""
                />
              </ThemeProvider>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}
