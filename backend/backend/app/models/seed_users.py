from app import db
from app.models.user import User
from werkzeug.security import generate_password_hash

# HR
hr = User(
    id='user_001',
    name='Kratibha Gangwar',
    email='hr@zapcg.com',
    role='HR',
    department='HR',
    avatar=None,
    permissions={
        'personalInfo': {'view': True, 'edit': True},
        'salaries': {'view': True, 'edit': False},
        'stipends': {'view': True, 'edit': False},
        'projects': {'view': False, 'edit': False},
        'resources': {'view': False, 'edit': False},
        'escalations': {'view': False, 'edit': False}
    },
    password=generate_password_hash('hr123')
)
# Resource Manager
manager = User(
    id='user_002',
    name='Deepthi Nagam L',
    email='manager@zapcg.com',
    role='Resource Manager',
    department='Resource Management',
    avatar=None,
    permissions={
        'personalInfo': {'view': False, 'edit': False},
        'salaries': {'view': False, 'edit': False},
        'stipends': {'view': False, 'edit': False},
        'projects': {'view': True, 'edit': True},
        'resources': {'view': True, 'edit': True},
        'escalations': {'view': True, 'edit': True},
        'teamAllocation': {'view': True, 'edit': True}
    },
    password=generate_password_hash('manager123')
)
# Leadership/SLT
ceo = User(
    id='user_003',
    name='Kishore Pallamreddy',
    email='ceo@zapcg.com',
    role='Leadership',
    department='Leadership',
    avatar=None,
    permissions={
        'personalInfo': {'view': True, 'edit': False},
        'salaries': {'view': True, 'edit': False},
        'stipends': {'view': True, 'edit': False},
        'projects': {'view': True, 'edit': False},
        'resources': {'view': True, 'edit': False},
        'escalations': {'view': True, 'edit': True}
    },
    password=generate_password_hash('Leadership@123')
)
cio = User(
    id='user_004',
    name='Sai Konda',
    email='cio@zapcg.com',
    role='Leadership',
    department='Leadership',
    avatar=None,
    permissions=ceo.permissions,
    password=generate_password_hash('Leadership@123')
)
cto = User(
    id='user_005',
    name='Prasanth Nair',
    email='cto@zapcg.com',
    role='Leadership',
    department='Leadership',
    avatar=None,
    permissions=ceo.permissions,
    password=generate_password_hash('Leadership@123')
)
# Engineering Manager
em1 = User(
    id='user_006',
    name='Santhanakrishnan B',
    email='santhanakrishnan.b@zapcg.com',
    role='Engineering Manager',
    department='Engineering',
    avatar=None,
    permissions={
        'personalInfo': {'view': False, 'edit': False},
        'salaries': {'view': False, 'edit': False},
        'stipends': {'view': False, 'edit': False},
        'projects': {'view': True, 'edit': False},
        'resources': {'view': False, 'edit': False},
        'escalations': {'view': True, 'edit': False}
    },
    password=generate_password_hash('EM123')
)
# Delivery Owner
em2 = User(
    id='user_007',
    name='Anurag Mahanto',
    email='anurag.mahanto@zapcg.com',
    role='Delivery Owner',
    department='Engineering',
    avatar=None,
    permissions=em1.permissions,
    password=generate_password_hash('EM123')
)
# Finance Head
finance = User(
    id='user_008',
    name='Sushama Mohandasan',
    email='sushama.mohandasan@zapcg.com',
    role='Finance Head',
    department='Finance',
    avatar=None,
    permissions={
        'personalInfo': {'view': False, 'edit': False},
        'salaries': {'view': True, 'edit': True},
        'stipends': {'view': True, 'edit': True},
        'projects': {'view': False, 'edit': False},
        'resources': {'view': False, 'edit': False},
        'escalations': {'view': False, 'edit': False}
    },
    password=generate_password_hash('Finance123')
)

def seed_users():
    db.session.add_all([hr, manager, ceo, cio, cto, em1, em2, finance])
    db.session.commit()
