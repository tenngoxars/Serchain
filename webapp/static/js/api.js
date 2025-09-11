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

  async function downloadCSV(address, transfers) {
    const res = await fetch("/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, transfers })
    });
    
    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transfers_${address.slice(0, 6)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      throw new Error('Download failed');
    }
  }

  root.Serchain = root.Serchain || {};
  root.Serchain.API = { fetchTransfers, downloadCSV };
})(window);