"use client";

import {
  useEffect,
  useState
} from "react";

import { useParams } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import {
  fetchSessionMedia,deleteMedia,fetchSessionById
} from "@/lib/api/alumniSessions";

import {
  getToken
} from "@/lib/auth";

export default function SessionMediaPage() {

  const params = useParams();
const [session, setSession] =
  useState<any>(null);
  const [media, setMedia] =
    useState<any[]>([]);

    const [selectedImage,
setSelectedImage] =
useState<string | null>(null);

  useEffect(() => {

    async function loadMedia() {

      try {

        

        const data =
          await fetchSessionMedia(
            Number(params.id),
            getToken() ?? ""
          );

        setMedia(data);
        const sessionData =await fetchSessionById(Number(params.id),getToken() ?? "");
        setSession(sessionData);

      } catch (error) {

        console.error(error);
      }
    }

    loadMedia();
    


  }, [params.id]);


  const currentUser = JSON.parse(
  localStorage.getItem("alumni_user") || "{}"
);

const isCreator =
  session?.createdBy?.email ===
  currentUser.email;
const handleDelete =
async (
  mediaId:number
) => {

  try {

    await deleteMedia(
      mediaId,
      getToken() ?? ""
    );

    setMedia(
      media.filter(
        m => m.id !== mediaId
      )
    );

  } catch {

    alert(
      "Delete Failed"
    );
  }
};
  return (
    <>
      <Navbar />

      <div
        className="
          max-w-6xl
          mx-auto
          py-10
          px-4
        "
      >

        <h1
          className="
            text-3xl
            font-bold
            mb-8
          "
        >
          Session Media
        </h1>

        <div
          className="
            grid
            md:grid-cols-3
            gap-5
          "
        >

          {media.map((item) => (

            <div
              key={item.id}
              className="
                rounded-xl
                overflow-hidden
                shadow
                border
              "
            >

              <img
  src={item.mediaUrl}
  alt=""
  onClick={() =>
    setSelectedImage(
      item.mediaUrl
    )
  }
  className="
    w-full
    h-64
    object-cover
    cursor-pointer
  "
/>
{isCreator &&
(<button
  onClick={() =>
    handleDelete(item.id)
  }
  className="
    w-full
    bg-red-600
    text-white
    py-2
  "
>
  Delete
</button>)
}


            </div>

          ))}

        </div>

      </div>
      {
selectedImage && (

<div
  className="
    fixed
    inset-0
    bg-black/90
    flex
    items-center
    justify-center
    z-50
  "
  onClick={() =>
    setSelectedImage(null)
  }
>

<img
  src={selectedImage}
  alt=""
  className="
    max-w-[90vw]
    max-h-[90vh]
  "
/>

</div>

)}

      <Footer />
    </>
  );
}