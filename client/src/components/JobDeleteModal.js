import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import { Modal, Alert, Button } from "react-bootstrap";
import axios from 'axios';

export default class JobDeleteModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            showAlert: false,
            errorMsg: ""
        };
    }

    onDelete = async (event) => {
        event.preventDefault();

        try {
            await axios({
                method: 'delete',
                url: 'api/jobs/' + this.props.data.id,
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            });
            this.setState({ redirect: true });
        } catch (err) {
            this.setState({
                showAlert: true,
                errorMsg: err.response?.data?.message || 'An error occurred while deleting the job.'
            });
            console.error('Delete error:', err);
        }
    };

    render() {
        const { redirect, showAlert, errorMsg } = this.state;
        
        if (redirect) {
            return <Redirect to="/job-list" />;
        }

        return (
            <Modal
                {...this.props}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className="font-sans"
            >
                <Modal.Header closeButton className="bg-gradient-to-r from-red-600 to-red-800 text-white border-b border-red-500">
                    <Modal.Title id="contained-modal-title-vcenter" className="text-xl font-semibold">
                        Delete Job
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-6">
                    {showAlert && (
                        <div className="mb-4 p-3 rounded-md bg-red-100 text-red-800 border border-red-200">
                            <i className="fas fa-exclamation-circle mr-2"></i>
                            {errorMsg}
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        <p className="text-gray-700">
                            <i className="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
                            Warning: Deleting this job will also permanently remove all associated payment records.
                        </p>
                        <p className="font-medium text-gray-800">
                            Are you sure you want to continue?
                        </p>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={this.props.onHide}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={this.onDelete}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                <i className="fas fa-trash-alt mr-1"></i> Delete Job
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}