# import json
#
# import firebase_admin
# from firebase_admin import credentials
# from firebase_admin import auth
# from flask import Blueprint, jsonify, request, g
# from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
#
# carbon_auth = Blueprint('carbon_auth', __name__)
#
# with open('secrets.json') as secret_json:
#     secret_json = json.load(secret_json)
#     firebase_cred = secret_json.get('FIREBASE')
# cred = credentials.Certificate(firebase_cred)
# firebase_admin.initialize_app(cred)
#
# login_manager = LoginManager()
#
#
# @login_manager.user_loader
# def load_user(user_id):
#     return User(user_id)
#
#
# class User(UserMixin):
#     def __init__(self, id):
#         self.id = id
#
#
# # login_manager.init_app(app)
# # login_manager.login_view = 'login'
#
#
# @carbon_auth.before_request
# def before_request():
#     g.user = current_user
#
#
# @carbon_auth.route('/login', methods=['POST'])
# def login():
#     id_token = request.form.get('id_token')
#
#     try:
#         user = auth.verify_id_token(id_token)
#         user_id = user['uid']
#         user = User(user_id)
#         login_user(user)
#         return jsonify({'message': 'Logged in successfully'})
#     except auth.InvalidIdTokenError:
#         return jsonify({'message': 'Invalid ID token'})
#
#
# @carbon_auth.route('/logout')
# @login_required
# def logout():
#     logout_user()
#     return jsonify({'message': 'Logged out successfully'})
#
#
# @carbon_auth.route('/protected')
# @login_required
# def protected_resource():
#     return jsonify({'message': 'This is a protected resource'})
