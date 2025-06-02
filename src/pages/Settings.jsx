import { useContext, useState, useRef, useEffect } from "react";
import { TransactionContext } from "../context/TransactionContext";
import "./../App.css";

export default function Settings() {
  const { setTransactions, toggleMute, isMuted, updateCurrency, defaultCurrency } =
    useContext(TransactionContext);

    const [isLightMode, setIsLightMode] = useState(() => {
  return localStorage.getItem("theme") === "light";
});

    useEffect(() => {
        if (isLightMode) {
            document.body.classList.add("light-mode");
    }   else {
            document.body.classList.remove("light-mode");
    }
    }, [isLightMode]);

    const toggleTheme = () => {
        const newMode = !isLightMode;
        setIsLightMode(newMode);
        localStorage.setItem("theme", newMode ? "light" : "dark");
    };

  const destroyAudioRef = useRef(null); // NEW audio ref

  const clearTransactions = () => {
    setTransactions([]);
    localStorage.removeItem("transactions");

    // Play destroy sound
    if (!isMuted && destroyAudioRef.current) {
      destroyAudioRef.current.currentTime = 0;
      destroyAudioRef.current.play();
    }
  };

  const handleCurrencyChange = (e) => {
    updateCurrency(e.target.value);
  };

  return (
    <main className="settings-container">
      {/* Hidden audio element */}
      <audio ref={destroyAudioRef} src="/sounds/destroy.mp3" preload="auto" />

      <header>
        <h1 className="page-title blue">
          <span className="icon-square blue"></span>
          Settings
        </h1>
      </header>

      <section>
        <form className="settings-form">
          <fieldset>
            <legend>Display Settings</legend>
            <label className="form-label">
              <input
                type="checkbox"
                checked={isLightMode}
                onChange={toggleTheme}
              />
              <span className="ml-2">Enable Light Mode</span>
            </label>
          </fieldset>

          <fieldset className="mt-4">
            <legend>Sound Settings</legend>
            <label className="form-label">
              <input
                type="checkbox"
                checked={isMuted}
                onChange={toggleMute}
              />
              <span className="ml-2">Mute Sound Effects</span>
            </label>
          </fieldset>

          <fieldset className="mt-4">
            <legend>Currency Preference</legend>
            <label className="form-label">
              <span>Preferred Currency:</span>
              <select
                value={defaultCurrency}
                onChange={handleCurrencyChange}
                className="form-input"
                style={{ marginLeft: "0.5rem" }}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="CZK">CZK</option>
              </select>
            </label>
          </fieldset>

          <button type="button" onClick={clearTransactions} className="clear-btn mt-4">
            Clear All Transactions
          </button>
        </form>
      </section>
    </main>
  );
}
