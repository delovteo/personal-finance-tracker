import { useContext, useRef } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { FaTrash } from "react-icons/fa";
import TransactionForm from "../components/TransactionForm";
import "./../App.css";

export default function Transactions() {
  const { transactions, setTransactions, defaultCurrency, isMuted } = useContext(TransactionContext);
  const deleteAudioRef = useRef(null); // NEW audio ref

  const handleDelete = (index) => {
    const updated = transactions.filter((_, i) => i !== index);
    setTransactions(updated);
    localStorage.setItem("transactions", JSON.stringify(updated));

    // Play delete sound
    if (!isMuted && deleteAudioRef.current) {
      deleteAudioRef.current.currentTime = 0;
      deleteAudioRef.current.play();
    }
  };

  return (
    <main className="transactions-container">
      {/* Hidden audio for delete */}
      <audio ref={deleteAudioRef} src="/sounds/delete.mp3" preload="auto" />

      <header>
        <h1 className="transaction-title">
          <span className="title-icon"></span>
          Transaction History
        </h1>
      </header>

      <section className="form-wrapper" aria-label="Add New Transaction">
        <TransactionForm />
      </section>

      <section aria-label="Transaction List">
        <ul className="transaction-list">
          {transactions.length > 0 ? (
            transactions.map((t, index) => (
              <li key={index}>
                <article className="transaction-card">
                  <div className="transaction-info">
                    <p className="transaction-name">{t.name}</p>
                    <p className="transaction-meta">{t.date} • {t.category}</p>
                    {t.description && (
                      <p className="transaction-desc">{t.description}</p>
                    )}
                  </div>
                  <div className="transaction-amount">
                    <p className="amount">
                      {t.convertedAmount || t.amount} {defaultCurrency}
                    </p>
                    <button
                      onClick={() => handleDelete(index)}
                      className="delete-btn"
                      aria-label="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </article>
              </li>
            ))
          ) : (
            <li className="no-transactions">No transactions yet...</li>
          )}
        </ul>
      </section>
    </main>
  );
}
