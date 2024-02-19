from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_migrate import Migrate
from functools import wraps
import jwt
import datetime
import secrets
import re
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = secrets.token_urlsafe(32)

# Define the path to the React build directory
react_build_path = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), 'client', 'build')

# Serve static files from the React build directory
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_static(path):
    if path != "" and os.path.exists(os.path.join(react_build_path, path)):
        # Serve any other static files
        return app.send_static_file(path)
    else:
        # Serve index.html for any other route
        return app.send_static_file('index.html')

# Initialize SQLAlchemy, Migrate, and Bcrypt
db = SQLAlchemy(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)

# Initialize CORS with default settings
CORS(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f"Task('{self.title}', '{self.description}')"

# JWT token required decorator


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split()[1]
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(
                token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.filter_by(id=data['user_id']).first()
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated


@app.route('/signup', methods=['POST'])
def signup():
    # Extract user data from request
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Check if all required fields are present
    if not username or not email or not password:
        return jsonify({'error': 'All fields are required!'}), 400

    # Validate email format
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({'error': 'Invalid email address!'}), 400

    # Validate password criteria
    if len(password) < 8 or not any(char.isdigit() for char in password):
        return jsonify({'error': 'Password must be at least 8 characters long and contain at least one digit!'}), 400

    # Check if the user already exists
    if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
        return jsonify({'error': 'Username or email already exists! Please login instead.'}), 400

    # Create a new user
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    # Log a message indicating successful user registration
    print(f"User '{username}' registered successfully!")

    # After successful registration
    token = jwt.encode({'user_id': new_user.id, 'exp': datetime.datetime.utcnow(
    ) + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'])
    return jsonify({'message': 'User registered successfully!', 'token': token}), 201

# Route to login and get JWT token


@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    user = User.query.filter_by(username=username).first()
    if user and bcrypt.check_password_hash(user.password, password):
        # Passwords match, login successful
        token = jwt.encode({'user_id': user.id, 'exp': datetime.datetime.utcnow(
        ) + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'])
        return jsonify({'token': token, 'username': user.username}), 200
    else:
        # Invalid username or password
        return jsonify({'message': 'Invalid username or password!'}), 401

# Route to reset password confirmation


@app.route('/reset-password', methods=['POST'])
def reset_password():
    email = request.json.get('email')
    new_password = request.json.get('password')

    # Additional validation for password
    if not new_password or len(new_password) < 8 or not any(char.isdigit() for char in new_password):
        return jsonify({'message': 'Password is required and must be at least 8 characters long and contain at least one digit!'}), 400

    # Check if email exists in the database
    user = User.query.filter_by(email=email).first()
    if user:
        # Update user's password
        user.password = bcrypt.generate_password_hash(
            new_password).decode('utf-8')
        db.session.commit()

        # Log password reset message
        print(f"Password for user '{user.username}' reset successfully!")

        return jsonify({'message': 'Password reset successfully!'}), 200
    else:
        # Log user not found message
        print(f"User with email '{email}' not found!")

        return jsonify({'message': 'User not found!'}), 404


# Route to log out
@app.route('/logout', methods=['GET'])
def logout():
    # Here, you can include code to clear the authentication token from the client-side.
    # For example, you can remove the token from local storage in the frontend.

    return jsonify({'message': 'User logged out successfully'}), 200
# Route to view all tasks assigned to the logged-in user


@app.route('/tasks', methods=['GET'])
@token_required
def get_tasks(current_user):
    tasks = Task.query.filter_by(user_id=current_user.id).all()
    return jsonify([{'id': task.id, 'title': task.title, 'description': task.description} for task in tasks]), 200

# Route to create a new task


@app.route('/tasks/add', methods=['POST'])
@token_required
def add_task(current_user):
    data = request.json
    title = data.get('title')
    description = data.get('description')

    if not title or not description:
        return jsonify({'message': 'Title and description are required'}), 400

    new_task = Task(title=title, description=description,
                    user_id=current_user.id)
    db.session.add(new_task)
    db.session.commit()

    return jsonify({'message': 'Task added successfully'}), 201

# Route to fetch user information


@app.route('/user', methods=['GET'])
@token_required
def get_user_info(current_user):
    return jsonify({'username': current_user.username}), 200


if __name__ == '__main__':
    app.run(debug=True)
