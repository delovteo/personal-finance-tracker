import { useState, useContext, useRef } from "react";
import { TransactionContext } from "../context/TransactionContext";
import {
  FaUtensils, FaHome, FaCar, FaShoppingBag, FaQuestionCircle, FaPlusCircle
} from "react-icons/fa";

export default function TransactionForm() {
  const { addTransaction, isMuted } = useContext(TransactionContext);
  const successAudioRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    amount: "",
    category: "Food",
    description: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.date || !formData.amount) {
      alert("Please fill in all required fields.");
      return;
    }

    addTransaction({ ...formData, amount: parseFloat(formData.amount) });

    if (!isMuted && successAudioRef.current) {
      successAudioRef.current.currentTime = 0;
      successAudioRef.current.play();
    }

    setFormData({
      name: "",
      date: "",
      amount: "",
      category: "Food",
      description: ""
    });
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form" aria-labelledby="form-title">
      <audio ref={successAudioRef} src="/sounds/success.mp3" preload="auto" />

      <fieldset>
        <legend id="form-title" className="form-title">
          <FaShoppingBag className="form-title-icon" />
          Add New Transaction
        </legend>

        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Transaction Name"
          value={formData.name}
          onChange={handleChange}
          className="form-input"
          required
          autoFocus
        />

        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="form-input"
          required
        />

        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          name="amount"
          placeholder="Amount ($)"
          min="0.00"
          step="0.01"
          value={formData.amount}
          onChange={handleChange}
          className="form-input"
          required
        />

        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="form-input"
        >
          <option value="Food">Food</option>
          <option value="Rent">Rent</option>
          <option value="Transport">Transport</option>
          <option value="Shopping">Shopping</option>
          <option value="Other">Other</option>
        </select>

        <label htmlFor="description">Description (optional)</label>
        <textarea
          id="description"
          name="description"
          placeholder="Description (optional)"
          value={formData.description}
          onChange={handleChange}
          className="form-input"
        />

        <button type="submit" className="submit-btn">
          <FaPlusCircle className="submit-icon pulse-animation" /> Add Transaction
        </button>
      </fieldset>
    </form>
  );
}
