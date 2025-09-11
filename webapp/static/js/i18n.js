(function (root) {
  'use strict';
  const DICT = {
    zh: {
      title: "Serchain 链上追踪器",
      addressPlaceholder: "请输入 Ethereum 地址（0x 开头）",
      queryBtn: "查询",
      querying: "查询中",
      invalidAddress: "请输入有效的 Ethereum 地址",
      noRecords: "未找到任何交易记录",
      success: (n) => `✅ 成功获取 ${n} 条交易记录`,
      countText: (n) => `共 ${n} 条交易记录`,
      download: "下载 CSV",
      errorPrefix: "❌ 错误：",
      fetchErrorPrefix: "❌ 请求失败：",
      historyLabel: "历史查询：",
      clearHistory: "清空历史",
      table: {
        index: "#", time: "时间", direction: "方向",
        from: "发出地址", to: "接收地址", value: "金额",
        asset: "资产", gasFee: "Gas 费 (ETH)"
      },
      direction: { in: "转入", out: "转出" },
      copySuccess: "✅ 地址已复制到剪贴板",
      copyError: "❌ 复制失败，请手动复制",
      pageInfo: "第 {current} 页，共 {total} 页",
      prevPage: "← 上一页",
      nextPage: "下一页 →",
      locale: "zh-CN"
    },
    en: {
      title: "Serchain On-chain Tracker",
      addressPlaceholder: "Enter Ethereum address (starts with 0x)",
      queryBtn: "Search",
      querying: "Querying",
      invalidAddress: "Please enter a valid Ethereum address",
      noRecords: "No transactions found",
      success: (n) => `✅ Successfully retrieved ${n} transfers`,
      countText: (n) => `${n} transfers found`,
      download: "Download CSV",
      errorPrefix: "❌ Error: ",
      fetchErrorPrefix: "❌ Request failed: ",
      historyLabel: "History:",
      clearHistory: "Clear History",
      table: {
        index: "#", time: "Time", direction: "Direction",
        from: "From", to: "To", value: "Value",
        asset: "Asset", gasFee: "Gas Fee (ETH)"
      },
      direction: { in: "Received", out: "Sent" },
      copySuccess: "✅ Address copied to clipboard",
      copyError: "❌ Copy failed, please copy manually",
      pageInfo: "Page {current} of {total}",
      prevPage: "← Previous",
      nextPage: "Next →",
      locale: "en-US"
    }
  };

  const KEY = "serchain_lang";
  let lang = null;

  function getLang() {
    if (lang) return lang;
    const saved = localStorage.getItem(KEY);
    if (saved) return (lang = saved);
    const nav = (navigator.language || "en").toLowerCase();
    return (lang = nav.startsWith("zh") ? "zh" : "en");
  }

  function setLang(next) {
    lang = next;
    localStorage.setItem(KEY, next);
    applyStatic();
    // 通知 App 以重渲染动态区域
    root.Serchain?.App?.rerenderOnLang?.();
  }

  function t(path) {
    const cur = DICT[getLang()] || DICT.en;
    return path.split(".").reduce((acc, k) => (acc && acc[k] != null ? acc[k] : null), cur);
  }

  function dirLabel(inOrOut) {
    return DICT[getLang()].direction[inOrOut];
  }

  function timeFormatter() {
    // 使用统一的日期时间格式 yyyy-mm-dd hh:mm:ss，确保中英文时间显示一致
    return {
      format: (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }
    };
  }

  function applyStatic() {
    const d = DICT[getLang()];
    document.documentElement.lang = d.locale;

    const byId = (id) => document.getElementById(id);
    document.title = d.title;
    byId("title") && (byId("title").textContent = d.title);
    byId("addressInput") && (byId("addressInput").placeholder = d.addressPlaceholder);
    byId("queryBtn") && (byId("queryBtn").textContent = d.queryBtn);
    byId("downloadLink") && (byId("downloadLink").textContent = d.download);

    // 表头
    const map = {
      "th-index": "table.index", "th-time": "table.time", "th-direction": "table.direction",
      "th-from": "table.from", "th-to": "table.to", "th-value": "table.value",
      "th-asset": "table.asset", "th-gas": "table.gasFee"
    };
    Object.entries(map).forEach(([id, key]) => {
      const el = byId(id);
      if (el) el.textContent = t(key);
    });

    // 历史标题与清空按钮（渲染时也会替换，这里兜底）
    byId("historyTitle") && (byId("historyTitle").textContent = d.historyLabel);
    byId("clearHistoryBtn") && (byId("clearHistoryBtn").textContent = d.clearHistory);
  }

  root.Serchain = root.Serchain || {};
  root.Serchain.I18N = { DICT, getLang, setLang, t, applyStatic, dirLabel, timeFormatter };
})(window);