import React, { Component } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import axios from "axios";
import moment from 'moment';
import MaterialTable from 'material-table';
import { ThemeProvider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';

// Function to decode JWT token
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error decoding token:', e);
    return null;
  }
};

export default class ApplicationList extends Component {
  constructor(props) {
    super(props);
    this.defaultPageSize = 10;
    this.maxPageSize = 100; // Match backend's max page size

    this.state = {
      applications: [],
      hasError: false,
      errorMsg: "",
      completed: false,
      totalItems: 0,
      totalPages: 0,
      currentPage: 0,
      pageSize: this.defaultPageSize,
      isLoading: false,
      error: null
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.fetchApplications(0, this.state.pageSize);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  fetchApplications = (page, pageSize = this.defaultPageSize) => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      console.error('No token found');
      return Promise.reject('No authentication token found');
    }
    
    // Decode the token to get user info
    const decoded = decodeToken(token);
    if (!decoded || !decoded.user || !decoded.user.id) {
      console.error('Invalid token format');
      return Promise.reject('Invalid authentication token');
    }
    
    const userId = decoded.user.id;
    const validPageSize = Math.min(Math.max(1, pageSize), this.maxPageSize);
    const validPage = Math.max(0, page);
    const apiPage = validPage + 1; // Convert to 1-based for backend

    if (this._isMounted) {
      this.setState({
        isLoading: true,
        error: null,
        pageSize: validPageSize,
        currentPage: validPage
      });
    }

    return axios({
      method: "get",
      url: `/api/applications/user/${userId}?page=${apiPage}&size=${validPageSize}`,
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000
    })
    .then((res) => {
      if (!res.data) {
        throw new Error('No data received from server');
      }

      const { items, ...pagination } = res.data;
      const formattedData = items.map(app => ({
        ...app,
        user: app.user || { id: null, fullName: 'Unknown User' },
        startDate: app.startDate ? moment(app.startDate).format('YYYY-MM-DD') : '',
        endDate: app.endDate ? moment(app.endDate).format('YYYY-MM-DD') : ''
      }));
      
      if (this._isMounted) {
        this.setState({ 
          applications: formattedData,
          totalItems: pagination.totalItems,
          totalPages: pagination.totalPages,
          currentPage: pagination.currentPage - 1, // Convert to 0-based
          pageSize: pagination.pageSize,
          hasError: false,
          errorMsg: '',
          isLoading: false
        });
      }
      
      return {
        data: formattedData,
        page: pagination.currentPage - 1,
        totalCount: pagination.totalItems
      };
    })
    .catch(error => {
      console.error('Error fetching applications:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load applications. Please try again later.';
      
      if (this._isMounted) {
        this.setState({ 
          hasError: true, 
          errorMsg: errorMessage,
          applications: [],
          isLoading: false
        });
      }
      
      return {
        data: [],
        page: 0,
        totalCount: 0
      };
    });
  };

  handlePageChange = (page, pageSize) => {
    return this.fetchApplications(page, pageSize);
  };

  handlePageSizeChange = (pageSize) => {
    return this.fetchApplications(0, pageSize);
  };

  onApprove = (app) => (event) => {
    event.preventDefault();
    this.updateApplicationStatus(app.id, 'Approved');
  };

  onReject = (app) => (event) => {
    event.preventDefault();
    this.updateApplicationStatus(app.id, 'Rejected');
  };

  updateApplicationStatus = (id, status) => {
    axios({
      method: "put",
      url: `/api/applications/${id}`,
      data: { status },
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(() => {
      const { currentPage, pageSize } = this.state;
      this.fetchApplications(currentPage, pageSize);
    })
    .catch((err) => {
      this.setState({
        hasError: true,
        errorMsg: err.response?.data?.message || 'Failed to update application status.',
      });
    });
  };

  render() {
    const theme = createMuiTheme({
      overrides: {
        MuiTableCell: {
          root: {
            padding: '12px 8px',
            '&:last-child': {
              paddingRight: '8px'
            }
          },
          head: {
            fontWeight: 'bold',
            backgroundColor: '#f5f5f5'
          }
        }
      }
    });

    const columns = [
      { 
        title: 'Type', 
        field: 'type',
        render: rowData => rowData.type || 'N/A',
        width: 200
      },
      {
        title: 'Start Date',
        field: 'startDate',
        render: rowData => moment(rowData.startDate).format('MMM D, YYYY'),
        width: 150
      },
      {
        title: 'End Date',
        field: 'endDate',
        render: rowData => moment(rowData.endDate).format('MMM D, YYYY'),
        width: 150
      },
      {
        title: 'Days',
        field: 'numberOfDays',
        type: 'numeric',
        align: 'center',
        width: 100
      },
      {
        title: 'Status',
        field: 'status',
        render: rowData => (
          <span 
            style={{
              color: rowData.status === 'Approved' ? 'green' : 
                     rowData.status === 'Rejected' ? 'red' : 'orange',
              fontWeight: 'bold',
              padding: '4px 8px',
              borderRadius: '12px',
              backgroundColor: rowData.status === 'Pending' ? '#fff3e0' : 'transparent'
            }}
          >
            {rowData.status}
          </span>
        ),
        width: 150
      },
      {
        title: 'Reason',
        field: 'reason',
        render: rowData => rowData.reason || 'N/A',
        width: 250
      }
    ];

    return (
      <div className="container-fluid pt-5">
        {this.state.hasError && (
          <div className="row justify-content-center mt-3">
            <div className="col-12">
              <Alert 
                variant="danger" 
                className="p-3"
                style={{
                  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                  borderLeft: '4px solid #dc3545',
                  margin: '0 0.5rem 0 0'
                }}
              >
                <div className="d-flex">
                  <i className="fas fa-exclamation-triangle mt-3 me-3" style={{minWidth: '20px'}}></i>
                  <div>
                    <h5 className="alert-heading mb-1">Error</h5>
                    <p className="mb-0">{this.state.errorMsg}</p>
                  </div>
                </div>
              </Alert>
            </div>
          </div>
        )}
        <div className="col-sm-12">
          <Card>
            <Card.Header className="bg-danger text-white">
              <strong>Application List</strong>
            </Card.Header>
            <Card.Body>
              <ThemeProvider theme={theme}>
                <MaterialTable
                  columns={[
                    { 
                      title: 'NO',
                      field: 'tableData.id',
                      width: 70,
                      render: (rowData) => {
                        const index = rowData.tableData.id + 1;
                        return index + (this.state.currentPage * this.state.pageSize);
                      },
                      customSort: (a, b) => {
                        const aIndex = a.tableData.id + (this.state.currentPage * this.state.pageSize);
                        const bIndex = b.tableData.id + (this.state.currentPage * this.state.pageSize);
                        return aIndex - bIndex;
                      }
                    },
                    { title: 'APP ID', field: 'id' },
                    { 
                      title: 'Full Name', 
                      field: 'fullName',
                      render: rowData => rowData.user?.fullName || rowData.name || 'N/A'
                    },
                    { 
                      title: 'Start Date', 
                      field: 'startDate',
                      render: rowData => moment(rowData.startDate).format('MMM D, YYYY')
                    },
                    { title: 'End Date', field: 'endDate' },
                    { title: 'Leave Type', field: 'type' },
                    { title: 'Reason', field: 'reason' },
                    {
                      title: 'Status',
                      field: 'status',
                      render: rowData => (
                        <Button 
                          size="sm" 
                          variant={
                            rowData.status === 'Approved' ? "success" : 
                            rowData.status === 'Pending' ? "warning" : "danger"
                          }
                          style={{ 
                            backgroundColor: rowData.status === 'Pending' ? '#fff3cd' : null,
                            color: rowData.status === 'Pending' ? '#000' : '#fff'
                          }}
                        >
                          {rowData.status}
                        </Button>
                      )
                    }
                    // {
                    //   title: 'Action',
                    //   field: 'actions',
                    //   sorting: false,
                    //   render: rowData => {
                    //     const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                    //     const isCurrentUser = rowData.user?.id === currentUser.id;
                        
                    //     if (isCurrentUser || rowData.status !== 'Pending') {
                    //       return null;
                    //     }
                        
                    //     return (
                    //       <div>
                    //         <Button 
                    //           onClick={this.onApprove(rowData)} 
                    //           variant="success" 
                    //           size="sm" 
                    //           className="mr-2" 
                    //           title="Approve"
                    //         >
                    //           <i className="fas fa-check"></i>
                    //         </Button>
                    //         <Button 
                    //           onClick={this.onReject(rowData)} 
                    //           variant="danger" 
                    //           size="sm" 
                    //           className="ml-2" 
                    //           title="Reject"
                    //         >
                    //           <i className="fas fa-times"></i>
                    //         </Button>
                    //       </div>
                    //     );
                    //   }
                    // }
                  ]}
                  data={query => {
                    return new Promise((resolve, reject) => {
                      this.fetchApplications(query.page, query.pageSize)
                        .then((result) => {
                          resolve({
                            data: result.data,
                            page: result.page,
                            totalCount: result.totalCount
                          });
                        })
                        .catch(error => {
                          console.error('Error:', error);
                          reject(error);
                        });
                    });
                  }}
                  options={{
                    search: false,
                    sorting: true,
                    pageSize: this.state.pageSize,
                    pageSizeOptions: [5, 10, 20, 50],
                    paginationType: 'stepped',
                    paginationPosition: 'both',
                    showFirstLastPageButtons: true,
                    headerStyle: {
                      backgroundColor: '#f8f9fa',
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    },
                    rowStyle: {
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    },
                    maxBodyHeight: 'calc(100vh - 250px)',
                    emptyRowsWhenPaging: false,
                    loadingType: 'overlay',
                    toolbar: false,
                    debounceInterval: 500,
                    minBodyHeight: '200px',
                    padding: 'dense',
                    showTitle: false,
                    toolbarButtonAlignment: 'left',
                    filtering: false,
                    draggable: false,
                    columnsButton: false,
                    actionsColumnIndex: -1,
                    addRowPosition: 'first',
                    showEmptyDataSourceMessage: !this.state.isLoading,
                    showTextRowsSelected: false,
                    showSelectAllCheckbox: false,
                    selection: false,
                    showSelectCheckbox: false,
                    searchFieldAlignment: 'left',
                    searchFieldStyle: {
                      marginRight: '1rem'
                    },
                    headerSelectionProps: {
                      color: 'primary'
                    },
                    rowStyle: rowData => ({
                      backgroundColor: rowData.tableData.checked ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
                      transition: 'background-color 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                      }
                    }),
                    paginationType: 'stepped',
                    showFirstLastPageButtons: true,
                    showTextRowsSelected: false,
                    showSelectAllCheckbox: false,
                    selection: false,
                    showSelectCheckbox: false
                  }}
                  isLoading={this.state.isLoading}
                  localization={{
                    pagination: {
                      labelRowsSelect: 'rows',
                      labelRowsPerPage: 'Rows per page:',
                      firstAriaLabel: 'First page',
                      firstTooltip: 'First page',
                      previousAriaLabel: 'Previous page',
                      previousTooltip: 'Previous page',
                      nextAriaLabel: 'Next page',
                      nextTooltip: 'Next page',
                      lastAriaLabel: 'Last page',
                      lastTooltip: 'Last page',
                      labelDisplayedRows: '{from}-{to} of {count}'
                    },
                    toolbar: {
                      searchTooltip: 'Search',
                      searchPlaceholder: 'Search...'
                    },
                    header: {
                      actions: 'Actions'
                    },
                    body: {
                      emptyDataSourceMessage: this.state.isLoading ? 'Loading...' : 'No records to display',
                      filterRow: {
                        filterTooltip: 'Filter'
                      },
                      addTooltip: 'Add',
                      deleteTooltip: 'Delete',
                      editTooltip: 'Edit',
                      editRow: {
                        deleteText: 'Are you sure you want to delete this row?',
                        cancelTooltip: 'Cancel',
                        saveTooltip: 'Save'
                      }
                    }
                  }}
                  options={{
                    search: false,
                    sorting: true,
                    pageSize: this.state.pageSize,
                    pageSizeOptions: [5, 10, 20, 50],
                    paginationType: 'stepped',
                    paginationPosition: 'both',
                    showFirstLastPageButtons: true,
                    headerStyle: {
                      backgroundColor: '#f8f9fa',
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    },
                    rowStyle: {
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontSize: '0.875rem'
                    },
                    maxBodyHeight: 'calc(100vh - 250px)',
                    emptyRowsWhenPaging: false,
                    loadingType: 'overlay',
                    toolbar: false,
                    debounceInterval: 500,
                    minBodyHeight: '200px',
                    padding: 'dense',
                    showTitle: false,
                    toolbarButtonAlignment: 'left',
                    filtering: false,
                    draggable: false,
                    columnsButton: false,
                    actionsColumnIndex: -1,
                    addRowPosition: 'first',
                    showEmptyDataSourceMessage: !this.state.isLoading,
                    showTextRowsSelected: false,
                    showSelectAllCheckbox: false,
                    selection: false,
                    showSelectCheckbox: false,
                    searchFieldAlignment: 'left',
                    searchFieldStyle: {
                      marginRight: '1rem'
                    },
                    headerSelectionProps: {
                      color: 'primary'
                    }
                  }}
                  title=""
                />
              </ThemeProvider>
            </Card.Body>
          </Card>
        </div>
        {this.state.completed && <Redirect to="/application-list" />}
      </div>
    );
  }
}