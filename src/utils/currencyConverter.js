const API_KEY = "a08ee4e15b4268a9ce3350ca";  
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

export async function getExchangeRates(baseCurrency = "USD") {
    console.log("Using Hardcoded API Key:", API_KEY);  
    console.log("Fetching from:", `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`);

    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data); 

        if (data.result === "error") {
            console.error("Error fetching exchange rates:", data["error-type"]);
            return null;
        }
        return data.conversion_rates;
    } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
        return null;
    }
}

export function convertAmount(amount, fromCurrency, toCurrency, rates) {
    if (!rates || !rates[toCurrency] || !rates[fromCurrency]) {
        console.error("Invalid exchange rates or currency codes");
        return null;
    }
    return (amount * (rates[toCurrency] / rates[fromCurrency])).toFixed(2);
}
