import React, { Component } from "react";
import { Card, Button, Form, Alert } from "react-bootstrap";
import { Redirect, NavLink } from 'react-router-dom'
import axios from 'axios'
import MaterialTable from 'material-table'
import { ThemeProvider } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles'
import AlertModal from './AlertModal'

export default class Announcement extends Component {

    constructor(props) {
        super(props)

        this.state = {
            announcements: [],
            departments: [],
            title: "",
            description: "",
            userId: null,
            departmentId: null,
            hasError: false,
            errorMsg: '',
            completed: false,
            showEditModel: false,
            showAlertModel: false
        }
    }

    componentDidMount() {
        axios({
            method: 'get',
            url: '/api/departments',
            headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
        })
        .then(res => {
            this.setState({departments: res.data})
        })

        axios({
            method: 'get',
            url: '/api/departmentAnnouncements',
            headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
        })
        .then(res => {
            this.setState({announcements: res.data})
        })
    }

    onDelete (announcement) {
        return event => {
            event.preventDefault()

            axios({
                method: 'delete',
                url: '/api/departmentAnnouncements/'  + announcement.id,
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            })
            .then(res => {
                this.setState({completed: true})
            })
            .catch(err => {
                this.setState({hasError: true, errorMsg: err.response.data.message})
            })
            
        }
    }
    
    handleChange = (event) => {
        const {name, value} = event.target
        this.setState({
            [name]: value
        })
    }

    pushDepartments = () => {
        let items = [];
        // Add the default "All Departments" option
        items.push(<option key="all" value="all">All Departments</option>);
        
        // Safely map over departments if it's an array
        if (Array.isArray(this.state.departments)) {
            this.state.departments.forEach((dept, index) => {
                items.push(<option key={dept.id} value={dept.id}>{dept.departmentName}</option>);
            });
        }
        
        return items;
    }

    onSubmit = (event) => {
        event.preventDefault()

        let departmentId = null
        if(this.state.selectedDepartment !== 'all') {
            departmentId = this.state.selectedDepartment
        }

        let data = {
            announcementTitle: this.state.title,
            announcementDescription: this.state.description,
            createdByUserId: JSON.parse(localStorage.getItem('user')).id,
            departmentId: departmentId
        }

        axios({
            method: 'post',
            url: 'api/departmentAnnouncements',
            data: data,
            headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
        })
        .then(res => {
            this.setState({completed: true})
        })
        .then(err => {
            console.log(err)
        })
    }

  render() {
    let closeAlertModel = () => this.setState({showAlertModel: false})

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
      <div className="container-fluid pt-2">
        {this.state.completed ? <Redirect to="/announcement" /> : null}
        <div className="row">
            <div className="col-sm-12">
                <Card className="main-card">
                    <Card.Header className="bg-danger"><strong>Add Announcement</strong></Card.Header>
                    <Card.Body>
                        <Card.Text>
                            <Form onSubmit={this.onSubmit}>
                                <Form.Group>
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control 
                                        type="text"
                                        value={this.state.title}
                                        onChange={this.handleChange}
                                        name="title"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control 
                                        type="textarea"
                                        value={this.state.description}
                                        onChange={this.handleChange}
                                        name="description"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Department</Form.Label>
                                    <Form.Control 
                                        as="select"
                                        value={this.state.selectedDepartment}
                                        onChange={this.handleChange}
                                        name="selectedDepartment"
                                    >
                                        <option value="">Choose one...</option>
                                        <option value="all">All Departments</option>
                                        {this.pushDepartments()}
                                    </Form.Control>
                                </Form.Group>
                                <Button type="submit" size="sm" className="mt-2 bg-danger border-danger">Publish</Button>
                            </Form>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        </div>
        <div className="row">
            <div className="col-sm-12">
            <Card className="main-card">
                <Card.Header className="bg-danger">
                <div className="panel-title">
                    <strong>Announcement List</strong>
                </div>
                </Card.Header>
                <Card.Body>
                <ThemeProvider theme={theme}>
  <MaterialTable
    columns={[
      { 
        title: 'ID', 
        field: 'id',
        width: 80,
        headerStyle: { fontWeight: 'bold' }
      },
      { 
        title: 'TITLE', 
        field: 'announcementTitle',
        headerStyle: { fontWeight: 'bold' },
        cellStyle: { whiteSpace: 'nowrap' }
      },
      { 
        title: 'DESCRIPTION', 
        field: 'announcementDescription',
        headerStyle: { fontWeight: 'bold' },
        cellStyle: { maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
      },
      { 
        title: 'CREATED BY', 
        field: 'user.fullName',
        headerStyle: { fontWeight: 'bold' }
      },
      { 
        title: 'DEPARTMENT', 
        field: 'department.departmentName',
        headerStyle: { fontWeight: 'bold' }
      },
      {
        title: 'ACTIONS',
        field: 'actions',
        sorting: false,
        headerStyle: { fontWeight: 'bold' },
        cellStyle: { textAlign: 'center' },
        render: rowData => (
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              this.onDelete(rowData);
            }} 
            size="sm" 
            variant="outline-danger"
            className="action-button"
          >
            <i className="fas fa-trash mr-1"></i> Delete
          </Button>
        )
      }
    ]}
    data={this.state.announcements}
    options={{
      headerStyle: {
        backgroundColor: '#f8f9fa',
        color: '#333',
        fontSize: '14px',
        fontWeight: '600',
        padding: '12px 10px',
        borderBottom: '1px solid #e0e0e0'
      },
      rowStyle: (rowData, index) => ({
        backgroundColor: index % 2 ? '#f8f9fa' : '#fff',
        '&:hover': {
          backgroundColor: '#f1f3f5 !important',
          cursor: 'pointer'
        }
      }),
      pageSize: 10,
      pageSizeOptions: [5, 10, 20, 50],
      paginationType: 'stepped',
      showFirstLastPageButtons: true,
      showTitle: false,
      search: true,
      searchFieldVariant: 'outlined',
      searchFieldStyle: {
        marginBottom: '16px',
        padding: '8px',
        backgroundColor: '#fff'
      },
      actionsColumnIndex: -1,
      emptyRowsWhenPaging: false,
      toolbar: true
    }}
    localization={{
      pagination: {
        labelRowsSelect: 'rows',
        labelDisplayedRows: '{from}-{to} of {count}'
      },
      toolbar: {
        searchPlaceholder: 'Search announcements...'
      },
      body: {
        emptyDataSourceMessage: 'No announcements found',
        addTooltip: 'Add',
        deleteTooltip: 'Delete',
        editTooltip: 'Edit',
        filterRow: {
          filterTooltip: 'Filter'
        }
      }
    }}
  />
</ThemeProvider>
                </Card.Body>
            </Card>
            </div>
        </div>
        {this.state.hasError ? (
            <Alert variant="danger" className="m-3" block>
              {this.state.errMsg}
            </Alert>
          ) : (<></>)}
      </div>
    );
  }
}