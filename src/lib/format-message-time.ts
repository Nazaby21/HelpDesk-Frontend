export function formatMessageTime(timestamp: string) {
  const messageDate = new Date(timestamp);
  const now = new Date();
  
  // If the server and client are comparing with Date.now(), hydration mismatch could still happen
  // However, fixing the timezone and locale is the main goal here.
  const diffInMinutes = Math.floor(
    (now.getTime() - messageDate.getTime()) / (60 * 1000),
  );
  const diffInDays = Math.floor(diffInMinutes / (60 * 24));

  if (diffInDays === 0) {
    if (diffInMinutes < 60) {
      return diffInMinutes === 0 ? "just now" : `${diffInMinutes}m`;
    }
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Phnom_Penh"
    }).format(messageDate);
  }

  if (diffInDays < 7) {
    return new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "Asia/Phnom_Penh" }).format(messageDate);
  }

  if (messageDate.getFullYear() === now.getFullYear()) {
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      timeZone: "Asia/Phnom_Penh"
    }).format(messageDate);
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Phnom_Penh"
  }).format(messageDate);
}

