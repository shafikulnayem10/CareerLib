import { serverFetch } from "../core/server";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export const getJobs = async (queryString) =>{
    return serverFetch(`/api/jobs?${queryString}`);
}

export const getJobById = async (jobId) => {
    return serverFetch(`/api/jobs/${jobId}`);
}

export const getCompanyJobs = async (companyId, status = 'active') => {
    const res = await fetch(`${serverUrl}/api/jobs?companyId=${companyId}&status=${status}`);
    return res.json();
}