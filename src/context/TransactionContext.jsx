import { createContext, useState, useEffect } from "react";
import { getExchangeRates, convertAmount } from "../utils/currencyConverter";

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
    const [transactions, setTransactions] = useState(() => {
        const savedTransactions = localStorage.getItem("transactions");
        return savedTransactions ? JSON.parse(savedTransactions) : [];
    });

    const [defaultCurrency, setDefaultCurrency] = useState(localStorage.getItem("defaultCurrency") || "USD");
    const [exchangeRates, setExchangeRates] = useState(null);

    // Fetch exchange rates
    useEffect(() => {
        async function fetchRates() {
            const rates = await getExchangeRates("USD");
            setExchangeRates(rates);
        }
        fetchRates();
    }, [defaultCurrency]);

    const [isMuted, setIsMuted] = useState(() => {
        const saved = localStorage.getItem("isMuted");
        return saved ? JSON.parse(saved) : false;
    });

    const toggleMute = () => {
        const newState = !isMuted;
        setIsMuted(newState);
        localStorage.setItem("isMuted", JSON.stringify(newState));
    };

    
    const addTransaction = (transaction) => {
        const enriched = {
            ...transaction,
            convertedAmount:
                defaultCurrency === "USD" || !exchangeRates
                    ? transaction.amount
                    : parseFloat(
                        convertAmount(transaction.amount, "USD", defaultCurrency, exchangeRates)
                    ),
        };

        const updated = [...transactions, enriched];
        setTransactions(updated);
        localStorage.setItem("transactions", JSON.stringify(updated));
    };



    const addMultipleTransactions = (newTransactions) => {
        const enriched = newTransactions.map((tx) => ({
            ...tx,
            convertedAmount:
                defaultCurrency === "USD" || !exchangeRates
                    ? tx.amount
                    : parseFloat(
                        convertAmount(tx.amount, "USD", defaultCurrency, exchangeRates)
                    ),
        }));

        const updated = [...transactions, ...enriched];
        setTransactions(updated);
        localStorage.setItem("transactions", JSON.stringify(updated));
    };

    const updateCurrency = async (newCurrency) => {
        setDefaultCurrency(newCurrency);
        localStorage.setItem("defaultCurrency", newCurrency);

        const newRates = await getExchangeRates("USD");
        if (!newRates) return;

        setExchangeRates(newRates);

        const updatedTransactions = transactions.map((t) => ({
            ...t,
            convertedAmount: parseFloat(
                convertAmount(parseFloat(t.amount), "USD", newCurrency, newRates)
            ),
        }));

        setTransactions(updatedTransactions);
        localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    };

    

    

    return (
        <TransactionContext.Provider
            value={{
                transactions,
                setTransactions,
                addTransaction,
                addMultipleTransactions, 
                updateCurrency,
                defaultCurrency,
                isMuted,
                toggleMute
            }}
        >
            {children}
        </TransactionContext.Provider>
    );
};

