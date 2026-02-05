import json
import os
import hashlib
import secrets
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    '''API для аутентификации: регистрация, вход и подтверждение email'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if action == 'register':
            email = body.get('email', '').lower().strip()
            password = body.get('password', '')
            full_name = body.get('full_name', '')
            
            if not email or not password:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email и пароль обязательны'}),
                    'isBase64Encoded': False
                }
            
            cur.execute('SELECT id FROM users WHERE email = %s', (email,))
            if cur.fetchone():
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Пользователь с таким email уже существует'}),
                    'isBase64Encoded': False
                }
            
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            verification_code = ''.join([str(secrets.randbelow(10)) for _ in range(6)])
            
            cur.execute(
                '''INSERT INTO users (email, password_hash, full_name, verification_code, is_verified) 
                   VALUES (%s, %s, %s, %s, %s) RETURNING id, email, full_name''',
                (email, password_hash, full_name, verification_code, False)
            )
            user = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'message': 'Регистрация успешна',
                    'user': dict(user),
                    'verification_code': verification_code
                }),
                'isBase64Encoded': False
            }
        
        elif action == 'verify':
            email = body.get('email', '').lower().strip()
            code = body.get('code', '')
            
            cur.execute('SELECT id FROM users WHERE email = %s AND verification_code = %s', (email, code))
            user = cur.fetchone()
            
            if not user:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Неверный код подтверждения'}),
                    'isBase64Encoded': False
                }
            
            cur.execute('UPDATE users SET is_verified = TRUE WHERE email = %s', (email,))
            conn.commit()
            
            session_token = secrets.token_urlsafe(32)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'message': 'Email подтвержден',
                    'token': session_token,
                    'user_id': user['id']
                }),
                'isBase64Encoded': False
            }
        
        elif action == 'login':
            email = body.get('email', '').lower().strip()
            password = body.get('password', '')
            
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            
            cur.execute(
                'SELECT id, email, full_name, role, balance, is_verified FROM users WHERE email = %s AND password_hash = %s',
                (email, password_hash)
            )
            user = cur.fetchone()
            
            if not user:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Неверный email или пароль'}),
                    'isBase64Encoded': False
                }
            
            if not user['is_verified']:
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email не подтвержден'}),
                    'isBase64Encoded': False
                }
            
            session_token = secrets.token_urlsafe(32)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'message': 'Вход выполнен',
                    'token': session_token,
                    'user': dict(user)
                }),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Неизвестное действие'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
