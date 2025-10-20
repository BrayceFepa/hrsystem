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

export default class ApplicationList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      applications: [],
      hasError: false,
      errorMsg: "",
      completed: false,
      totalItems: 0,
      totalPages: 0,
      currentPage: 0,
      pageSize: 10
    };
  }

  componentDidMount() {
    this.fetchApplications();
  }

  fetchApplications = (page = 0, pageSize = 10) => {
    axios({
      method: "get",
      url: "/api/applications",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      params: {
        page: page + 1, // API uses 1-based paging
        size: pageSize
      }
    }).then((res) => {
      const formattedApplications = res.data.items.map(app => ({
        ...app,
        startDate: moment(app.startDate).format('YYYY-MM-DD'),
        endDate: moment(app.endDate).format('YYYY-MM-DD'),
        fullName: app.user?.fullName || app.name,
        status: app.status || 'Pending'
      }));

      this.setState({ 
        applications: formattedApplications,
        totalItems: res.data.totalItems,
        totalPages: res.data.totalPages,
        currentPage: res.data.currentPage - 1,
        pageSize: pageSize
      });
    }).catch((err) => {
      console.error('Error fetching applications:', err);
      this.setState({ 
        hasError: true, 
        errorMsg: err.response?.data?.message || 'Failed to load applications. Please try again later.'
      });
    });
  }

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
            padding: '6px 6px 6px 6px'
          }
        }
      }
    });

    const { applications, pageSize } = this.state;

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
                    { title: 'APP ID', field: 'id' },
                    { 
                      title: 'Full Name', 
                      field: 'fullName',
                      render: rowData => rowData.user?.fullName || rowData.name || 'N/A'
                    },
                    { title: 'Start Date', field: 'startDate' },
                    { title: 'End Date', field: 'endDate' },
                    { title: 'Leave Type', field: 'type' },
                    { title: 'Comments', field: 'reason' },
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
                    },
                    {
                      title: 'Action',
                      field: 'actions',
                      sorting: false,
                      render: rowData => {
                        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                        const isCurrentUser = rowData.user?.id === currentUser.id;
                        
                        if (isCurrentUser || rowData.status !== 'Pending') {
                          return null;
                        }
                        
                        return (
                          <div>
                            <Button 
                              onClick={this.onApprove(rowData)} 
                              variant="success" 
                              size="sm" 
                              className="mr-2" 
                              title="Approve"
                            >
                              <i className="fas fa-check"></i>
                            </Button>
                            <Button 
                              onClick={this.onReject(rowData)} 
                              variant="danger" 
                              size="sm" 
                              className="ml-2" 
                              title="Reject"
                            >
                              <i className="fas fa-times"></i>
                            </Button>
                          </div>
                        );
                      }
                    }
                  ]}
                  data={query =>
                    new Promise((resolve) => {
                      this.fetchApplications(query.page, query.pageSize)
                        .then(() => {
                          resolve({
                            data: applications,
                            page: this.state.currentPage,
                            totalCount: this.state.totalItems,
                          });
                        });
                    })
                  }
                  options={{
                    search: true,
                    sorting: true,
                    pageSize: pageSize,
                    pageSizeOptions: [10, 20, 30, 50, 75, 100],
                    rowStyle: (rowData, index) => ({
                      backgroundColor: index % 2 ? '#f2f2f2' : 'white'
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