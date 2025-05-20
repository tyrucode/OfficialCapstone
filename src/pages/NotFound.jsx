import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const NotFound = () => {
    // state for the not found page
    const [seconds, setSeconds] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((prevSeconds) => { // take the timer and  when it hits 1 nav the user to the home page
                if (prevSeconds === 1) {
                    clearInterval(timer); // stop the timer
                    navigate("/"); // send user home
                    return 0;
                }
                return prevSeconds - 1;
            });
        }, 1000);

        return () => clearInterval(timer); // cleanup
    }, [navigate]);

    return (
        <div>
            <h2>Page Not Found</h2>
            <p>Redirecting to Home in {seconds} seconds...</p>
        </div>
    );
};

export default NotFound;
