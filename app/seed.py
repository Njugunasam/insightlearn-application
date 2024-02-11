from app import db, User, Task
from app import app

def seed():
    with app.app_context():
        # Create sample users
        samuel = User(username='samuel', password='password123')
        lawrence = User(username='lawrence', password='securepass')
        
        # Add users to the session
        db.session.add(samuel)
        db.session.add(lawrence)
        
        # Commit the changes to the database
        db.session.commit()
        
        # Create sample tasks for each user
        task1 = Task(title='Complete project proposal', description='Draft and finalize project proposal for upcoming client meeting', user=samuel)
        task2 = Task(title='Prepare presentation slides', description='Create slides for the project presentation meeting', user=samuel)
        task3 = Task(title='Review project timeline', description='Review and update project timeline based on recent changes', user=lawrence)
        task4 = Task(title='Follow up with clients', description='Check in with clients to provide project updates and address any concerns', user=lawrence)
        
        # Add tasks to the session
        db.session.add(task1)
        db.session.add(task2)
        db.session.add(task3)
        db.session.add(task4)
        
        # Commit the changes to the database
        db.session.commit()

if __name__ == '__main__':
    seed()
