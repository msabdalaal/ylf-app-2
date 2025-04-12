import { getValueFor } from "@/hooks/storage";

export default async function uploadFile(
  uri: string,
  mimeType: string,
  name: string
) {
  const realFormData = new FormData();
  realFormData.append("file", {
    uri: uri,
    type: mimeType,
    name: name,
  } as any);
  const token = await getValueFor("token");
  const response = await fetch("https://test.ylf-eg.org/api/upload/file", {
    method: "POST",
    body: realFormData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (response.ok) {
    return data.path;
  } else {
    alert(data.message);
  }
}
