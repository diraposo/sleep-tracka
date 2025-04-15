import { useEffect, useState } from "react";
import SleepForm from "./SleepForm";
import SleepChart from "./SleepChart";

type SleepQuality = "great" | "okay" | "poor";

interface SleepEntry {
  id: string;
  date: string;
  quality: SleepQuality;
  hours: number;
  note?: string;
}

const STORAGE_KEY = "sleep_entries";

const SleepTracker = () => {
  const [entries, setEntries] = useState<SleepEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<SleepEntry | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setEntries(JSON.parse(stored));
    setHasLoaded(true);
  }, []);

  // Save to local storage whenever entries change
  useEffect(() => {
    if (hasLoaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries, hasLoaded]);

  const addOrUpdateEntry = (entry: SleepEntry) => {
    setEntries((prev) => {
      const existingIndex = prev.findIndex((e) => e.id === entry.id);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = entry;
        return updated;
      }
      return [entry, ...prev];
    });
    setEditingEntry(null);
  };

  const deleteEntry = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this sleep entry?");
    if (!confirmed) return;
  
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (editingEntry?.id === id) setEditingEntry(null);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4 sm:p-6">
      <div className="space-y-4">
        <SleepForm
            onSave={addOrUpdateEntry}
            editingEntry={editingEntry || undefined}
            onCancelEdit={() => setEditingEntry(null)}
        />
      </div>
      <SleepChart data={entries} />

      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-md p-4 transition-all duration-300">
        <h2 className="text-xl font-semibold mb-4">Sleep History</h2>
        {entries.length === 0 ? (
          <p className="text-gray-500">No entries yet.</p>
        ) : (
          <ul className="space-y-3">
            {entries.map((entry) => (
              <li key={entry.id} className="border-b pb-2 transition hover:bg-gray-50 dark:hover:bg-zinc-700 rounded-lg px-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg">{formatEmoji(entry.quality)}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(entry.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm">
                  Slept <strong>{entry.hours}</strong> hrs
                  {entry.note && <div className="sleep-entry-note mt-1">💭 {entry.note}</div>}
                </div>
                <div className="flex justify-center gap-2 mt-2">
                  <button
                    onClick={() => setEditingEntry(entry)}
                    className="text-blue-600 hover:bg-blue-100 rounded-lg px-3 py-1 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="text-red-600 hover:bg-red-100 rounded-lg px-3 py-1 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

function formatEmoji(quality: SleepQuality): string {
  switch (quality) {
    case "great":
      return "😴 Great";
    case "okay":
      return "😐 Okay";
    case "poor":
      return "😵 Poor";
    default:
      return "";
  }
}

export default SleepTracker;
