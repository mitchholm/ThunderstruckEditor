import React from 'react';
import { ReactComponent as Logo } from './logo.svg';
import './Nav.css';


class Nav extends React.Component {
    render() {
        return (
            <div className="navbar">
                <Logo />
            </div>
        );
    }
}

export default Nav