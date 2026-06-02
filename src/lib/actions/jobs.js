'use server'

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
export const createJob = async (newJobData) => {
    const res = await fetch(`${serverUrl}/api/jobs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newJobData),
    });

    return res.json();
}