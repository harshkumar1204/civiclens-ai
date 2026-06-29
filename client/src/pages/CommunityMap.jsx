import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

function CommunityMap() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
  console.log("✅ Real-time Map Started");

  const unsubscribe = onSnapshot(
    collection(db, "reports"),
    (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("📄 Documents:", data.length);

      setReports(data);
    }
  );

  return () => unsubscribe();
}, []);

  

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
  center={[22.049389, 88.068325]}
  zoom={18}
  style={{ height: "100%", width: "100%" }}
>
  <TileLayer
    attribution="&copy; OpenStreetMap contributors"
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />

  {reports.map((report) => (
    <Marker
  key={report.id}
  position={[
    Number(report.latitude),
    Number(report.longitude),
  ]}
>
  <Popup>
  <div style={{ width: "240px" }}>
    <img
      src={report.imageUrl}
      alt="Issue"
      style={{
        width: "100%",
        height: "140px",
        objectFit: "cover",
        borderRadius: "10px",
        marginBottom: "10px",
      }}
    />

    <h3
      style={{
        fontWeight: "bold",
        fontSize: "20px",
        marginBottom: "8px",
      }}
    >
      {report.issueType}
    </h3>

    <p>
      <strong>Severity:</strong>{" "}
      <span
        style={{
          color:
            report.severity === "High"
              ? "red"
              : report.severity === "Medium"
              ? "orange"
              : "green",
          fontWeight: "bold",
        }}
      >
        {report.severity}
      </span>
    </p>

    <p>
      <strong>Status:</strong> {report.status}
    </p>

    <p style={{ marginTop: "8px" }}>
      {report.description}
    </p>
  </div>
</Popup>
</Marker>
  ))}
</MapContainer>
    </div>
  );
}

export default CommunityMap;