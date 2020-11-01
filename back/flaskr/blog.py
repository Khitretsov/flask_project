from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)

from werkzeug.exceptions import abort

from flaskr.auth import login_required
from flaskr.db import get_db

bp = Blueprint('blog', __name__,  url_prefix='/blog')


def chengeStructure(sql_list):
    if len(sql_list) == 0:
        return []

    keys = sql_list[0].keys()
    default_dict = dict((key, None) for key in keys)
    
    arr = []
    for item in sql_list:
        new_dict = default_dict.copy()
        for key in keys:
            new_dict[key] = item[key]
        
        arr.append(new_dict)
    
    return arr


@bp.route('/posts')
def posts():
    db = get_db()
    posts = db.execute(
        'SELECT p.id, title, body, created, author_id, username'
        ' FROM post p JOIN user u ON p.author_id = u.id'
        ' ORDER BY created DESC'
    ).fetchall()

    return jsonify(chengeStructure(posts))


@bp.route('/create', methods=('GET', 'POST'))
@login_required
def create():
    if request.method == 'POST':
        form = request.get_json()
        title = form['title']
        body = form['body']
        error = None

        if not title:
            error = 'Title is required.'

        if error is not None:
            flash(error)
        else:
            db = get_db()
            db.execute(
                'INSERT INTO post (title, body, author_id)'
                ' VALUES (?, ?, ?)',
                (title, body, g.user['id'])
            )
            db.commit()
            createdRow = db.execute(
                'SELECT p.id, title, body, created, author_id, username'
                ' FROM post p JOIN user u ON p.author_id = u.id'
                ' ORDER BY p.id DESC LIMIT 1'
            ).fetchall()

            return jsonify({'is_success': True, 'message': chengeStructure(createdRow)})

        return jsonify({'is_success': False, 'message': error})


def get_post(id, check_author=True):
    post = get_db().execute(
        'SELECT p.id, title, body, created, author_id, username'
        ' FROM post p JOIN user u ON p.author_id = u.id'
        ' WHERE p.id = ?',
        (id,)
    ).fetchone()

    if post is None:
        abort(404, "Post id {0} doesn't exist.".format(id))

    if check_author and post['author_id'] != g.user['id']:
        abort(403)

    return post


@bp.route('/<int:id>/delete', methods=('POST',))
@login_required
def delete(id):
    get_post(id)
    db = get_db()
    db.execute('DELETE FROM post WHERE id = ?', (id,))
    db.commit()
    return jsonify({'is_success': True, 'message': 'Post has been deleted'})


@bp.route('/<int:id>/update', methods=('GET', 'POST'))
@login_required
def update(id):
    post = get_post(id)

    if request.method == 'POST':
        form = request.get_json()
        title = form['title']
        body = form['body']
        error = None

        if not title:
            error = 'Title is required.'

        if error is not None:
            flash(error)
        else:
            db = get_db()
            db.execute(
                'UPDATE post SET title = ?, body = ?'
                ' WHERE id = ?',
                (title, body, id)
            )
            db.commit()
            return jsonify({'is_success': True, 'message': 'Post has been updated'})

    return jsonify({'is_success': False, 'message': error})
