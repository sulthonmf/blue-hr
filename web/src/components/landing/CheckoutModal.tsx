import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  Building2,
  ShieldCheck,
  ArrowRight,
  Receipt,
  Zap,
  ExternalLink,
  AlertCircle,
  CreditCard,
  Clock,
  Sparkles,
} from "lucide-react";

export interface PlanItem {
  id: string;
  name: string;
  priceMonthly: string;
  priceAnnual: string;
  maxEmployees: string;
  features: string[];
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: PlanItem | null;
  billingCycle: "monthly" | "annual";
  onPaymentSuccess?: (transactionDetails: any) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  billingCycle,
  onPaymentSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isPendingMidtrans, setIsPendingMidtrans] = useState<boolean>(false);
  const [transactionRef, setTransactionRef] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [redirectUrl, setRedirectUrl] = useState<string>("");

  // Contact Form State
  const [buyerInfo, setBuyerInfo] = useState({
    companyName: "",
    adminName: "",
    email: "",
    phone: "",
  });

  if (!isOpen || !selectedPlan) return null;

  const priceStr = billingCycle === "annual" ? selectedPlan.priceAnnual : selectedPlan.priceMonthly;
  const numPrice = parseInt(priceStr.replace(/[^0-9]/g, "")) || 499000;
  const adminFee = 4500;
  const ppn = Math.round(numPrice * 0.11);
  const totalPrice = numPrice + adminFee + ppn;

  // Real Midtrans Snap Payment Handler
  const handlePayWithMidtrans = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!buyerInfo.companyName || !buyerInfo.adminName || !buyerInfo.email) {
      setErrorMessage("Silakan lengkapi Data Perusahaan, Nama Admin, dan Email terlebih dahulu.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");
    setRedirectUrl("");

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
      const response = await fetch(`${apiUrl}/payments/create-snap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          billingCycle,
          amount: numPrice,
          companyName: buyerInfo.companyName,
          customerName: buyerInfo.adminName,
          customerEmail: buyerInfo.email,
          customerPhone: buyerInfo.phone || "081234567890",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.token) {
        throw new Error(data.error || "Gagal membuat sesi transaksi Midtrans");
      }

      if (data.redirectUrl) {
        setRedirectUrl(data.redirectUrl);
      }

      // Check if Midtrans Snap popup is loaded
      if (typeof window !== "undefined" && (window as any).snap) {
        (window as any).snap.pay(data.token, {
          onSuccess: (result: any) => {
            console.log("[Midtrans Payment Success]:", result);
            setIsProcessing(false);
            setIsPendingMidtrans(false);
            setIsSuccess(true);
            setTransactionRef(result.order_id || data.orderId);
          },
          onPending: (result: any) => {
            console.log("[Midtrans Payment Pending]:", result);
            setIsProcessing(false);
            // DO NOT auto mark as success! Show pending status with bypass button
            setIsPendingMidtrans(true);
            setTransactionRef(result.order_id || data.orderId);
          },
          onError: (err: any) => {
            console.error("[Midtrans Payment Error]:", err);
            setIsProcessing(false);
            setErrorMessage("Pembayaran gagal diproses oleh Midtrans.");
          },
          onClose: () => {
            console.log("[Midtrans Popup Closed]");
            setIsProcessing(false);
          },
        });
      } else if (data.redirectUrl) {
        window.open(data.redirectUrl, "_blank");
        setIsProcessing(false);
      } else {
        throw new Error("Script Midtrans Snap JS belum termuat. Periksa koneksi internet.");
      }
    } catch (err: any) {
      console.error("[Midtrans Error]:", err);
      setIsProcessing(false);
      setErrorMessage(err.message || "Gagal menghubungkan ke Midtrans. Pastikan server backend berjalan.");
    }
  };

  // Instant Bypass Handler for Sandbox Testing
  const handleInstantBypass = () => {
    const fakeOrder = "SANDBOX-BYPASS-" + Math.floor(100000 + Math.random() * 900000);
    setTransactionRef(fakeOrder);
    setIsProcessing(false);
    setIsPendingMidtrans(false);
    setIsSuccess(true);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setIsPendingMidtrans(false);
    setIsProcessing(false);
    setErrorMessage("");
    setRedirectUrl("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Ribbon */}
        <div className="p-6 md:p-7 bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 text-white relative">
          <button
            onClick={handleResetAndClose}
            className="absolute top-5 right-5 p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-1.5 text-blue-200 text-xs font-semibold tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4 text-cyan-300" /> Midtrans Official Payment Gateway
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            Checkout Lisensi {selectedPlan.name}
          </h2>
          <p className="text-blue-100/90 text-xs mt-1">
            Paket {billingCycle === "annual" ? "Tahunan (Hemat 20%)" : "Bulanan"} • Kuota: {selectedPlan.maxEmployees}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          {/* 1. SUCCESS VIEW */}
          {isSuccess ? (
            <div className="py-6 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Pembayaran Berhasil Diterima!
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-2 max-w-md">
                Selamat! Paket <span className="font-bold text-blue-600 dark:text-blue-400">{selectedPlan.name}</span> telah aktif untuk <span className="font-semibold text-slate-800 dark:text-slate-200">{buyerInfo.companyName || "Perusahaan Anda"}</span>. Seluruh fitur paket ini kini terbuka di dashboard.
              </p>

              {/* Receipt Summary Card */}
              <div className="my-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-left w-full max-w-md space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-blue-500" /> Order ID Midtrans
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                    {transactionRef || "BHR-ORDER-COMPLETED"}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Paket Lisensi:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{selectedPlan.name} ({billingCycle})</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Status Transaksi:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">SETTLEMENT / PAID</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Waktu Pembayaran:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{new Date().toLocaleString("id-ID")}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Total Dibayar:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <button
                  onClick={() => {
                    handleResetAndClose();
                    if (onPaymentSuccess) {
                      onPaymentSuccess({ orderId: transactionRef, plan: selectedPlan.id });
                    }
                  }}
                  className="flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
                >
                  <span>Buka Dashboard ({selectedPlan.name} Terbuka)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : isPendingMidtrans ? (
            /* 2. PENDING STATUS VIEW WITH INSTANT BYPASS */
            <div className="py-6 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/60 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4 animate-pulse">
                <Clock className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Menunggu Pembayaran (Status: PENDING)
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-2 max-w-md">
                Transaksi QRIS / Virtual Account telah diterbitkan di <span className="font-semibold text-blue-600">Midtrans Sandbox</span> dengan ID: <span className="font-mono font-bold">{transactionRef}</span>.
              </p>

              <div className="my-6 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-left w-full max-w-md space-y-2">
                <div className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Mode Sandbox Testing:
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Di Sandbox, Anda tidak perlu transfer uang sungguhan. Anda bisa klik <b>"Bypass Bayar Sukses"</b> di bawah untuk langsung mengonfirmasi pembayaran dan membuka semua fitur dashboard.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <button
                  type="button"
                  onClick={handleInstantBypass}
                  className="flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
                >
                  <Zap className="w-4 h-4" />
                  <span>Konfirmasi / Bypass Bayar (Sandbox)</span>
                </button>

                <a
                  href="https://simulator.sandbox.midtrans.com/qris"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Simulator Midtrans</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            /* 3. CHECKOUT FORM VIEW */
            <form onSubmit={handlePayWithMidtrans} className="space-y-6">
              
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form Data Pelanggan */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" /> 1. Data Perusahaan & Kontak Pembeli
                </h3>
                
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Perusahaan *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: PT Solusi Digital Nusantara"
                    value={buyerInfo.companyName}
                    onChange={(e) => setBuyerInfo({ ...buyerInfo, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Lengkap Admin HR *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Budi Santoso"
                      value={buyerInfo.adminName}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, adminName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Invoice *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="budi@perusahaan.co.id"
                      value={buyerInfo.email}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    No. WhatsApp / Telepon
                  </label>
                  <input
                    type="tel"
                    placeholder="081234567890"
                    value={buyerInfo.phone}
                    onChange={(e) => setBuyerInfo({ ...buyerInfo, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Rincian Tagihan */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Receipt className="w-4 h-4" /> 2. Rincian Pembelian
                </h3>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Paket Lisensi {selectedPlan.name}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                      {billingCycle === "annual" ? "Tagihan Tahunan (Hemat 20%)" : "Tagihan Bulanan"}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Harga Lisensi ({selectedPlan.maxEmployees}):</span>
                      <span className="font-semibold text-slate-900 dark:text-white">Rp {numPrice.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>PPN (11%):</span>
                      <span>Rp {ppn.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Biaya Penanganan (Payment Gateway):</span>
                      <span>Rp {adminFee.toLocaleString("id-ID")}</span>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Total Pembayaran:</span>
                    <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
                      Rp {totalPrice.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Supported Payment Channels via Midtrans */}
              <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-xs">
                <div className="font-semibold text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-blue-600" /> Kanal Pembayaran Midtrans Snap:
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Mendukung QRIS (GoPay, OVO, ShopeePay, DANA), Virtual Account (BCA, Mandiri, BRI, BNI, Permata), Kartu Kredit/Debit Visa & Mastercard, serta Alfamart & Indomaret.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Midtrans Snap 256-bit SSL Protected
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleInstantBypass}
                    className="py-3 px-4 rounded-xl border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                    title="Bypass langsung tanpa perlu scan QRIS untuk testing"
                  >
                    <Zap className="w-3.5 h-3.5 text-emerald-500" />
                    <span>⚡ Bypass Sandbox</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 sm:flex-initial py-3.5 px-7 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Membuka Midtrans Snap...
                      </span>
                    ) : (
                      <>
                        <span>Bayar via Midtrans (Rp {totalPrice.toLocaleString("id-ID")})</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
