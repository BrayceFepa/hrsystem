import React, { Component } from "react";
import { Card, Badge, Button, Form, Modal } from "react-bootstrap";
import { Redirect } from 'react-router-dom';
import MaterialTable from 'material-table';
import DeleteModal from './DeleteModal';
import axios from 'axios';
import { ThemeProvider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

export default class EmployeeList extends Component {
  
  constructor(props) {
    super(props)

    this.state = {
      users: [],
      selectedUser: null,
      viewRedirect: false,
      editRedirect: false,
      deleteModal: false
    }
  }

  componentDidMount() {
    axios({
      method: 'get',
      url: '/api/users',
      headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
    })
    .then(res => {
      this.setState({users: res.data})
    })
    .catch(err => {
      console.log(err)
    })
  }

  onView = (user) => {
    return (event) => {
      event.preventDefault()

      this.setState({selectedUser: user, viewRedirect: true})
    } 
  }

  onEdit = (user) => {
    return (event) => {
      event.preventDefault()

      this.setState({selectedUser: user, editRedirect: true})
    }
  }

  onDelete = user => {
    return event => {

      this.setState({selectedUser: user, deleteModal: true})
    }
  }

  render() {
    let closeDeleteModel = () => this.setState({deleteModal: false});

    const theme = createMuiTheme({
      overrides: {
        MuiTable: {
          root: {
            minWidth: '100%',
          },
        },
        MuiTableHead: {
          root: {
            backgroundColor: '#f8fafc',
          },
        },
        MuiTableRow: {
          head: {
            '& th': {
              fontWeight: '600',
              color: '#334155',
              fontSize: '0.875rem',
              padding: '12px 16px',
              backgroundColor: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
            },
          },
          root: {
            '&:nth-of-type(odd)': {
              backgroundColor: '#f8fafc',
            },
            '&:hover': {
              backgroundColor: '#f1f5f9',
            },
          },
        },
        MuiTableCell: {
          root: {
            padding: '12px 16px',
            borderBottom: '1px solid #e2e8f0',
            fontSize: '0.875rem',
            color: '#334155',
          },
          head: {
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          },
        },
        MuiTablePagination: {
          root: {
            borderTop: '1px solid #e2e8f0',
          },
        },
      },
      props: {
        MuiButton: {
          disableElevation: true,
        },
      },
    });

    return (
      <div className="employee-list-container w-full">
        {this.state.viewRedirect && <Redirect to={{pathname: '/employee-view', state: {selectedUser: this.state.selectedUser}}} />}
        {this.state.editRedirect && <Redirect to={{pathname: '/employee-edit', state: {selectedUser: this.state.selectedUser}}} />}
        {this.state.deleteModal && (
          <DeleteModal show={true} onHide={closeDeleteModel} data={this.state.selectedUser} />
        )}
        
        <div className="w-full px-0 md:px-4 py-6">
          <div className="bg-white rounded-lg shadow overflow-hidden w-full">
            <Card.Header className="bg-danger">
            <div className="d-flex justify-content-between align-items-center">
              <b className="text-medium text-white">Employee Directory</b>
              <a 
                href="/employee-add" 
                className="btn btn-light btn-sm"
              >
                <span className="mr-1">+</span> 
                <span>Add Employee</span>
              </a>
            </div>
          </Card.Header>
            <div className="w-full p-0">
              <div style={{ width: '100%', overflow: 'hidden' }}>
                <ThemeProvider theme={theme}>
                  <MaterialTable 
                    title=""
                    components={{
                      Container: props => <div {...props} style={{ width: '100%', margin: 0, padding: 0 }} />
                    }}
                    options={{
                      ...this.state.tableOptions,
                      pageSize: 10,
                      pageSizeOptions: [5, 10, 20, 50],
                      padding: 'dense',
                      tableLayout: 'auto',
                      maxBodyHeight: 'calc(100vh - 300px)',
                      headerStyle: {
                        position: 'sticky',
                        top: 0,
                        backgroundColor: '#fff',
                        zIndex: 1,
                      },
                      header: {
                        padding: '0 16px',
                        margin: 0
                      },
                      searchFieldStyle: {
                        height: '20px',
                        padding: '2px 4px',
                        margin: '0 8px 0 0',
                        fontSize: '14px'
                      },
                      searchFieldVariant: 'outlined',
                      searchFieldInputProps: {
                        style: {
                          height: '30px',
                          padding: '0 8px'
                        }
                      },
                      search: true,
                      searchFieldAlignment: 'right',
                      searchAutoFocus: true,
                      showTitle: false,
                      toolbar: true
                    }}
                    columns={[
                    {
                      title: 'EMP ID', 
                      field: 'id',
                      headerStyle: { minWidth: '100px' },
                      cellStyle: { fontFamily: 'monospace', color: '#4b5563' }
                    },
                    {
                      title: 'FULL NAME', 
                      field: 'fullName',
                      headerStyle: { minWidth: '180px' },
                      cellStyle: { fontWeight: 500, color: '#1e293b' }
                    },
                    {
                      title: 'DEPARTMENT', 
                      field: 'department.departmentName',
                      headerStyle: { minWidth: '180px' },
                      cellStyle: { color: '#475569' }
                    },
                    {
                      title: 'JOB TITLE', 
                      field: 'jobs',
                      headerStyle: { minWidth: '200px' },
                      cellStyle: { color: '#475569' },
                      render: rowData => (
                        <span className="font-medium text-gray-800">
                          {rowData.jobs.map((job, index) => {
                            if(new Date(job.startDate).setHours(0) <= Date.now() && new Date(job.endDate).setHours(24) >= Date.now()) {
                              return job.jobTitle;
                            }
                            return null;
                          }).filter(Boolean).join(', ')}
                        </span>
                      )
                    },
                    {
                      title: 'MOBILE', 
                      field: 'user_personal_info.mobile',
                      headerStyle: { minWidth: '140px' },
                      cellStyle: { color: '#475569' }
                    },
                    {
                      title: 'STATUS', 
                      field: 'active',
                      headerStyle: { minWidth: '120px' },
                      render: rowData => (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          rowData.active 
                            ? 'bg-green-200 text-green-600' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {rowData.active ? 'Active' : 'Inactive'}
                        </span>
                      )
                    },
                    {
                      title: '',
                      field: 'actions',
                      headerStyle: { width: '80px' },
                      cellStyle: { textAlign: 'center' },
                      render: rowData => (
                        <button 
                          onClick={this.onView(rowData)}
                          className="p-2 text-red-400 hover:bg-red-50 rounded-full transition-colors duration-200"
                          title="View Details"
                        >
                          <FiEye className="w-5 h-5" />
                        </button>
                      )
                    },
                    {
                      title: '',
                      field: 'actions',
                      headerStyle: { width: '120px' },
                      cellStyle: { textAlign: 'center' },
                      render: rowData => (
                        <div className="flex space-x-2">
                          <button
                            onClick={this.onEdit(rowData)}
                            className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center"
                          >
                            <FiEdit2 className="mr-1.5" size={14} />
                            Edit
                          </button>
                          {rowData.id !== JSON.parse(localStorage.getItem('user'))?.id && (
                            <button
                              onClick={this.onDelete(rowData)}
                              className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center"
                            >
                              <FiTrash2 className="mr-1.5" size={14} />
                              Delete
                            </button>
                          )}
                        </div>
                      )
                    }
                  ]}
                  data={this.state.users}
                  options={{
                    pageSize: 10,
                    pageSizeOptions: [10, 20, 50],
                    search: true,
                    searchFieldVariant: 'outlined',
                    searchFieldStyle: {
                      padding: '1px 10px',
                      borderRadius: '0.375rem',
                      borderColor: '#e2e8f0',
                      marginBottom: '1rem',
                      width: '300px',
                      fontSize: '0.875rem'
                    },
                    headerStyle: {
                      backgroundColor: '#f8fafc',
                      borderBottom: '1px solid #e2e8f0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#64748b',
                    },
                    rowStyle: (rowData, index) => ({
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        backgroundColor: '#f1f5f9',
                      },
                    }),
                    components: {
                    Toolbar: props => (
                      <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <div className="flex-1 max-w-md">
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <input
                                type="text"
                                placeholder="Search employees..."
                                value={props.searchText || ''}
                                onChange={e => props.onSearchChanged(e.target.value)}
                                className="block w-full mt-5 pl-10 pr-5 py-0.5 border border-red-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm h-8"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }
                }}
                  />
                </ThemeProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
