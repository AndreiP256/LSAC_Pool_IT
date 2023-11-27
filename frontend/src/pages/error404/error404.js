import React from 'react';
import "./error404.css"

export default function Error404() {
    return (
        <div className = "error-page" style={{ textAlign: 'center', marginTop: '20vh' }}>
            <h1>404</h1>
            <p>Oops! The page you are looking for does not exist.</p>
            <a href="/">Go back to Home</a>
        </div>
    );
}