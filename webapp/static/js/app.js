(function (root) {
  'use strict';
  const I18N = () => root.Serchain.I18N;
  const API  = () => root.Serchain.API;
  const History = () => root.Serchain.History;

  let els = {};
  let lastTransfers = null;

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
    } else if (key === "invalidAddress" || key === "fetchErrorPrefix") {
      els.status.innerHTML = `<div class="status-indicator status-error">${statusText}</div>`;
    } else if (key === "noRecords") {
      els.status.innerHTML = `<div class="status-indicator status-warning">${statusText}</div>`;
    } else {
      els.status.innerHTML = statusText;
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

  function renderTable(transfers, address) {
    els.tbody.innerHTML = "";
    const fmt = I18N().timeFormatter();
    const me = address.toLowerCase();

    const frag = document.createDocumentFragment();
    transfers.slice().reverse().forEach((tx, i) => {
      const dirKey = (tx.to || "").toLowerCase() === me ? "in" : "out";
      const tr = document.createElement("tr");
      tr.className = "table-row";
      tr.style.animationDelay = `${i * 0.1}s`;
      
      // 添加方向图标
      const directionIcon = dirKey === "in" ? "📥" : "📤";
      const directionClass = dirKey === "in" ? "direction-in" : "direction-out";
      
      tr.innerHTML = `
        <td class="px-4 py-2 text-center font-mono text-sm text-gray-400">${i + 1}</td>
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

    setStatus("querying");
    els.count.textContent = "";
    els.download.classList.add("hidden");

    try {
      const transfers = await API().fetchTransfers(addr);
      if (!transfers.length) { setStatus("noRecords"); return; }

      lastTransfers = transfers;
      els.result.classList.remove("hidden");
      els.count.textContent = I18N().DICT[I18N().getLang()].countText(transfers.length);
      
      // 显示成功状态
      setStatus("success", transfers.length);
      setTimeout(() => {
        els.status.innerHTML = "";
      }, 2000);

      renderTable(transfers, addr);

      els.download.href = API().csvUrl(addr);
      els.download.textContent = I18N().DICT[I18N().getLang()].download;
      els.download.classList.remove("hidden");

      History().add(addr);
      History().render("historyContainer", (a) => { els.input.value = a; onSearch(); });
    } catch (e) {
      setStatus("fetchErrorPrefix", e.message || String(e));
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
    if (lastTransfers && els.input.value) {
      renderTable(lastTransfers, els.input.value);
      els.count.textContent = I18N().DICT[I18N().getLang()].countText(lastTransfers.length);
      els.download.textContent = I18N().DICT[I18N().getLang()].download;
    }
  }

  root.Serchain = root.Serchain || {};
  root.Serchain.App = { init, rerenderOnLang };
  
  // 暴露复制功能到全局作用域
  root.copyToClipboard = copyToClipboard;
})(window);