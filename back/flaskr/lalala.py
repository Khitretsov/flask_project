@bp.route('/login', methods=('GET', 'POST'))
def login():
    if request.method == 'POST':
        # Всякий код

        if error is None:
            session.clear()
            session['user_id'] = user['id']     # session == {'user_id': user['id']}

        # Всякий код


@bp.before_app_request
def load_logged_in_user():
    user_id = session.get('user_id')    # session == None






Добрый вечер!
Кто-нибудь, пожалуйста, подскажите, что я делаю не так.

Что дано.
У меня всего два запроса, оба POST.
Первый - login. При его обработке происходит запись id текущего пользователя в объект session
Второй создаёт запись в БД. 
Есть функция load_logged_in_user, обёрнутая в декоратор @bp.before_app_request.
Она вызывается при проверке авторизирован ли пользователь, отправляющий второй запрос.
Втоорй запрос отправляется после успешного завершения первого

Вопрос. 
Почему объект session в load_logged_in_user равен None?