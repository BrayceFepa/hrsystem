import React, { Component } from "react";
import { Card, Button, Form, Alert } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import axios from "axios";
import moment from 'moment'
import MaterialTable from 'material-table'
import { ThemeProvider } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles'

export default class ApplicationList extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = () => ({
    applications: [],
    selectedApplications: null,
    done: false,
    hasError: false,
    errorMsg: "",
    completed: false,
    showModel: false,
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
    this.fetchApplications(1);
  }

  fetchApplications = (page) => {
    axios({
      method: "get",
      url: `/api/applications?page=${page}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => {
      const { items, ...pagination } = res.data;
      const formattedData = items.map(app => ({
        ...app,
        user: app.user || { id: null, fullName: 'Unknown User' },
        startDate: app.startDate ? moment(app.startDate).format('YYYY-MM-DD') : '',
        endDate: app.endDate ? moment(app.endDate).format('YYYY-MM-DD') : ''
      }));
      
      this.setState({ 
        applications: formattedData,
        pagination: {
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          totalItems: pagination.totalItems,
          pageSize: pagination.pageSize,
          hasNextPage: pagination.hasNextPage,
          hasPrevPage: pagination.hasPrevPage
        }
      });
    }).catch(error => {
      console.error('Error fetching applications:', error);
      this.setState({ 
        hasError: true, 
        errorMsg: 'Failed to load applications. Please try again later.' 
      });
    });
  }

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
            errorMsg: err.response.data.message,
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
              <ThemeProvider theme={theme}>
                <MaterialTable
                
                    columns={[
                        {title: 'APP ID', field: 'id'},
                        {title: 'Full Name', field: 'user.fullName'},
                        {title: 'Start Date', field: 'startDate'},
                        {title: 'End Date', field: 'endDate'},
                        {title: 'Leave Type', field: 'type'},
                        {title: 'Comments', field: 'reason'},
                        {
                            title: 'Status', 
                            field: 'status',
                            render: rowData => (
                                <Button size="sm" variant={rowData.status==='Approved' ? "success" : rowData.status==='Pending' ? "warning" : "danger"} style={{ backgroundColor: rowData.status === 'Pending' ? '#fff3cd' : null }}>{rowData.status}</Button>
                            )
                        },
                        {
                            title: 'Action',
                            render: rowData => {
                                try {
                                    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                                    const isNotCurrentUser = rowData.user && rowData.user.id && currentUser.id && 
                                                          String(rowData.user.id) !== String(currentUser.id);
                                    const isPending = rowData.status === "Pending";
                                    
                                    if (isNotCurrentUser && isPending) {
                                        return (
                                            <>
                                                <Button 
                                                    onClick={(e) => this.onApprove(rowData)(e)} 
                                                    variant="success" 
                                                    size="sm" 
                                                    className="mr-2" 
                                                    title="Approve"
                                                >
                                                    <i className="fas fa-check"></i>
                                                </Button>
                                                <Button 
                                                    onClick={(e) => this.onReject(rowData)(e)} 
                                                    variant="danger" 
                                                    size="sm" 
                                                    className="ml-2" 
                                                    title="Reject"
                                                >
                                                    <i className="fas fa-times"></i>
                                                </Button>
                                            </>
                                        );
                                    }
                                    return null;
                                } catch (error) {
                                    console.error('Error rendering action buttons:', error);
                                    return null;
                                }
                            }
                        }
                    ]}
                    data={this.state.applications}
                    
                    options={{
                      rowStyle: (rowData, index) => ({
                        backgroundColor: index % 2 ? '#f2f2f2' : 'white'
                      }),
                      ...(this.state.pagination && {
                        pageSize: this.state.pagination.pageSize || 10,
                        page: (this.state.pagination.currentPage || 1) - 1,
                        totalCount: this.state.pagination.totalItems || 0,
                        pageSizeOptions: [5, 10, 20, 50],
                        paginationType: 'stepped',
                        onChangePage: (event, newPage) => {
                          this.handlePageChange(newPage + 1);
                        },
                        onChangeRowsPerPage: (pageSize) => {
                          this.fetchApplications(1);
                        },
                        paginationPosition: 'both'
                      })
                    }}
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