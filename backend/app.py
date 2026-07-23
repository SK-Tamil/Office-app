from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import pymysql

pymysql.install_as_MySQLdb()

app = Flask(__name__)
CORS(app)

# RDS DATABASE CONFIG
app.config['SQLALCHEMY_DATABASE_URI'] = (
    'mysql+pymysql://admin:admin123@officedb.c1ksc204yo6w.ap-southeast-1.rds.amazonaws.com/officedb'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Employee Table
class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    department = db.Column(db.String(100))
    email = db.Column(db.String(100))

# Home API
@app.route('/')
def home():
    return "Backend Running Successfully"

# GET ALL EMPLOYEES
@app.route('/employees', methods=['GET'])
def get_employees():
    employees = Employee.query.all()

    output = []

    for emp in employees:
        output.append({
            'id': emp.id,
            'name': emp.name,
            'department': emp.department,
            'email': emp.email
        })

    return jsonify(output)

# ADD EMPLOYEE
@app.route('/employees', methods=['POST'])
def add_employee():
    data = request.get_json()

    emp = Employee(
        name=data['name'],
        department=data['department'],
        email=data['email']
    )

    db.session.add(emp)
    db.session.commit()

    return jsonify({'message': 'Employee Added'})

# UPDATE EMPLOYEE
@app.route('/employees/<int:id>', methods=['PUT'])
def update_employee(id):
    emp = Employee.query.get(id)

    if not emp:
        return jsonify({'message': 'Employee Not Found'}), 404

    data = request.get_json()

    emp.name = data['name']
    emp.department = data['department']
    emp.email = data['email']

    db.session.commit()

    return jsonify({'message': 'Employee Updated'})

# DELETE EMPLOYEE
@app.route('/employees/<int:id>', methods=['DELETE'])
def delete_employee(id):
    emp = Employee.query.get(id)

    if not emp:
        return jsonify({'message': 'Employee Not Found'}), 404

    db.session.delete(emp)
    db.session.commit()

    return jsonify({'message': 'Employee Deleted'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

