// i18n.js
export const translations = {
  zh: {
    title: "Serchain 链上追踪器",
    addressPlaceholder: "请输入 Ethereum 地址（0x 开头）",
    queryBtn: "查询",
    querying: "⏳ 查询中...",
    invalidAddress: "❌ 请输入有效的 Ethereum 地址。",
    noRecords: "😶 未找到任何交易记录。",
    countText: (n) => `共 ${n} 条交易记录`,
    download: "下载 CSV",
    errorPrefix: "❌ 错误：",
    fetchErrorPrefix: "❌ 请求失败：",
    historyLabel: "历史查询：",
    clearHistory: "清空历史",
    tableHeaders: {
      index: "#",
      time: "时间",
      direction: "方向",
      from: "发出地址",
      to: "接收地址",
      value: "金额",
      asset: "资产",
      gasFee: "Gas 费 (ETH)"
    },
    direction: {
      in: "转入",
      out: "转出"
    },
    toggleLabel: "🇨🇳 简体中文 / 🇬🇧 English",
  },
  en: {
    title: "Serchain On-chain Tracker",
    addressPlaceholder: "Enter Ethereum address (starts with 0x)",
    queryBtn: "Search",
    querying: "⏳ Querying...",
    invalidAddress: "❌ Please enter a valid Ethereum address.",
    noRecords: "😶 No transactions found.",
    countText: (n) => `${n} transfers found`,
    download: "Download CSV",
    errorPrefix: "❌ Error: ",
    fetchErrorPrefix: "❌ Request failed: ",
    historyLabel: "History:",
    clearHistory: "Clear History",
    tableHeaders: {
      index: "#",
      time: "Time",
      direction: "Direction",
      from: "From",
      to: "To",
      value: "Value",
      asset: "Asset",
      gasFee: "Gas Fee (ETH)"
    },
    direction: {
      in: "Received",
      out: "Sent"
    },
    toggleLabel: "🇨🇳 Chinese / 🇬🇧 English",
  }
};

export let currentLang = "zh";

export function setLanguage(lang) {
  currentLang = lang;
  const t = translations[lang];

  document.title = t.title;
  document.getElementById("title").textContent = t.title;
  document.getElementById("addressInput").placeholder = t.addressPlaceholder;
  document.getElementById("queryBtn").textContent = t.queryBtn;
  document.getElementById("downloadLink").textContent = t.download;
  document.getElementById("langToggle").textContent = t.toggleLabel;

  document.querySelector("th[data-key='index']").textContent = t.tableHeaders.index;
  document.querySelector("th[data-key='time']").textContent = t.tableHeaders.time;
  document.querySelector("th[data-key='direction']").textContent = t.tableHeaders.direction;
  document.querySelector("th[data-key='from']").textContent = t.tableHeaders.from;
  document.querySelector("th[data-key='to']").textContent = t.tableHeaders.to;
  document.querySelector("th[data-key='value']").textContent = t.tableHeaders.value;
  document.querySelector("th[data-key='asset']").textContent = t.tableHeaders.asset;
  document.querySelector("th[data-key='gasFee']").textContent = t.tableHeaders.gasFee;

  if (window.lastTransfers) {
    window.renderTable(window.lastTransfers);  // 注意 renderTable 在全局挂载
  }
}

export function setStatus(key, extra = "") {
  const msg = translations[currentLang][key];
  const statusText = document.getElementById("status");
  statusText.textContent = typeof msg === "function" ? msg(extra) : msg + extra;
}