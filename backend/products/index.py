import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    '''API для работы с товарами: получение списка, создание, обновление'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            query_params = event.get('queryStringParameters', {}) or {}
            category_id = query_params.get('category_id')
            seller_id = query_params.get('seller_id')
            
            query = '''
                SELECT p.*, c.name as category_name, u.full_name as seller_name, u.email as seller_email
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN users u ON p.seller_id = u.id
                WHERE p.status = 'active'
            '''
            params = []
            
            if category_id:
                query += ' AND p.category_id = %s'
                params.append(category_id)
            
            if seller_id:
                query += ' AND p.seller_id = %s'
                params.append(seller_id)
            
            query += ' ORDER BY p.created_at DESC'
            
            cur.execute(query, params)
            products = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'products': [dict(p) for p in products]}, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            seller_id = body.get('seller_id')
            title = body.get('title')
            description = body.get('description', '')
            category_id = body.get('category_id')
            price = body.get('price')
            image_url = body.get('image_url', '')
            metadata = body.get('metadata', {})
            
            if not all([seller_id, title, category_id, price]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Необходимо заполнить все обязательные поля'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                '''INSERT INTO products (seller_id, title, description, category_id, price, image_url, metadata)
                   VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id, title, price''',
                (seller_id, title, description, category_id, price, image_url, json.dumps(metadata))
            )
            product = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Товар создан', 'product': dict(product)}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
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
