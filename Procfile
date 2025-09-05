web: export NODE_ENV=production && cd webapp && python app.py
build: apt-get update && apt-get install -y curl && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs && node -v && npm -v && npm install --prefix webapp && npm run build --prefix webapp
web: gunicorn -w 2 -k gthread -b 0.0.0.0:$PORT webapp.app:app
# Build happens in Railway's Build Command, not here. Set it to: `pip install -r requirements.txt && cd webapp && npm ci --no-audit --no-fund && npm run build:css`