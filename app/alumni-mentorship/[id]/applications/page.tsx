"use client";

import { useEffect,useState } from "react";

import { useParams } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import {
    getApplicants
} from "@/lib/api/mentorship";

import {
    MentorshipApplication
} from "@/lib/types/mentorship";

import {
    getToken
} from "@/lib/auth";

export default function ApplicationsPage(){

    const params =
        useParams();

    const [applications,setApplications] =
        useState<MentorshipApplication[]>([]);

    const [loading,setLoading] =
        useState(true);

    useEffect(()=>{

        async function load(){

            try{

                const data =
                    await getApplicants(

                        Number(params.id),

                        getToken() ?? ""

                    );

                setApplications(data);

            }finally{

                setLoading(false);

            }

        }

        load();

    },[]);

    return(

        <>

        <Navbar/>

        <div className="max-w-7xl mx-auto py-10 px-6">

            <h1 className="text-4xl font-bold mb-8">

                Applications

            </h1>

            {

                loading

                ?

                <div>

                    Loading...

                </div>

                :

                <div className="overflow-auto">

                    <table className="min-w-full border">

                        <thead>

                        <tr
                        className="bg-gray-100">

                            <th className="border p-3">

                                Student

                            </th>

                            <th className="border p-3">

                                Email

                            </th>

                            <th className="border p-3">

                                Branch

                            </th>

                            <th className="border p-3">

                                Batch

                            </th>

                            <th className="border p-3">

                                Motivation

                            </th>

                            <th className="border p-3">

                                Resume

                            </th>

                        </tr>

                        </thead>

                        <tbody>

                        {

                            applications.map(app=>(

                                <tr
                                key={app.applicationId}>

                                    <td className="border p-3">

                                        {app.fullName}

                                    </td>

                                    <td className="border p-3">

                                        {app.email}

                                    </td>

                                    <td className="border p-3">

                                        {app.branch}

                                    </td>

                                    <td className="border p-3">

                                        {app.batchYear}

                                    </td>

                                    <td className="border p-3 max-w-md">

                                        {app.motivation}

                                    </td>

                                    <td className="border p-3">

                                        {

                                            app.resumeUrl

                                            ?

                                            <a

                                                href={app.resumeUrl}

                                                target="_blank"

                                                className="text-blue-600 underline"

                                            >

                                                View Resume

                                            </a>

                                            :

                                            "No Resume"

                                        }

                                    </td>

                                </tr>

                            ))

                        }

                        </tbody>

                    </table>

                </div>

            }

        </div>

        <Footer/>

        </>

    );

}