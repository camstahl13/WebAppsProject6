import { Component } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../services/AuthService";


class AutoRedirect extends Component{
    static contextType = AuthContext;

    render() {
        const { user } = this.context;
        if (user && user.loggedIn) {
            if (!user.is_faculty) {
                return <Navigate to={`/student/${user.username}`} />;
            }
            else {
                return <Navigate to={`/faculty/${user.username}`} />;
            }
        }
        return <Navigate to="/login" />;
    }
}

export default AutoRedirect;