"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { uploadSessionPhoto } from "@/lib/api/alumniSessions";

import { getToken } from "@/lib/auth";

export default function UploadMediaPage() {
  const params = useParams();

  const router = useRouter();

  const [files, setFiles] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (files.length === 0) {
      alert("Select a photo");
      return;
    }
    setLoading(true);
    try {
      await Promise.all(
        files.map((file) =>
          uploadSessionPhoto(Number(params.id), file, getToken() ?? ""),
        ),
      );

      alert("Uploaded");
    } catch {
      alert("Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="
          max-w-3xl
          mx-auto
          py-10
          px-4
        "
      >
        <h1
          className="
            text-3xl
            font-bold
            mb-6
          "
        >
          Upload Session Media
        </h1>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
        />
        <div className="grid grid-cols-3 gap-4 mt-6">
          {files.map((file, index) => (
            <img
              key={index}
              src={URL.createObjectURL(file)}
              className="
        h-40
        w-full
        object-cover
        rounded-lg
      "
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="
            block
            mt-6
            bg-yellow-500
            px-6
            py-3
            rounded
            font-semibold
          "
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      <Footer />
    </>
  );
}
