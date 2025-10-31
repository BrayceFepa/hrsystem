import React, { Component } from "react";
import { 
  Card, 
  Button, 
  Modal, 
  TablePagination, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem
} from "@material-ui/core";
import { Redirect } from "react-router-dom";
import { FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import axios from "axios";
import moment from 'moment'
import MaterialTable from 'material-table'
import { ThemeProvider } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles'
import { LEAVE_TYPE_OPTIONS } from '../../constants/leaveTypes';

export default class ApplicationList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      applications: [],
      selectedApplications: null,
      done: false,
      hasError: false,
      errorMsg: "",
      completed: false,
      showDeleteModal: false,
      applicationToDelete: null,
      isDeleting: false,
      filters: {
        status: '',
        type: '',
        startDate: '',
        endDate: ''
      },
      pagination: {
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false
      }
    };
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
    this.fetchApplications();
  };

  resetFilters = () => {
    this.setState({
      filters: {
        status: '',
        type: '',
        startDate: '',
        endDate: ''
      }
    }, () => this.fetchApplications());
  };
  componentDidMount() {
    this.fetchApplications();
    
    // Add global event listeners for debugging
    this.debugEventListeners = {
      click: (e) => console.log('Global click:', e.target, e),
      beforeunload: (e) => {
        console.log('Before unload event detected');
        console.trace('Before unload stack trace');
      },
      submit: (e) => console.log('Form submit detected', e.target)
    };
    
    // Add debug listeners
    Object.entries(this.debugEventListeners).forEach(([event, handler]) => {
      window.addEventListener(event, handler, true);
    });
  }

  componentWillUnmount() {
    // Clean up debug listeners
    Object.entries(this.debugEventListeners || {}).forEach(([event, handler]) => {
      window.removeEventListener(event, handler, true);
    });
  }

  fetchApplications = (page = 1, pageSize = 10) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.departmentId) {
        throw new Error('User department information not found');
      }

      const deptId = user.departmentId;
      const { filters } = this.state;

      // Build URL with filters
      let url = `/api/applications/department/${deptId}?page=${page}&size=${pageSize}`;

      // Add filters to URL
      const params = [];
      if (filters.status) params.push(`status=${encodeURIComponent(filters.status)}`);
      if (filters.type) params.push(`type=${encodeURIComponent(filters.type)}`);
      if (filters.startDate) params.push(`startDate=${encodeURIComponent(filters.startDate)}`);
      if (filters.endDate) params.push(`endDate=${encodeURIComponent(filters.endDate)}`);

      if (params.length > 0) {
        url += `&${params.join('&')}`;
      }

      axios({
        method: "get",
        url: url,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
          if (!res.data || !res.data.items) {
            throw new Error('No applications data received from server');
          }

          // Format dates for each application
          const formattedApplications = res.data.items.map(app => ({
            ...app,
            startDate: app.startDate ? moment(app.startDate).format('YYYY-MM-DD') : '',
            endDate: app.endDate ? moment(app.endDate).format('YYYY-MM-DD') : ''
          }));

          this.setState({
            applications: formattedApplications,
            pagination: {
              totalItems: res.data.totalItems,
              currentPage: res.data.currentPage,
              pageSize: res.data.pageSize,
              totalPages: res.data.totalPages,
              hasNextPage: res.data.hasNextPage,
              hasPrevPage: res.data.hasPrevPage
            },
            hasError: false
          });
        })
        .catch(err => {
          console.error('Error fetching applications:', err);
          this.setState({
            hasError: true,
            errorMsg: err.response?.data?.message || 'Failed to load applications'
          });
        });
    } catch (error) {
      console.error('Error in fetchApplications:', error);
      this.setState({
        hasError: true,
        errorMsg: error.message
      });
    }
  };
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

  handleDeleteClick = (app) => (e) => {
    console.log('1. Delete button clicked', { app, event: e ? e.type : 'no event' });
    
    // Prevent all possible default behaviors
    if (e) {
      console.log('2. Event object exists, preventing default behaviors');
      e.preventDefault();
      e.stopPropagation();
      
      if (e.nativeEvent) {
        console.log('3. Native event exists, stopping immediate propagation');
        e.nativeEvent.stopImmediatePropagation();
      }
      
      // Prevent default for any parent handlers
      e.cancelBubble = true;
      if (e.stopImmediatePropagation) {
        console.log('4. stopImmediatePropagation available, calling it');
        e.stopImmediatePropagation();
      }
      
      console.log('5. Setting state to show delete modal');
      // Set a small timeout to ensure the state update happens in the next tick
      setTimeout(() => {
        console.log('6. Inside setTimeout, updating state');
        this.setState({
          showDeleteModal: true,
          applicationToDelete: app
        }, () => {
          console.log('7. State updated, modal should be visible');
        });
      }, 0);
      
      console.log('8. Returning false from event handler');
      return false;
    }
    
    console.log('9. Fallback: No event object, just setting state');
    // Fallback in case event is not provided
    this.setState({
      showDeleteModal: true,
      applicationToDelete: app
    });
    
    return false;
  }

  handleDeleteConfirm = () => {
    const { applicationToDelete } = this.state;
    if (!applicationToDelete) return;

    this.setState({ isDeleting: true });

    axios({
      method: "delete",
      url: "/api/applications/" + applicationToDelete.id,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(() => {
        this.setState({
          showDeleteModal: false,
          applicationToDelete: null,
          isDeleting: false,
          completed: true
        });
        this.fetchApplications();
      })
      .catch((err) => {
        this.setState({
          hasError: true,
          errorMsg: err.response?.data?.message || 'Failed to delete application',
          showDeleteModal: false,
          isDeleting: false
        });
      });
  }

  handleDeleteCancel = () => {
    this.setState({
      showDeleteModal: false,
      applicationToDelete: null,
      isDeleting: false
    });
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
          <Card className="mb-4">
            <Card.Body>
              <form onSubmit={this.handleFilterSubmit}>
                <div className="row">
                  <div className="col-md-3">
                    <FormControl fullWidth variant="outlined" size="small" margin="normal">
                      <InputLabel>Status</InputLabel>
                      <Select
                        name="status"
                        value={this.state.filters.status}
                        onChange={this.handleFilterChange}
                        label="Status"
                      >
                        <MenuItem value="">All Status</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Approved">Approved</MenuItem>
                        <MenuItem value="Rejected">Rejected</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="col-md-3">
                    <FormControl fullWidth variant="outlined" size="small" margin="normal">
                      <InputLabel>Leave Type</InputLabel>
                      <Select
                        name="type"
                        value={this.state.filters.type}
                        onChange={this.handleFilterChange}
                        label="Leave Type"
                      >
                        <MenuItem value="">All Types</MenuItem>
                        {LEAVE_TYPE_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  {/* <div className="col-md-3">
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
        </div> */}
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
              </form>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header className="bg-danger">
              <div className="panel-title">
                <strong>Application List</strong>
              </div>
            </Card.Header>
            <Card.Body>
              <ThemeProvider theme={theme}>
                <MaterialTable
                  options={{
                    pageSize: this.state.pagination.pageSize,
                    page: this.state.pagination.currentPage - 1,
                    count: this.state.pagination.totalItems,
                    rowsPerPageOptions: [5, 10, 20, 50, 75, 100],
                    rowStyle: (rowData, index) => {
                      if (index % 2) {
                        return { backgroundColor: '#f2f2f2' };
                      }
                      return { cursor: 'pointer' };
                    },
                    actionsColumnIndex: -1,
                    showTitle: false,
                    toolbar: false,
                    search: false,
                    paging: true,
                    actionsCellStyle: {
                      display: 'none' // Hide the actions cell completely
                    },
                    headerStyle: {
                      backgroundColor: '#f8f9fa',
                      position: 'sticky',
                      top: 0,
                      zIndex: 1
                    },
                    onRowClick: (event, rowData, togglePanel) => {
                      // Only handle row click if the click target is not a button
                      if (!event.target.closest('button')) {
                        // Handle row click if needed
                      }
                    },
                    onChangePage: (page, pageSize) => {
                      this.fetchApplications(page + 1, pageSize);
                    },
                    onChangeRowsPerPage: (event) => {
                      this.fetchApplications(1, event.target.value);
                    }
                  }}
                  components={{
                    Container: props => <div>{props.children}</div>,
                    Toolbar: () => null,
                    Pagination: props => (
                      <div style={{ padding: '10px' }}>
                        <TablePagination
                          {...props}
                          rowsPerPageOptions={[5, 10, 20, 50, 75, 100]}
                          component="div"
                          count={this.state.pagination.totalItems}
                          rowsPerPage={this.state.pagination.pageSize}
                          page={this.state.pagination.currentPage - 1}
                          onPageChange={(e, page) => this.fetchApplications(page + 1, this.state.pagination.pageSize)}
                          onRowsPerPageChange={(e) => this.fetchApplications(1, parseInt(e.target.value))}
                        />
                      </div>
                    )
                  }}
                  columns={[
                    {
                      title: 'NO',
                      width: 80,
                      render: (rowData) => {
                        const { pagination } = this.state;
                        const currentPage = pagination?.currentPage || 1;
                        const pageSize = pagination?.pageSize || 10;
                        const rowIndex = this.state.applications.indexOf(rowData);
                        return (currentPage - 1) * pageSize + rowIndex + 1;
                      }
                    },
                    { title: 'APP ID', field: 'id' },
                    { title: 'Full Name', field: 'user.fullName' },
                    { title: 'Start Date', field: 'startDate' },
                    { title: 'End Date', field: 'endDate' },
                    { title: 'Leave Type', field: 'type' },
                    { title: 'Comments', field: 'reason' },
                    {
                      title: 'Status',
                      field: 'status',
                      render: rowData => (
                        <Button size="sm" variant={rowData.status === 'Approved' ? "success" : rowData.status === 'Pending' ? "warning" : "danger"}>{rowData.status}</Button>
                      )
                    },
                    {
                      title: 'Action',
                      field: 'actions',
                      sorting: false,
                      render: rowData => (
                        <div className="d-flex">
                          {rowData.user.id !== JSON.parse(localStorage.getItem('user')).id && rowData.status === "Pending" && (
                            <>
                              <Button
                                onClick={this.onApprove(rowData)}
                                variant="success"
                                size="sm"
                                className="mr-2"
                                title="Approve"
                              >
                                <FaCheck />
                              </Button>
                              <Button
                                onClick={this.onReject(rowData)}
                                variant="warning"
                                size="sm"
                                className="mr-2"
                                title="Reject"
                              >
                                <FaTimes />
                              </Button>
                            </>
                          )}
                          <div onClick={e => e.stopPropagation()}>
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                this.handleDeleteClick(rowData)(e);
                              }}
                              variant="danger"
                              size="sm"
                              title="Delete"
                              disabled={this.state.isDeleting}
                              type="button"
                              style={{ pointerEvents: 'auto' }}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </div>
                      )
                    }
                  ]}
                  data={this.state.applications}
                  title=""
                />
              </ThemeProvider>
            </Card.Body>
          </Card>
        </div>
        {this.state.hasError && (
          <div style={{ 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            padding: '10px', 
            margin: '10px', 
            borderRadius: '4px',
            border: '1px solid #f5c6cb'
          }}>
            {this.state.errorMsg}
          </div>
        )}
        {this.state.completed && <Redirect to="/application-list" />}

        {/* Delete Confirmation Modal */}
        <Modal show={this.state.showDeleteModal} onHide={this.handleDeleteCancel} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this application?</p>
            {this.state.applicationToDelete && (
              <div className="mt-2">
                <p><strong>Application ID:</strong> {this.state.applicationToDelete.id}</p>
                <p><strong>Employee:</strong> {this.state.applicationToDelete.user?.fullName || 'N/A'}</p>
                <p><strong>Leave Type:</strong> {this.state.applicationToDelete.type}</p>
              </div>
            )}
            <p className="text-danger mt-3">This action cannot be undone.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={this.handleDeleteCancel}
              disabled={this.state.isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={this.handleDeleteConfirm}
              disabled={this.state.isDeleting}
            >
              {this.state.isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}