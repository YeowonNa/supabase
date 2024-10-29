export function formatDateTime(data) {
  const date = new Date(data);
  const formattedDate = new Intl.DateTimeFormat("ko-KR", {
    hour: "numeric",
    minute: "numeric",
  }).format(date);

  return formattedDate;
}
