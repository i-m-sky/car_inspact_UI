// src/components/ComingSoon.js

import React, { useState, useEffect } from 'react';
import '../Assets/css/commingsoon.css';

const ComingSoon = () => {
    const [countdown, setCountdown] = useState('');

    useEffect(() => {
        // Set the date we're counting down to
        const countDownDate = new Date("June 1, 2024 00:00:00").getTime();

        // Update the countdown every 1 second
        const intervalId = setInterval(() => {
            // Get the current date and time
            const now = new Date().getTime();

            // Find the distance between now and the countdown date
            const distance = countDownDate - now;

            // Calculate days, hours, minutes and seconds
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Format the countdown
            const countdownString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

            // Set the countdown state
            setCountdown(countdownString);

            // If the countdown is over, clear the interval
            if (distance < 0) {
                clearInterval(intervalId);
                setCountdown('EXPIRED');
            }
        }, 1000);

        // Clear interval on unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="coming-container">
            <h1>Coming Soon</h1>
            <p>Our website is under construction</p>
            <div className="countdown">{countdown}</div>
        </div>
    );
};

export default ComingSoon;