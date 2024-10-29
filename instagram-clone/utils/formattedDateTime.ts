export function formatDateTime(data) {
  const date = new Date();
  const formattedDate = new Intl.DateTimeFormat("ko-KR", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(date);

  return formattedDate;
}
