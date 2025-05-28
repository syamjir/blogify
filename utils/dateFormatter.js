// ========================
// Format Date Utility
// ========================
// Converts a date string into a human-readable format:
// Example: "2025-05-28T12:00:00Z" → "May 28, 2025"

function dateFormatter(dateString) {
  const date = new Date(dateString);

  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return formattedDate;
}
module.exports = dateFormatter;
