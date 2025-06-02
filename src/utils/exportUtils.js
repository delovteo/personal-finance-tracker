import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * Convert transactions to CSV format and trigger a download.
 */
export function exportToCSV(transactions) {
    if (!transactions.length) {
        alert("No transactions to export.");
        return;
    }

    const csvContent = [
        ["Name", "Amount", "Category", "Date", "Description"], // CSV Headers
        ...transactions.map((t) => [t.name, t.amount, t.category, t.date, t.description]),
    ]
        .map((row) => row.join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

/**
 * Convert transactions to JSON format and trigger a download.
 */
export function exportToJSON(transactions) {
    if (!transactions.length) {
        alert("No transactions to export.");
        return;
    }

    const jsonContent = JSON.stringify(transactions, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

/**
 * Convert transactions to PDF format and trigger a download.
 */
export function exportToPDF(transactions) {
    if (!transactions.length) {
        alert("No transactions to export.");
        return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Transaction Report", 14, 15);

    const tableColumn = ["Name", "Amount", "Category", "Date", "Description"];
    const tableRows = transactions.map((t) => [t.name, t.amount, t.category, t.date, t.description]);

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 25,
    });

    doc.save("transactions.pdf");
}
