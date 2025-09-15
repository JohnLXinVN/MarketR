export async function GET() {
  try {
    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,cca2"
    );
    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    return Response.json(
      { error: "Failed to fetch countries" },
      { status: 500 }
    );
  }
}
