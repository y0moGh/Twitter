from flask import Flask, request, jsonify, session, make_response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import secrets

app = Flask(__name__)
CORS(app, supports_credentials=True, methods=["GET", "POST", "PUT", "DELETE"])

# Configuración de la base de datos SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tpTwitter.db'  # El nombre de la base de datos es usuarios.db
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Configuración para manejar sesiones en Flask
clave_secreta = secrets.token_hex(32)
app.secret_key = clave_secreta

# Configurar SameSite=None para la cookie de sesión
app.config['SESSION_COOKIE_SECURE'] = False
app.config['SESSION_COOKIE_SAMESITE'] = 'None'

# Creo la "tabla" Posts
class Posts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(50), nullable=False)
    content = db.Column(db.String(100), nullable=False)

# Creo la "tabla" Comments
class Comments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(50), nullable=False)
    content = db.Column(db.String(100), nullable=False)
    postId = db.Column(db.Integer, nullable=False)

# Creo la "tabla" Users
class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)

# Posts
@app.route('/api/createPost', methods=['POST'])
def createPost():
    data = request.json

    if 'author' in data and 'title' and 'content' in data:
        newPost = Posts(author=data['author'], title=data['title'], content=data['content'])
        db.session.add(newPost)
        db.session.commit()
        return jsonify({"mensaje": "Post creado correctamente"})
    else:
        return jsonify({"mensaje": "Error en los datos recibidos"}), 400

@app.route('/api/showPosts', methods=['GET'])
@app.route('/api/showPosts/<int:post_id>', methods=['GET'])
def show_posts(post_id=None):
    if post_id:
        post = Posts.query.get(post_id)
        if post:
            postData = {"id": post.id, "author": post.author, "title": post.title, "content": post.content}
            return jsonify({"post": postData})
        else:
            return jsonify({"mensaje": "No se encontró el post"}), 404
    else:
        posts = Posts.query.all()
        postsData = [{"id": post.id,"author": post.author, "title": post.title, "content": post.content} for post in posts]
        return jsonify({"posts": postsData})

# Comments
@app.route('/api/createComment', methods=['POST'])
def createComment():
    data = request.json

    if 'author' in data and 'title' and 'content' and 'postId' in data:
        newComment = Comments(author=data['author'], title=data['title'], content=data['content'], postId=data['postId'])
        db.session.add(newComment)
        db.session.commit()
        return jsonify({"mensaje": "Comentario creado correctamente"})
    else:
        return jsonify({"mensaje": "Error en los datos recibidos"}), 400
    
@app.route('/api/showComments', methods=['GET'])
def showComments():
    comments = Comments.query.all()
    commentsData = [{"author": comment.author, "title": comment.title, "content": comment.content, "postId": comment.postId} for comment in comments]
    return jsonify({"comments": commentsData})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json

    if 'user' in data and 'password' in data:
        user = Users.query.filter_by(user=data['user'], password=data['password']).first()

        if user:
            session['user_id'] = user.id
            response = make_response(jsonify({"mensaje": "Inicio de sesión exitoso", "user": user.user}))
            
            # Configurar la cookie con SameSite=None
            response.set_cookie('username', user.user, samesite='None', secure=False)
            
            return response
        else:
            return jsonify({"mensaje": "Credenciales incorrectas"}), 401
    else:
        return jsonify({"mensaje": "Error en los datos recibidos"}), 400

@app.route('/api/createUser', methods=['POST'])
def createUser():
    data = request.json

    if 'user' in data and 'password' in data:
        newUser = Users(user=data['user'], password=data['password'])
        db.session.add(newUser)
        db.session.commit()
        return jsonify({"mensaje": "Usuario creado correctamente"})
    else:
        return jsonify({"mensaje": "Error en los datos recibidos"}), 400

@app.route('/api/showUsers', methods=['GET'])
def showUsers():
    users = Users.query.all()
    usersData = [{"user": user.user, "password": user.password} for user in users]
    return jsonify({"users": usersData})

# Eliminar un post
@app.route('/api/deletePost/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    post = Posts.query.get(post_id)

    if post:
        db.session.delete(post)
        db.session.commit()
        return jsonify({"mensaje": "Post eliminado correctamente"})
    else:
        return jsonify({"mensaje": "No se encontró el post"}), 404
    
# Actualizar un post
@app.route('/api/updatePost/<int:post_id>', methods=['PUT'])
def update_post(post_id):
    post = Posts.query.get(post_id)

    if post:
        data = request.json

        if 'author' in data and 'title' in data and 'content' in data:
            post.author = data['author']
            post.title = data['title']
            post.content = data['content']

            db.session.commit()

            return jsonify({"mensaje": "Post actualizado correctamente"})
        else:
            return jsonify({"mensaje": "Error en los datos recibidos"}), 400
    else:
        return jsonify({"mensaje": "No se encontró el post"}), 404

if __name__ == '__main__':
    with app.app_context():
        # Crear las tablas en la base de datos
        db.create_all()
    app.run(debug=True)