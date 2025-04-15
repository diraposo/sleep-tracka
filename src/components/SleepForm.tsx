import { useEffect, useState } from "react";

type SleepQuality = "great" | "okay" | "poor";

interface SleepEntry {
  id: string;
  date: string;
  quality: SleepQuality;
  hours: number;
  note?: string;
}
interface SleepFormProps {
  onSave: (entry: SleepEntry) => void;
  editingEntry?: SleepEntry;
  onCancelEdit: () => void;
}

const SleepForm = ({ onSave, editingEntry, onCancelEdit }: SleepFormProps) => {
  const [quality, setQuality] = useState<SleepQuality>("great");
  const [hours, setHours] = useState<number>(8);
  const [note, setNote] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingEntry) {
      setQuality(editingEntry.quality);
      setHours(editingEntry.hours);
      setNote(editingEntry.note ?? "");
    } else {
      setQuality("great");
      setHours(8);
      setNote("");
    }
  }, [editingEntry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    if (hours < 0 || hours > 24) {
      setError("Hours must be between 0 and 24.");
      return;
    }
    setError(null); // clear previous error
    
    const newEntry: SleepEntry = {
      id: editingEntry?.id || crypto.randomUUID(),
      date: editingEntry?.date || new Date().toISOString(),
      quality,
      hours: Number(hours),
      note: note.trim() || undefined,
    };
    onSave(newEntry);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-4 space-y-4">
      <h2 className="text-xl font-semibold">
        {editingEntry ? "Edit Sleep Entry" : "New Sleep Entry"}
      </h2>
      <div>
        <label className="block font-medium mb-1">Sleep Quality?</label>
        <div className="flex gap-4 text-2xl">
          <button type="button" onClick={() => setQuality("great")} className={`px-2 py-1 rounded transition ${quality === "great" ? "bg-blue-100" : ""}`}>
            😴
          </button>
          <button type="button" onClick={() => setQuality("okay")} className={`px-2 py-1 rounded transition ${quality === "okay" ? "bg-yellow-100" : ""}`}>
            😐
          </button>
          <button type="button" onClick={() => setQuality("poor")} className={`px-2 py-1 rounded transition ${quality === "poor" ? "bg-red-100" : ""}`}>
            😵
          </button>
        </div>
      </div>

      <div>
        <label className="block font-medium mb-1">Hours Slept</label>
        <input
          id="hours"
          type="number"
          value={hours}
          min={0}
          max={24}
          onChange={(e) => setHours(Number(e.target.value))}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
      
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className="block font-medium mb-1">Dream Notes (optional)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div className="flex gap-2 justify-center">
        <button
          type="submit"
          className="bg-green-600 text-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          {editingEntry ? "Update" : "Save"}
        </button>
        {editingEntry && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-gray-600 hover:underline"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default SleepForm;
