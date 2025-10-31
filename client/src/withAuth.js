import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

const withAuth = (WrappedComponent) => {
  return class extends Component {
    _isMounted = false;

    constructor(props) {
      super(props);
      this.state = {
        isAuthenticated: false,
        loading: true,
        redirect: false,
      };
    }

    componentDidMount() {
      this._isMounted = true;
      this.verifyToken();
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    verifyToken = async () => {
      const token = localStorage.getItem('token');
      
      // If no token, redirect to login
      if (!token) {
        this.safeSetState({ loading: false, redirect: true });
        return;
      }

      try {
        const response = await axios({
          method: "get",
          url: "/checkToken",
          headers: { "Authorization": `Bearer ${token}` }
        });

        // Only proceed if component is still mounted
        if (this._isMounted) {
          localStorage.setItem('user', JSON.stringify(response.data.authData.user));
          this.safeSetState({ 
            isAuthenticated: true,
            loading: false 
          });
        }
      } catch (error) {
        console.error('Authentication error:', error);
        if (this._isMounted) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          this.safeSetState({ 
            isAuthenticated: false,
            loading: false, 
            redirect: true 
          });
        }
      }
    };

    // Helper method to safely set state if component is still mounted
    safeSetState = (newState) => {
      if (this._isMounted) {
        this.setState(newState);
      }
    };

    render() {
      const { loading, redirect, isAuthenticated } = this.state;
      
      // Show nothing while loading
      if (loading) {
        return null;
      }
      
      // Redirect to login if not authenticated
      if (redirect || !isAuthenticated) {
        return <Redirect to="/login" />;
      }
      
      // Render the protected component with props
      return <WrappedComponent {...this.props} />;
    }
  };
};

export default withAuth;
