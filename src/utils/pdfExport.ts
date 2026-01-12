import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

interface Sale {
  id: string;
  amount: number;
  client_name: string;
  month_year: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
    email: string;
  };
}

interface ExportOptions {
  title?: string;
  includeUser?: boolean;
  monthYear?: string;
}

export const exportSalesToPDF = (sales: Sale[], options: ExportOptions = {}) => {
  const { title = 'Sales Report', includeUser = false, monthYear } = options;

  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setTextColor(102, 51, 153); // Purple color
  doc.text(title, 14, 20);

  // Subtitle with date
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${format(new Date(), 'MMMM dd, yyyy HH:mm')}`, 14, 28);
  
  if (monthYear) {
    const [year, month] = monthYear.split('-');
    const monthName = format(new Date(parseInt(year), parseInt(month) - 1, 1), 'MMMM yyyy');
    doc.text(`Period: ${monthName}`, 14, 34);
  }

  // Summary stats
  const totalSales = sales.reduce((sum, sale) => sum + Number(sale.amount), 0);
  const avgSale = sales.length > 0 ? totalSales / sales.length : 0;

  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Total Sales: $${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 14, monthYear ? 44 : 38);
  doc.text(`Number of Sales: ${sales.length}`, 14, monthYear ? 52 : 46);
  doc.text(`Average Sale: $${avgSale.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 14, monthYear ? 60 : 54);

  // Table
  const headers = includeUser 
    ? ['Date', 'Sales Person', 'Client', 'Amount']
    : ['Date', 'Client', 'Amount'];

  const rows = sales.map((sale) => {
    const date = format(new Date(sale.created_at), 'MMM dd, yyyy');
    const amount = `$${Number(sale.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    const salesPerson = sale.profiles?.full_name || sale.profiles?.email || 'Unknown';

    return includeUser 
      ? [date, salesPerson, sale.client_name, amount]
      : [date, sale.client_name, amount];
  });

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: monthYear ? 70 : 60,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [102, 51, 153],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 240, 250],
    },
    columnStyles: includeUser
      ? {
          0: { cellWidth: 30 },
          1: { cellWidth: 45 },
          2: { cellWidth: 60 },
          3: { cellWidth: 35, halign: 'right' },
        }
      : {
          0: { cellWidth: 35 },
          1: { cellWidth: 90 },
          2: { cellWidth: 40, halign: 'right' },
        },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${pageCount} - CMS Sales Report`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  // Download
  const fileName = `sales-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
};

export const exportTeamReportToPDF = (
  teamMembers: Array<{
    id: string;
    full_name: string | null;
    email: string;
    total_sales: number;
    monthly_target: number;
    role: string;
  }>
) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setTextColor(102, 51, 153);
  doc.text('Team Performance Report', 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${format(new Date(), 'MMMM dd, yyyy HH:mm')}`, 14, 28);

  // Summary
  const totalTeamSales = teamMembers.reduce((sum, m) => sum + m.total_sales, 0);
  const totalTeamTarget = teamMembers.reduce((sum, m) => sum + m.monthly_target, 0);
  const teamProgress = totalTeamTarget > 0 ? (totalTeamSales / totalTeamTarget) * 100 : 0;

  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Team Total Sales: $${totalTeamSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 14, 40);
  doc.text(`Team Target: $${totalTeamTarget.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 14, 48);
  doc.text(`Overall Progress: ${teamProgress.toFixed(1)}%`, 14, 56);

  // Table
  const headers = ['Name', 'Role', 'Target', 'Sales', 'Progress'];
  const rows = teamMembers.map((member) => {
    const progress = member.monthly_target > 0 
      ? (member.total_sales / member.monthly_target) * 100 
      : 0;

    return [
      member.full_name || member.email.split('@')[0],
      member.role.charAt(0).toUpperCase() + member.role.slice(1),
      `$${member.monthly_target.toLocaleString()}`,
      `$${member.total_sales.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      `${progress.toFixed(1)}%`,
    ];
  });

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 66,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [102, 51, 153],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 240, 250],
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 30 },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' },
      4: { cellWidth: 30, halign: 'right' },
    },
  });

  const fileName = `team-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
};
