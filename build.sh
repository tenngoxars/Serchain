#!/bin/bash

# 安装 Python 依赖
echo "Installing Python dependencies..."
pip install -r requirements.txt

# 进入 webapp 目录
cd webapp || exit

# 确保 nodejs 和 npm 已安装
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
    echo "Installing Node.js and npm..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

# 检查 Node.js 版本
NODE_VERSION=$(node -v)
echo "Node.js version: $NODE_VERSION"

# 安装 npm 依赖
echo "Installing npm dependencies..."
npm install

# 构建 Tailwind CSS
echo "Building Tailwind CSS..."
npx tailwindcss -i ./static/css/main.css -o ./static/css/output.css --minify
BUILD_EXIT_CODE=$?
echo "Tailwind build exit code: $BUILD_EXIT_CODE"

# 确保静态目录存在并已构建完成
mkdir -p static/css
if [ ! -f static/css/output.css ]; then
    echo "Error: output.css not found!"
    ls -la static/css/
    exit 1
fi

echo "CSS build completed. File size:"
ls -lh static/css/output.css

echo "Build completed successfully!"
