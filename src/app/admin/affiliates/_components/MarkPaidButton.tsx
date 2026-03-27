"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MarkPaidButton({ affiliateId }: { affiliateId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleMarkPaid = async () => {
        if (!confirm("Mark all pending commissions as paid for this affiliate?")) return;
        setLoading(true);
        await fetch("/api/admin/mark-paid", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ affiliate_id: affiliateId }),
        });
        setLoading(false);
        router.refresh();
    };

    return (
        <button
            onClick={handleMarkPaid}
            disabled={loading}
            className="bg-green-900/50 hover:bg-green-800 text-green-400 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
            {loading ? "..." : "Mark Paid"}
        </button>
    );
}
