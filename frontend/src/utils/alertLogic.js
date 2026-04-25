// export const getTempStatus = (t) => {
//   if (t > 50) return "red";
//   if (t >= 40) return "yellow";
//   return "green";
// };

// export const getSoilStatus = (s) => {
//   if (s >= 15 && s <= 20) return "red";
//   if (s > 20 && s <= 25) return "yellow";
//   return "green";
// };

// export const getSmokeStatus = (s) => {
//   if (s >= 300) return "red";
//   if (s >= 100) return "yellow";
//   return "green";
// };

// export const getFlameStatus = (flame) => {
//   const isFlame = flame === true || Number(flame) === 1;
//   return isFlame ? "red" : "green";
// };

// export const getZoneStatus = (data) => {
//   const temp = Number(data.temp) || 0;
//   const hum = Number(data.humidity) || 0;
//   const gas = Number(data.smoke) || 0;
//   const flame = data.flame === true || Number(data.flame) === 1;

//   // 🔴 CASE 3: FIRE DETECTED
//   if (flame) {
//     return "red";
//   }

//   // 🟡 CASE 2: HIGH RISK (PREDICTION)
//   if (
//     temp > 40 || // high temp
//     hum < 30 || // low humidity
//     gas > 800 // high gas
//   ) {
//     return "yellow"; // or "orange"
//   }

//   // 🟢 CASE 1: SAFE
//   return "green";
// };
// ─── Individual Sensor Status ───────────────────────────────────────────────

export const getTempStatus = (t) => {
  if (t > 40) return "red";       // HIGH RISK
  if (t >= 30) return "yellow";   // MODERATE
  return "green";                 // SAFE: < 30
};

export const getHumidityStatus = (h) => {
  if (h < 30) return "red";       // HIGH RISK
  if (h <= 50) return "yellow";   // MODERATE: 30–50
  return "green";                 // SAFE: > 50
};

export const getSmokeStatus = (s) => {
  if (s > 800) return "red";      // HIGH RISK
  if (s >= 700) return "yellow";  // MODERATE: 700–800
  return "green";                 // SAFE: < 700
};

export const getSoilStatus = (s) => {
  if (s < 20) return "red";       // too dry
  if (s <= 30) return "yellow";   // low
  return "green";                 // healthy
};

export const getFlameStatus = (flame) => {
  // Flame sensor: 1 = fire detected, 0 = no fire
  const isFlame = flame === true || Number(flame) === 1;
  return isFlame ? "red" : "green";
};

// ─── Zone Overall Status (3-Case Logic) ─────────────────────────────────────
//
//  CASE 1 → SAFE    : All params below threshold AND flame = 0
//  CASE 2 → HIGH RISK (Prediction) : Any param above threshold BUT flame = 0
//             → "Fire may occur within ~1 hour — take preventive action"
//  CASE 3 → FIRE DETECTED : flame = 1 (params may or may not be above threshold)
//

export const getZoneStatus = (data) => {
  const temp  = Number(data.temp)     || 0;
  const hum   = Number(data.humidity) || 0;
  const gas   = Number(data.smoke)    || 0;

  // Flame: 1 = fire, 0 = no fire (corrected logic)
  const flame = Number(data.flame) === 1 || data.flame === true;

  // ── CASE 3: FIRE DETECTED ──
  if (flame) {
    return "red"; // 🔴 Fire confirmed
  }

  // ── CASE 2: HIGH RISK PREDICTION ──
  const highTemp  = temp > 40;   // above HIGH RISK threshold
  const lowHum    = hum < 30;    // below SAFE threshold
  const highGas   = gas > 800;   // above HIGH RISK threshold

  if (highTemp || lowHum || highGas) {
    return "yellow"; // 🟡 Fire predicted — act now
  }

  // ── CASE 1: SAFE ──
  return "green"; // 🟢 All good
};

// ─── Human-readable zone message ────────────────────────────────────────────

export const getZoneMessage = (data) => {
  const status = getZoneStatus(data);
  switch (status) {
    case "red":
      return "🔥 FIRE DETECTED — Immediate action required!";
    case "yellow":
      return "⚠️ HIGH RISK — Fire predicted. Take preventive action now.";
    default:
      return "✅ All parameters normal. Zone is safe.";
  }
};