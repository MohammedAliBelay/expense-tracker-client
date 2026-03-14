import { useState, useEffect } from "react";
import API from "../../Api/axious";
import "./EditModal.css";
import { toast } from "react-toastify";

export default function EditModal({ expense, onClose, onUpdate }) {
  const [form, setForm] = useState(() => ({
    date: expense?.date ? String(expense.date).split("T")[0] : "",
    amount: expense?.amount ?? "",
    payer: expense?.payer ?? "",
    source_of_money: expense?.source_of_money ?? "",
    phone: expense?.phone ?? "",
    reason: expense?.reason ?? "",
    receipt: expense?.receipt ?? "No",
    status: expense?.status ?? "Pending",
  }));

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasChanged =
      form.date !== expense.date?.split("T")[0] ||
      form.amount !== String(expense.amount) ||
      form.payer !== expense.payer ||
      form.source_of_money !== expense.source_of_money ||
      form.phone !== expense.phone ||
      form.reason !== expense.reason ||
      form.receipt !== expense.receipt;

    if (!hasChanged) {
      toast.info("Please modify your data before submitting.", {
        autoClose: 1000,
      });
      return;
    }
    if (form.status !== "Pending") {
      toast.error("Only pending expenses can be edited.", {
        autoClose: 1000,
      });
      return;
    }

    try {
      const payload = {
        date: form.date,
        amount: form.amount,
        payer: form.payer,
        source_of_money: form.source_of_money,
        phone: form.phone,
        reason: form.reason,
        receipt: form.receipt,
        status: form.status,
      };

      await API.put(`/expenses/${expense.id}`, payload);

      if (typeof onUpdate === "function") await onUpdate();
      toast.success("Expense updated successfully!", {
        autoClose: 1000,
      });
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Update failed", { autoClose: 1000 });
    }
  };

  if (!expense) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Expense</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div>
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Payer</label>
              <input
                type="text"
                name="payer"
                value={form.payer}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Source of Money</label>
              <input
                type="text"
                name="source_of_money"
                value={form.source_of_money}
                onChange={handleChange}
                placeholder="Enter source"
              />
            </div>

            <div>
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Reason</label>
              <input
                type="text"
                name="reason"
                value={form.reason}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-buttons">
            <button type="submit" className="btn-save">
              Save Changes
            </button>
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
