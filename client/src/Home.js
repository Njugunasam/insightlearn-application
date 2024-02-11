import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

// Import images
import image1 from './images/image1.avif';
import image2 from './images/image2.avif';
import image3 from './images/image3.avif';

// Import Footer component
import Footer from './Footer';

const Home = () => {
    return (
        <div className="home-container">
            {/* Navbar */}

            {/* Welcome section */}
            <section className="welcome">
                <h1>Welcome to our Task Management App</h1>
                <p>Effortlessly organize your tasks, streamline teamwork, and boost productivity.</p>
            </section>

            {/* Features section with illustrations */}
            <section className="features">
                <div className="feature">
                    <img className="feature-image" src={image1} alt="User-friendly Interface" />
                    <div className="feature-content">
                        <h2>User-friendly Interface</h2>
                        <p>Our platform offers an intuitive and easy-to-use interface, allowing users to navigate seamlessly and access all features effortlessly. With clean design and intuitive controls, users can focus on their tasks without distractions.</p>
                    </div>
                </div>
                <div className="feature">
                    <img className="feature-image" src={image2} alt="Collaborative Task Management" />
                    <div className="feature-content">
                        <h2>Collaborative Task Management</h2>
                        <p>Streamline teamwork and collaboration with our collaborative task management feature. Assign tasks to team members, share task lists, and track progress in real-time. Facilitate communication and coordination among team members by providing a centralized platform for task assignment, updates, and discussions. Enhance productivity and efficiency by fostering seamless collaboration within your team.</p>
                    </div>
                </div>
                <div className="feature">
                    <img className="feature-image" src={image3} alt="Customizable Task Categories" />
                    <div className="feature-content">
                        <h2>Customizable Task Categories</h2>
                        <p>Effortlessly organize your tasks with customizable categories tailored to your workflow. Create personalized categories such as "Work," "Personal," "Home," or any other relevant labels to categorize your tasks based on priority, project, or context. Stay organized and focused by sorting tasks into specific categories, enabling you to easily locate and manage your tasks according to your preferences. With customizable task categories, you have the flexibility to adapt your task management system to suit your unique needs and optimize your productivity.</p>
                    </div>
                </div>
            </section>

            {/* Call-to-action section */}
            <section className="call-to-action">
                <h2>Ready to get started?</h2>
                <Link to="/signup" className="btn-primary">Sign Up Now</Link>
                <Link to="/login" className="btn-secondary">Login</Link>
            </section>

            {/* Include Footer component */}
            <Footer />
        </div>
    );
}

export default Home;
