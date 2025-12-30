export function formatMessageTime(date) {
  if (!date) return "Invalid date";
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }
  return parsedDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}