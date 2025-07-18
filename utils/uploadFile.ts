import { del } from "@/hooks/axios";
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
  const response = await fetch("https://mobile.ylf-eg.org/api/upload/file", {
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
    console.log(data);
    alert(data.message);
  }
}

export async function deleteFile(uri: string) {
  try {
    await del("upload/delete", {
      path: uri,
    });
  } catch (error) {
    console.log(error);
  }
}
