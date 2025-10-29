from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from LoginRegister.Register import register_bp
from LoginRegister.Login import login_bp
from LLM.Response import response_bp

app = Flask(__name__)
CORS(app, origins=[Config.FRONTEND_URL])

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


if __name__ == "__main__":
    app.run(debug=True, port=Config.PORT)
