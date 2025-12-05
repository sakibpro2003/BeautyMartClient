export const uploadImage = async (file: File, folder: string) => {
  const data = new FormData();
  data.append("file", file);
  data.append("folder", folder);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: data,
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body?.error || "Failed to upload image.");
  }

  return body.url as string;
};
