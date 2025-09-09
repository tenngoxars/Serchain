(function (root) {
  'use strict';

  async function fetchTransfers(address) {
    const res = await fetch("/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.transfers || [];
  }

  const csvUrl = (address) => `/download/${address}`;

  root.Serchain = root.Serchain || {};
  root.Serchain.API = { fetchTransfers, csvUrl };
})(window);