from flask import Flask, request, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS  # Import CORS from flask_cors module
from flask_migrate import Migrate
from functools import wraps  # Import wraps function

import jwt
import datetime
import secrets

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = secrets.token_urlsafe(32)

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
migrate = Migrate(app, db)

# Initialize CORS with default settings
CORS(app)

# Define your models here
# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)

# Task model
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

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
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.filter_by(id=data['user_id']).first()
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# Route to register a new user
@app.route('/signup', methods=['POST'])
def signup():
    username = request.json.get('username')
    email = request.json.get('email')
    password = request.json.get('password')
    if not username or not email or not password:
        return jsonify({'message': 'Username, email, and password are required!'}), 400
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully!'}), 201

# Route to login and get JWT token
@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    user = User.query.filter_by(username=username).first()
    if user and bcrypt.check_password_hash(user.password, password):
        # Passwords match, login successful
        token = jwt.encode({'user_id': user.id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'])
        return jsonify({'token': token}), 200  # Removed .decode('UTF-8')
    else:
        # Invalid username or password
        return jsonify({'message': 'Invalid username or password!'}), 401

# Route to log out
@app.route('/logout')
def logout():
    # Code to logout user (optional)
    return redirect(url_for('login'))

# Route to view all tasks assigned to the logged-in user
@app.route('/tasks', methods=['GET'])
@token_required
def get_tasks(current_user):
    tasks = Task.query.filter_by(user_id=current_user.id).all()
    return jsonify([{'id': task.id, 'title': task.title, 'description': task.description} for task in tasks]), 200

# Route to create a new task
@app.route('/tasks', methods=['POST'])
@token_required
def add_task(current_user):
    title = request.json.get('title')
    description = request.json.get('description')
    if not title or not description:
        return jsonify({'message': 'Title and description are required!'}), 400
    new_task = Task(title=title, description=description, user_id=current_user.id)
    db.session.add(new_task)
    db.session.commit()
    return jsonify({'message': 'Task created successfully!'}), 201

if __name__ == '__main__':
    app.run(debug=True)
