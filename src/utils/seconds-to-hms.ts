function secondsToHms(seconds: number) {
  const date = new Date(seconds * 1000); // Convert seconds to milliseconds
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes().toString().padStart(2, "0");
  const ss = date.getUTCSeconds().toString().padStart(2, "0");

  let formattedTime = `${mm}:${ss}`;

  if (hh > 0) {
    formattedTime = `${hh}:${formattedTime}`;
  }

  return formattedTime;
}
export default secondsToHms