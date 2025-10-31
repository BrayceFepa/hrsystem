import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import { Modal, Alert, Button } from "react-bootstrap";
import axios from 'axios'

export default class DeleteModal extends Component {
    constructor(props) {
        super(props)

        this.state = {
            redirect: false,
            showSuccess: false,
            error: null
        }
    }

    onDelete = async (event) => {
        event.preventDefault()
        
        try {
            const response = await axios({
                method: 'delete',
                url: 'api/users/' + this.props.data.id,
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            });
            
            // Show success message
            this.setState({ showSuccess: true });
            
            // Redirect after 1.5 seconds to allow user to see the success message
            setTimeout(() => {
                this.setState({ redirect: true });
                if (this.props.onSuccess) {
                    this.props.onSuccess(response.data.message);
                }
            }, 1500);
            
        } catch (err) {
            console.error('Error deleting user:', err);
            this.setState({ 
                error: err.response?.data?.message || 'Failed to delete user. Please try again.' 
            });
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/employee-list" />;
        }

        return (
            <Modal
                {...this.props}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={this.props.onHide}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {this.state.showSuccess ? 'Success' : 'Warning'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.showSuccess ? (
                        <Alert variant="success">
                            User was deleted successfully!
                        </Alert>
                    ) : (
                        <div>
                            {this.state.error && (
                                <Alert variant="danger" className="mb-3">
                                    {this.state.error}
                                </Alert>
                            )}
                            <p>Are you sure you want to delete employee: <strong>{this.props.data.fullName}</strong>?</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {!this.state.showSuccess && (
                        <>
                            <Button variant="danger" onClick={this.onDelete}>
                                Delete
                            </Button>
                            <Button variant="secondary" onClick={this.props.onHide}>
                                Cancel
                            </Button>
                        </>
                    )}
                </Modal.Footer>
            </Modal>
        );
    }
}