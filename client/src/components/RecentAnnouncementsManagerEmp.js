import React from "react";
import axios from "axios";
import { format } from 'date-fns';

export default class RecentAnnouncements extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      recentAnnouncements: [],
      loading: true,
      error: null
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.fetchAnnouncements();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  fetchAnnouncements = async () => {
    try {
      const deptId = JSON.parse(localStorage.getItem('user')).departmentId;
      const response = await axios({
        method: "get",
        url: `/api/departmentAnnouncements/recent/department/${deptId}`,
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        },
      });

      if (this._isMounted) {
        this.setState({ 
          recentAnnouncements: response.data,
          loading: false 
        });
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
      if (this._isMounted) {
        this.setState({ 
          error: 'Failed to load announcements',
          loading: false 
        });
      }
    }
  };

  formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  renderAnnouncement = (announcement) => {
    const { user, department } = announcement;
    const announcementDate = new Date(announcement.createdAt);
    
    return (
      <div key={announcement.id} className="announcement-item mb-4 p-3 border rounded">
        <div className="d-flex">
          <div className="mr-3 text-center">
            <div className="bg-danger text-white p-2 rounded" style={{ minWidth: '70px' }}>
              <div className="font-weight-bold text-uppercase" style={{ fontSize: '0.75rem' }}>
                {format(announcementDate, 'MMM')}
              </div>
              <div className="h3 mb-0 font-weight-bold">
                {announcementDate.getDate()}
              </div>
              <div style={{ fontSize: '0.75rem' }}>
                {format(announcementDate, 'yyyy')}
              </div>
            </div>
          </div>
          
          <div className="flex-grow-1">
            {/* Title Section */}
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h4 className="mb-1 font-weight-bold text-danger">
                {announcement.announcementTitle || 'No Title'}
              </h4>
              <small className="text-muted">
                <i className="far fa-clock mr-1"></i>
                {this.formatDate(announcement.createdAt)}
              </small>
            </div>
            
            {/* Description Section */}
            <div className="bg-light p-3 rounded mb-3">
              <p className="mb-0 text-dark">
                {announcement.announcementDescription || 'No description provided.'}
              </p>
            </div>
            
            {/* Footer with Meta Info */}
            <div className="d-flex flex-wrap justify-content-between align-items-center text-muted small">
              <div className="mb-1">
                <span className="badge bg-light text-dark border mr-2">
                  <i className="fas fa-user-tie mr-1"></i>
                  {user?.fullName || 'Unknown User'}
                </span>
                {user?.role && (
                  <span className="badge bg-info text-white mr-2">
                    {user.role.replace('ROLE_', '')}
                  </span>
                )}
              </div>
              
              {department && (
                <div className="mb-1">
                  <span className="badge bg-light text-dark border">
                    <i className="fas fa-building mr-1"></i>
                    {department.departmentName}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { recentAnnouncements, loading, error } = this.state;

    if (loading) {
      return (
        <div className="card">
          <div className="card-body text-center p-4">
            <div className="spinner-border text-danger" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-2 mb-0">Loading announcements...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-circle mr-2"></i>
          {error}
        </div>
      );
    }

    if (recentAnnouncements.length === 0) {
      return (
        <div className="card">
          <div className="card-body text-center p-4">
            <i className="far fa-bell-slash fa-2x text-muted mb-2"></i>
            <p className="mb-0">No announcements found</p>
          </div>
        </div>
      );
    }

    return (
      <div className="card">
        <div className="card-body p-0">
          {recentAnnouncements.map(this.renderAnnouncement)}
        </div>
      </div>
    );
  }
}
