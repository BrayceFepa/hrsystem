import React, { Component } from "react";
import { Card, Button, Form, Alert } from "react-bootstrap";
import { Redirect, NavLink } from 'react-router-dom'
import AddDepartment from './DepartmentAdd'
import EditDepartmentModal from './EditDepartmentModal'
import axios from 'axios'
import MaterialTable from 'material-table'
import { ThemeProvider } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles'
import AlertModal from './AlertModal'
import DeleteConfirmation from './DeleteConfirmation'

export default class DepartmentList extends Component {

    constructor(props) {
        super(props)

        this.state = {
            departments: [],
            jobs: [],
            selectedDepartment: null,
            hasError: false,
            errorMsg: '',
            completed: false,
            showEditModel: false,
            showAlertModel: false,
            showDeleteConfirm: false,
            departmentToDelete: null
        }
    }

    componentDidMount() {
        axios({
            method: 'get',
            url: '/api/departments',
            headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
        })
        .then(res => {
            this.setState({departments: res.data})
        })
    }

    onEdit (department) {
        return event=> {
            event.preventDefault()
            
            this.setState({selectedDepartment: department, showEditModel: true})
        }
    }

    onDelete (department) {
        return event => {
            event.preventDefault()
            this.setState({showDeleteConfirm: true, departmentToDelete: department})
        }
    }

    confirmDelete = () => {
        const { departmentToDelete } = this.state;
        if (departmentToDelete.users.length > 0) {
            this.setState({showDeleteConfirm: false, showAlertModel: true});
        } else {
            axios({
                method: 'delete',
                url: '/api/departments/'  + departmentToDelete.id,
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            })
            .then(res => {
                this.setState({completed: true, showDeleteConfirm: false, departmentToDelete: null})
            })
            .catch(err => {
                this.setState({hasError: true, errorMsg: err.response.data.message, showDeleteConfirm: false, departmentToDelete: null})
            })
        }
    }
    
  render() {
    let closeEditModel = () => this.setState({showEditModel: false})
    let closeAlertModel = () => this.setState({showAlertModel: false})
    let closeDeleteConfirm = () => this.setState({showDeleteConfirm: false, departmentToDelete: null})

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
      <div className="container-fluid pt-2">
        <div className="row">
            <div className="col-sm-12">
                <AddDepartment />
            </div>
        </div>
        <div className="row">
            <div className="col-sm-12">
            <Card className="main-card">
                <Card.Header className="bg-danger">
                <div className="panel-title">
                    <b className="text-medium">Department List</b>
                </div>
                </Card.Header>
                    <Card.Body className="p-4">
                    <ThemeProvider theme={theme}>
                    <MaterialTable
                                className="shadow-sm rounded-lg overflow-hidden border border-gray-200"
                            columns={[
                                {
                                    title: 'DEPT ID',
                                    field: 'id',
                                    headerStyle: {
                                        backgroundColor: '#f8fafc',
                                        color: '#1e293b',
                                        fontWeight: '600',
                                        fontSize: '0.875rem',
                                        padding: '12px 16px',
                                        borderBottom: '1px solid #e2e8f0'
                                    },
                                    cellStyle: {
                                        padding: '12px 16px',
                                        borderBottom: '1px solid #f1f5f9',
                                        color: '#334155',
                                        fontSize: '0.875rem'
                                    }
                                },
                                {
                                    title: 'Department Name',
                                    field: 'departmentName',
                                    headerStyle: {
                                        backgroundColor: '#f8fafc',
                                        color: '#1e293b',
                                        fontWeight: '600',
                                        fontSize: '0.875rem',
                                        padding: '12px 16px',
                                        borderBottom: '1px solid #e2e8f0'
                                    },
                                    cellStyle: {
                                        padding: '12px 16px',
                                        borderBottom: '1px solid #f1f5f9',
                                        color: '#334155',
                                        fontSize: '0.875rem',
                                        fontWeight: '500'
                                    }
                                },
                                {
                                    title: 'Jobs', 
                                    field: 'jobs',
                                    headerStyle: {
                                        backgroundColor: '#f8fafc',
                                        color: '#1e293b',
                                        fontWeight: '600',
                                        fontSize: '0.875rem',
                                        padding: '12px 16px',
                                        borderBottom: '1px solid #e2e8f0',
                                        textAlign: 'center'
                                    },
                                    cellStyle: {
                                        padding: '12px 16px',
                                        borderBottom: '1px solid #f1f5f9',
                                        textAlign: 'center'
                                    },
                                    render: dept => (
                                        <NavLink 
                                            to={{ pathname: '/job-list', state: {selectedDepartment: dept.id} }}
                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                        >
                                            View Jobs
                                        </NavLink>
                                    )
                                },
                                {
                                    title: 'Actions',
                                    field: 'actions',
                                    headerStyle: {
                                        backgroundColor: '#f8fafc',
                                        color: '#1e293b',
                                        fontWeight: '600',
                                        fontSize: '0.875rem',
                                        padding: '12px 16px',
                                        borderBottom: '1px solid #e2e8f0',
                                        textAlign: 'center',
                                        width: '200px'
                                    },
                                    cellStyle: {
                                        padding: '8px 16px',
                                        borderBottom: '1px solid #f1f5f9',
                                        textAlign: 'center'
                                    },
                                    render: rowData => (
                                        <div className="flex space-x-2 justify-center">
                                            <button
                                                onClick={this.onEdit(rowData)}
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                            >
                                                <i className="fas fa-edit mr-1"></i> Edit
                                            </button>
                                            <button
                                                onClick={this.onDelete(rowData)}
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                                            >
                                                <i className="fas fa-trash mr-1"></i> Delete
                                            </button>
                                            </div>
                                    )
                                }
                            ]}
                            data={this.state.departments}
                            options={{
                                rowStyle: (rowData, index) => {
                                    if(index%2) {
                                        return {backgroundColor: '#f2f2f2'}
                                    }
                                },
                                pageSize: 10,
                                pageSizeOptions: [5, 10, 20, 30, 50, 75, 100],
                                paginationType: 'stepped',
                                showFirstLastPageButtons: true,
                                showTitle: true,
                                toolbar: true,
                                search: true,
                                searchFieldAlignment: 'right',
                                searchFieldVariant: 'outlined',
                                searchFieldStyle: {
                                    padding: '4px 8px',
                                    height: '32px',
                                    fontSize: '0.875rem',
                                    borderRadius: '0.375rem',
                                    borderColor: '#e2e8f0',
                                    '&:focus': {
                                        borderColor: '#93c5fd',
                                        boxShadow: '0 0 0 1pxrgb(244, 43, 43)',
                                        outline: 'none'
                                    }
                                },
                                header: true,
                                padding: 'dense',
                                emptyRowsWhenPaging: false,
                                actionsColumnIndex: -1,
                                addRowPosition: 'first',
                                sorting: true,
                                draggable: false
                            }}
                            title={
                                <div className="flex justify-between items-center">
                                    {/* <span className="text-lg font-semibold text-gray-800">Departments</span>
                                    <AddDepartment onDepartmentAdded={this.onDepartmentAdded} /> */}
                                </div>
                            }
                            components={{
                                Container: props => (
                                    <div className="rounded-lg overflow-hidden border border-gray-200">
                                        {props.children}
                                    </div>
                                )
                            }}
                    />
                    </ThemeProvider>
                </Card.Body>
            </Card>
            {this.state.showEditModel ? (
                <EditDepartmentModal show={true} onHide={closeEditModel} data={this.state.selectedDepartment} />
            ) : this.state.showAlertModel ? (
                <AlertModal show={this.state.showAlertModel} onHide={closeAlertModel} />
            ) : this.state.showDeleteConfirm ? (
                <DeleteConfirmation 
                    show={this.state.showDeleteConfirm}
                    onHide={closeDeleteConfirm}
                    onConfirm={this.confirmDelete}
                    message="Are you sure you want to delete this department? This action cannot be undone."
                />
            ) : null}
            </div>
        </div>
        {this.state.hasError ? (
            <Alert variant="danger" className="m-3" block>
            </Alert>
          ) : this.state.completed ? (
            <Redirect to="/departments" />
          ) : (<></>)}
      </div>
    );
  }
}