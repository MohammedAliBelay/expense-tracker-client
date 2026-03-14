import React, { useState } from "react";
import ExpenseTable from "../expensetable/ExpenseTable";
import api from "../../Api/axious";
import "./Dashboard.css";

export default function Dashboard({
  expenses,
  fetchExpenses,
  role,
  userId,
  showToast,
}) {
  const [loadingExport, setLoadingExport] = useState(false);

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const exportExcel = async () => {
    try {
      setLoadingExport(true);
      const res = await api.get("/expenses/export/excel", {
        responseType: "blob",
      });
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      downloadBlob(blob, "expenses.xlsx");
      setLoadingExport(false);
      showToast("Excel export started");
    } catch (err) {
      setLoadingExport(false);
      console.error("Excel export error:", err);
      showToast("Excel export failed", "error");
    }
  };
  const [showExport, setShowExport] = useState(false);

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div className="dashboard-toolbar">
            {role === "owner" && (
              <>
                <button
                  className="toggle-export-btn"
                  onClick={() => setShowExport(!showExport)}
                >
                  {showExport ? "Hide Export" : "Export Options"}
                </button>

                {showExport && (
                  <button
                    className="export-btn export-excel"
                    onClick={exportExcel}
                    disabled={loadingExport}
                  >
                    {loadingExport ? "Exporting..." : "Export Excel"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <ExpenseTable
          expenses={expenses}
          fetchExpenses={fetchExpenses}
          role={role}
          userId={userId}
          showToast={showToast}
        />
      </div>
    </div>
  );
}
