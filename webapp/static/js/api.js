(function (root) {
  'use strict';

  async function fetchTransfers(address, maxCount = 50, pageKey = null) {
    const res = await fetch("/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, maxCount, pageKey })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return {
      transfers: data.transfers || [],
      pagination: data.pagination || {},
      pageKey: data.pageKey || null
    };
  }

  const csvUrl = (address) => `/download/${address}`;

  root.Serchain = root.Serchain || {};
  root.Serchain.API = { fetchTransfers, csvUrl };
})(window);