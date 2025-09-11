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
      langToggle: document.getElementById("langToggle"),
      history: document.getElementById("historyContainer"),
    };
  }

  function setStatus(key, extra = "") {
    const d = I18N().DICT[I18N().getLang()];
    const v = d[key];
    els.status.textContent = typeof v === "function" ? v(extra) : (v ?? "") + (extra ?? "");
  }

  function formatValue(v) {
    // 避免科学计数法，保留最多 18 位小数，不加千分位
    const num = Number(v);
    if (!isFinite(num)) return String(v ?? "-");
    return num.toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: 18 });
  }

  function renderTable(transfers, address) {
    els.tbody.innerHTML = "";
    const fmt = I18N().timeFormatter();
    const me = address.toLowerCase();

    const frag = document.createDocumentFragment();
    transfers.slice().reverse().forEach((tx, i) => {
      const dirKey = (tx.to || "").toLowerCase() === me ? "in" : "out";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="px-4 py-2 text-center">${i + 1}</td>
        <td class="px-4 py-2 text-center hash-mono">${fmt.format(new Date(tx.time))}</td>
        <td class="px-4 py-2 text-center ${dirKey === "in" ? "direction-in" : "direction-out"}">${I18N().dirLabel(dirKey)}</td>
        <td class="px-4 py-2 whitespace-nowrap hash-mono">${tx.from}</td>
        <td class="px-4 py-2 whitespace-nowrap hash-mono">${tx.to}</td>
        <td class="px-4 py-2 text-right">${formatValue(tx.value)}</td>
        <td class="px-4 py-2 text-center">${tx.asset}</td>
        <td class="px-4 py-2 text-right">${tx.gas_fee || "-"}</td>
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
      els.status.textContent = "";

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
    els.langToggle.addEventListener("click", () => {
      const next = I18N().getLang() === "zh" ? "en" : "zh";
      I18N().setLang(next);
      // 历史区在切换语言后也要刷新
      History().render("historyContainer", (a) => { els.input.value = a; onSearch(); });
    });
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
    History().render("historyContainer", (a) => { els.input.value = a; onSearch(); });
    initEvents();
    initVanta();
  }

  function rerenderOnLang() {
    I18N().applyStatic();
    History().render("historyContainer", (a) => { els.input.value = a; onSearch(); });
    if (lastTransfers && els.input.value) {
      renderTable(lastTransfers, els.input.value);
      els.count.textContent = I18N().DICT[I18N().getLang()].countText(lastTransfers.length);
      els.download.textContent = I18N().DICT[I18N().getLang()].download;
    }
  }

  root.Serchain = root.Serchain || {};
  root.Serchain.App = { init, rerenderOnLang };
})(window);