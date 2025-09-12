(function (root) {
  'use strict';
  
  // ============================================================================
  // 依赖注入
  // ============================================================================
  const I18N = () => root.Serchain.I18N;
  const API  = () => root.Serchain.API;
  const History = () => root.Serchain.History;

  // ============================================================================
  // 常量配置
  // ============================================================================
  const CONSTANTS = {
    // 时间相关
    ANIMATION_DURATION: 300,
    FADE_IN_DELAY: 10,
    SUCCESS_TOAST_DELAY: 1500,
    COPY_TOAST_DELAY: 1000,
    FADE_OUT_DELAY: 2000,
    SCROLL_DELAY: 300,
    QUERY_ANIMATION_DELAY: 300,
    
    // 缓存相关
    CACHE_DURATION: 5 * 60 * 1000, // 5分钟
    CACHE_MAX_SIZE: 50,
    
    // 数据相关
    INITIAL_COUNT: 10,
    INCREMENT_COUNT: 10,
    
    // 动画相关
    OPACITY_TRANSITION: "opacity 0.3s ease-in",
    HEIGHT_TRANSITION: "height 0.3s ease-in-out",
    FADE_OUT_TRANSITION: "opacity 0.5s ease-out, height 0.5s ease-out, margin 0.5s ease-out"
  };

  // ============================================================================
  // 工具函数
  // ============================================================================
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 格式化地址显示（移动端显示前4位+后4位）
  function formatAddress(address) {
    if (!address) return "";
    
    // 检查是否为移动端
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // 移动端显示前4位+后4位
      return `${address.slice(0, 4)}...${address.slice(-4)}`;
    } else {
      // 桌面端显示完整地址
      return address;
    }
  }

  // ============================================================================
  // 全局状态
  // ============================================================================
  let els = {};
  let allTransfers = null; // 存储所有数据
  let filteredTransfers = null; // 存储筛选后的数据
  let currentAddress = "";
  let currentCount = CONSTANTS.INITIAL_COUNT; // 当前查询的数据量
  let pageKey = null; // Alchemy 分页的 pageKey
  let currentFilter = "all"; // 当前筛选模式
  const incrementCount = CONSTANTS.INCREMENT_COUNT; // 每次增加的条数

  // ============================================================================
  // 缓存系统
  // ============================================================================
  const CACHE_CONFIG = {
    duration: CONSTANTS.CACHE_DURATION,
    maxSize: CONSTANTS.CACHE_MAX_SIZE,
    enableRefresh: true
  };
  const cache = new Map(); // 缓存存储
  let cacheTimestamp = null; // 当前数据的缓存时间

  // ============================================================================
  // 缓存管理函数
  // ============================================================================
  function getCachedData(address) {
    const cached = cache.get(address);
    if (cached && Date.now() - cached.timestamp < CACHE_CONFIG.duration) {
      return cached.data;
    }
    return null;
  }

  function setCachedData(address, data) {
    // 清理过期缓存
    cleanExpiredCache();
    // 限制缓存大小
    if (cache.size >= CACHE_CONFIG.maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    cache.set(address, {
      data: data,
      timestamp: Date.now()
    });
  }

  function cleanExpiredCache() {
    const now = Date.now();
    for (const [key, value] of cache.entries()) {
      if (now - value.timestamp >= CACHE_CONFIG.duration) {
        cache.delete(key);
      }
    }
  }

  function isDataFromCache() {
    return cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_CONFIG.duration);
  }

  // 格式化时间字符串
  function formatTimeString(queryTime, locale, isChinese) {
    if (isChinese) {
      // 中文：先获取日期时间，再单独获取时区名称
      const dateTime = queryTime.toLocaleString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      const timeZoneName = queryTime.toLocaleString(locale, {
        timeZoneName: 'long'
      }).split(' ').pop();
      return `${dateTime} ${timeZoneName}`;
    } else {
      // 英文：使用时区缩写，24小时格式
      return queryTime.toLocaleString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
        hour12: false
      });
    }
  }

  function updateCacheStatus() {
    const statusEl = document.getElementById('cacheStatus');
    if (!statusEl) return;
    
    // 如果没有查询过数据，不显示状态
    if (!allTransfers || !cacheTimestamp) {
      statusEl.textContent = '';
      return;
    }
    
    // 显示用户本地时间
    const queryTime = new Date(cacheTimestamp);
    const locale = I18N().getLang() === 'zh' ? 'zh-CN' : 'en-US';
    const isChinese = I18N().getLang() === 'zh';
    const timeString = formatTimeString(queryTime, locale, isChinese);
    
    statusEl.textContent = `${I18N().DICT[I18N().getLang()].queryTime}: ${timeString}`;
    statusEl.className = 'text-xs text-blue-300 font-medium';
  }

  // 显示成功状态
  function showSuccessStatus() {
    const d = I18N().DICT[I18N().getLang()];
    const message = d.success(allTransfers.length);
    
    // 创建成功提示浮窗
    const toast = document.createElement('div');
    toast.className = 'fixed bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
    toast.style.top = '50%';
    toast.style.left = '50%';
    toast.style.transform = 'translate(-50%, -50%)';
    toast.style.position = 'fixed';
    toast.style.fontSize = '16px';
    toast.style.fontWeight = '600';
    toast.style.opacity = '0';
    toast.style.scale = '0.9';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // 添加淡入效果
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.scale = '1';
    }, CONSTANTS.FADE_IN_DELAY);
    
    // 1.5秒后移除提示
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.scale = '0.9';
      toast.style.transform = 'translate(-50%, -50%) translateY(-10px)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, CONSTANTS.ANIMATION_DURATION);
    }, CONSTANTS.SUCCESS_TOAST_DELAY);
  }

  // 显示结果按钮
  function showResultButtons() {
    els.download.textContent = I18N().DICT[I18N().getLang()].download;
    // 使用 updateButtonVisibility 来根据当前筛选状态决定是否显示按钮
    updateButtonVisibility();
  }

  // 更新历史记录
  function updateHistory(addr) {
    History().add(addr);
    History().render("historyContainer", (a) => { els.input.value = a; onSearch(); });
  }

  // 更新查询更多按钮状态
  function updateLoadMoreButton() {
    if (pageKey) {
      els.loadMoreBtn.disabled = false;
      els.loadMoreBtn.textContent = I18N().DICT[I18N().getLang()].loadMoreBtn;
    } else {
      els.loadMoreBtn.disabled = true;
      els.loadMoreBtn.textContent = I18N().DICT[I18N().getLang()].noMoreData;
    }
  }

  // 处理无更多数据的情况
  function handleNoMoreData() {
    setStatus("noMoreData");
    els.loadMoreBtn.disabled = true;
    els.loadMoreBtn.textContent = I18N().DICT[I18N().getLang()].noMoreData;
    fadeOutStatus(CONSTANTS.FADE_OUT_DELAY + 1000);
  }

  // 隐藏加载状态
  function hideLoadMoreStatus() {
    els.loadMoreStatus.classList.add("hidden");
  }

  // 启用查询更多按钮
  function enableLoadMoreButton() {
    els.loadMoreBtn.disabled = false;
    els.loadMoreBtn.textContent = I18N().DICT[I18N().getLang()].loadMoreBtn;
  }

  // 显示无数据提示
  function showNoDataMessage() {
    // 移除现有的无数据提示
    const existingMessage = document.getElementById('noDataMessage');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    // 创建无数据提示
    const messageDiv = document.createElement('div');
    messageDiv.id = 'noDataMessage';
    messageDiv.className = 'text-center py-8 text-gray-400';
    messageDiv.innerHTML = `
      <div class="text-4xl mb-4">📭</div>
      <p class="text-lg font-medium">${I18N().DICT[I18N().getLang()].noDataMessage || '暂无数据'}</p>
      <p class="text-sm mt-2">${I18N().DICT[I18N().getLang()].noDataSubMessage || '请尝试其他筛选条件'}</p>
    `;
    
    // 插入到表格容器的位置
    const tableContainer = document.querySelector('.table-container');
    if (tableContainer && tableContainer.parentNode) {
      tableContainer.parentNode.insertBefore(messageDiv, tableContainer);
    }
  }

  // 隐藏无数据提示
  function hideNoDataMessage() {
    const messageDiv = document.getElementById('noDataMessage');
    if (messageDiv) {
      messageDiv.remove();
    }
  }

  // 更新按钮显示状态
  function updateButtonVisibility() {
    // 重新筛选数据以确保 filteredTransfers 是最新的
    filterTransfers();
    const hasData = filteredTransfers && filteredTransfers.length > 0;
    
    // 控制按钮的显示
    if (hasData) {
      // 有数据时：显示所有按钮
      els.download.classList.remove("hidden");
      els.loadMoreBtn.classList.remove("hidden");
      if (els.refreshBtn) {
        els.refreshBtn.classList.remove("hidden");
      }
    } else {
      // 无数据时：只显示刷新按钮，隐藏下载和查询更多按钮
      els.download.classList.add("hidden");
      els.loadMoreBtn.classList.add("hidden");
      if (els.refreshBtn) {
        els.refreshBtn.classList.remove("hidden"); // 刷新按钮始终显示
      }
    }
  }

  // 将技术错误转换为用户友好的错误信息
  function getUserFriendlyError(error) {
    const errorMessage = error.message || String(error);
    
    // 网络连接错误
    if (errorMessage.includes('HTTPSConnectionPool') || 
        errorMessage.includes('Max retries exceeded') ||
        errorMessage.includes('SSLError') ||
        errorMessage.includes('SSL: UNEXPECTED_EOF_WHILE_READING') ||
        errorMessage.includes('ConnectionError')) {
      return I18N().DICT[I18N().getLang()].networkError;
    }
    
    // 超时错误
    if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
      return I18N().DICT[I18N().getLang()].timeoutError;
    }
    
    // API 错误
    if (errorMessage.includes('API') || errorMessage.includes('api')) {
      return I18N().DICT[I18N().getLang()].apiError;
    }
    
    // 地址格式错误
    if (errorMessage.includes('invalid') || errorMessage.includes('Invalid')) {
      return I18N().DICT[I18N().getLang()].invalidAddressError;
    }
    
    // 默认错误
    return I18N().DICT[I18N().getLang()].unknownError;
  }

  function cacheDom() {
    els = {
      input: document.getElementById("addressInput"),
      btn: document.getElementById("queryBtn"),
      status: document.getElementById("status"),
      result: document.getElementById("resultContainer"),
      tbody: document.getElementById("resultsTableBody"),
      count: document.getElementById("countText"),
      download: document.getElementById("downloadLink"),
      langZh: document.getElementById("langZh"),
      langEn: document.getElementById("langEn"),
      history: document.getElementById("historyContainer"),
      loadMoreBtn: document.getElementById("loadMoreBtn"),
      loadMoreStatus: document.getElementById("loadMoreStatus"),
      loadMoreStatusText: document.getElementById("loadMoreStatusText"),
      filterAll: document.getElementById("filterAll"),
      filterReceived: document.getElementById("filterReceived"),
      filterSent: document.getElementById("filterSent"),
      refreshBtn: document.getElementById("refreshBtn"),
      refreshText: document.querySelector('.refresh-text')
    };
  }

  // 状态提示动画效果
  async function animateStatusIn() {
    els.status.style.opacity = "0";
    els.status.style.transition = `${CONSTANTS.OPACITY_TRANSITION}, ${CONSTANTS.HEIGHT_TRANSITION}`;
    const currentHeight = els.status.offsetHeight;
    els.status.style.height = "0px";
    
    await delay(CONSTANTS.FADE_IN_DELAY);
    els.status.style.opacity = "1";
    els.status.style.height = currentHeight + "px";
  }

  function setStatus(key, extra = "") {
    const d = I18N().DICT[I18N().getLang()];
    const v = d[key];
    const statusText = typeof v === "function" ? v(extra) : (v ?? "") + (extra ?? "");
    
    // 添加状态指示器样式
    els.status.className = "text-sm text-center mt-2";
    
    if (key === "querying") {
      els.status.innerHTML = `<div class="status-indicator status-warning"><div class="loading-spinner"></div>${statusText}</div>`;
    } else if (key === "success") {
      els.status.innerHTML = `<div class="status-indicator status-success">${statusText}</div>`;
    } else if (key === "invalidAddress" || key === "fetchErrorPrefix") {
      els.status.innerHTML = `<div class="status-indicator status-error">${statusText}</div>`;
    } else if (key === "noRecords") {
      els.status.innerHTML = `<div class="status-indicator status-warning">${statusText}</div>`;
    } else {
      els.status.innerHTML = statusText;
    }
    
    // 应用动画效果
    animateStatusIn();
    
    // 成功状态需要记录高度和margin，用于后续的渐隐动画
    if (key === "success") {
      delay(CONSTANTS.FADE_IN_DELAY).then(() => {
        els.status.style.marginTop = "0.5rem"; // 记录mt-2的值
      });
    }
  }

  // 状态提示渐隐函数
  function fadeOutStatus(delay = CONSTANTS.FADE_OUT_DELAY) {
    setTimeout(() => {
      els.status.style.transition = CONSTANTS.FADE_OUT_TRANSITION;
      els.status.style.opacity = "0";
      els.status.style.height = "0px"; // 高度过渡到0
      els.status.style.marginTop = "0px"; // margin也过渡到0
      setTimeout(() => {
        els.status.innerHTML = "";
        els.status.style.opacity = "1";
        els.status.style.transition = "";
        els.status.style.height = ""; // 重置高度
        els.status.style.marginTop = ""; // 重置margin
      }, CONSTANTS.ANIMATION_DURATION);
    }, delay);
  }

  // 查询中动画渐隐函数
  function fadeOutQuerying() {
    els.status.style.transition = `${CONSTANTS.OPACITY_TRANSITION.replace('ease-in', 'ease-out')}, ${CONSTANTS.HEIGHT_TRANSITION.replace('ease-in-out', 'ease-out')}`;
    els.status.style.opacity = "0";
    els.status.style.height = "0px";
    setTimeout(() => {
      els.status.innerHTML = "";
      els.status.style.opacity = "1";
      els.status.style.height = "";
      els.status.style.transition = "";
    }, CONSTANTS.ANIMATION_DURATION);
  }

  // 筛选功能
  function setFilter(filter, skipAnimation = false) {
    currentFilter = filter;
    
    // 更新按钮状态
    els.filterAll.classList.toggle("active", filter === "all");
    els.filterReceived.classList.toggle("active", filter === "received");
    els.filterSent.classList.toggle("active", filter === "sent");
    
    // 筛选数据
    filterTransfers();
    
    // 根据情况选择是否使用动画
    if (skipAnimation) {
      // 直接渲染，不使用动画
      renderTable(filteredTransfers, currentAddress);
      updateCount();
      updateButtonVisibility(); // 更新按钮显示状态
    } else {
      // 平滑过渡效果
      smoothTableTransition();
    }
  }

  // 平滑表格过渡
  function smoothTableTransition() {
    const resultContainer = els.result;
    const tbody = els.tbody;
    
    // 记录当前高度
    const currentHeight = resultContainer.offsetHeight;
    
    // 添加淡出效果
    tbody.classList.add('fade-out');
    
    setTimeout(() => {
      // 重新渲染表格
      renderTable(filteredTransfers, currentAddress);
      
      // 更新计数
      updateCount();
      
      // 更新按钮显示状态
      updateButtonVisibility();
      
      // 记录新高度
      const newHeight = resultContainer.offsetHeight;
      
      // 设置过渡高度
      resultContainer.style.height = currentHeight + 'px';
      resultContainer.style.transition = 'height 0.3s ease-in-out';
      
      // 强制重排
      resultContainer.offsetHeight;
      
      // 过渡到新高度
      resultContainer.style.height = newHeight + 'px';
      
      // 添加淡入效果
      tbody.classList.remove('fade-out');
      tbody.classList.add('fade-in');
      
      // 过渡完成后移除高度限制
      setTimeout(() => {
        resultContainer.style.height = '';
        resultContainer.style.transition = '';
        tbody.classList.remove('fade-in');
      }, CONSTANTS.ANIMATION_DURATION + 100);
      
      }, CONSTANTS.ANIMATION_DURATION);
  }

  function filterTransfers() {
    if (!allTransfers) return;
    
    const me = currentAddress.toLowerCase();
    
    switch (currentFilter) {
      case "received":
        filteredTransfers = allTransfers.filter(tx => 
          (tx.to || "").toLowerCase() === me
        );
        break;
      case "sent":
        filteredTransfers = allTransfers.filter(tx => 
          (tx.from || "").toLowerCase() === me
        );
        break;
      default:
        filteredTransfers = allTransfers;
    }
  }

  function updateCount() {
    const total = allTransfers ? allTransfers.length : 0;
    const filtered = filteredTransfers ? filteredTransfers.length : 0;
    
    if (currentFilter === "all") {
      // 全部标签：显示总记录数
      els.count.textContent = I18N().DICT[I18N().getLang()].countText(total);
    } else {
      // 转入/转出标签：只显示筛选后的记录数
      const modeText = currentFilter === "received" ? 
        I18N().DICT[I18N().getLang()].filterReceived : 
        I18N().DICT[I18N().getLang()].filterSent;
      els.count.textContent = I18N().DICT[I18N().getLang()].countText(filtered);
    }
  }

  function formatValue(v) {
    // 避免科学计数法，保留最多 18 位小数，不加千分位
    const num = Number(v);
    if (!isFinite(num)) return String(v ?? "-");
    return num.toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: 18 });
  }

  // 复制到剪贴板功能
  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      // 使用现代 Clipboard API
      navigator.clipboard.writeText(text).then(() => {
        showCopySuccess();
      }).catch(() => {
        fallbackCopyTextToClipboard(text);
      });
    } else {
      // 降级到传统方法
      fallbackCopyTextToClipboard(text);
    }
  }

  // 降级复制方法
  function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      showCopySuccess();
    } catch (err) {
      console.error('复制失败:', err);
      showCopyError();
    }
    
    document.body.removeChild(textArea);
  }

  // 显示复制提示
  function showCopyToast(message, isSuccess = true) {
    const toast = document.createElement('div');
    toast.className = `fixed ${isSuccess ? 'bg-green-600' : 'bg-red-600'} text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300`;
    toast.style.top = '20px';
    toast.style.left = '20px';
    toast.style.position = 'fixed';
    toast.style.fontSize = '14px';
    toast.style.fontWeight = '500';
    toast.style.opacity = '0';
    toast.style.scale = '0.9';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // 添加淡入效果
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.scale = '1';
    }, CONSTANTS.FADE_IN_DELAY);
    
    // 1秒后移除提示
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.scale = '0.9';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, CONSTANTS.ANIMATION_DURATION);
    }, CONSTANTS.COPY_TOAST_DELAY);
  }

  // 显示复制成功提示
  function showCopySuccess() {
    const d = I18N().DICT[I18N().getLang()];
    const message = d.copySuccess || "✅ 地址已复制到剪贴板";
    showCopyToast(message, true);
  }

  // 显示复制失败提示
  function showCopyError() {
    const d = I18N().DICT[I18N().getLang()];
    const message = d.copyError || "❌ 复制失败，请手动复制";
    showCopyToast(message, false);
  }

  // 查询更多数据
  // 显示加载更多状态
  function showLoadMoreStatus() {
    els.loadMoreBtn.disabled = true;
    els.loadMoreStatus.classList.remove("hidden");
    els.loadMoreStatusText.textContent = I18N().DICT[I18N().getLang()].loadingMore;
  }

  // 处理加载更多成功
  function handleLoadMoreSuccess(result) {
    // 合并新数据到现有数据
    allTransfers = [...allTransfers, ...result.transfers];
    pageKey = result.pageKey; // 更新 pageKey
    currentCount = allTransfers.length;
    
    // 重新筛选数据（跳过动画，因为是加载更多）
    filterTransfers();
    renderTable(filteredTransfers, currentAddress);
    updateCount();

    // 隐藏加载状态
    hideLoadMoreStatus();
    
    // 更新查询更多按钮状态
    updateLoadMoreButton();
    
    // 自动滚动到查询更多按钮
    scrollToLoadMoreButton();

    // 如果没有下一页的 pageKey，禁用按钮
    if (!pageKey) {
      els.loadMoreBtn.disabled = true;
      els.loadMoreBtn.textContent = I18N().DICT[I18N().getLang()].noMoreData;
    } else {
      // 重新启用按钮
      enableLoadMoreButton();
    }
  }

  // 滚动到加载更多按钮
  function scrollToLoadMoreButton() {
    setTimeout(() => {
      // 滚动到查询更多按钮
      const loadMoreBtn = els.loadMoreBtn;
      if (loadMoreBtn && !loadMoreBtn.classList.contains('hidden')) {
        loadMoreBtn.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      } else {
        // 备用方案：滚动到结果容器底部
        const resultContainer = els.result;
        if (resultContainer) {
          resultContainer.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'end' 
          });
        }
      }
    }, CONSTANTS.SCROLL_DELAY);
  }

  // 处理加载更多错误
  function handleLoadMoreError(e) {
    const userFriendlyError = getUserFriendlyError(e);
    setStatus("fetchErrorPrefix", userFriendlyError);
    hideLoadMoreStatus();
    enableLoadMoreButton();
  }

  async function loadMoreData() {
    if (!currentAddress) return;
    
    // 如果没有 pageKey，说明已经查完所有数据
    if (!pageKey) {
      handleNoMoreData();
      return;
    }
    
    // 显示表格下方的加载状态
    showLoadMoreStatus();
    
    try {
      // 使用 pageKey 查询下一页数据
      const result = await API().fetchTransfers(currentAddress, incrementCount, pageKey);
      if (!result.transfers.length) { 
        hideLoadMoreStatus();
        handleNoMoreData();
        return; 
      }

      handleLoadMoreSuccess(result);
    } catch (e) {
      handleLoadMoreError(e);
    }
  }

  // 处理无数据情况
  function handleNoData(tableContainer) {
    if (tableContainer) {
      tableContainer.style.display = 'none';
    }
    
    // 无数据时：只显示刷新按钮，隐藏下载和查询更多按钮
    els.download.classList.add("hidden");
    els.loadMoreBtn.classList.add("hidden");
    if (els.refreshBtn) {
      els.refreshBtn.classList.remove("hidden"); // 刷新按钮始终显示
    }
    
    // 显示无数据提示
    showNoDataMessage();
  }

  // 处理有数据情况
  function handleWithData(tableContainer) {
    // 显示表格
    if (tableContainer) {
      tableContainer.style.display = 'block';
    }
    
    // 隐藏无数据提示
    hideNoDataMessage();
    
    // 更新按钮显示状态
    updateButtonVisibility();
  }

  function renderTable(transfers, address) {
    els.tbody.innerHTML = "";
    const tableContainer = document.querySelector('.table-container');
    
    // 如果没有数据，隐藏整个表格并显示提示
    if (!transfers || transfers.length === 0) {
      handleNoData(tableContainer);
      return;
    }
    
    handleWithData(tableContainer);
    
    const fmt = I18N().timeFormatter();
    const me = address.toLowerCase();

    const frag = document.createDocumentFragment();
    transfers.forEach((tx, i) => {
      const dirKey = (tx.to || "").toLowerCase() === me ? "in" : "out";
      const tr = document.createElement("tr");
      tr.className = "table-row";
      tr.style.animationDelay = `${i * 0.05}s`; // 减少动画延迟
      
      // 添加方向图标
      const directionIcon = dirKey === "in" ? "📥" : "📤";
      const directionClass = dirKey === "in" ? "direction-in" : "direction-out";
      
      // 计算序号
      const totalIndex = i + 1;
    
      tr.innerHTML = `
      <td class="px-4 py-2 text-center font-mono text-sm text-gray-400">${totalIndex}</td>
      <td class="px-4 py-2 text-center hash-mono text-sm">${fmt.format(new Date(tx.time))}</td>
      <td class="px-4 py-2 text-center ${directionClass} font-medium">
        <span class="inline-flex items-center gap-1">
          ${directionIcon} ${I18N().dirLabel(dirKey)}
        </span>
      </td>
      <td class="px-4 py-2 whitespace-nowrap hash-mono text-xs">
        <span class="bg-gray-800 px-2 py-1 rounded text-gray-300 table-cell-address cursor-pointer hover:bg-gray-700 transition-colors" 
              title="点击复制地址: ${tx.from}" 
              onclick="copyToClipboard('${tx.from}')">${formatAddress(tx.from)}</span>
      </td>
      <td class="px-4 py-2 whitespace-nowrap hash-mono text-xs">
        <span class="bg-gray-800 px-2 py-1 rounded text-gray-300 table-cell-address cursor-pointer hover:bg-gray-700 transition-colors" 
              title="点击复制地址: ${tx.to}" 
              onclick="copyToClipboard('${tx.to}')">${formatAddress(tx.to)}</span>
      </td>
      <td class="px-4 py-2 text-right font-mono font-semibold">${formatValue(tx.value)}</td>
      <td class="px-4 py-2 text-center">
        <span class="bg-blue-900/30 text-blue-300 px-2 py-1 rounded text-xs font-medium">${tx.asset}</span>
      </td>
      <td class="px-4 py-2 text-right font-mono text-sm text-gray-400">${tx.gas_fee || "-"}</td>
      `;
      frag.appendChild(tr);
    });
    els.tbody.appendChild(frag);
  }

  // 处理缓存数据
  function handleCachedData(cachedData, addr) {
    allTransfers = cachedData.transfers;
    pageKey = cachedData.pageKey;
    currentFilter = "all";
    cacheTimestamp = cachedData.timestamp;
    
    // 显示结果容器
    els.result.classList.remove("hidden");
    
    // 设置默认筛选（跳过动画，因为是缓存数据）
    setFilter("all", true);
    
    // 更新缓存状态
    updateCacheStatus();
    
    // 显示成功状态
    showSuccessStatus();
    
    // 更新查询更多按钮状态
    updateLoadMoreButton();
    
    // 更新历史记录
    updateHistory(addr);
  }

  // 处理查询成功
  function handleQuerySuccess(result, addr) {
    allTransfers = result.transfers;
    pageKey = result.pageKey;
    currentFilter = "all";
    cacheTimestamp = Date.now();
    
    // 保存到缓存
    setCachedData(addr, {
      transfers: result.transfers,
      pageKey: result.pageKey,
      timestamp: cacheTimestamp
    });
    
    // 先渐隐查询中动画
    fadeOutQuerying();
    
    // 延迟显示结果，让查询中动画先消失
    setTimeout(() => {
      // 显示结果容器
      els.result.classList.remove("hidden");
      
      // 设置默认筛选（跳过动画，因为是初始加载）
      setFilter("all", true);
      
      // 更新缓存状态
      updateCacheStatus();
      
      // 显示刷新按钮
      if (els.refreshBtn) {
        els.refreshBtn.classList.remove("hidden");
      }
      
      // 显示成功状态
      showSuccessStatus();
      
      // 更新查询更多按钮状态
      updateLoadMoreButton();
    }, CONSTANTS.SCROLL_DELAY); // 等待查询中动画消失

    // 更新历史记录
    updateHistory(addr);
  }

  // 处理查询错误
  function handleQueryError(e) {
    // 先渐隐查询中动画
    fadeOutQuerying();
    
    // 延迟显示错误信息
    setTimeout(() => {
      const userFriendlyError = getUserFriendlyError(e);
      setStatus("fetchErrorPrefix", userFriendlyError);
    }, CONSTANTS.SCROLL_DELAY);
  }

  async function onSearch(forceRefresh = false) {
    const addr = (els.input.value || "").trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(addr)) { 
      setStatus("invalidAddress"); 
      return; 
    }

    currentAddress = addr;
    currentCount = CONSTANTS.INITIAL_COUNT; // 重置为初始10条
    pageKey = null; // 重置分页键
    
    // 检查缓存
    if (!forceRefresh) {
      const cachedData = getCachedData(addr);
      if (cachedData) {
        handleCachedData(cachedData, addr);
        return;
      }
    }

    setStatus("querying");
    els.count.textContent = "";
    els.download.classList.add("hidden");
    els.loadMoreBtn.classList.add("hidden");

    try {
      // 初始查询10条数据
      const result = await API().fetchTransfers(addr, currentCount, pageKey);
      if (!result.transfers.length) { 
        fadeOutQuerying();
        setTimeout(() => {
          setStatus("noRecords");
        }, CONSTANTS.SCROLL_DELAY);
        return; 
      }

      handleQuerySuccess(result, addr);
    } catch (e) {
      handleQueryError(e);
    }
  }

  function initEvents() {
    els.btn.addEventListener("click", onSearch);
    
    // 刷新按钮事件
    if (els.refreshBtn) {
      els.refreshBtn.addEventListener("click", () => onSearch(true));
    }
    
    els.input.addEventListener("keydown", (e) => { if (e.key === "Enter") onSearch(); });
    
    // 语言切换按钮事件
    els.langZh.addEventListener("click", () => {
      I18N().setLang("zh");
      updateLangButtons();
    });
    
    els.langEn.addEventListener("click", () => {
      I18N().setLang("en");
      updateLangButtons();
    });
    
    // 查询更多按钮事件
    els.loadMoreBtn.addEventListener("click", loadMoreData);
    
    // 筛选按钮事件
    els.filterAll.addEventListener("click", () => setFilter("all"));
    els.filterReceived.addEventListener("click", () => setFilter("received"));
    els.filterSent.addEventListener("click", () => setFilter("sent"));
    
    // 下载按钮事件
    els.download.addEventListener("click", async (e) => {
      e.preventDefault();
      if (filteredTransfers && currentAddress) {
        try {
          await API().downloadCSV(currentAddress, filteredTransfers);
        } catch (error) {
          console.error('Download failed:', error);
          setStatus("fetchErrorPrefix", "Download failed");
        }
      }
    });
  }

  function updateLangButtons() {
    const currentLang = I18N().getLang();
    els.langZh.classList.toggle("active", currentLang === "zh");
    els.langEn.classList.toggle("active", currentLang === "en");
  }

  function initVanta() {
    // 三方脚本加载异常时不影响主流程
    if (!(root.VANTA && root.VANTA.NET)) return;
    try {
      root.VANTA.NET({
        el: "#vanta-bg",
        mouseControls: true, touchControls: true, gyroControls: false,
        minHeight: 200, minWidth: 200, scale: 1, scaleMobile: 1,
        color: 0xc846c2, backgroundColor: 0x23153c, points: 12.0, maxDistance: 22.0, spacing: 18.0
      });
    } catch (e) {
      console.warn("VANTA init failed:", e);
    }
  }

  function init() {
    cacheDom();
    I18N().applyStatic();
    updateLangButtons(); // 设置初始按钮状态
    History().render("historyContainer", (a) => { els.input.value = a; onSearch(); });
    initEvents();
    initVanta();
    
    // 初始化标签按钮文本
    updateFilterButtonTexts();
    
    // 监听窗口大小变化，重新渲染表格
    window.addEventListener('resize', () => {
      if (allTransfers && currentAddress) {
        renderTable();
      }
    });
    
    // 初始化缓存状态显示
    updateCacheStatus();
  }

  function updateFilterButtonTexts() {
    if (els.filterAll) {
      els.filterAll.querySelector('.tab-text').textContent = I18N().DICT[I18N().getLang()].filterAll;
      els.filterReceived.querySelector('.tab-text').textContent = I18N().DICT[I18N().getLang()].filterReceived;
      els.filterSent.querySelector('.tab-text').textContent = I18N().DICT[I18N().getLang()].filterSent;
    }
    
    // 更新刷新按钮文本
    if (els.refreshText) {
      els.refreshText.textContent = I18N().DICT[I18N().getLang()].refreshBtn;
    }
  }

  function rerenderOnLang() {
    I18N().applyStatic();
    updateLangButtons(); // 更新语言按钮状态
    History().render("historyContainer", (a) => { els.input.value = a; onSearch(); });
    if (allTransfers && els.input.value) {
      // 重新筛选数据（跳过动画，因为是语言切换）
      filterTransfers();
      renderTable(filteredTransfers, els.input.value);
      updateCount();
      
      // 更新按钮状态
      els.filterAll.classList.toggle("active", currentFilter === "all");
      els.filterReceived.classList.toggle("active", currentFilter === "received");
      els.filterSent.classList.toggle("active", currentFilter === "sent");
      
      // 更新标签按钮文本
      updateFilterButtonTexts();
      
      // 更新缓存状态显示
      updateCacheStatus();
      
      // 更新按钮文本
      els.download.textContent = I18N().DICT[I18N().getLang()].download;
      if (!els.loadMoreBtn.disabled) {
        els.loadMoreBtn.textContent = I18N().DICT[I18N().getLang()].loadMoreBtn;
      }
      els.loadMoreStatusText.textContent = I18N().DICT[I18N().getLang()].loadingMore;
    }
  }

  root.Serchain = root.Serchain || {};
  root.Serchain.App = { init, rerenderOnLang };
  
  // 暴露复制功能到全局作用域
  root.copyToClipboard = copyToClipboard;
})(window);