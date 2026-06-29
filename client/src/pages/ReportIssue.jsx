import { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import {
  FaCloudUploadAlt,
  FaArrowRight,
  FaMapMarkerAlt,
  FaSpinner,
} from "react-icons/fa";

function ReportIssue() {
  // Image
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  // Loading
  const [loading, setLoading] = useState(false);

  // AI Result
  const [issueType, setIssueType] = useState("");
  const [severity, setSeverity] = useState("");
  const [description, setDescription] = useState("");

  // Location
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        setImage(URL.createObjectURL(selectedFile));

        // Reset previous data
        setImageUrl("");
        setIssueType("");
        setSeverity("");
        setDescription("");
        setLatitude("");
        setLongitude("");
      }
    },
  });

  async function analyzeImage() {
    if (!file) {
      alert("Please upload an image first.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post(
        "http://localhost:5000/analyze-image",
        formData
      );

      setImageUrl(res.data.imageUrl);

      const json = res.data.result;
      setIssueType(json.issueType);
      setSeverity(json.severity);
      setDescription(json.description);
    } catch (err) {
  console.error("Axios Error:", err);

  if (err.response) {
    console.log("Status:", err.response.status);
    console.log("Response:", err.response.data);
  } else if (err.request) {
    console.log("No response received from server");
  } else {
    console.log(err.message);
  }

  alert("AI Analysis Failed");
}finally {
      setLoading(false);
    }
  }

  function detectLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
      },
      (error) => {
        console.error(error);
        alert("Unable to fetch your location.");
      }
    );
  }

  async function submitReport() {
    try {
      if (!issueType || !severity || !description) {
        alert("Please analyze the image first.");
        return;
      }

      if (!latitude || !longitude) {
        alert("Please detect your location first.");
        return;
      }

      if (!imageUrl) {
        alert("Image upload failed. Please analyze again.");
        return;
      }

      await addDoc(collection(db, "reports"), {
        issueType,
        severity,
        description,
        latitude,
        longitude,
        imageUrl,
        status: "Pending",
        createdAt: serverTimestamp(),
      });

      alert("✅ Report submitted successfully!");
      window.scrollTo({
  top: 0,
  behavior: "smooth",
});

      // Reset form
      setImage(null);
      setFile(null);
      setImageUrl("");
      setIssueType("");
      setSeverity("");
      setDescription("");
      setLatitude("");
      setLongitude("");
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Failed to submit report.");
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070B17] px-6 py-20 text-white">

      {/* Background Blur Effects */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[150px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto w-full max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl"
      >
        {/* Header Badge */}
        <div className="mb-6 flex justify-center">
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-cyan-300">
            🤖 AI Powered Civic Reporting
          </span>
        </div>

        <h1 className="text-center text-5xl font-bold">
          Report Community Issue
        </h1>

        <p className="mt-4 text-center text-gray-400">
          Upload a photo and let AI automatically identify the issue.
        </p>

        {/* Feature Tags */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-blue-300">
            🤖 AI Detection
          </span>
          <span className="rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-green-300">
            📍 Geo Location
          </span>
          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-violet-300">
            ⚡ Fast Reporting
          </span>
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className="mt-10 cursor-pointer rounded-3xl border border-blue-500/40 bg-gradient-to-br from-slate-900 to-slate-800 p-16 text-center transition hover:border-blue-400"
        >
          <input {...getInputProps()} />
          <FaCloudUploadAlt className="mx-auto mb-6 text-8xl text-blue-400" />
          <h2 className="text-3xl font-bold">Drag & Drop Image Here</h2>
          <p className="mt-3 text-gray-400">PNG • JPG • JPEG</p>
          <p className="mt-2 text-sm text-gray-500">Maximum size 10 MB</p>
        </div>

        {/* Image Preview */}
        {image && (
          <img
            src={image}
            alt="Preview"
            className="mt-8 w-full rounded-2xl"
          />
        )}

        {/* Analyze Button */}
        <button
          onClick={analyzeImage}
          disabled={loading}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 py-4 text-lg font-semibold"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              Analyze with AI
              <FaArrowRight />
            </>
          )}
        </button>

        {/* AI Result Section */}
        {issueType && (
          <div className="mt-8 space-y-4">
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-5">
              <h3 className="mb-4 text-xl font-semibold text-blue-400">
                🤖 AI Analysis Result
              </h3>
              <p>
                <strong>Issue Type:</strong> {issueType}
              </p>
              <p className="mt-2">
                <strong>Severity:</strong> {severity}
              </p>
              <p className="mt-2">
                <strong>Description:</strong> {description}
              </p>
              {imageUrl && (
  <div className="mt-5">
    <p className="mb-3 text-cyan-300 font-semibold">
      ✅ Image uploaded successfully
    </p>

    <img
      src={imageUrl}
      alt="Uploaded"
      className="rounded-xl border border-cyan-500/30"
    />
  </div>
)}
            </div>

            {/* Detect Location Button */}
            <button
              onClick={detectLocation}
              disabled={!issueType}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-green-500/40 bg-green-500/10 py-4 text-lg font-semibold text-green-300 transition hover:bg-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaMapMarkerAlt />
              Detect My Location
            </button>

            {/* Location Display */}
            {(latitude || longitude) && (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-5">
                <h3 className="mb-4 text-xl font-semibold text-green-400">
                  Current Location
                </h3>
                <p>
                  <strong>Latitude:</strong> {latitude}
                </p>
                <p className="mt-2">
                  <strong>Longitude:</strong> {longitude}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={submitReport}
              disabled={!latitude || !longitude}
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 py-4 text-lg font-bold transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Report
            </button>
          </div>
        )}

      </motion.div>
    </div>
  );
}

export default ReportIssue;
