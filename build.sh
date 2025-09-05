#!/bin/bash
set -x  # 启用调试模式，显示执行的每个命令

echo "Current directory: $(pwd)"

# 安装 Node.js
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash - || {
    echo "Failed to setup Node.js repository"
    exit 1
}
apt-get update && apt-get install -y nodejs || {
    echo "Failed to install Node.js"
    exit 1
}

# 验证 Node.js 安装
echo "Verifying Node.js installation..."
node --version
npm --version

# 安装 Python 依赖
echo "Installing Python dependencies..."
pip install -r requirements.txt

# 进入 webapp 目录
echo "Changing to webapp directory..."
cd webapp || {
    echo "Failed to change to webapp directory"
    exit 1
}

echo "Current directory after cd: $(pwd)"
echo "Listing webapp directory contents:"
ls -la

# 检查 Node.js 版本
NODE_VERSION=$(node -v)
echo "Node.js version: $NODE_VERSION"

# 安装 npm 依赖
echo "Installing npm dependencies..."
npm install || {
    echo "Failed to install npm dependencies"
    exit 1
}

echo "Listing installed node_modules:"
ls -la node_modules

# 构建 Tailwind CSS
echo "Building Tailwind CSS..."
echo "Checking for main.css:"
ls -la ./static/css/main.css || {
    echo "main.css not found!"
    exit 1
}

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
