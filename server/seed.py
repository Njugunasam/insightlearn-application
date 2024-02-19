import requests
from app import db, User, Task
from app import app

def seed():
    with app.app_context():
        # Create sample users if they don't already exist
        samuel = User.query.filter_by(username='samuel').first()
        if not samuel:
            samuel = User(username='samuel', email='samuel@example.com', password='password123')
            db.session.add(samuel)
        
        lawrence = User.query.filter_by(username='lawrence').first()
        if not lawrence:
            lawrence = User(username='lawrence', email='lawrence@example.com', password='securepass')
            db.session.add(lawrence)
        
        # Commit the changes to the database
        db.session.commit()
        
        # Create sample tasks for each user
        task1 = Task(title='Complete project proposal', description='Draft and finalize project proposal for upcoming client meeting', user_id=samuel.id)
        task2 = Task(title='Prepare presentation slides', description='Create slides for the project presentation meeting', user_id=samuel.id)
        task3 = Task(title='Review project timeline', description='Review and update project timeline based on recent changes', user_id=lawrence.id)
        task4 = Task(title='Follow up with clients', description='Check in with clients to provide project updates and address any concerns', user_id=lawrence.id)
        
        # Add tasks to the session
        db.session.add(task1)
        db.session.add(task2)
        db.session.add(task3)
        db.session.add(task4)
        
        # Commit the changes to the database
        db.session.commit()

        # Test the /tasks endpoint
        token = 'bmtq0lsnaUeXhLVK0jAUAoeN26my0Onsp_F_yX_09sQ'
        headers = {'Authorization': f'Bearer {token}'}
        response = requests.get('http://127.0.0.1:5000/tasks', headers=headers)

        # Print the response content
        print(response.json())

if __name__ == '__main__':
    seed()
