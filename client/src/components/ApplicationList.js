import React, { Component } from "react";
import { Card, Button, Form, Alert } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import axios from "axios";
import moment from 'moment';
import MaterialTable from 'material-table';
import { ThemeProvider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { LEAVE_TYPES, LEAVE_TYPE_OPTIONS } from '../constants/leaveTypes';

export default class ApplicationList extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.cancelToken = null;
    this._isMounted = false;
  }

  getInitialState = () => ({
    applications: [],
    selectedApplications: null,
    done: false,
    hasError: false,
    errorMsg: "",
    completed: false,
    showModel: false,
    filters: {
      status: '',
      type: '',
      startDate: '',
      endDate: ''
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      pageSize: 10,
      hasNextPage: false,
      hasPrevPage: false
    }
  });

  componentDidMount() {
    this._isMounted = true;
    this.fetchApplications(0, this.state.pagination.pageSize);
  }

  componentWillUnmount() {
    this._isMounted = false;
    // Cancel any pending requests
    if (this.cancelToken) {
      this.cancelToken.cancel('Component unmounted');
    }
  }

  handleFilterChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      filters: {
        ...prevState.filters,
        [name]: value
      }
    }));
  };

  handleFilterSubmit = (e) => {
    e.preventDefault();
    this.fetchApplications(1);
  };

  resetFilters = () => {
    this.setState({
      filters: {
        status: '',
        type: '',
        startDate: '',
        endDate: ''
      }
    }, () => this.fetchApplications(1));
  };

  fetchApplications = (page, pageSize = this.state.pagination.pageSize) => {
    return new Promise((resolve, reject) => {
      // Cancel previous request if it exists
      if (this.cancelToken) {
        this.cancelToken.cancel('Operation canceled due to new request');
      }

      // Ensure page is a number and within bounds
      page = Math.max(0, parseInt(page) || 0);
      pageSize = Math.min(Math.max(1, parseInt(pageSize) || 10), 100); // Max 100 items per page

      // Update state to reflect loading
      this.setState({
        isLoading: true,
        error: null,
        pagination: {
          ...this.state.pagination,
          currentPage: page,
          pageSize: pageSize
        }
      });

      // Create a new cancel token for this request
      this.cancelToken = axios.CancelToken.source();

      // Build URL with pagination and filters
      let url = `/api/applications?page=${page + 1}&size=${pageSize}`;

      // Add filters
      const { filters } = this.state;
      const params = [];
      if (filters.status) params.push(`status=${encodeURIComponent(filters.status)}`);
      if (filters.type) params.push(`type=${encodeURIComponent(filters.type)}`);
      if (filters.startDate) params.push(`startDate=${encodeURIComponent(filters.startDate)}`);
      if (filters.endDate) params.push(`endDate=${encodeURIComponent(filters.endDate)}`);

      if (params.length > 0) {
        url += `&${params.join('&')}`;
      }

      axios({
        method: 'get',
        url: url,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Cache-Control': 'no-cache'
        },
        cancelToken: this.cancelToken.token
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

          const result = {
            data: formattedData,
            page: page,
            totalCount: pagination.totalItems || 0
          };

          if (this._isMounted) {
            this.setState({
              applications: formattedData,
              pagination: {
                ...this.state.pagination,
                currentPage: (pagination.currentPage || (page + 1)) - 1, // Convert to 0-based
                totalItems: pagination.totalItems || 0,
                totalPages: pagination.totalPages || Math.ceil((pagination.totalItems || 0) / pageSize),
                pageSize: pagination.pageSize || pageSize,
                hasNextPage: pagination.hasNextPage !== undefined
                  ? pagination.hasNextPage
                  : ((page + 1) * pageSize) < (pagination.totalItems || 0),
                hasPrevPage: pagination.hasPrevPage !== undefined
                  ? pagination.hasPrevPage
                  : page > 0
              },
              isLoading: false
            });
          }

          resolve(result);
        })
        .catch(error => {
          if (axios.isCancel(error)) {
            // Request was canceled, no need to handle as error
            return;
          }

          console.error('Error fetching applications:', error);
          const errorMessage = error.response?.data?.message || 'Failed to load applications. Please try again later.';

          if (this._isMounted) {
            this.setState({
              isLoading: false,
              error: errorMessage
            });
          }

          reject(error);
        });
    });
  };
  handlePageChange = (newPage) => {
    this.fetchApplications(newPage);
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  onApprove(app) {
    return (event) => {
      event.preventDefault();

      axios({
        method: "put",
        url: "/api/applications/" + app.id,
        data: {
          status: 'Approved'
        },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
          this.setState({ completed: true });
        })
        .catch((err) => {
          this.setState({
            hasError: true,
            errorMsg: err.response.data.message,
          });
        });
    };
  }

  onReject(app) {
    return (event) => {
      event.preventDefault()

      axios({
        method: "put",
        url: "/api/applications/" + app.id,
        data: {
          status: 'Rejected'
        },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
          this.setState({ completed: true });
        })
        .catch((err) => {
          this.setState({
            hasError: true,
            errorMsg: err.response?.data?.message || 'Failed to reject application',
          });
        });
    }
  }

  handleDelete = (app) => {
    if (window.confirm(`Are you sure you want to delete application #${app.id}? This action cannot be undone.`)) {
      axios({
        method: "delete",
        url: `/api/applications/${app.id}`,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
          // Refresh the applications list after successful deletion
          this.fetchApplications(this.state.pagination.currentPage);

          // Show success message
          this.setState({
            hasError: false,
            errorMsg: '',
            successMsg: 'Application deleted successfully!'
          });

          // Clear success message after 3 seconds
          setTimeout(() => {
            this.setState({ successMsg: '' });
          }, 3000);
        })
        .catch((err) => {
          this.setState({
            hasError: true,
            errorMsg: err.response?.data?.message || 'Failed to delete application',
          });
        });
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
      <div className="container-fluid pt-5">
        <div className="col-sm-12">
          <Card>
            <Card.Header className="bg-danger text-white">
              <strong>Application List</strong>
            </Card.Header>
            <Card.Body>
              <Card className="mb-4">
                <Card.Body>
                  <Form onSubmit={this.handleFilterSubmit}>
                    <div className="row">
                      <div className="col-md-3">
                        <Form.Group>
                          <Form.Label>Status</Form.Label>
                          <Form.Control
                            as="select"
                            name="status"
                            value={this.state.filters.status}
                            onChange={this.handleFilterChange}
                          >
                            <option value="">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                      <div className="col-md-3">
                        <Form.Group>
                          <Form.Label>Leave Type</Form.Label>
                          <Form.Control
                            as="select"
                            name="type"
                            value={this.state.filters.type}
                            onChange={this.handleFilterChange}
                          >
                            <option value="">All Types</option>
                            {LEAVE_TYPE_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                      </div>
                      <div className="col-md-3">
                        <Form.Group>
                          <Form.Label>Start Date</Form.Label>
                          <Form.Control
                            type="date"
                            name="startDate"
                            value={this.state.filters.startDate}
                            onChange={this.handleFilterChange}
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-3">
                        <Form.Group>
                          <Form.Label>End Date</Form.Label>
                          <Form.Control
                            type="date"
                            name="endDate"
                            value={this.state.filters.endDate}
                            onChange={this.handleFilterChange}
                          />
                        </Form.Group>
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col-12 d-flex justify-content-end">
                        <Button
                          variant="secondary"
                          className="mr-2"
                          onClick={this.resetFilters}
                          type="button"
                        >
                          Reset Filters
                        </Button>
                        <Button variant="danger" type="submit">
                          Apply Filters
                        </Button>
                      </div>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
              <ThemeProvider theme={theme}>
                <MaterialTable
                  columns={[
                    {
                      title: 'NO',
                      field: 'tableData.id',
                      render: (rowData) => {
                        const currentPage = this.state.pagination.currentPage || 1;
                        const pageSize = this.state.pagination.pageSize || 10;
                        return (currentPage - 1) * pageSize + rowData.tableData.id + 1;
                      },
                      width: 70,
                      sorting: false
                    },
                    {
                      title: 'APP ID',
                      field: 'id',
                      width: 100
                    },
                    {
                      title: 'Full Name',
                      field: 'user.fullName',
                      width: 150
                    },
                    {
                      title: 'Start Date',
                      field: 'startDate',
                      width: 120
                    },
                    {
                      title: 'End Date',
                      field: 'endDate',
                      width: 120
                    },
                    {
                      title: 'Leave Type',
                      field: 'type',
                      width: 150
                    },
                    {
                      title: 'Comments',
                      field: 'reason',
                      width: 200
                    },
                    {
                      title: 'Status',
                      field: 'status',
                      width: 120,
                      render: rowData => (
                        <Button
                          size="sm"
                          variant={
                            rowData.status === 'Approved' ? "success" :
                              rowData.status === 'Pending' ? "warning" : "danger"
                          }
                          style={{
                            backgroundColor: rowData.status === 'Pending' ? '#fff3cd' : null,
                            minWidth: '80px'
                          }}
                        >
                          {rowData.status}
                        </Button>
                      )
                    },
                    {
                      title: 'Action',
                      field: 'actions',
                      width: 180,
                      render: rowData => {
                        try {
                          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                          const userRole = currentUser.role || '';
                          const isAdminOrManager = ['ROLE_ADMIN', 'ROLE_MANAGER'].includes(userRole);
                          const isNotCurrentUser = rowData.user && rowData.user.id && currentUser.id &&
                            String(rowData.user.id) !== String(currentUser.id);
                          const isPending = rowData.status === "Pending";

                          return (
                            <div className="d-flex">
                              {isNotCurrentUser && isPending && (
                                <>
                                  <Button
                                    onClick={(e) => this.onApprove(rowData)(e)}
                                    variant="success"
                                    size="sm"
                                    className="mr-1"
                                    title="Approve"
                                  >
                                    <i className="fas fa-check"></i>
                                  </Button>
                                  <Button
                                    onClick={(e) => this.onReject(rowData)(e)}
                                    variant="danger"
                                    size="sm"
                                    className="mx-1"
                                    title="Reject"
                                  >
                                    <i className="fas fa-times"></i>
                                  </Button>
                                </>
                              )}
                              {isAdminOrManager && (
                                <Button
                                  onClick={() => this.handleDelete(rowData)}
                                  variant="outline-danger"
                                  size="sm"
                                  className="ml-1"
                                  title="Delete"
                                >
                                  <i className="fas fa-trash"></i>
                                </Button>
                              )}
                            </div>
                          );
                        } catch (error) {
                          console.error('Error rendering action buttons:', error);
                          return null;
                        }
                      }
                    }
                  ]}
                  data={query => {
                    return this.fetchApplications(query.page, query.pageSize, query.search)
                      .then(result => ({
                        data: result.data,
                        page: result.page,
                        totalCount: result.totalCount
                      }))
                      .catch(error => {
                        console.error('Error loading data:', error);
                        return {
                          data: [],
                          page: 0,
                          totalCount: 0
                        };
                      });
                  }}
                  options={{
                    rowStyle: (rowData, index) => ({
                      search: true,
                      searchFieldAlignment: 'left',
                      backgroundColor: index % 2 ? '#f8f9fa' : 'white',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }),
                    pageSize: this.state.pagination.pageSize,
                    pageSizeOptions: [5, 10, 20, 50],
                    paginationType: 'stepped',
                    paginationPosition: 'both',
                    showFirstLastPageButtons: true,
                    emptyRowsWhenPaging: false,
                    debounceInterval: 500,
                    minBodyHeight: '400px',
                    headerStyle: {
                      backgroundColor: '#f8f9fa',
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    },
                    filtering: false,
                    search: true,
                    toolbar: true,
                    loadingType: 'overlay',
                    showTitle: false,
                    toolbarButtonAlignment: 'left',
                    columnsButton: false,
                    actionsColumnIndex: -1,
                    showEmptyDataSourceMessage: !this.state.isLoading,
                    showTextRowsSelected: false,
                    showSelectAllCheckbox: false,
                    selection: false,
                    showSelectCheckbox: false,
                    searchFieldAlignment: 'left'
                  }}
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
                  isLoading={this.state.isLoading}
                  title=""
                />
              </ThemeProvider>
            </Card.Body>
          </Card>
        </div>
        {this.state.hasError && (
          <Alert variant="danger" className="m-3">
            {this.state.errorMsg}
          </Alert>
        )}
        {this.state.completed && <Redirect to="/application-list" />}
      </div>
    );
  }
}