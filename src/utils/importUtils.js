

/**
 * Parse and import transactions from a JSON file.
 * @param {Function} addTransaction - Function to add a transaction to context.
 */
export function importFromJSON(addMultipleTransactions) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";

  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);

        if (!Array.isArray(parsed)) {
          alert("Invalid JSON format: expected an array of transactions.");
          return;
        }

        const validTransactions = parsed.filter(
          (tx) => tx.name && tx.amount && tx.date && tx.category !== undefined
        );

        if (!validTransactions.length) {
          alert("No valid transactions found.");
          return;
        }

        addMultipleTransactions(validTransactions);
        alert(`Imported ${validTransactions.length} transaction(s) successfully.`);
      } catch (error) {
        console.error("Import error:", error);
        alert("Failed to import transactions. Invalid JSON file.");
      }
    };

    reader.readAsText(file);
  };

  input.click();
}
