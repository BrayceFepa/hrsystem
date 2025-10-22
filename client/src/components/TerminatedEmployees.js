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
    this.defaultPageSize = 15;
    this.maxPageSize = 100;
    this.pageSizeOptions = [10, 15, 25, 50, 100];
    this.searchTimeout = null;

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
      error: null,
      searchTerm: ''
    };
  }

  handleSearch = (e) => {
    const searchTerm = e.target.value;
    this.setState({ searchTerm }, () => {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      
      this.searchTimeout = setTimeout(() => {
        this.fetchTerminatedUsers(0, this.state.pageSize, searchTerm);
      }, 500);
    });
  };

  fetchTerminatedUsers = async (page, pageSize, searchTerm) => {
    if (cancel) {
      cancel('Operation canceled by new request');
    }

    const validPageSize = Math.min(Math.max(1, pageSize), this.maxPageSize);
    const validPage = Math.max(0, page);
    const apiPage = validPage + 1;

    if (this._isMounted) {
      this.setState({
        isLoading: true,
        error: null,
        pageSize: validPageSize,
        currentPage: validPage,
        searchTerm: searchTerm !== undefined ? searchTerm : this.state.searchTerm
      });
    }

    try {
      const response = await axios({
        method: 'get',
        url: '/api/users',
        params: {
          active: true,
          empStatus: 'Terminated',
          page: apiPage,
          size: validPageSize,
          search: searchTerm || this.state.searchTerm || undefined
        },
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        timeout: 10000,
        cancelToken: new CancelToken(c => { cancel = c; })
      });

      if (!this._isMounted) return;

      if (!response.data || !response.data.items) {
        throw new Error('No data received from server');
      }

      const { items, totalItems, currentPage: currentPageFromApi, totalPages, hasNextPage, hasPrevPage } = response.data;

      // Format data for the table
      const formattedData = items.map(user => {
        const job = user.jobs?.[0] || {};
        return {
          id: user.id,
          username: user.username,
          fullName: user.fullName || 'N/A',
          department: user.department?.departmentName || 'N/A',
          jobTitle: job.jobTitle || 'N/A',
          empType: job.empType || 'N/A',
          contract: job.contract || 'N/A',
          startDate: job.startDate ? new Date(job.startDate).toLocaleDateString() : 'N/A',
          endDate: job.endDate ? new Date(job.endDate).toLocaleDateString() : 'N/A',
          directSupervisor: job.directSupervisor || 'N/A',
          certificate: job.certificate || 'N/A',
          status: job.empStatus || 'N/A',
          role: user.role ? user.role.replace('ROLE_', '') : 'N/A'
        };
      });

      if (this._isMounted) {
        this.setState({
          users: formattedData,
          totalCount: parseInt(totalItems) || 0,
          currentPage: parseInt(currentPageFromApi) - 1, // Convert to 0-based index
          pageSize: parseInt(validPageSize),
          totalPages: parseInt(totalPages) || 1,
          isLoading: false
        });
      }

      return {
        data: formattedData,
        page: parseInt(currentPageFromApi) - 1, // Convert to 0-based index
        totalCount: parseInt(totalItems) || 0,
        totalPages: parseInt(totalPages) || 1,
        hasNextPage: hasNextPage === true,
        hasPrevPage: hasPrevPage === true
      };
    } catch (error) {
      if (!axios.isCancel(error) && this._isMounted) {
        console.error('Error fetching terminated employees:', error);
        const errorMessage = error.response?.data?.message || 'Failed to fetch terminated employees. Please try again.';
        
        this.setState({
          isLoading: false,
          error: errorMessage
        });
      }
      throw error;
    } finally {
      cancel = null; // Reset cancel token
    }
  };

  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
    this.fetchTerminatedUsers(0, this.state.pageSize);
  }

  componentWillUnmount() {
    this._isMounted = false;
    if (cancel) {
      cancel('Operation canceled by component unmount');
      cancel = null;
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
    const { users, totalCount, isLoading, error, viewRedirect, selectedUser, pageSize, currentPage } = this.state;

    if (viewRedirect && selectedUser) {
      return <Redirect to={`/employee-view/${selectedUser.id}`} />;
    }

    const columns = [
      {
        title: 'NO',
        field: 'id',
        cellStyle: { width: '5%' },
        render: (rowData) => rowData.tableData.id + 1,
        customSort: () => 0,
        sorting: false
      },
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
        cellStyle: { fontWeight: 500, color: '#1e293b' },
        render: rowData => rowData.fullName || 'N/A'
      },
      {
        title: 'DEPARTMENT',
        field: 'department',
        headerStyle: { minWidth: '150px' },
        cellStyle: { color: '#4b5563' },
        render: rowData => rowData.department || 'N/A'
      },
      {
        title: 'JOB TITLE',
        field: 'jobTitle',
        headerStyle: { minWidth: '200px' },
        cellStyle: { color: '#4b5563' },
        render: rowData => rowData.jobTitle || 'N/A'
      },
      {
        title: 'START DATE',
        field: 'startDate',
        headerStyle: { minWidth: '120px' },
        cellStyle: { color: '#4b5563' },
        render: rowData => rowData.startDate || 'N/A'
      },
      {
        title: 'TERMINATION DATE',
        field: 'endDate',
        headerStyle: { minWidth: '150px' },
        cellStyle: { color: '#4b5563' },
        render: rowData => rowData.endDate || 'Present'
      },
      {
        title: 'STATUS',
        field: 'status',
        headerStyle: { minWidth: '120px' },
        render: rowData => (
          <Badge variant="danger" className="px-2 py-1 text-xs">Terminated</Badge>
        )
      },
      // {
      //   title: 'ACTIONS',
      //   field: 'actions',
      //   headerStyle: { minWidth: '150px', textAlign: 'center' },
      //   cellStyle: { textAlign: 'center' },
      //   render: rowData => (
      //     <div className="flex justify-center space-x-2">
      //       <Button
      //         size="sm"
      //         variant="outline-primary"
      //         className="px-2 py-1 text-xs"
      //         onClick={this.onView(rowData)}
      //       >
      //         <FiEye className="mr-1" /> View
      //       </Button>
      //     </div>
      //   )
      // }
    ];

    const theme = createMuiTheme({
      overrides: {
        MuiTableCell: {
          root: {
            padding: '6px 6px 6px 6px'
          }
        },
        MuiToolbar: {
          root: {
            padding: '0 8px',
            minHeight: '64px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            '@media (min-width: 600px)': {
              padding: '0 16px',
            },
          },
        },
      },
    });

    return (
      <div className="container-fluid pt-2">
        <div className="row">
          <div className="col-sm-12">
            <Card className="main-card">
              <Card.Header className="bg-danger d-flex justify-content-between align-items-center">
                <div className="panel-title">
                  <strong className="text-white">Terminated Employees</strong>
                </div>
                {/* <div className="search-container" style={{ width: '300px' }}>
                  <Form.Control
                    type="text"
                    placeholder="Search employees..."
                    value={this.state.searchTerm}
                    onChange={this.handleSearch}
                    className="form-control-sm"
                  />
                </div> */}
              </Card.Header>
              <Card.Body>
                <ThemeProvider theme={theme}>
                  <MaterialTable
                    title=""
                    components={{
                      Container: props => <div {...props} style={{ width: '100%', margin: 0, padding: 0 }} />,
                      Toolbar: props => (
                        <div style={{ display: 'none' }}>
                          {props.children}
                        </div>
                      ),
                    }}
                    columns={columns}
                    data={query =>
                      new Promise((resolve, reject) => {
                        this.fetchTerminatedUsers(
                          query.page,
                          query.pageSize,
                          this.state.searchTerm
                        )
                          .then(result => {
                            resolve({
                              data: result.data,
                              page: result.page,
                              totalCount: result.totalCount,
                            });
                          })
                          .catch(error => {
                            console.error('Error in data fetch:', error);
                            reject(error);
                          });
                      })
                    }
                    options={{
                      pageSize: this.state.pageSize,
                      pageSizeOptions: this.pageSizeOptions,
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
                      search: false, // Disable the default search
                      showTitle: false,
                      toolbar: true,
                    }}
                  />
                </ThemeProvider>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}
