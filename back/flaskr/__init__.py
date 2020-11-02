import os

from flask import Flask, render_template
from flask_cors import CORS


def create_app(test_config=None):
    # create and configure the app
    app = Flask(
        __name__,
        instance_relative_config=True,
        # static_folder='../../front/build/static',
        # template_folder='../../front/build'
        static_folder='./static',
        template_folder='./template'
    )
    cors = CORS(app) # Чтобы ходить с 3000 на 5000
    app.config['CORS_HEADERS'] = 'Content-Type'

    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # a simple page that says hello
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def catch_all(path):
        return render_template('index.html')
        # return app.send_static_file("index.html")


    from . import db
    db.init_app(app)


    from . import auth
    app.register_blueprint(auth.bp)


    from . import blog
    app.register_blueprint(blog.bp)
    # app.add_url_rule('/', endpoint='index')


    return app