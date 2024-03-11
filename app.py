import requests
from flask import Flask, jsonify, request
from datetime import datetime

import pandas as pd

from yahoo_fin.stock_info import get_live_price, get_quote_table, get_data, get_quote_data, get_day_gainers, get_day_losers, get_day_most_active


app = Flask(__name__)

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
        start_date = (datetime.now() - pd.DateOffset(years=1)).strftime('%Y-%m-%d')
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



if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)

