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

    this.state = {
      applications: [],
      selectedApplications: null,
      done: false,
      hasError: false,
      errorMsg: "",
      completed: false,
      showModel: false,
    };
  }

  componentDidMount() {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.departmentId) {
        throw new Error('User department information not found');
      }
      
      const deptId = user.departmentId;
      axios({
        method: "get",
        url: "/api/applications/department/" + deptId,
        // url: "/api/applications/manager/me",
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
      console.error('Error in componentDidMount:', error);
      this.setState({ 
        hasError: true,
        errorMsg: error.message
      });
    }
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
            <Card.Header className="bg-danger">
              <div className="panel-title">
                <strong>Application List</strong>
              </div>
            </Card.Header>
            <Card.Body>
              <ThemeProvider theme={theme}>
                <MaterialTable
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
                        <Button size="sm" variant={rowData.status === 'Approved' ? "success" : rowData.status === 'Pending' ? "warning" : "danger"}>{rowData.status}</Button>
                            )
                        },
                        {
                            title: 'Action',
                            render: rowData => (
                              rowData.user.id != JSON.parse(localStorage.getItem('user')).id ? (
                                rowData.status==="Pending" ? (
                                  <>
                              <Button onClick={this.onApprove(rowData)} variant="success" size="sm" className="mr-2" title="Approve"><i className="fas fa-check"></i></Button>
                              <Button onClick={this.onReject(rowData)} variant="danger" size="sm" className="ml-2" title="Reject"><i className="fas fa-times"></i></Button>
                                  </>
                                ) : null
                              ) : null
                            )
                        }
                    ]}
                    data={this.state.applications}
                    
                    options={{
                    rowStyle: (rowData, index) => {
                      if(index%2) {
                        return {backgroundColor: '#f2f2f2'}
                      }
                    },
                    pageSize: 10,
                    pageSizeOptions: [10, 20, 30, 50, 75, 100]
                  }}
                    title="Applications"
                />
              </ThemeProvider>
            </Card.Body>
          </Card>
        </div>
        {this.state.hasError ? (
          <Alert variant="danger" className="m-3" block>
            {this.state.errMsg}
          </Alert>
        ) : this.state.completed ? (
          <Redirect to="/application-list" />
        ) : (
          <></>
        )}
      </div>
    );
  }
}