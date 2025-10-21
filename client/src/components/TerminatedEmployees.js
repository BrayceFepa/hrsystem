import React, { Component } from "react";
import { Card, Badge, Button, Form, Modal } from "react-bootstrap";
import { Redirect } from 'react-router-dom';
import MaterialTable from 'material-table';
import DeleteModal from './DeleteModal';
import axios from 'axios';
import { ThemeProvider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

const CancelToken = axios.CancelToken;
let cancel;

export default class TerminatedEmployees extends Component {
  constructor(props) {
    super(props);
    this.defaultPageSize = 10;
    this.maxPageSize = 100;

    this.state = {
      users: [],
      totalCount: 0,
      pageSize: this.defaultPageSize,
      currentPage: 0,
      selectedUser: null,
      viewRedirect: false,
      editRedirect: false,
      deleteModal: false,
      isLoading: false,
      error: null
    };
  }

  fetchTerminatedUsers = (page, pageSize) => {
    if (cancel) {
      cancel('Operation canceled due to new request');
    }

    const validPageSize = Math.min(Math.max(1, pageSize), this.maxPageSize);
    const validPage = Math.max(0, page);
    const apiPage = validPage + 1;

    if (this._isMounted) {
      this.setState({
        isLoading: true,
        error: null,
        pageSize: validPageSize,
        currentPage: validPage
      });
    }

    return axios({
      method: 'get',
      url: `/api/users?page=${apiPage}&size=${validPageSize}&empstatus=Terminated`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      timeout: 10000,
      cancelToken: new CancelToken(function executor(c) {
        cancel = c;
      })
    })
    .then(res => {
      if (!res.data) {
        throw new Error('No data received from server');
      }

      const response = {
        items: res.data.items || [],
        totalItems: res.data.totalItems || 0,
        currentPage: res.data.currentPage || 1,
        totalPages: res.data.totalPages || 0,
        pageSize: res.data.pageSize || validPageSize
      };

      if (this._isMounted) {
        this.setState({
          users: response.items,
          totalCount: response.totalItems,
          currentPage: response.currentPage - 1,
          pageSize: response.pageSize,
          isLoading: false
        });
      }

      return {
        data: response.items,
        page: response.currentPage - 1,
        totalCount: response.totalItems,
        hasNextPage: (response.currentPage * response.pageSize) < response.totalItems
      };
    })
    .catch(error => {
      if (!axios.isCancel(error)) {
        console.error('Error fetching terminated employees:', error);
        const errorMessage = error.response?.data?.message || 'Failed to fetch terminated employees. Please try again.';
        
        if (this._isMounted) {
          this.setState({
            isLoading: false,
            error: errorMessage
          });
        }
      }
      throw error;
    });
  };

  componentDidMount() {
    this._isMounted = true;
    this.fetchTerminatedUsers(0, this.state.pageSize);
  }

  componentWillUnmount() {
    this._isMounted = false;
    if (cancel) {
      cancel('Operation canceled by the user.');
    }
  }

  handlePageChange = (page, pageSize) => {
    return this.fetchTerminatedUsers(page, pageSize);
  };

  handlePageSizeChange = (pageSize) => {
    return this.fetchTerminatedUsers(0, pageSize);
  };

  onView = (user) => {
    return (event) => {
      event.preventDefault();
      this.setState({ selectedUser: user, viewRedirect: true });
    };
  };

  render() {
    const { users, totalCount, isLoading, error, viewRedirect, selectedUser } = this.state;

    if (viewRedirect && selectedUser) {
      return <Redirect to={`/employee-view/${selectedUser.id}`} />;
    }

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
      },
    });

    const columns = [
      { 
        title: 'Employee ID', 
        field: 'employeeId',
        render: (rowData) => rowData.employeeId || 'N/A'
      },
      { 
        title: 'Name', 
        field: 'fullName',
        render: (rowData) => `${rowData.firstName || ''} ${rowData.lastName || ''}`.trim() || 'N/A'
      },
      { 
        title: 'Email', 
        field: 'email',
        render: (rowData) => rowData.email || 'N/A'
      },
      { 
        title: 'Department', 
        field: 'department',
        render: (rowData) => rowData.department?.name || 'N/A'
      },
      { 
        title: 'Job Title', 
        field: 'jobTitle',
        render: (rowData) => rowData.jobTitle || 'N/A'
      },
      {
        title: 'Actions',
        field: 'actions',
        sorting: false,
        render: (rowData) => (
          <div className="d-flex">
            <Button 
              variant="link" 
              size="sm" 
              className="p-0 mr-2"
              onClick={this.onView(rowData)}
              title="View"
            >
              <FiEye className="text-primary" />
            </Button>
          </div>
        ),
      },
    ];

    return (
      <div className="container-fluid p-0">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0 text-gray-800">Terminated Employees</h1>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <Card className="shadow-sm">
          <Card.Body className="p-0">
            <ThemeProvider theme={theme}>
              <MaterialTable
                columns={columns}
                data={query =>
                  new Promise((resolve, reject) => {
                    this.fetchTerminatedUsers(
                      query.page,
                      query.pageSize
                    )
                    .then(result => {
                      resolve({
                        data: result.data,
                        page: result.page,
                        totalCount: result.totalCount,
                      });
                    })
                    .catch(error => {
                      reject(error);
                    });
                  })
                }
                options={{
                  search: true,
                  searchFieldAlignment: 'left',
                  pageSize: this.state.pageSize,
                  pageSizeOptions: [10, 20, 50, 100],
                  paginationType: 'stepped',
                  showFirstLastPageButtons: true,
                  toolbar: true,
                  headerStyle: {
                    backgroundColor: '#f8f9fa',
                    padding: '1rem',
                    borderBottom: '1px solid #e3e6f0',
                    color: '#4e73df',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    fontSize: '0.7rem',
                    letterSpacing: '0.05rem',
                  },
                  rowStyle: {
                    backgroundColor: '#fff',
                    '&:nth-of-type(odd)': {
                      backgroundColor: '#f8f9fa',
                    },
                    '&:hover': {
                      backgroundColor: '#f1f3f9',
                    },
                  },
                }}
                isLoading={isLoading}
              />
            </ThemeProvider>
          </Card.Body>
        </Card>
      </div>
    );
  }
}
