"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [providers, setProviders] = useState([]);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/dashboard");

      if (!res.ok) return;

      const text = await res.text();

      if (!text) return;

      const data = JSON.parse(text);

      setProviders(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboard();

    const eventSource = new EventSource("/api/sse");

    eventSource.onmessage = () => {
      fetchDashboard();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Provider Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className="border rounded p-4"
          >
            <h2 className="text-xl font-bold">
              {provider.name}
            </h2>

            <p>
              Leads Received:{" "}
              {provider.leadsReceived}
            </p>

            <p>
              Remaining Quota:{" "}
              {provider.quotaRemaining}
            </p>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">
                Assigned Leads
              </h3>

              <div className="space-y-2">
                {provider.leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="border p-2 rounded"
                  >
                    <p>
                      <strong>Name:</strong>{" "}
                      {lead.name}
                    </p>

                    <p>
                      <strong>Phone:</strong>{" "}
                      {lead.phone}
                    </p>

                    <p>
                      <strong>City:</strong>{" "}
                      {lead.city}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}