import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

// Import images
import image1 from './images/image1.avif';
import image2 from './images/image2.avif';
import image3 from './images/image3.avif';
import image4 from './images/image4.jpg';
import image5 from './images/image5.jpeg';
import image6 from './images/image6.jpeg';

// Import Footer component
import Footer from './Footer';

// Testimonials data
const testimonials = [
    {
        id: 1,
        name: 'Rock Johnson',
        testimonial: 'I love using this task management app! It has greatly improved my productivity and organization. Highly recommended!',
        image: image4, // Add image for John Doe
    },
    {
        id: 2,
        name: 'Barack Obama',
        testimonial: 'This app has made collaboration with my team so much easier. Assigning tasks, tracking progress, and communicating within the app has streamlined our workflow.',
        image: image5, // Add image for Jane Smith
    },
    {
        id: 3,
        name: 'Chris Brown',
        testimonial: 'Customizable task categories have been a game-changer for me. I can easily organize my tasks based on priority and project, keeping me focused and efficient.',
        image: image6, // Add image for Michael Johnson
    },
];

const Testimonials = () => {
    return (
        <div className="testimonials-container">
            {testimonials.map(testimonial => (
                <div key={testimonial.id} className="testimonial">
                    <div className="testimonial-content">
                        <img className="testimonial-image" src={testimonial.image} alt={testimonial.name} />
                        <p className="testimonial-text">"{testimonial.testimonial}"</p>
                        <p className="testimonial-author">- {testimonial.name}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

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

            {/* Testimonials section */}
            <section className="say">
                <h2>What Our Users Say</h2>
                <Testimonials />
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
