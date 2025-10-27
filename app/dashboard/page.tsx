"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

type StudentData = {
  _id: string;
  name: string;
  task: string;
  deadline: string;
  github?: string;
  status: "pending" | "underReview" | "reviewed" | "notReviewed";
};

export default function DashboardPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<StudentData[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [github, setGithub] = useState("");
  const [isMarking, setIsMarking] = useState(false);
  const [globalTask, setGlobalTask] = useState<{ currentTask: string }>({
  currentTask: "",
});




  // ✅ Fetch students from backend
  async function fetchStudents() {
    try {
      const res = await fetch("https://codeminds-admin.vercel.app/api/students");
      const data = await res.json();
      if (Array.isArray(data)) setStudents(data);
      else console.error("Invalid data:", data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  }
  // ✅ Fetch current task and deadline (from admin)
async function fetchGlobalTask() {
  try {
    const res = await fetch("https://codeminds-admin.vercel.app/api/task");
    const data = await res.json();
    setGlobalTask(data);
  } catch (error) {
    console.error("Error fetching global task:", error);
  }
}


 useEffect(() => {
  fetchStudents();
  fetchGlobalTask(); // ✅ also fetch the task
  const interval = setInterval(() => {
    fetchStudents();
    fetchGlobalTask();
  }, 10000); // auto-refresh every 10s
  return () => clearInterval(interval);
}, []);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.replace("/");
  };

  // ✅ Filter
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Status color helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case "underReview":
        return "text-yellow-500";
      case "reviewed":
        return "text-green-600";
      case "notReviewed":
        return "text-red-500";
      default:
        return "text-gray-600";
    }
  };

  // ✅ Mark task as Done (changes pending → underReview)
  const handleMarkDone = async () => {
    if (!selectedStudent) return;
    if (selectedStudent.status !== "pending") return; // prevent if already marked
    if (isMarking) return;

    const confirmMark = confirm("⚠️ Are you sure you’ve completed your project?");
    if (!confirmMark) return;

    setIsMarking(true);

    try {
      console.log("PATCH → Marking student as underReview:", selectedStudent._id);
      const res = await axios.patch(`https://codeminds-admin.vercel.app/api/students/${selectedStudent._id}`, {
        status: "underReview",
      });

      if (res.data?.success) {
        alert("✅ Task marked as 'Under Review' successfully!");
        setStudents((prev) =>
          prev.map((s) =>
            s._id === selectedStudent._id ? { ...s, status: "underReview" } : s
          )
        );
        setSelectedStudent((prev) =>
          prev ? { ...prev, status: "underReview" } : prev
        );
      } else {
        alert(res.data?.message || "Failed to update status.");
      }
    } catch (err) {
      console.error("❌ Error marking done:", err);
      alert("Server error while marking task as done.");
    } finally {
      setIsMarking(false);
    }
  };

  // ✅ Save GitHub ID (only once)
  const handleGithubSave = async () => {
    if (!selectedStudent) return;
    if (!github.trim()) return alert("Please enter a valid GitHub ID.");

    // Prevent re-entry if already locked
    if (selectedStudent.github && selectedStudent.github.trim() !== "") {
      return alert("GitHub ID already submitted and locked! 🔒");
    }

    try {
      console.log("PATCH → Saving GitHub:", selectedStudent._id);

      const res = await axios.patch(`https://codeminds-admin.vercel.app/api/students/${selectedStudent._id}`, {
        github: github.trim(),
      });

      if (res.data?.success) {
        alert("✅ GitHub ID saved and locked successfully!");
        setStudents((prev) =>
          prev.map((s) =>
            s._id === selectedStudent._id ? { ...s, github: github.trim() } : s
          )
        );
        setSelectedStudent((prev) =>
          prev ? { ...prev, github: github.trim() } : prev
        );
      } else {
        alert(res.data?.message || "Error saving GitHub.");
      }
    } catch (err) {
      console.error("❌ Error saving GitHub:", err);
      alert("Server error while saving GitHub ID.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-[Poppins] flex flex-col items-center p-6">
      {/* Header */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-center py-6 gap-4">
        <div className="flex items-center gap-3">
          <Image
            src="/codeminds-logo.png"
            alt="CodeMinds Logo"
            width={50}
            height={50}
            className="object-contain"
          />
          <h1 className="text-3xl font-bold">CodeMinds Dashboard</h1>
        </div>

        <div className="bg-white shadow-md border border-gray-100 rounded-xl px-6 py-4 w-full md:w-auto">
  <h3 className="font-semibold text-gray-800 mb-1 text-lg">📋 Current Task:</h3>
  <p className="text-blue-600 font-medium">
    {globalTask.currentTask || "No task assigned yet"}
  </p>
</div>


        <button
          onClick={handleLogout}
          className="md:ml-6 px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition w-full md:w-auto"
        >
          Logout
        </button>
      </div>

      {/* Search */}
      <div className="w-full max-w-3xl mb-6">
        <input
          type="text"
          placeholder="🔍 Search student by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
        />
      </div>

      <AnimatePresence mode="wait">
        {/* List View */}
        {!selectedStudent && (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl"
          >
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student._id || index}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedStudent(student)}
                className="cursor-pointer bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-100"
              >
                <h2 className="text-lg font-bold">{student.name}</h2>
                <p className="text-gray-600 text-sm mt-1">{student.task}</p>
                <p className="text-gray-500 text-xs mt-1">Deadline: {student.deadline}</p>
                <p className={`mt-2 font-semibold ${getStatusColor(student.status)}`}>
                  {student.status === "underReview"
                    ? "Under Review ⏳"
                    : student.status === "reviewed"
                    ? "Reviewed ✅"
                    : student.status === "notReviewed"
                    ? "Not Reviewed ❌"
                    : "Pending 🕒"}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Detail View */}
        {selectedStudent && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <button
              onClick={() => setSelectedStudent(null)}
              className="text-blue-500 hover:underline mb-4"
            >
              ← Back to list
            </button>

            <h2 className="text-2xl font-bold mb-2">{selectedStudent.name}</h2>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Task:</span> {selectedStudent.task}
            </p>
            <p className="text-gray-600 mb-4">
              <span className="font-semibold">Deadline:</span> {selectedStudent.deadline}
            </p>

            {/* GitHub */}
            {!selectedStudent.github ? (
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
                <input
                  type="text"
                  placeholder="Enter your GitHub ID"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleGithubSave}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-xl shadow-lg transition-all"
                >
                  Save
                </motion.button>
              </div>
            ) : (
              <p className="text-gray-700 mb-6">
                <span className="font-semibold">GitHub:</span>{" "}
                <a
                  href={`https://github.com/${selectedStudent.github}`}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  {selectedStudent.github}
                </a>{" "}
                <span className="text-gray-500 text-sm">(locked 🔒)</span>
              </p>
            )}

            {/* Status */}
            <p className={`font-bold text-lg mb-4 ${getStatusColor(selectedStudent.status)}`}>
              Status:{" "}
              {selectedStudent.status === "underReview"
                ? "Under Review ⏳"
                : selectedStudent.status === "reviewed"
                ? "Reviewed ✅"
                : selectedStudent.status === "notReviewed"
                ? "Not Reviewed ❌"
                : "Pending 🕒"}
            </p>

            {/* Mark Done Button */}
            {selectedStudent.status === "pending" && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={isMarking}
                onClick={handleMarkDone}
                className={`group relative overflow-hidden text-white text-base font-bold px-8 py-4 rounded-lg shadow-lg transition-all duration-300 ${
                  isMarking ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isMarking ? "Submitting..." : "Mark as Done ✅"}
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
