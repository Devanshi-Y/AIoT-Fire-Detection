export const getTempStatus = (t) => {
  if (t > 50) return "red";
  if (t >= 40) return "yellow";
  return "green";
};

export const getSoilStatus = (s) => {
  if (s >= 15 && s <= 20) return "red";
  if (s > 20 && s <= 25) return "yellow";
  return "green";
};

export const getSmokeStatus = (s) => {
  if (s >= 300) return "red";
  if (s >= 100) return "yellow";
  return "green";
};

export const getFlameStatus = (f) => (f ? "red" : "green");

export const getZoneStatus = (statuses) => {
  const red = statuses.filter(s => s === "red").length;
  const yellow = statuses.filter(s => s === "yellow").length;

  if (red === statuses.length) return "red";
  if (yellow >= statuses.length / 2) return "yellow";
  return "green";
};