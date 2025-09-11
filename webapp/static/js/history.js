(function (root) {
  'use strict';
  const KEY = "serchain_history";

  const get = () => JSON.parse(localStorage.getItem(KEY) || "[]");
  const set = (arr) => localStorage.setItem(KEY, JSON.stringify(arr));
  const add = (addr) => {
    const list = get();
    if (!list.includes(addr)) {
      list.unshift(addr);
      if (list.length > 5) list.pop();
      set(list);
    }
  };
  const remove = (addr) => set(get().filter(x => x !== addr));
  const clear = () => localStorage.removeItem(KEY);

  function render(containerId, onSelect) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const i18n = root.Serchain.I18N;
    const d = i18n.DICT[i18n.getLang()];

    el.className = "flex flex-wrap justify-center gap-2 items-center";
    el.innerHTML = "";

    const list = get();
    if (!list.length) return;

    const label = document.createElement("div");
    label.id = "historyLabel";
    label.innerHTML = `🕒 ${d.historyLabel}`;
    label.className = "text-sm text-gray-300 font-medium flex items-center";
    el.appendChild(label);

    list.forEach((addr) => {
      const wrap = document.createElement("span");
      wrap.className = "history-item cursor-pointer";
      wrap.title = addr;
      wrap.innerHTML = `
        ${addr.slice(0, 6)}...${addr.slice(-4)}
        <span class="history-close" title="Delete" style="font-size: 1.5rem;">×</span>
      `;
      wrap.querySelector(".history-close").onclick = () => {
        remove(addr);
        render(containerId, onSelect);
      };
      wrap.onclick = (e) => {
        if (!e.target.classList.contains("history-close")) {
          onSelect?.(addr);
        }
      };
      el.appendChild(wrap);
    });

    const clearBtn = document.createElement("button");
    clearBtn.id = "clearHistoryBtn";
    clearBtn.textContent = d.clearHistory;
    clearBtn.className = "text-sm text-gray-300 hover:text-white hover:bg-red-500/20 cursor-pointer ml-3 px-3 py-1 rounded-md border border-red-400/30 hover:border-red-400/60 transition-all duration-200 backdrop-blur-sm bg-red-500/10 hover:bg-red-500/20 font-medium";
    clearBtn.onclick = () => { clear(); render(containerId, onSelect); };
    el.appendChild(clearBtn);
  }

  root.Serchain = root.Serchain || {};
  root.Serchain.History = { get, set, add, remove, clear, render };
})(window);