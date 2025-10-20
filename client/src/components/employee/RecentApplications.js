import React from "react";
import axios from "axios";
import { format } from 'date-fns';

export default class RecentApplications extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      recentApplications: [],
      loading: true,
      error: null
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.fetchApplications();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  fetchApplications = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem('user')).id;
      const response = await axios({
        method: "get",
        url: `/api/applications/recent/user/${userId}`,
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        },
      });

      if (this._isMounted) {
        this.setState({ 
          recentApplications: response.data,
          loading: false 
        });
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      if (this._isMounted) {
        this.setState({ 
          error: 'Failed to load applications',
          loading: false 
        });
      }
    }
  };

  formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  getStatusBadge = (status) => {
    const statusConfig = {
      'Approved': { class: 'success', icon: 'check-circle' },
      'Rejected': { class: 'danger', icon: 'times-circle' },
      'Pending': { class: 'warning', icon: 'clock' }
    };
    
    const config = statusConfig[status] || { class: 'secondary', icon: 'question-circle' };
    
    return (
      <span className={`badge bg-${config.class} text-white`}>
        <i className={`fas fa-${config.icon} mr-1`}></i>
        {status}
      </span>
    );
  };

  renderApplication = (app) => {
    const startDate = new Date(app.startDate);
    const endDate = new Date(app.endDate);
    const isSameDay = startDate.toDateString() === endDate.toDateString();
    
    return (
      <div key={app.id} className="application-item p-3 border-bottom">
        <div className="d-flex justify-content-between align-items-start">
          <div className="d-flex align-items-start">
            <div className="mr-3 mt-1">
              <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" 
                   style={{ width: '48px', height: '48px' }}>
                <i className="fas fa-file-alt text-danger" style={{ fontSize: '1.25rem' }}></i>
              </div>
            </div>
            <div className="flex-grow-1">
              <h5 className="mb-2 font-weight-bold text-dark" style={{ fontSize: '1.1rem' }}>
                {app.type || 'Application'}
              </h5>
              <p className="mb-2 text-muted" style={{ fontSize: '0.95rem' }}>
                {app.reason || 'No reason provided'}
              </p>
              <div className="d-flex flex-wrap align-items-center" style={{ gap: '1rem' }}>
                <div className="d-flex align-items-center" style={{ fontSize: '0.95rem' }}>
                  <i className="far fa-calendar-alt mr-2"></i>
                  <span>
                    {isSameDay 
                      ? this.formatDate(app.startDate) 
                      : `${this.formatDate(app.startDate)} - ${this.formatDate(app.endDate)}`
                    }
                  </span>
                </div>
                <div className="d-flex align-items-center" style={{ fontSize: '0.95rem' }}>
                  <i className="far fa-user mr-2"></i>
                  <span>{app.user?.fullName || 'Unknown User'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="ml-2">
            {this.getStatusBadge(app.status)}
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { recentApplications, loading, error } = this.state;

    if (loading) {
      return (
        <div className="card">
          <div className="card-body text-center p-4">
            <div className="spinner-border text-danger" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-2 mb-0">Loading applications...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="alert alert-danger m-3">
          <i className="fas fa-exclamation-circle mr-2"></i>
          {error}
        </div>
      );
    }

    if (recentApplications.length === 0) {
      return (
        <div className="card">
          <div className="card-body text-center p-4">
            <i className="far fa-folder-open fa-2x text-muted mb-2"></i>
            <p className="mb-0">No recent applications found</p>
          </div>
        </div>
      );
    }

    return (
      <div className="card">
        <div className="card-header bg-white border-bottom-0">
          {/* <h5 className="mb-0">Recent Applications</h5> */}
        </div>
        <div className="list-group list-group-flush">
          {recentApplications.map(this.renderApplication)}
        </div>
      </div>
    );
  }
}
