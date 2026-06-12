'use server'

import { serverMutation } from "../core/server";

// const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
export const createJob = async (newJobData) => {
    return serverMutation('/api/jobs', newJobData, 'POST');
}
