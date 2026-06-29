import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import DashboardCharts from "../components/DashboardCharts";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

function Dashboard() {
  const [search, setSearch] = useState("");
const [filterStatus, setFilterStatus] = useState("All");
const [filterSeverity, setFilterSeverity] = useState("All");
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, "reports"),
    (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReports(data);
    }
  );

  return () => unsubscribe();
}, []);
async function markResolved(id) {
  try {
    await updateDoc(doc(db, "reports", id), {
      status: "Resolved",
    });

  } catch (error) {
    console.error(error);
  }
}
async function handleLogout() {
  try {
    await signOut(auth);
    navigate("/login");
  } catch (error) {
    console.error(error);
  }
}
   async function deleteReport(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this report?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "reports", id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete report.");
    }
  }
  const pending = reports.filter(
  (report) => report.status === "Pending"
).length;

const resolved = reports.filter(
  (report) => report.status === "Resolved"
).length;

const highSeverity = reports.filter(
  (report) => report.severity === "High"
).length;
 const filteredReports = reports.filter((report) => {
  const matchesSearch =
    report.issueType
      .toLowerCase()
      .includes(search.toLowerCase());

  const matchesStatus =
    filterStatus === "All" ||
    report.status === filterStatus;

  const matchesSeverity =
    filterSeverity === "All" ||
    report.severity === filterSeverity;

  return (
    matchesSearch &&
    matchesStatus &&
    matchesSeverity
  );
});
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-12 px-10 pb-10">
      <div className="mb-10 flex items-center justify-between">

  <h1 className="text-5xl font-bold">
    📊 Dashboard
  </h1>

  <button
    onClick={handleLogout}
    className="rounded-xl bg-red-600 px-6 py-3 font-bold hover:bg-red-700"
  >
    🚪 Logout
  </button>

</div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

  <div className="rounded-2xl bg-blue-600 p-6 shadow-lg">
    <h3 className="text-lg font-semibold">📄 Total Reports</h3>
    <p className="mt-4 text-4xl font-bold">
      {reports.length}
    </p>
  </div>

  <div className="rounded-2xl bg-yellow-500 p-6 shadow-lg">
    <h3 className="text-lg font-semibold">⏳ Pending</h3>
    <p className="mt-4 text-4xl font-bold">
      {pending}
    </p>
  </div>

  <div className="rounded-2xl bg-green-600 p-6 shadow-lg">
    <h3 className="text-lg font-semibold">✅ Resolved</h3>
    <p className="mt-4 text-4xl font-bold">
      {resolved}
    </p>
  </div>

  <div className="rounded-2xl bg-red-600 p-6 shadow-lg">
  <h3 className="text-lg font-semibold">🚨 High Severity</h3>
  <p className="mt-4 text-4xl font-bold">
    {highSeverity}
  </p>
</div>

</div> {/* <-- This closes the grid */}
<DashboardCharts reports={reports} />
<div className="mt-12">
  <h2 className="mb-6 text-3xl font-bold">
    📋 Recent Reports
  </h2>
  <div className="mb-6 flex flex-col gap-4 md:flex-row">

  <input
    type="text"
    placeholder="🔍 Search issue..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="flex-1 rounded-xl border border-slate-700 bg-slate-800 p-3 outline-none"
  />

  <select
    value={filterStatus}
    onChange={(e) => setFilterStatus(e.target.value)}
    className="rounded-xl border border-slate-700 bg-slate-800 p-3"
  >
    <option>All</option>
    <option>Pending</option>
    <option>Resolved</option>
  </select>
  <select
  value={filterSeverity}
  onChange={(e) => setFilterSeverity(e.target.value)}
  className="rounded-xl border border-slate-700 bg-slate-800 p-3"
>
  <option>All</option>
  <option>High</option>
  <option>Medium</option>
  <option>Low</option>
</select>

</div>
  <div className="mt-6 w-full overflow-x-auto rounded-2xl bg-slate-900 shadow-xl">
    <table className="w-full min-w-[1200px] text-left">

      <thead className="bg-slate-800">
        <tr>
          <th className="px-6 py-4">Image</th>
<th className="px-6 py-4">Issue</th>
<th className="px-6 py-4">Description</th>
<th className="px-6 py-4">Severity</th>
<th className="px-6 py-4">Status</th>
<th className="px-6 py-4">Action</th>
        </tr>
      </thead>

      <tbody>

        {filteredReports.map((report) => (

          <tr
  key={report.id}
  className="border-b border-slate-700 hover:bg-slate-800 transition"
>

  <td className="px-6 py-4">
  <img
  src={report.imageUrl || "https://placehold.co/80x60?text=No+Image"}
  alt="Issue"
  className="h-16 w-20 rounded-lg object-cover"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "https://placehold.co/80x60?text=No+Image";
  }}
/>
  </td>

  <td className="px-6 py-4 font-semibold">
    {report.issueType}
  </td>

  <td className="px-6 py-4 max-w-xs">
    {report.description?.length > 45
  ? report.description.substring(0, 45) + "..."
  : report.description || "No description"}
  </td>

  <td className="px-6 py-4">
    <span
      className={`rounded-full px-3 py-1 text-sm font-bold
      ${
        report.severity === "High"
          ? "bg-red-600"
          : report.severity === "Medium"
          ? "bg-yellow-500"
          : "bg-green-600"
      }`}
    >
      {report.severity}
    </span>
  </td>

  <td className="px-6 py-4">
    <span
      className={`rounded-full px-3 py-1 text-sm font-bold
      ${
        report.status === "Resolved"
          ? "bg-green-600"
          : "bg-yellow-600"
      }`}
    >
      {report.status}
    </span>
  </td>

  <td className="px-6 py-4">
    <div className="flex gap-2">

  <button
    onClick={() => setSelectedReport(report)}
    className="rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-700"
  >
    View
  </button>

  <button
    onClick={() => deleteReport(report.id)}
    className="rounded-lg bg-red-600 px-4 py-2 hover:bg-red-700"
  >
    Delete
  </button>

</div>
  </td>

</tr>

        ))}

      </tbody>

    </table>
  </div>
</div>
{selectedReport && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
    <div className="w-full max-w-2xl rounded-2xl bg-slate-900 p-8 text-white">

      <img
        src={
  selectedReport.imageUrl ||
  "https://placehold.co/600x400?text=No+Image"
}
        alt="Issue"
        className="mb-6 h-72 w-full rounded-xl object-cover"
      />

      <h2 className="mb-4 text-3xl font-bold">
        {selectedReport.issueType}
      </h2>

      <p className="mb-3">
        <strong>Severity:</strong> {selectedReport.severity}
      </p>

      <p className="mb-3">
        <strong>Status:</strong> {selectedReport.status}
      </p>

      <p className="mb-3">
        <strong>Description:</strong>
      </p>

      <p className="mb-5 text-gray-300">
        {selectedReport.description}
      </p>

      <p>
        <strong>Latitude:</strong> {selectedReport.latitude}
      </p>

      <p className="mb-6">
        <strong>Longitude:</strong> {selectedReport.longitude}
      </p>

      <div className="flex gap-4">

  <button
    onClick={async () => {
      await markResolved(selectedReport.id);
      setSelectedReport(null);
    }}
    className="rounded-xl bg-green-600 px-6 py-3 hover:bg-green-700"
  >
    ✅ Mark Resolved
  </button>

  <button
    onClick={() => setSelectedReport(null)}
    className="rounded-xl bg-red-600 px-6 py-3 hover:bg-red-700"
  >
    Close
  </button>

</div>

    </div>
  </div>
)}
</div>
  );
}

export default Dashboard;