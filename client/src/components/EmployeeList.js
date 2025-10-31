import React, { Component } from "react";
import { Card, Badge, Button, Form, Modal } from "react-bootstrap";
import { Redirect } from 'react-router-dom';
import MaterialTable from 'material-table';
import DeleteModal from './DeleteModal';
import axios from 'axios';
import { ThemeProvider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

// Create a cancel token source
const CancelToken = axios.CancelToken;
let cancel;

export default class EmployeeList extends Component {

  constructor(props) {
    super(props);
    this.defaultPageSize = 10;
    this.maxPageSize = 100;
    this.searchTimeout = null;

    this.state = {
      users: [],
      searchText: '',
      filters: {
        role: '',
        active: '',
        empStatus: ''
      },
      selectedUser: null,
      viewRedirect: false,
      editRedirect: false,
      deleteModal: false,
      isLoading: false,
      error: null,
      pagination: {
        currentPage: 0,
        totalPages: 1,
        totalItems: 0,
        pageSize: this.defaultPageSize,
        hasNextPage: false,
        hasPrevPage: false
      }
    };
  }

  fetchUsers = (page, pageSize = this.state.pagination.pageSize) => {
    console.log('[fetchUsers] Called with:', { page, pageSize, currentState: this.state.pagination });

    return new Promise((resolve, reject) => {
      if (this.cancelToken) {
        console.log('[fetchUsers] Canceling previous request');
        this.cancelToken.cancel('Operation canceled due to new request');
      }

      // Ensure page and pageSize are valid numbers
      const currentPage = Math.max(0, parseInt(page, 10) || 0);
      const currentPageSize = Math.min(
        Math.max(1, parseInt(pageSize, 10) || this.defaultPageSize),
        this.maxPageSize
      );

      // Convert to 1-based page for API
      const apiPage = currentPage + 1;
      const apiPageSize = currentPageSize;

      console.log('[fetchUsers] Converted to API params:', { apiPage, apiPageSize });

      this.setState({ isLoading: true, error: null });

      this.cancelToken = axios.CancelToken.source();
      let url = `/api/users?page=${apiPage}&size=${apiPageSize}`;

      // Add search and filters to URL
      if (this.state.searchText) {
        const searchParam = encodeURIComponent(this.state.searchText.trim());
        url += `&search=${searchParam}`;
      }

      const { filters } = this.state;
      if (filters.role) url += `&role=${encodeURIComponent(filters.role)}`;
      if (filters.active !== '') url += `&active=${filters.active === 'true'}`;
      if (filters.empStatus) url += `&empStatus=${encodeURIComponent(filters.empStatus)}`;

      console.log('[fetchUsers] Making API request to:', url);

      axios({
        method: 'get',
        url: url,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Cache-Control': 'no-cache'
        },
        cancelToken: this.cancelToken.token
      })
        .then(res => {
          if (!res.data) throw new Error('No data received from server');

          const { items = [], totalItems, totalPages } = res.data;

          // Ensure we have valid pagination data
          const newPagination = {
            currentPage: currentPage,
            totalItems: parseInt(totalItems) || 0,
            totalPages: parseInt(totalPages) || 1,
            pageSize: currentPageSize,
            hasNextPage: (currentPage + 1) < (parseInt(totalPages) || 1),
            hasPrevPage: currentPage > 0
          };

          console.log('[fetchUsers] Updating state with pagination:', newPagination);

          if (this._isMounted) {
            this.setState({
              users: items,
              pagination: newPagination,
              isLoading: false
            });
          }

          resolve({
            data: items,
            page: currentPage,
            totalCount: parseInt(totalItems) || 0
          });
        })
        .catch(error => {
          if (axios.isCancel(error)) {
            console.log('[fetchUsers] Request canceled:', error.message);
            return;
          }

          console.error('[fetchUsers] Error:', error);
          const errorMessage = error.response?.data?.message || 'Failed to load users. Please try again later.';

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

  handleFilterChange = (filterName, value) => {
    this.setState(prevState => ({
      filters: {
        ...prevState.filters,
        [filterName]: value
      },
      pagination: {
        ...prevState.pagination,
        currentPage: 0 // Reset to first page when filters change
      }
    }), () => {
      this.updateURL();
      this.fetchUsers(0, this.state.pagination.pageSize);
    });
  };

  componentDidMount() {
    this._isMounted = true;
    this.loadStateFromURL();
  }

  componentWillUnmount() {
    this._isMounted = false;
    if (this.cancelToken) {
      this.cancelToken.cancel('Component unmounted');
    }
  }

  // Load state from URL parameters
  loadStateFromURL = () => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);

    const pagination = {
      currentPage: parseInt(params.get('page')) || 0,
      pageSize: Math.min(
        parseInt(params.get('pageSize')) || this.defaultPageSize,
        this.maxPageSize
      ),
      // These will be updated after the API call
      totalItems: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false
    };

    const searchText = params.get('search') || '';
    const filters = {
      role: params.get('role') || '',
      active: params.get('active') || '',
      empStatus: params.get('empStatus') || ''
    };

    this.setState(
      {
        pagination,
        searchText,
        filters
      },
      () => {
        this.fetchUsers(pagination.currentPage, pagination.pageSize);
      }
    );
  };

  updateURL = () => {
    if (typeof window === 'undefined') return; // Skip during SSR

    const { pagination, searchText, filters } = this.state;
    const params = new URLSearchParams();

    // Add pagination
    params.set('page', pagination.currentPage);
    params.set('pageSize', pagination.pageSize);

    // Add search
    if (searchText) {
      params.set('search', searchText);
    }

    // Add filters
    if (filters.role) params.set('role', filters.role);
    if (filters.active !== '') params.set('active', filters.active);
    if (filters.empStatus) params.set('empStatus', filters.empStatus);

    // Update URL without page reload
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  handlePageChange = (newPage) => {
    console.log('[handlePageChange] New page:', newPage, 'Current state:', this.state.pagination);
    this.fetchUsers(newPage);
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    console.log('[handleChange]', { name, value });
    this.setState({
      [name]: value,
    });
  };

  handlePageSizeChange = (pageSize) => {
    console.log('[handlePageSizeChange] New page size:', pageSize, 'Current state:', this.state.pagination);

    this.setState({
      pagination: {
        ...this.state.pagination,
        currentPage: 0,
        pageSize: pageSize
      }
    }, () => {
      console.log('[handlePageSizeChange] State after update:', this.state.pagination);
      this.updateURL();
      this.fetchUsers(0, pageSize);
    });
  };
  // Handle browser back/forward navigation
  componentDidUpdate(prevProps, prevState) {
    if (window.location.search !== this.lastSearch) {
      this.lastSearch = window.location.search;
      this.loadStateFromURL();
    }
  }

  onView = (user) => {
    return (event) => {
      event.preventDefault()

      this.setState({ selectedUser: user, viewRedirect: true })
    }
  }

  onEdit = (user) => {
    return (event) => {
      event.preventDefault()

      this.setState({ selectedUser: user, editRedirect: true })
    }
  }

  onDelete = user => {
    return event => {

      this.setState({ selectedUser: user, deleteModal: true })
    }
  }

  render() {
    let closeDeleteModel = () => this.setState({ deleteModal: false });

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
        {this.state.viewRedirect && <Redirect to={{ pathname: '/employee-view', state: { selectedUser: this.state.selectedUser } }} />}
        {this.state.editRedirect && <Redirect to={{ pathname: '/employee-edit', state: { selectedUser: this.state.selectedUser } }} />}
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
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
                  <div className="w-full md:w-1/4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      value={this.state.filters.role}
                      onChange={(e) => {
                        const value = e?.target?.value || '';
                        this.setState(
                          (prevState) => ({
                            filters: { ...prevState.filters, role: value },
                          }),
                          () => this.fetchUsers(0, this.state.pageSize, this.state.searchText)
                        );
                      }}
                    >
                      <option value="">All Roles</option>
                      <option value="ROLE_ADMIN">Admin</option>
                      <option value="ROLE_EMPLOYEE">Employee</option>
                      <option value="ROLE_MANAGER">Manager</option>
                      <option value="ROLE_HR">HR</option>
                      <option value="ROLE_FINANCE">Finance</option>
                    </select>
                  </div>

                  <div className="w-full md:w-1/4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      value={this.state.filters.active}
                      onChange={(e) => {
                        const value = e?.target?.value || '';
                        this.setState(
                          (prevState) => ({
                            filters: { ...prevState.filters, active: value },
                          }),
                          () => this.fetchUsers(0, this.state.pageSize, this.state.searchText)
                        );
                      }}
                    >
                      <option value="">All Statuses</option>
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>

                  <div className="w-full md:w-1/4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employment Status</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      value={this.state.filters.empStatus}
                      onChange={(e) => {
                        const value = e?.target?.value || '';
                        this.setState(
                          (prevState) => ({
                            filters: { ...prevState.filters, empStatus: value },
                          }),
                          () => this.fetchUsers(0, this.state.pageSize, this.state.searchText)
                        );
                      }}
                    >
                      <option value="">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Terminated">Terminated</option>
                    </select>
                  </div>

                  <div className="w-full md:w-1/4 flex items-end">
                    <button
                      onClick={() => {
                        this.setState(
                          {
                            filters: {
                              role: '',
                              active: '',
                              empStatus: ''
                            },
                          },
                          () => this.fetchUsers(0, this.state.pageSize, this.state.searchText)
                        );
                      }}
                      className="w-full md:w-auto bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
                {this.state.isLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 z-10 flex flex-col">
                    {/* Table Header Skeleton */}
                    <div className="flex items-center h-14 bg-gray-50 px-4 border-b border-gray-200">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={`header-${i}`}
                          className="h-4 bg-gray-200 rounded mr-6"
                          style={{
                            width: i === 0 ? '10%' : i === 5 ? '15%' : '15%',
                            minWidth: '80px'
                          }}
                        />
                      ))}
                    </div>

                    {/* Table Rows Skeleton */}
                    {[...Array(5)].map((_, rowIndex) => (
                      <div
                        key={`row-${rowIndex}`}
                        className={`flex items-center h-16 px-4 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        {[...Array(6)].map((_, cellIndex) => (
                          <div
                            key={`cell-${rowIndex}-${cellIndex}`}
                            className="mr-6 overflow-hidden"
                            style={{
                              width: cellIndex === 0 ? '10%' : cellIndex === 5 ? '15%' : '15%',
                              minWidth: '80px'
                            }}
                          >
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            {cellIndex === 0 && (
                              <div className="h-3 bg-gray-100 rounded mt-1 w-3/4 animate-pulse"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}

                    {/* Pagination Skeleton */}
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                      <div className="flex space-x-2">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={`page-${i}`}
                            className="h-8 w-8 bg-gray-200 rounded-md animate-pulse"
                          ></div>
                        ))}
                      </div>
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                )}
                <ThemeProvider theme={theme}>
                  <MaterialTable
                    title=""
                    data={this.state.users}
                    isLoading={this.state.isLoading}
                    options={{
                      pageSize: this.state.pagination.pageSize,
                      page: this.state.pagination.currentPage,
                      count: this.state.pagination.totalItems,
                      pageSizeOptions: [10, 20, 50],
                      paginationType: 'stepped',
                      filtering: false,
                      search: false, // We'll handle search separately
                      showTitle: false,
                      debounceInterval: 500,
                      paging: true,
                      emptyRowsWhenPaging: false,
                      rowStyle: this.rowStyle,
                      headerStyle: {
                        backgroundColor: '#f8fafc',
                        color: '#334155',
                        fontWeight: 600,
                        padding: '12px 16px',
                        borderBottom: '1px solid #e2e8f0',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        whiteSpace: 'nowrap'
                      },
                      cellStyle: {
                        padding: '12px 16px',
                        borderBottom: '1px solid #e2e8f0',
                        color: '#334155',
                        fontSize: '0.875rem'
                      },

                      onSearchChange: (searchText) => {
                        this.setState(
                          {
                            searchText,
                            pagination: {
                              ...this.state.pagination,
                              currentPage: 0
                            }
                          },
                          () => {
                            clearTimeout(this.searchTimeout);
                            this.searchTimeout = setTimeout(() => {
                              this.updateURL();
                              this.fetchUsers(0, this.state.pagination.pageSize);
                            }, 500);
                          }
                        );
                      }
                    }}
                    columns={[
                      {
                        title: 'NO',
                        field: 'no',
                        headerStyle: { minWidth: '100px' },
                        cellStyle: { fontFamily: 'monospace', color: '#4b5563' },
                        render: (rowData) => {
                          const rowIndex = rowData.tableData?.id ?? 0;
                          const pageOffset = (this.state.pagination.currentPage || 0) * (this.state.pagination.pageSize || 10);
                          return rowIndex + 1 + pageOffset;
                        }
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
                        cellStyle: { fontWeight: 500, color: '#1e293b' }
                      },
                      {
                        title: 'DEPARTMENT',
                        field: 'department.departmentName',
                        headerStyle: { minWidth: '180px' },
                        cellStyle: { color: '#475569' },
                        render: rowData => rowData.department?.departmentName || 'N/A'
                      },
                      {
                        title: 'ROLE',
                        field: 'role',
                        headerStyle: { minWidth: '180px' },
                        cellStyle: { color: '#475569' },
                        render: rowData => {
                          const roleMap = {
                            'ROLE_ADMIN': 'Admin',
                            'ROLE_MANAGER': 'Manager',
                            'ROLE_HR': 'HR',
                            'ROLE_FINANCE': 'Finance',
                            'ROLE_EMPLOYEE': 'Employee'
                          };
                          return roleMap[rowData.role] || rowData.role || 'N/A';
                        }
                      },
                      {
                        title: 'JOB TITLE',
                        field: 'jobs',
                        headerStyle: { minWidth: '200px' },
                        cellStyle: { color: '#475569' },
                        render: rowData => (
                          <span className="font-medium text-gray-800">
                            {rowData.jobs?.length > 0
                              ? rowData.jobs[0].jobTitle || 'N/A'
                              : 'N/A'}
                          </span>
                        )
                      },
                      {
                        title: 'MOBILE',
                        field: 'user_personal_info.phone',
                        headerStyle: { minWidth: '140px' },
                        cellStyle: { color: '#475569' },
                        render: rowData => rowData.user_personal_info?.phone || 'N/A'
                      },
                      {
                        title: 'Employment Status',
                        field: 'jobs[0].empStatus',
                        headerStyle: { minWidth: '120px' },
                        render: rowData => {
                          const status = rowData.jobs?.[0]?.empStatus || 'N/A';
                          const statusClass = {
                            'Active': 'bg-green-200 text-green-600',
                            'On Leave': 'bg-yellow-200 text-yellow-600',
                            'Terminated': 'bg-red-100 text-red-800'
                          }[status] || 'bg-gray-100 text-gray-800';

                          return (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                              {status}
                            </span>
                          );
                        }
                      },
                      {
                        title: 'Actions',
                        field: 'actions',
                        headerStyle: { width: '120px' },
                        cellStyle: {
                          textAlign: 'center',
                          padding: '0 4px'
                        },
                        render: rowData => (
                          <div className="flex items-center justify-center space-x-1">
                            <button
                              onClick={this.onView(rowData)}
                              className="p-1.5 text-blue-400 hover:bg-blue-50 rounded-full transition-colors duration-200"
                              title="View Details"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={this.onEdit(rowData)}
                              className="p-1.5 text-yellow-400 hover:bg-yellow-50 rounded-full transition-colors duration-200"
                              title="Edit Details"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            {rowData.id !== JSON.parse(localStorage.getItem('user'))?.id && (
                              <button
                                onClick={this.onDelete(rowData)}
                                className="p-1.5 text-red-400 hover:bg-red-50 rounded-full transition-colors duration-200"
                                title="Delete"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )
                      }
                    ]}
        
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
