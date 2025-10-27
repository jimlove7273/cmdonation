export function handleError(error: unknown) {
  console.error(error);
  return Response.json(
    { error: error instanceof Error ? error.message : "Unknown error" },
    { status: 500 },
  );
}
