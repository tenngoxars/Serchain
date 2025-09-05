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
npm run build

# 确保静态目录存在并已构建完成
mkdir -p static/css
if [ ! -f static/css/output.css ]; then
    echo "Error: Tailwind CSS build failed!"
    exit 1
fi

echo "Build completed successfully!"
