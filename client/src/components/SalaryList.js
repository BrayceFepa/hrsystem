import React, { Component } from "react";
import { Card, Badge, Button, Form, Modal } from "react-bootstrap";
import {Redirect} from 'react-router-dom'
import MaterialTable from 'material-table'
import DeleteModal from './DeleteModal'
import axios from 'axios'
import { ThemeProvider } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles'

export default class SalaryList extends Component {
  
  constructor(props) {
    super(props)

    this.state = {
      data: [],
      selectedUser: null,
      editRedirect: false,
      deleteModal: false,
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      isLoading: false
    }
  }

  componentDidMount() {
    this.fetchData(1, this.state.pageSize);
  }

  fetchData = (page, pageSize) => {
    this.setState({ isLoading: true });
    
    axios({
      method: 'get',
      url: `/api/financialInformations?page=${page}&pageSize=${pageSize}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => {
      this.setState({
        data: res.data.items,
        totalCount: res.data.totalItems,
        currentPage: res.data.currentPage,
        pageSize: res.data.pageSize,
        isLoading: false
      });
    })
    .catch(err => {
      console.error('Error fetching financial information:', err);
      this.setState({ isLoading: false });
    });
  }

  handlePageChange = (page, pageSize) => {
    this.fetchData(page + 1, pageSize);
  }

  handlePageSizeChange = (pageSize) => {
    this.fetchData(1, pageSize);
  }

  onEdit = (financialInfo) => {
    return (event) => {
      event.preventDefault()

      this.setState({selectedUser: financialInfo.user, editRedirect: true})
    } 
  }

  onView = (user) => {
    return (event) => {
      event.preventDefault()

      this.setState({selectedUser: user, viewRedirect: true})
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
      <div className="container-fluid pt-4">
        {this.state.editRedirect ? (<Redirect to={{pathname: '/salary-details', state: {selectedUser: this.state.selectedUser}}}></Redirect>) : (<></>)}
        {this.state.viewRedirect ? (<Redirect to={{pathname: '/salary-view', state: {selectedUser: this.state.selectedUser}}}></Redirect>) : (<></>)}
        <div className="col-sm-12">
          <Card>
            <Card.Header className="bg-danger">
              <div className="panel-title">
                <strong>List of Employees and Their Salaries</strong>
              </div>
            </Card.Header>
            <Card.Body>
              <ThemeProvider theme={theme}>
                <MaterialTable 
                  columns={[
                    {title: 'EMP ID', field: 'user.id'},
                    {title: 'Full Name', field: 'user.fullName'},
                    {title: 'Gross Salary', field: 'salaryGross'},
                    {title: 'Deductions', field: 'deductionTotal'},
                    {title: 'Net Salary', field: 'salaryNet'},
                    {title: 'Employment Type', field: 'employmentType'},
                    // {
                    //   title: 'View',
                    //   render: rowData => (
                    //     <Form>
                    //       <Button size="sm" className="mr-2 bg-danger border-danger" variant="info" onClick={this.onView(rowData.user)}><i className="far fa-eye bg-danger"></i></Button>
                    //     </Form>
                    //   )
                    // },
                    {
                      title: 'Action',
                      render: rowData => (
                        <>
                          <Button size="sm" variant="info" className="mr-2 bg-danger border-danger" onClick={this.onEdit(rowData)}><i className="far fa-edit"></i>Edit</Button>
                        </>
                      )
                    }
                  ]}
                  data={this.state.data}
                  options={{
                    rowStyle: (rowData, index) => ({
                      backgroundColor: index % 2 ? '#f2f2f2' : 'white'
                    }),
                    page: this.state.currentPage - 1,
                    pageSize: this.state.pageSize,
                    pageSizeOptions: [10, 20, 30, 50],
                    paginationType: 'stepped',
                    paginationPosition: 'both',
                    emptyRowsWhenPaging: false,
                    search: false,
                    showTitle: false,
                    toolbar: true,
                    headerStyle: {
                      backgroundColor: '#f8f9fa',
                      fontWeight: 'bold',
                      padding: '10px',
                      position: 'sticky',
                      top: 0,
                      zIndex: 1
                    },
                    loading: this.state.isLoading,
                    sorting: false,
                    debounceInterval: 500,
                    minBodyHeight: '400px',
                    maxBodyHeight: 'calc(100vh - 300px)',
                    padding: 'dense',
                    showFirstLastPageButtons: true,
                    showSelectAllCheckbox: false,
                    showTextRowsSelected: false,
                    toolbarButtonAlignment: 'left',
                    actionsColumnIndex: -1
                  }}
                  onChangePage={this.handlePageChange}
                  onChangeRowsPerPage={({ pageSize }) => this.handlePageSizeChange(pageSize)}
                  totalCount={this.state.totalCount}
                />
              </ThemeProvider>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}