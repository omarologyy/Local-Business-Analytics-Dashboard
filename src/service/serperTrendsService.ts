const myHeaders = new Headers();
myHeaders.append("X-API-KEY", "1523539ec3aa99685b9fd7c469726682e4b62a4b");
myHeaders.append("Content-Type", "application/json");

const raw: string = JSON.stringify({
  q: "apple inc",
});

const requestOptions: RequestInit = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow",
};

try {
  const response: Response = await fetch(
    "https://google.serper.dev/search",
    requestOptions
  );
  const result: string = await response.text();
  console.log(result);
} catch (error) {
  console.error(error);
}
