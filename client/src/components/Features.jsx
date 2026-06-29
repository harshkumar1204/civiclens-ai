import {
  FaCamera,
  FaMapMarkedAlt,
  FaUsers,
  FaChartBar,
  FaRobot,
  FaMapMarkerAlt,
} from "react-icons/fa";

const features = [
  {
    icon: <FaCamera />,
    title: "AI Issue Detection",
    desc: "Upload an image and let AI identify the issue automatically.",
  },
  {
    icon: <FaMapMarkedAlt />,
    title: "Live Community Map",
    desc: "View reported issues on an interactive map.",
  },
  {
    icon: <FaUsers />,
    title: "Community Verification",
    desc: "Nearby citizens can verify and validate reports.",
  },
  {
    icon: <FaChartBar />,
    title: "Analytics Dashboard",
    desc: "Track issue trends and resolution progress.",
  },
  {
    icon: <FaRobot />,
    title: "AI Smart Priority",
    desc: "AI decides which issues need urgent attention.",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Geo Location",
    desc: "Automatically attach location to every report.",
  },
];

function Features() {
  return (
    <section className="features">
      <h2>Why CivicLens AI?</h2>

      <div className="feature-grid">
        {features.map((feature, index) => (
          <div className="card" key={index}>
            <div className="icon">{feature.icon}</div>

            <h3>{feature.title}</h3>

            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;