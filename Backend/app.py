from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from LoginRegister.Register import register_bp
from LoginRegister.Login import login_bp
from LLM.Response import response_bp
from ComparisonLLM.Compare import compare_bp

app = Flask(__name__)

# Updated CORS configuration - this is the fix!
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

@app.route('/message')
def home():
    print("📦 Backend '/' route accessed")
    return jsonify({
        "message": "Backend is running!",
        "db_status": "connected" if Config.DB is not None else "not connected"
    })

app.register_blueprint(register_bp, url_prefix="/api")
app.register_blueprint(login_bp, url_prefix="/api")
app.register_blueprint(response_bp, url_prefix="/api")
app.register_blueprint(compare_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True, port=Config.PORT)