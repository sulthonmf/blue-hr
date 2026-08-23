import React, { useState } from "react";
import axios from "axios";
import { useHRStore, PayrollItem } from "../stores/useHRStore";
import { useAuthStore } from "../stores/useAuthStore";
import { useLanguageStore } from "../stores/useLanguageStore";
import {
  CreditCard,
  Printer,
  Plus,
  FileText,
  DollarSign,
  Shield,
} from "lucide-react";

export const PayrollPage: React.FC = () => {
  const { user, hasPermission } = useAuthStore();
  const { payrolls, employees, createPayroll, setLoading } = useHRStore();
  const { t } = useLanguageStore();

  const [isEntryOpen, setIsEntryOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollItem | null>(
    null,
  );

  // Form State
  const [selectedUserId, setSelectedUserId] = useState<number | "">("");
  const [period, setPeriod] = useState("2026-08");
  const [baseSalary, setBaseSalary] = useState("8500000");
  const [allowance, setAllowance] = useState("1500000");
  const [overtimePay, setOvertimePay] = useState("500000");
  const [sickDeduction, setSickDeduction] = useState("100000");
  const [absentDeduction, setAbsentDeduction] = useState("300000");
  const [lateDeduction, setLateDeduction] = useState("50000");
  const [taxBpjsDeduction, setTaxBpjsDeduction] = useState("250000");

  const canManagePayroll =
    hasPermission("manage_payroll") ||
    user?.role_name === "Admin" ||
    user?.role_name === "HR Manager" ||
    user?.role_name === "HR Lead" ||
    user?.role_name === "HR Staff";

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getStandardSalaryForPosition = (
    position: string = "",
    department: string = "",
  ) => {
    const pos = position.toLowerCase();
    let base = 8500000;
    let allow = 1500000;

    if (
      pos.includes("director") ||
      pos.includes("vp") ||
      pos.includes("head") ||
      pos.includes("c-level")
    ) {
      base = 25000000;
      allow = 5000000;
    } else if (pos.includes("manager") || pos.includes("lead")) {
      base = 16000000;
      allow = 3000000;
    } else if (
      pos.includes("senior") ||
      pos.includes("architect") ||
      pos.includes("expert")
    ) {
      base = 12000000;
      allow = 2000000;
    } else if (
      pos.includes("specialist") ||
      pos.includes("developer") ||
      pos.includes("engineer") ||
      pos.includes("designer")
    ) {
      base = 9500000;
      allow = 1500000;
    } else if (
      pos.includes("junior") ||
      pos.includes("intern") ||
      pos.includes("trainee")
    ) {
      base = 5500000;
      allow = 1000000;
    } else {
      base = 8000000;
      allow = 1200000;
    }

    const bpjs = Math.round(base * 0.05);
    return { base, allow, bpjs };
  };

  const handleEmployeeSelect = (val: string) => {
    const id = val ? Number(val) : "";
    setSelectedUserId(id);
    if (id) {
      const emp = employees.find((e) => e.id === id);
      if (emp) {
        const { base, allow, bpjs } = getStandardSalaryForPosition(
          emp.position,
          emp.department,
        );
        setBaseSalary(String(base));
        setAllowance(String(allow));
        setTaxBpjsDeduction(String(bpjs));
      }
    }
  };

  const handleCreatePayrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return alert("Pilih karyawan!");

    const base = parseFloat(baseSalary) || 0;
    const allow = parseFloat(allowance) || 0;
    const over = parseFloat(overtimePay) || 0;

    const sick = parseFloat(sickDeduction) || 0;
    const abs = parseFloat(absentDeduction) || 0;
    const late = parseFloat(lateDeduction) || 0;
    const bpjs = parseFloat(taxBpjsDeduction) || 0;

    const totalIncome = base + allow + over;
    const totalDeduction = sick + abs + late + bpjs;
    const netSalary = totalIncome - totalDeduction;

    setLoading(true, "Menyimpan & menerbitkan slip gaji...");
    try {
      await createPayroll({
        user_id: Number(selectedUserId),
        period,
        base_salary: base,
        allowance: allow,
        overtime_pay: over,
        sick_deduction: sick,
        absent_deduction: abs,
        late_deduction: late,
        tax_bpjs_deduction: bpjs,
        net_salary: netSalary,
        status: "PAID",
      });
      alert("Slip gaji berhasil diproses dan disimpan!");
      setIsEntryOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGenerateAllPayrolls = async () => {
    if (
      !confirm(
        "Apakah Anda yakin ingin menerbitkan slip gaji massal untuk seluruh 100 karyawan periode ini?",
      )
    )
      return;
    setLoading(true, "Menerbitkan slip gaji massal seluruh karyawan...");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/payroll/generate-all",
        { period },
        {
          headers: { Authorization: `Bearer ${useAuthStore.getState().token}` },
          withCredentials: true,
        },
      );
      alert(res.data.message || "Slip gaji massal berhasil diterbitkan!");
      useHRStore.getState().fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
            <CreditCard className="text-[#2563eb]" size={24} />
            {t.payrollTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.payrollSub}
          </p>
        </div>

        {canManagePayroll && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleGenerateAllPayrolls}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <FileText size={15} />
              <span>{t.bulkIssueBtn}</span>
            </button>

            <button
              onClick={() => setIsEntryOpen(!isEntryOpen)}
              className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus size={16} />
              {isEntryOpen ? t.cancel : t.inputSalaryBtn}
            </button>
          </div>
        )}
      </div>

      {/* Input Form Modal / Panel */}
      {isEntryOpen && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 font-display">
            {t.inputSalaryFormTitle}
          </h3>

          <form
            onSubmit={handleCreatePayrollSubmit}
            className="space-y-4 text-xs"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  {t.selectEmployee}
                </label>
                <select
                  required
                  value={selectedUserId}
                  onChange={(e) => handleEmployeeSelect(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none"
                >
                  <option value="">-- {t.selectEmployee} --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.position} - {emp.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  {t.period}
                </label>
                <input
                  type="month"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>

            {/* Income Section */}
            <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/40">
              <h4 className="font-extrabold text-[#2563eb] mb-3 flex items-center gap-1.5 font-display">
                <DollarSign size={16} /> {t.earningsHeader}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    {t.baseSalary} (Rp)
                  </label>
                  <input
                    type="number"
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    {t.allowance} (Rp)
                  </label>
                  <input
                    type="number"
                    value={allowance}
                    onChange={(e) => setAllowance(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    {t.overtimePay} (Rp)
                  </label>
                  <input
                    type="number"
                    value={overtimePay}
                    onChange={(e) => setOvertimePay(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Deductions Section */}
            <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-100 dark:border-rose-900/40">
              <h4 className="font-extrabold text-rose-600 mb-3 flex items-center gap-1.5 font-display">
                <Shield size={16} /> {t.deductionsHeader}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    {t.lateDeduction} (Rp)
                  </label>
                  <input
                    type="number"
                    value={lateDeduction}
                    onChange={(e) => setLateDeduction(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    {t.sickDeduction} (Rp)
                  </label>
                  <input
                    type="number"
                    value={sickDeduction}
                    onChange={(e) => setSickDeduction(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    {t.absentDeduction} (Rp)
                  </label>
                  <input
                    type="number"
                    value={absentDeduction}
                    onChange={(e) => setAbsentDeduction(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    {t.taxBpjsDeduction} (Rp)
                  </label>
                  <input
                    type="number"
                    value={taxBpjsDeduction}
                    onChange={(e) => setTaxBpjsDeduction(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-3 rounded-full text-xs shadow-md transition-all cursor-pointer"
            >
              {t.savePublish}
            </button>
          </form>
        </div>
      )}

      {/* Payroll History Table */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 font-display">
          {t.payrollListTitle}
        </h3>

        <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="p-3.5">{t.colEmployee}</th>
                <th className="p-3.5">{t.colDivision}</th>
                <th className="p-3.5">{t.period}</th>
                <th className="p-3.5">{t.baseSalary}</th>
                <th className="p-3.5">{t.totalDeduction}</th>
                <th className="p-3.5">{t.netSalary}</th>
                <th className="p-3.5 text-right">{t.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {payrolls.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-6 text-slate-500 font-medium"
                  >
                    {t.noPayrollData}
                  </td>
                </tr>
              ) : (
                payrolls.map((p) => {
                  const totalDeductions =
                    p.sick_deduction +
                    p.absent_deduction +
                    p.late_deduction +
                    p.tax_bpjs_deduction;
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-3.5 font-extrabold text-slate-900 dark:text-white">
                        {p.user_name || user?.name}
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300">
                        {p.position || "Software Engineer"}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-[#2563eb]">
                        {p.period}
                      </td>
                      <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300">
                        {formatRupiah(p.base_salary)}
                      </td>
                      <td className="p-3.5 font-mono text-rose-600 dark:text-rose-400">
                        -{formatRupiah(totalDeductions)}
                      </td>
                      <td className="p-3.5 font-mono font-black text-emerald-600 dark:text-emerald-400">
                        {formatRupiah(p.net_salary)}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedPayslip(p)}
                          className="px-3.5 py-1.5 bg-[#2563eb] hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-sm flex items-center gap-1.5 ml-auto transition-all"
                        >
                          <FileText size={14} />
                          {t.printPayslip}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Printable Payslip Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 w-full max-w-2xl rounded-3xl p-8 shadow-2xl relative border border-slate-200">
            {/* Close & Print buttons */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 print:hidden">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {t.payslipDetail}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Printer size={15} />
                  Print / Save PDF
                </button>
                <button
                  onClick={() => setSelectedPayslip(null)}
                  className="p-2 text-slate-400 hover:text-slate-900 font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Official Payslip Printable Document */}
            <div className="space-y-6">
              {/* Header Company Info */}
              <div className="flex items-center justify-between pb-6 border-b-2 border-slate-900">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-xl bg-[#2563eb] text-white flex items-center justify-center font-black text-lg">
                      B
                    </div>
                    <h1 className="text-xl font-black tracking-tight">
                      BlueHR Enterprise<span className="text-[#2563eb]">.</span>
                    </h1>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    PT BlueHR Global Technology Indonesia
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Jakarta Central Towers Lt. 18, Jakarta Selatan
                  </p>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 bg-blue-100 text-[#2563eb] text-xs font-bold rounded-full">
                    {t.confidential}
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-2">
                    {t.payrollTitle}
                  </h3>
                  <p className="text-xs font-mono font-bold text-slate-600">
                    {t.period}: {selectedPayslip.period}
                  </p>
                </div>
              </div>

              {/* Employee Particulars */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <p className="text-slate-400 font-semibold">{t.employeeNameLabel}</p>
                  <p className="font-extrabold text-slate-900 text-sm">
                    {selectedPayslip.user_name || user?.name}
                  </p>
                  <p className="text-slate-400 font-semibold mt-2">
                    {t.positionDeptLabel}
                  </p>
                  <p className="font-bold text-slate-800">
                    {selectedPayslip.position || "Senior Engineer"} (
                    {selectedPayslip.department || "Engineering"})
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 font-semibold">
                    {t.paymentStatusLabel}
                  </p>
                  <p className="font-extrabold text-emerald-600">
                    {t.paymentPaid}
                  </p>
                  <p className="text-slate-400 font-semibold mt-2">
                    {t.issueDateLabel}
                  </p>
                  <p className="font-mono text-slate-800">
                    {new Date(
                      selectedPayslip.created_at || Date.now(),
                    ).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>

              {/* Earnings vs Deductions Breakdown */}
              <div className="grid grid-cols-2 gap-6 text-xs">
                {/* Earnings */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-900 border-b pb-1">
                    {t.earningsSectionTitle}
                  </h4>
                  <div className="flex justify-between text-slate-600">
                    <span>{t.baseSalary}</span>
                    <span className="font-mono font-semibold">
                      {formatRupiah(selectedPayslip.base_salary)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>{t.allowance}</span>
                    <span className="font-mono font-semibold">
                      {formatRupiah(selectedPayslip.allowance)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>{t.overtimePay}</span>
                    <span className="font-mono font-semibold">
                      {formatRupiah(selectedPayslip.overtime_pay)}
                    </span>
                  </div>
                  <div className="flex justify-between font-extrabold text-slate-900 border-t pt-2">
                    <span>{t.totalIncome}</span>
                    <span className="font-mono">
                      {formatRupiah(
                        selectedPayslip.base_salary +
                          selectedPayslip.allowance +
                          selectedPayslip.overtime_pay,
                      )}
                    </span>
                  </div>
                </div>

                {/* Deductions */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-rose-600 border-b pb-1">
                    {t.deductionsSectionTitle}
                  </h4>
                  <div className="flex justify-between text-slate-600">
                    <span>{t.lateDeduction}</span>
                    <span className="font-mono font-semibold text-rose-600">
                      -{formatRupiah(selectedPayslip.late_deduction)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>{t.sickDeduction}</span>
                    <span className="font-mono font-semibold text-rose-600">
                      -{formatRupiah(selectedPayslip.sick_deduction)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>{t.absentDeduction}</span>
                    <span className="font-mono font-semibold text-rose-600">
                      -{formatRupiah(selectedPayslip.absent_deduction)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>{t.taxBpjsDeduction}</span>
                    <span className="font-mono font-semibold text-rose-600">
                      -{formatRupiah(selectedPayslip.tax_bpjs_deduction)}
                    </span>
                  </div>
                  <div className="flex justify-between font-extrabold text-rose-600 border-t pt-2">
                    <span>{t.totalDeduction}</span>
                    <span className="font-mono">
                      -
                      {formatRupiah(
                        selectedPayslip.sick_deduction +
                          selectedPayslip.absent_deduction +
                          selectedPayslip.late_deduction +
                          selectedPayslip.tax_bpjs_deduction,
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Net Take Home Pay Highlight Box */}
              <div className="bg-[#2563eb] text-white p-5 rounded-2xl flex items-center justify-between shadow-lg">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
                    {t.netSalary}
                  </span>
                  <h2 className="text-2xl font-black font-mono mt-0.5">
                    {formatRupiah(selectedPayslip.net_salary)}
                  </h2>
                </div>
                <div className="text-right text-[10px] text-blue-100 font-medium max-w-[140px]">
                  {t.directDepositNote}
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-4 text-center text-xs pt-4">
                <div>
                  <p className="text-slate-400">{t.receivedByEmployee}</p>
                  <div className="h-12"></div>
                  <p className="font-extrabold text-slate-900">
                    {selectedPayslip.user_name || user?.name}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">{t.approvedByHR}</p>
                  <div className="h-12"></div>
                  <p className="font-extrabold text-slate-900">
                    Siti Rahma (HR Lead)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
