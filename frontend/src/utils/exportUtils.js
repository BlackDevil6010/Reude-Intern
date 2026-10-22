import React from 'react';

// Common CSV Exporter with Audit Log tracking
export function exportToCSV(filename, rows, auditAction = null, actor = 'User') {
  if (!rows || !rows.length) {
    alert('No data available to export.');
    return;
  }
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      headers.map(field => {
        let val = row[field] === null || row[field] === undefined ? '' : String(row[field]);
        val = val.replace(/"/g, '""');
        if (val.search(/("|,|\n)/g) >= 0) val = `"${val}"`;
        return val;
      }).join(',')
    )
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Print / PDF format helper using browser native print view
export function printToPDF(title, contentHtml) {
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    alert('Please allow popups to generate PDF/Print preview.');
    return;
  }
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; }
          h1 { color: #f97316; font-size: 24px; margin-bottom: 8px; }
          p.sub { color: #64748b; font-size: 13px; margin-bottom: 24px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
          th { background: #f8fafc; text-align: left; padding: 10px; border-bottom: 2px solid #e2e8f0; font-weight: bold; }
          td { padding: 10px; border-bottom: 1px solid #f1f5f9; }
          tr:nth-child(even) { background: #fafafa; }
          .footer { margin-top: 40px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 16px; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p class="sub">Generated on ${new Date().toLocaleString()} · REUDE Enterprise Intelligence</p>
        ${contentHtml}
        <div class="footer">Confidential · REUDE Technologies Internal System</div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 400);
}
