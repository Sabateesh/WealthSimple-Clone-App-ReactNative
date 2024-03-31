import pandas as pd

from yahoo_fin.stock_info import get_live_price, get_quote_table, get_data, get_quote_data, get_day_gainers, get_day_losers, get_day_most_active, get_company_info
from yahoo_fin import news
from yahoo_fin import stock_info as si



import os



import requests
from flask import Flask, jsonify, request, redirect, url_for, render_template
from flask_login import LoginManager, UserMixin, login_required
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import logging
import os
from requests_html import HTMLSession
from datetime import datetime
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC





# Flask app setup
app = Flask(__name__)
app.config['SECRET_KEY'] = b'\x10d\x7f\x99\xfa\x88\xe8\xe2B*\x86\xe9\x14\xc1\xa7\xbd'

# Construct the path to the database file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, 'wealthsimple_clone.db')

# Configure the SQLAlchemy database URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy with the Flask app
db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.init_app(app)

# User model
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

with app.app_context():
    db.create_all()


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        email = data['email']
        password = data['password']

        logging.info(f'Received registration request with email: {email}')

        hashed_password = generate_password_hash(password)

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            logging.warning(f'Email already exists: {email}')
            return jsonify({'success': False, 'message': 'Email already exists'}), 409

        new_user = User(email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        logging.info(f'User registered successfully: {email}')
        return jsonify({'success': True}), 201
    except Exception as e:
        logging.error(f'Error during registration: {e}')
        return jsonify({'success': False, 'message': 'Registration failed'}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']
    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        return jsonify({'success': True}), 200
    else:
        return jsonify({'success': False}), 401

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('index'))


@app.route('/logo', methods=['GET'])
def get_logo():
    company_name = request.args.get('name')
    ticker_symbol = request.args.get('ticker')

    if not company_name and not ticker_symbol:
        return jsonify({'error': 'Either company name or ticker symbol is required'}), 400

    api_url = 'https://api.api-ninjas.com/v1/logo?'
    if company_name:
        api_url += f'name={company_name}'
    elif ticker_symbol:
        api_url += f'ticker={ticker_symbol}'

    try:
        response = requests.get(api_url, headers={'X-Api-Key': 'vI3t9p1/WhQZ+LsHRk0KgQ==MtiZRh0fA0J8eG7L'})
        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({'error': f'Error fetching logo: {response.text}'}), response.status_code
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/logo2', methods=['GET'])
def get_logo2():
    ticker_symbol = request.args.get('ticker')
    api_key = 'IH54C6QtdA2J78bQVEymjX8jyQnDUPCu'

    if not ticker_symbol:
        return jsonify({'error': 'Ticker symbol is required'}), 400
    
    logo_url = f'https://financialmodelingprep.com/image-stock/{ticker_symbol}.png?apikey={api_key}'
    return jsonify({'logo_url': logo_url}), 200







@app.route('/stock_price', methods=['GET'])
def get_stock_price():
    stock_symbol = request.args.get('symbol')

    if not stock_symbol:
        return jsonify({'error': 'No stock symbol provided'}), 400

    try:
        price = get_live_price(stock_symbol.upper())
        full_quote = get_quote_table(stock_symbol.upper())
        keysToInclude = ["Bid", "Ask", "Open", "Previous Close", "Earnings Date", "Market Cap", "PE Ratio (TTM)", "Volume", "Day's Range"]
        quote = {key: full_quote[key] for key in keysToInclude if key in full_quote}
        return jsonify({'symbol': stock_symbol, 'price': price, 'quote': quote}), 200

    except Exception as e:
        return jsonify({'error': f'Error fetching data for {stock_symbol}: {str(e)}'}), 500




@app.route('/stock_history', methods=['GET'])
def get_stock_history():
    stock_symbol = request.args.get('symbol')
    end_date = datetime.now().strftime('%Y-%m-%d')


    if not stock_symbol:
        return jsonify({'error': 'No stock symbol provided'}), 400

    try:
        start_date = (datetime.now() - pd.DateOffset(years=5)).strftime('%Y-%m-%d')
        historical_data = get_data(stock_symbol.upper(), start_date=start_date, end_date=end_date)
        prices = historical_data['close'].tolist()
        dates = historical_data.index.strftime('%Y-%m-%d').tolist()
        return jsonify({'symbol': stock_symbol, 'dates': dates, 'prices': prices}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/stock_info', methods=['GET'])
def get_stock_info():
    stock_symbol = request.args.get('symbol')
    if not stock_symbol:
        return jsonify({'error': 'No stock symbol provided'}), 400
    try:
        price = get_live_price(stock_symbol.upper())
        quote_data = get_quote_data(stock_symbol.upper())
        currency = quote_data.get('currency', 'USD')
        return jsonify({
            'symbol': stock_symbol,
            'price': price,
            'currency': currency
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/day_gainers', methods=['GET'])
def day_gainers():
    try:
        gainers = get_day_gainers().head(3)
        data = gainers[['Symbol', 'Name', 'Price (Intraday)', '% Change', ]].to_dict(orient='records')
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/day_losers', methods=['GET'])
def day_losers():
    try:
        losers = get_day_losers().head(3)
        data = losers[['Symbol','Name', 'Price (Intraday)', '% Change']].to_dict(orient='records')
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/most_active', methods=['GET'])
def most_active():
    try:
        active_stocks = get_day_most_active().head(3)
        data = active_stocks[['Symbol','Name', 'Price (Intraday)', '% Change']].to_dict(orient='records')
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Current get_top_cryptos from yahoo_fin does not work. using alt Web scraping
@app.route('/top_cryptos')
def get_top_crypto():
    '''gets the top 3 cryptocurrencies by market cap'''

    session = HTMLSession()

    resp = session.get("https://finance.yahoo.com/cryptocurrencies?offset=0&count=1")

    tables = pd.read_html(resp.html.raw_html)

    df = tables[0].copy()

    df["% Change"] = df["% Change"].map(lambda x: float(str(x).strip("%").strip("+").replace(",", "")))

    fields_to_change = [x for x in df.columns.tolist() if "Volume" in x or x == "Market Cap" or x == "Circulating Supply"]

    for field in fields_to_change:
        if type(df[field][0]) == str:
            df[field] = df[field].map(lambda x: float(str(x).replace(",", "").replace("T", "e12").replace("B", "e9").replace("M", "e6").replace("K", "e3").replace("%", "")))

    session.close()

    return df.to_json(orient="records")


#Logo fetch for cryto not working currently - need to research alt api's
@app.route('/crypto_logo', methods=['GET'])
def get_crypto_logo():
    crypto_symbol = request.args.get('symbol')

    if not crypto_symbol:
        return jsonify({'error': 'No cryptocurrency symbol provided'}), 400

    api_url = 'https://api.api-ninjas.com/v1/logo?'
    if crypto_symbol:
        api_url += f'ticker={crypto_symbol}'
    try:
        response = requests.get(api_url, headers={'X-Api-Key': 'vI3t9p1/WhQZ+LsHRk0KgQ==MtiZRh0fA0J8eG7L'})
        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({'error': f'Error fetching logo: {response.text}'}), response.status_code
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/news/<ticker>', methods=['GET'])
def get_stock_news(ticker):
    try:
        news_items = news.get_yf_rss(ticker)
        return jsonify(news_items)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/company_info', methods=['GET'])
def get_company_info():
    ticker_symbol = request.args.get('symbol')
    if not ticker_symbol:
        return jsonify({'error': 'Ticker symbol is required'}), 400

    api_key = 'IH54C6QtdA2J78bQVEymjX8jyQnDUPCu'
    url = f'https://financialmodelingprep.com/api/v3/search?query={ticker_symbol}&limit=1&apikey={api_key}'

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        if data:
            return jsonify(data[0]), 200 
        else:
            return jsonify({'error': 'No company information found'}), 404
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

@app.route('/company_search', methods=['GET'])
def company_search():
    query = request.args.get('query')
    limit = request.args.get('limit', 20)
    
    # Check if the query ends with '.TO', if so, set the exchange to 'TSX'
    exchange = 'TSX' if query.upper().endswith('.TO') else 'NASDAQ'

    api_key = 'IH54C6QtdA2J78bQVEymjX8jyQnDUPCu'
    url = f'https://financialmodelingprep.com/api/v3/search?query={query}&limit={limit}&exchange={exchange}&apikey={api_key}'

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return jsonify(data), 200
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500


@app.route('/company-profile/<symbol>', methods=['GET'])
def get_company_profile(symbol):
    api_key = 'IH54C6QtdA2J78bQVEymjX8jyQnDUPCu'
    if not api_key:
        return jsonify({"error": "API key is required"}), 400
    
    api_url = f"https://financialmodelingprep.com/api/v3/profile/{symbol}?apikey={api_key}"
    response = requests.get(api_url)
    
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Failed to fetch company profile"}), response.status_code

@app.route('/trades/nancy-pelosi', methods=['GET'])
def get_nancy_pelosi_trades():
    options = Options()
    options.add_argument('--headless')
    #driver = webdriver.Chrome(service=Service(ChromeDriverManager(version="123.0.6312.87").install()),options=options)
    service = Service(executable_path='/Users/sabateeshsivakumar/Downloads/chromedriver-mac-arm64/chromedriver')
    driver = webdriver.Chrome(service=service, options=options)
    url = "https://www.quiverquant.com/congresstrading/politician/Nancy%20Pelosi-P000197"
    driver.get(url)

    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, 'table tr')))

    trades = []
    rows = driver.find_elements(By.CSS_SELECTOR, 'table tr')
    for row in rows:
        cells = row.find_elements(By.TAG_NAME, 'td')
        if len(cells) >= 5:
            stock_info = cells[0].text.strip().split('\n')
            transaction_info = cells[1].text.strip().split('\n')
        
            stock = stock_info[0] if len(stock_info) > 0 else None
            stock_detail = stock_info[1] if len(stock_info) > 1 else None
            transaction = transaction_info[0] if len(transaction_info) > 0 else None
            transaction_amount = transaction_info[1] if len(transaction_info) > 1 else None
        
            trade = {
                'stock': stock,
                'stock_detail': stock_detail,  
                'transaction': transaction,
                'transaction_amount': transaction_amount,
                'filed': cells[2].text.strip(),
                'traded': cells[3].text.strip(),
                'description': cells[4].text.strip()
            }
            trades.append(trade)

    driver.quit()
    return jsonify(trades)

@app.route('/trades/tommy-tuberville', methods=['GET'])
def get_tommy_tuberville_trades():
    options = Options()
    options.add_argument('--headless')
    #driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    service = Service(executable_path='/Users/sabateeshsivakumar/Downloads/chromedriver-mac-arm64/chromedriver')
    driver = webdriver.Chrome(service=service, options=options)
    url = "https://www.quiverquant.com/congresstrading/politician/Tommy%20Tuberville-T000278"
    driver.get(url)

    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, 'table tr')))

    trades = []
    rows = driver.find_elements(By.CSS_SELECTOR, 'table tr')
    for row in rows:
        cells = row.find_elements(By.TAG_NAME, 'td')
        if len(cells) >= 5:
            stock_info = cells[0].text.strip().split('\n')
            transaction_info = cells[1].text.strip().split('\n')
        
            stock = stock_info[0] if len(stock_info) > 0 else None
            stock_detail = stock_info[1] if len(stock_info) > 1 else None
            transaction = transaction_info[0] if len(transaction_info) > 0 else None
            transaction_amount = transaction_info[1] if len(transaction_info) > 1 else None
        
            trade = {
                'stock': stock,
                'stock_detail': stock_detail,  
                'transaction': transaction,
                'transaction_amount': transaction_amount,
                'filed': cells[2].text.strip(),
                'traded': cells[3].text.strip(),
                'description': cells[4].text.strip()
            }
            trades.append(trade)

    driver.quit()
    return jsonify(trades)

@app.route('/trades/josh-gottheimer', methods=['GET'])
def get_josh_gottheimer_trades():
    options = Options()
    options.add_argument('--headless')
    #driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    service = Service(executable_path='/Users/sabateeshsivakumar/Downloads/chromedriver-mac-arm64/chromedriver')
    driver = webdriver.Chrome(service=service, options=options)
    url = "https://www.quiverquant.com/congresstrading/politician/Josh%20Gottheimer-G000583"
    driver.get(url)

    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, 'table tr')))

    trades = []
    rows = driver.find_elements(By.CSS_SELECTOR, 'table tr')
    for row in rows:
        cells = row.find_elements(By.TAG_NAME, 'td')
        if len(cells) >= 5:
            stock_info = cells[0].text.strip().split('\n')
            transaction_info = cells[1].text.strip().split('\n')
        
            stock = stock_info[0] if len(stock_info) > 0 else None
            stock_detail = stock_info[1] if len(stock_info) > 1 else None
            transaction = transaction_info[0] if len(transaction_info) > 0 else None
            transaction_amount = transaction_info[1] if len(transaction_info) > 1 else None
        
            trade = {
                'stock': stock,
                'stock_detail': stock_detail,  
                'transaction': transaction,
                'transaction_amount': transaction_amount,
                'filed': cells[2].text.strip(),
                'traded': cells[3].text.strip(),
                'description': cells[4].text.strip()
            }
            trades.append(trade)

    driver.quit()
    return jsonify(trades)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000,debug=True)