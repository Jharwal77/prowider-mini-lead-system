"use client";

import { useState } from "react";

export default function TestToolsPage() {
  const [loading, setLoading] = useState(false);

  const createLead = async (phone, serviceId) => {
    return fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Test User",
        phone,
        city: "Delhi",
        description: "Test Lead",
        serviceId,
      }),
    });
  };

  const testDuplicate = async () => {
    setLoading(true);

    const phone = Math.floor(
      1000000000 + Math.random() * 9000000000
    ).toString();

    await createLead(phone, 1);

    const duplicate = await createLead(phone, 1);

    const result = await duplicate.json();

    alert(JSON.stringify(result, null, 2));

    setLoading(false);
  };

  const testConcurrency = async () => {
    setLoading(true);

    const requests = [];

    for (let i = 0; i < 3; i++) {
      requests.push(
        createLead(
          (9000000000 + i + Date.now()).toString(),
          1
        )
      );
    }

    await Promise.all(requests);

    alert("3 concurrent leads submitted");

    setLoading(false);
  };

  const testWebhook = async () => {
    setLoading(true);

    const res = await fetch("/api/webhook/reset-quota", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idempotencyKey: "payment-event-123",
      }),
    });

    const data = await res.json();

    alert(JSON.stringify(data, null, 2));

    setLoading(false);
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">
        Test Tools
      </h1>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={testDuplicate}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Test Duplicate Prevention
        </button>

        <button
          onClick={testConcurrency}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Test Concurrent Requests
        </button>

        <button
          onClick={testWebhook}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Test Webhook Idempotency
        </button>
      </div>
    </div>
  );
}