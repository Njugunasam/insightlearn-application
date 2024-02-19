from flask import Blueprint

tasks_bp = Blueprint('tasks', __name__)

# Define your routes here
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
    password = request.json.get('password')
    if not username or not password:
        return jsonify({'message': 'Username and password are required!'}), 400
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully!'}), 201

# Route to login and get JWT token
@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    if not username or not password:
        return jsonify({'message': 'Username and password are required!'}), 400
    user = User.query.filter_by(username=username).first()
    if user and bcrypt.check_password_hash(user.password, password):
        token = jwt.encode({'user_id': user.id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'])
        return jsonify({'token': token.decode('UTF-8')}), 200
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
    tasks = Task.query.filter_by(user=current_user).all()
    return jsonify([{'id': task.id, 'title': task.title, 'description': task.description} for task in tasks]), 200

# Route to create a new task
@app.route('/tasks', methods=['POST'])
@token_required
def add_task(current_user):
    title = request.json.get('title')
    description = request.json.get('description')
    if not title or not description:
        return jsonify({'message': 'Title and description are required!'}), 400
    new_task = Task(title=title, description=description, user=current_user)
    db.session.add(new_task)
    db.session.commit()
    return jsonify({'message': 'Task created successfully!'}), 201