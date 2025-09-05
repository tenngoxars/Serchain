#!/bin/bash
echo "Starting build process..."

# 进入 webapp 目录
cd webapp || exit

# 安装 npm 依赖
echo "Installing npm dependencies..."
npm install --production

# 构建 Tailwind CSS
echo "Building Tailwind CSS..."
npm run build

# 确保静态目录存在
mkdir -p static/css

# 构建完成
echo "Build completed!"

# 返回根目录
cd ..
