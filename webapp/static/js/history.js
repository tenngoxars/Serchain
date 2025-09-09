(function (root) {
  'use strict';
  const KEY = "serchain_history";

  const get = () => JSON.parse(localStorage.getItem(KEY) || "[]");
  const set = (arr) => localStorage.setItem(KEY, JSON.stringify(arr));
  const add = (addr) => {
    const list = get();
    if (!list.includes(addr)) {
      list.unshift(addr);
      if (list.length > 10) list.pop();
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
    label.textContent = d.historyLabel;
    label.className = "text-sm text-gray-300 flex items-center";
    el.appendChild(label);

    list.forEach((addr) => {
      const wrap = document.createElement("div");
      wrap.className = "flex items-center";

      const btn = document.createElement("button");
      btn.textContent = addr.slice(0, 6) + "..." + addr.slice(-4);
      btn.title = addr;
      btn.className = "px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 border border-zinc-600";
      btn.onclick = () => onSelect?.(addr);

      const del = document.createElement("button");
      del.innerHTML = '<span aria-label="Delete" role="img">❌</span>';
      del.className = "ml-1 text-gray-400 hover:text-red-500 cursor-pointer";
      del.title = "Delete";
      del.onclick = () => { remove(addr); render(containerId, onSelect); };

      wrap.appendChild(btn);
      wrap.appendChild(del);
      el.appendChild(wrap);
    });

    const clearBtn = document.createElement("button");
    clearBtn.id = "clearHistoryBtn";
    clearBtn.textContent = d.clearHistory;
    clearBtn.className = "text-sm text-gray-400 hover:text-red-500 cursor-pointer ml-4";
    clearBtn.onclick = () => { clear(); render(containerId, onSelect); };
    el.appendChild(clearBtn);
  }

  root.Serchain = root.Serchain || {};
  root.Serchain.History = { get, set, add, remove, clear, render };
})(window);