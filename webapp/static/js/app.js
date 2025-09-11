(function (root) {
  'use strict';
  const I18N = () => root.Serchain.I18N;
  const API  = () => root.Serchain.API;
  const History = () => root.Serchain.History;

  let els = {};
  let allTransfers = null; // 存储所有数据
  let currentAddress = "";
  let currentCount = 10; // 当前查询的数据量
  let pageKey = null; // Alchemy 分页的 pageKey
  const incrementCount = 10; // 每次增加的条数

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
      loadMoreStatusText: document.getElementById("loadMoreStatusText")
    };
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
      // 记录当前高度和margin，用于平滑过渡
      els.status.style.height = els.status.offsetHeight + "px";
      els.status.style.marginTop = "0.5rem"; // 记录mt-2的值
    } else if (key === "invalidAddress" || key === "fetchErrorPrefix") {
      els.status.innerHTML = `<div class="status-indicator status-error">${statusText}</div>`;
    } else if (key === "noRecords") {
      els.status.innerHTML = `<div class="status-indicator status-warning">${statusText}</div>`;
    } else {
      els.status.innerHTML = statusText;
    }
  }

  // 状态提示渐隐函数
  function fadeOutStatus(delay = 2000) {
    setTimeout(() => {
      els.status.style.transition = "opacity 0.5s ease-out, height 0.5s ease-out, margin 0.5s ease-out";
      els.status.style.opacity = "0";
      els.status.style.height = "0px"; // 高度过渡到0
      els.status.style.marginTop = "0px"; // margin也过渡到0
      setTimeout(() => {
        els.status.innerHTML = "";
        els.status.style.opacity = "1";
        els.status.style.transition = "";
        els.status.style.height = ""; // 重置高度
        els.status.style.marginTop = ""; // 重置margin
      }, 500);
    }, delay);
  }

  // 查询中动画渐隐函数
  function fadeOutQuerying() {
    els.status.style.transition = "opacity 0.3s ease-out";
    els.status.style.opacity = "0";
    setTimeout(() => {
      els.status.innerHTML = "";
      els.status.style.opacity = "1";
      els.status.style.transition = "";
    }, 300);
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

  // 显示复制成功提示
  function showCopySuccess() {
    const d = I18N().DICT[I18N().getLang()];
    const message = d.copySuccess || "✅ 地址已复制到剪贴板";
    
    // 创建临时提示元素
    const toast = document.createElement('div');
    toast.className = 'fixed bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300';
    toast.style.top = '16px';
    toast.style.left = '16px';
    toast.style.position = 'fixed';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // 2秒后移除提示
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 2000);
  }

  // 显示复制失败提示
  function showCopyError() {
    const d = I18N().DICT[I18N().getLang()];
    const message = d.copyError || "❌ 复制失败，请手动复制";
    
    const toast = document.createElement('div');
    toast.className = 'fixed bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300';
    toast.style.top = '16px';
    toast.style.left = '16px';
    toast.style.position = 'fixed';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 2000);
  }

  // 查询更多数据
  async function loadMoreData() {
    if (!currentAddress) return;
    
    // 如果没有 pageKey，说明已经查完所有数据
    if (!pageKey) {
      setStatus("noMoreData");
      els.loadMoreBtn.disabled = true;
      els.loadMoreBtn.textContent = I18N().DICT[I18N().getLang()].noMoreData;
      fadeOutStatus(3000);
      return;
    }
    
    // 显示表格下方的加载状态
    els.loadMoreBtn.disabled = true;
    els.loadMoreStatus.classList.remove("hidden");
    els.loadMoreStatusText.textContent = I18N().DICT[I18N().getLang()].loadingMore;
    
    try {
      // 使用 pageKey 查询下一页数据
      const result = await API().fetchTransfers(currentAddress, incrementCount, pageKey);
      if (!result.transfers.length) { 
        setStatus("noMoreData");
        els.loadMoreBtn.disabled = true;
        els.loadMoreBtn.textContent = I18N().DICT[I18N().getLang()].noMoreData;
        els.loadMoreStatus.classList.add("hidden");
        fadeOutStatus(3000);
        return; 
      }

      // 合并新数据到现有数据
      allTransfers = [...allTransfers, ...result.transfers];
      pageKey = result.pageKey; // 更新 pageKey
      currentCount = allTransfers.length;
      
      els.count.textContent = I18N().DICT[I18N().getLang()].countText(allTransfers.length);
      
      // 渲染所有数据
      renderTable(allTransfers, currentAddress);

      // 隐藏加载状态
      els.loadMoreStatus.classList.add("hidden");
      
      // 自动滚动到查询更多按钮
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
      }, 300);

      // 如果没有下一页的 pageKey，禁用按钮
      if (!pageKey) {
        els.loadMoreBtn.disabled = true;
        els.loadMoreBtn.textContent = I18N().DICT[I18N().getLang()].noMoreData;
      } else {
        // 重新启用按钮
        els.loadMoreBtn.disabled = false;
        els.loadMoreBtn.textContent = I18N().DICT[I18N().getLang()].loadMoreBtn;
      }

    } catch (e) {
      setStatus("fetchErrorPrefix", e.message || String(e));
      els.loadMoreStatus.classList.add("hidden");
      els.loadMoreBtn.disabled = false;
    }
  }

  function renderTable(transfers, address) {
    els.tbody.innerHTML = "";
    const fmt = I18N().timeFormatter();
    const me = address.toLowerCase();

    const frag = document.createDocumentFragment();
    transfers.slice().reverse().forEach((tx, i) => {
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
              onclick="copyToClipboard('${tx.from}')">${tx.from}</span>
      </td>
      <td class="px-4 py-2 whitespace-nowrap hash-mono text-xs">
        <span class="bg-gray-800 px-2 py-1 rounded text-gray-300 table-cell-address cursor-pointer hover:bg-gray-700 transition-colors" 
              title="点击复制地址: ${tx.to}" 
              onclick="copyToClipboard('${tx.to}')">${tx.to}</span>
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

  async function onSearch() {
    const addr = (els.input.value || "").trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(addr)) { setStatus("invalidAddress"); return; }

    currentAddress = addr;
    currentCount = 10; // 重置为初始10条
    pageKey = null; // 重置分页键
    
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
        }, 300);
        return; 
      }

      allTransfers = result.transfers;
      pageKey = result.pageKey; // 保存下一页的 pageKey
      
      // 先渐隐查询中动画
      fadeOutQuerying();
      
      // 延迟显示结果，让查询中动画先消失
      setTimeout(() => {
        // 显示结果容器
        els.result.classList.remove("hidden");
        els.count.textContent = I18N().DICT[I18N().getLang()].countText(allTransfers.length);
        
        // 渲染所有数据
        renderTable(allTransfers, addr);

        els.download.textContent = I18N().DICT[I18N().getLang()].download;
        els.download.classList.remove("hidden");
        els.loadMoreBtn.classList.remove("hidden");
        
        // 显示成功状态
        setStatus("success", allTransfers.length);
        fadeOutStatus(2000);
        
        // 重置查询更多按钮状态
        if (pageKey) {
          els.loadMoreBtn.disabled = false;
          els.loadMoreBtn.textContent = I18N().DICT[I18N().getLang()].loadMoreBtn;
        } else {
          // 如果没有 pageKey，说明数据不足10条或已查完
          els.loadMoreBtn.disabled = true;
          els.loadMoreBtn.textContent = I18N().DICT[I18N().getLang()].noMoreData;
        }
      }, 300); // 等待查询中动画消失

      History().add(addr);
      History().render("historyContainer", (a) => { els.input.value = a; onSearch(); });
    } catch (e) {
      // 先渐隐查询中动画
      fadeOutQuerying();
      
      // 延迟显示错误信息
      setTimeout(() => {
        setStatus("fetchErrorPrefix", e.message || String(e));
      }, 300);
    }
  }

  function initEvents() {
    els.btn.addEventListener("click", onSearch);
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
    
    // 下载按钮事件
    els.download.addEventListener("click", async (e) => {
      e.preventDefault();
      if (allTransfers && currentAddress) {
        try {
          await API().downloadCSV(currentAddress, allTransfers);
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
  }

  function rerenderOnLang() {
    I18N().applyStatic();
    updateLangButtons(); // 更新语言按钮状态
    History().render("historyContainer", (a) => { els.input.value = a; onSearch(); });
    if (allTransfers && els.input.value) {
      renderTable(allTransfers, els.input.value);
      els.download.textContent = I18N().DICT[I18N().getLang()].download;
      // 只有在按钮未禁用时才更新文本
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