import React, { useState } from "react";
import EditModal from "../editmodal/EditModal";

import "./ExpenseTable.css";
import api from "../../Api/axious";

export default function ExpenseTable({
  expenses,
  fetchExpenses,
  role,
  userId,
  showToast,
}) {
  const [filter, setFilter] = useState("All");
  const [editingExpense, setEditingExpense] = useState(null);
  const [newExpense, setNewExpense] = useState({
    date: "",
    amount: "",
    payer: "",
    source_of_money: "",
    phone: "",
    reason: "",
    receipt: null,
    remark: "",
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/expenses/approve/${id}`, { status: newStatus });
      showToast(`Expense ${newStatus}`);
      fetchExpenses();
    } catch {
      showToast("Update failed", "error");
    }
  };

  const addExpense = async () => {
    if (!newExpense.date || !newExpense.amount || !newExpense.reason) {
      return showToast("Date, Amount, and Reason are required", "error");
    }
    try {
      const formData = new FormData();

      for (const key in newExpense) {
        if (newExpense[key] !== null && newExpense[key] !== "") {
          formData.append(key, newExpense[key]);
        }
      }

      await api.post("/expenses", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setNewExpense({
        date: "",
        amount: "",
        payer: "",
        source_of_money: "",
        phone: "",
        reason: "",
        receipt: null,
        remark: "",
      });
      showToast("Submitted for approval!", { autoClose: 1000 });
      fetchExpenses();
    } catch {
      showToast("Submission failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await api.delete(`/expenses/${id}`);
      showToast("Deleted successfully", { autoClose: 1000 });
      fetchExpenses();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const visibleExpenses = expenses;

  const filtered =
    filter === "All"
      ? visibleExpenses
      : visibleExpenses.filter((e) => e.status === filter);
  // Only sum approved expenses
  const totalAmount = filtered
    .filter((e) => e.status === "Approved") // ignore Pending/Rejected
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="table-section">
      {/* MODAL RENDERED CONDITIONALLY */}
      {editingExpense && (
        <EditModal
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onUpdate={() => {
            fetchExpenses();
            setEditingExpense(null);
          }}
        />
      )}

      {/* ADD EXPENSE FORM */}
      <div className="add-expense-section">
        <button
          className="toggle-add-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "Hide Submit Expense" : "Add New Expense"}
        </button>

        <div
          className={`add-expense-form ${showAddForm ? "expanded" : "collapsed"}`}
        >
          <h3>Submit New Expense</h3>
          <div className="add-form-row">
            <input
              type="date"
              value={newExpense.date}
              onChange={(e) =>
                setNewExpense({ ...newExpense, date: e.target.value })
              }
            />
            <input
              placeholder="Amount"
              type="number"
              value={newExpense.amount}
              onChange={(e) =>
                setNewExpense({ ...newExpense, amount: e.target.value })
              }
            />

            <input
              placeholder="Payer"
              type="text"
              value={newExpense.payer}
              onChange={(e) =>
                setNewExpense({ ...newExpense, payer: e.target.value })
              }
            />

            <input
              list="source-options"
              value={newExpense.source_of_money}
              placeholder="Write a source fund"
              onChange={(e) =>
                setNewExpense({
                  ...newExpense,
                  source_of_money: e.target.value,
                })
              }
            />

            <input
              placeholder="Phone"
              type="number"
              value={newExpense.phone}
              onChange={(e) =>
                setNewExpense({ ...newExpense, phone: e.target.value })
              }
            />
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) =>
                setNewExpense({ ...newExpense, receipt: e.target.files[0] })
              }
            />

            <input
              placeholder="Reason"
              value={newExpense.reason}
              onChange={(e) =>
                setNewExpense({ ...newExpense, reason: e.target.value })
              }
            />
          </div>
          <button onClick={addExpense}>Submit Expense</button>
        </div>
      </div>

      <div className="table-controls" style={{ marginBottom: "1rem" }}>
        <label>Filter by Status: </label>
        <select onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <table
        className="expense-table"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ background: "#50b9b9" }}>
            <th>Date</th>
            <th>Name</th>
            <th>Amount (ETB)</th>
            <th>Payer</th>
            <th>Source</th>
            <th>Phone</th>
            <th>Reason</th>
            <th>Receipt</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((e) => {
            // treat both sides as strings to avoid type/coercion issues
            const isOwnerOfRecord = String(e.user_id) === String(userId);
            // Permission rules
            const canEdit =
              (role !== "owner" || isOwnerOfRecord) && e.status !== "Approved";
            const canDelete =
              (role !== "owner" || isOwnerOfRecord) && e.status !== "Approved";

            return (
              <tr key={e.id} style={{ borderBottom: "1px solid #eee" }}>
                <td data-label="Date">
                  {e.date ? String(e.date).split("T")[0] : "N/A"}
                </td>
                <td data-label="Name">{e.user_name}</td>
                <td data-label="Amount">{e.amount}</td>
                <td data-label="Payer">{e.payer ?? e.payer_name ?? "N/A"}</td>
                <td data-label="Source">{e.source_of_money ?? "N/A"}</td>
                <td data-label="Phone">{e.phone}</td>
                <td data-label="Reason">{e.reason}</td>
                <td data-label="Receipt">
                  {e.receipt ? (
                    <button
                      className="btn-view"
                      onClick={() =>
                        window.open(
                          `http://localhost:5000/uploads/${e.receipt}`,
                          "_blank",
                        )
                      }
                    >
                      View
                    </button>
                  ) : (
                    "No receipt"
                  )}
                </td>

                <td data-label="Status">
                  <span className={`badge ${e.status}`}>{e.status}</span>
                </td>

                <td>
                  <div className="action-buttons">
                    {role === "owner" &&
                      e.status === "Pending" &&
                      !isOwnerOfRecord && (
                        <>
                          <button
                            className="btn-approve"
                            onClick={() => handleStatusChange(e.id, "Approved")}
                          >
                            Approve
                          </button>

                          <button
                            className="btn-reject"
                            onClick={() => handleStatusChange(e.id, "Rejected")}
                          >
                            Reject
                          </button>
                        </>
                      )}

                    {role !== "owner" && canEdit && (
                      <button
                        className="btn-edit"
                        onClick={() => setEditingExpense(e)}
                      >
                        Edit
                      </button>
                    )}

                    {role !== "owner" && canDelete && (
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(e.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="total-expense">
        Total Amount of your expense: {totalAmount.toLocaleString()} ETB
      </div>
    </div>
  );
}
