import React, { Component } from "react";
import { Card, Button, Form, Alert, Badge } from "react-bootstrap";
import { Redirect } from 'react-router-dom'
import JobAddModal from './JobAddModal'
import JobEditModal from './JobEditModal'
import JobDeleteModal from './JobDeleteModal'
import axios from 'axios'
import moment from 'moment'
import MaterialTable from 'material-table'
import { ThemeProvider } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles'
import AlertModal from './AlertModal';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

export default class JobList extends Component {

    constructor(props) {
        super(props)

        this.state = {
            departments: [],
            selectedDepartment: null,
            selectedJob: null,
            jobs: [],
            showEditModel: false,
            showAddModel: false,
            showDeleteModel: false,
            currentPage: 0,
            pageSize: 10
        }
    }

    componentDidMount() {
        if (this.props.location.state) {
            this.setState({ selectedDepartment: this.props.location.state.selectedDepartment })
        }
        axios({
            method: 'get',
            url: '/api/departments',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => {
                this.setState({ departments: res.data.items || [] }, () => {
                    if (this.state.selectedDepartment) {
                        this.fetchData()
                    }
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    fetchData = () => {
        axios({
            method: 'get',
            url: 'api/departments/' + this.state.selectedDepartment,
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => {
                let department = res.data
                let jobs = [];

                department.users.map(user => {
                    user.jobs.map((job, index) => {
                        job.startDate = moment(job.startDate).format('YYYY-MM-DD')
                        job.endDate = moment(job.endDate).format('YYYY-MM-DD')
                        jobs.push(job)
                    })
                })

                this.setState({ jobs: jobs })
            })
            .catch(err => {
                console.log(err)
            })
    }

    fetchDataAll = () => {
        axios({
            method: 'get',
            url: '/api/departments',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => {
                const departments = res.data?.items || [];
                let allJobs = [];

                departments.forEach(department => {
                    if (department.users?.length > 0) {
                        department.users.forEach(user => {
                            if (user.jobs?.length > 0) {
                                user.jobs.forEach(job => {
                                    allJobs.push({
                                        ...job,
                                        departmentName: department.departmentName,
                                        userName: user.fullName,
                                        startDate: job.startDate ? moment(job.startDate).format('YYYY-MM-DD') : 'N/A',
                                        endDate: job.endDate ? moment(job.endDate).format('YYYY-MM-DD') : 'Present',
                                        departmentId: department.id
                                    });
                                });
                            }
                        });
                    }
                });

                this.setState({
                    jobs: allJobs,
                    // Re-fetch departments to ensure the dropdown is populated correctly
                    departments: departments
                });
            })
            .catch(err => {
                console.error('Error fetching all departments and jobs:', err);
            });
    }

    pushSelectItems = () => {
        const { departments, selectedDepartment } = this.state;

        return [
            <option key="all" value="all">All departments</option>,
            ...departments.map((dept) => (
                <option
                    key={dept.id}
                    value={dept.id}
                >
                    {dept.departmentName}
                </option>
            ))
        ];
    }

    handleChange = (event) => {
        this.setState({ selectedDepartment: event.target.value }, () => {
            if (this.state.selectedDepartment === "all") {
                this.fetchDataAll()
            } else {
                this.fetchData()
            }
        })
    }

    onEdit(job) {
        return event => {
            event.preventDefault()

            this.setState({ selectedJob: job, showEditModel: true })
        }
    }

    addJob = () => {
        this.setState({ showAddModel: true })
    }

    onDelete(job) {
        return event => {
            event.preventDefault()
            this.setState({ selectedJob: job }, () => {
                this.setState({ showDeleteModel: true })
            })

            // if(department.users.length > 0) {
            //     this.setState({showAlertModel: true})
            // } else {
            //     axios({
            //         method: 'delete',
            //         url: '/api/departments/'  + department.id,
            //         headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            //     })
            //     .then(res => {
            //         this.setState({completed: true})
            //     })
            //     .catch(err => {
            //         this.setState({hasError: true, errorMsg: err.response.data.message})
            //     })
            // }

        }
    }

    render() {
        let closeEditModel = () => this.setState({ showEditModel: false })
        let closeAddModel = () => this.setState({ showAddModel: false })
        let closeDeleteModel = () => this.setState({ showDeleteModel: false })

        const theme = createMuiTheme({
            overrides: {
                MuiTableCell: {
                    root: {
                        padding: '6px 6px 6px 6px'
                    }
                }
            }
        })

        const isAllDepartmentsSelected = this.state.selectedDepartment === "all";

        const columns = [
            // {
            //     title: 'No',
            //     cellStyle: { width: '5%' },
            //     render: (rowData) => {
            //         // Use the table's built-in row index and add 1 for 1-based numbering
            //         return (this.state.currentPage * this.state.pageSize) + rowData.tableData.id + 1;
            //     },
            //     customSort: () => 0,
            //     sorting: false
            // },
            {
                title: 'JOB ID',
                field: 'id',
                headerStyle: { minWidth: '100px' },
                cellStyle: { fontFamily: 'monospace', color: '#4b5563' }
            },
            {
                title: 'JOB TITLE',
                field: 'jobTitle',
                headerStyle: { minWidth: '180px' },
                cellStyle: { fontWeight: 500, color: '#1e293b' }
            },
            {
                title: 'EMPLOYEE',
                field: 'user.fullName',
                headerStyle: { minWidth: '180px' },
                cellStyle: { color: '#4b5563' },
                render: rowData => rowData.userName ? rowData.userName : rowData.user.fullName
            },
            isAllDepartmentsSelected && {
                title: 'DEPARTMENT',
                field: 'departmentName',
                headerStyle: { minWidth: '150px' },
                cellStyle: { color: '#4b5563' }
            },
            {
                title: 'START DATE',
                field: 'startDate',
                headerStyle: { minWidth: '120px' },
                cellStyle: { color: '#4b5563' }
            },
            {
                title: 'END DATE',
                field: 'endDate',
                headerStyle: { minWidth: '120px' },
                cellStyle: { color: '#4b5563' }
            },
            {
                title: 'STATE',
                field: 'endDate',
                headerStyle: { minWidth: '120px' },
                render: job => (
                    new Date(job.startDate).setHours(0) > new Date() ?
                        <Badge variant="warning" className="px-2 py-1 text-xs">Future Job</Badge> :
                        new Date(job.endDate).setHours(24) >= new Date() ?
                            <Badge variant="success" className="px-2 py-1 text-xs">Current Job</Badge> :
                            <Badge variant="danger" className="px-2 py-1 text-xs">Old Job</Badge>
                )
            },
            {
                title: 'ACTIONS',
                field: 'actions',
                headerStyle: { minWidth: '150px', textAlign: 'center' },
                cellStyle: { textAlign: 'center' },
                render: rowData => (
                    <div className="flex justify-center space-x-2">
                        <Button
                            size="sm"
                            variant="outline-primary"
                            className="px-2 py-1 text-xs"
                            onClick={this.onEdit(rowData)}
                        >
                            <FiEdit2 className="mr-1" /> Edit
                        </Button>
                        <Button
                            size="sm"
                            variant="outline-danger"
                            className="px-2 py-1 text-xs"
                            onClick={this.onDelete(rowData)}
                        >
                            <FiTrash2 className="mr-1" /> Delete
                        </Button>
                    </div>
                )
            }
        ].filter(Boolean);

        return (
            <div className="container-fluid pt-2">
                <div className="row">
                    <div className="col-12 mb-4">
                        <Card className="shadow-sm border-0 rounded-3">
                            <Card.Header className="bg-white border-0 py-3">
                                <h5 className="mb-0 fw-semibold text-danger">
                                    <i className="bi bi-building me-2"></i>
                                    Select Department
                                    <span className="text-danger">*</span>
                                </h5>
                            </Card.Header>
                            <Card.Body className="pt-0">
                                <div className="d-flex align-items-center gap-2">
                                    <div className="flex-grow-1">
                                        <select
                                            className="form-select form-select-lg border-2 py-2"
                                            value={this.state.selectedDepartment || ''}
                                            onChange={this.handleChange}
                                            style={{
                                                borderColor: '#dee2e6',
                                                borderRadius: '8px',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                            }}
                                        >
                                            <option value="" disabled>Select a department...</option>
                                            {this.pushSelectItems()}
                                        </select>
                                    </div>
                                    <Button
                                        variant="danger"
                                        onClick={this.addJob}
                                        className="d-flex align-items-center"
                                        style={{
                                            whiteSpace: 'nowrap',
                                            height: '35px',
                                            padding: '0.5rem 1.5rem'
                                        }}
                                    >
                                        <i className="fa fa-plus me-2 pr-2"></i>
                                        Add Job
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <Card className="main-card">
                            <Card.Header className="bg-danger">
                                <div className="panel-title">
                                    <strong>Job List</strong>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <ThemeProvider theme={theme}>
                                    <MaterialTable
                                        title={this.selectedUser ? this.selectedUser.fullName : ''}
                                        components={{
                                            Container: props => <div {...props} style={{ width: '100%', margin: 0, padding: 0 }} />
                                        }}
                                        columns={columns}
                                        data={this.state.jobs}
                                        page={this.state.currentPage}
                                        onChangePage={(page) => this.setState({ currentPage: page })}
                                        onChangeRowsPerPage={(pageSize) => this.setState({ pageSize: pageSize, currentPage: 0 })}
                                        options={{
                                            pageSize: this.state.pageSize,
                                            pageSizeOptions: [5, 10, 20, 50],
                                            padding: 'dense',
                                            tableLayout: 'auto',
                                            maxBodyHeight: 'calc(100vh - 300px)',
                                            headerStyle: {
                                                position: 'sticky',
                                                top: 0,
                                                backgroundColor: '#fff',
                                                zIndex: 1,
                                                borderBottom: '1px solid #e2e8f0',
                                            },
                                            rowStyle: (rowData, index) => ({
                                                backgroundColor: index % 2 ? '#f8fafc' : '#ffffff',
                                                '&:hover': {
                                                    backgroundColor: '#f1f5f9'
                                                }
                                            }),
                                            search: true,
                                            searchFieldAlignment: 'right',
                                            searchAutoFocus: true,
                                            showTitle: false,
                                            toolbar: true,
                                            searchFieldStyle: {
                                                height: '32px',
                                                padding: '0 8px',
                                                margin: '8px 0',
                                                borderRadius: '4px',
                                                border: '1px solid #e2e8f0'
                                            }
                                        }}
                                    />
                                </ThemeProvider>
                            </Card.Body>
                        </Card>
                        {this.state.showEditModel ? (
                            <JobEditModal show={true} onHide={closeEditModel} data={this.state.selectedJob} />
                        ) : this.state.showAddModel ? (
                            <JobAddModal show={true} onHide={closeAddModel} />
                        ) : this.state.showDeleteModel ? (
                            <JobDeleteModal show={true} onHide={closeDeleteModel} data={this.state.selectedJob} />
                        ) : (<></>)}
                    </div>
                </div>
                {/* {this.state.hasError ? (
            <Alert variant="danger" className="m-3" block>
              {this.state.errMsg}
            </Alert>
          ) : this.state.completed ? (
            <Redirect to="/departments" />
          ) : (<></>)} */}
            </div>
        );
    }
}