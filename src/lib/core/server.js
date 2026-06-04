const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;


export const serverFetch = async (path) => {
    const res = await fetch(`${serverUrl}${path}`);
    // handle 401, 404, 403
    return res.json();
}


export const serverMutation = async (path, data) => {
    const res = await fetch(`${serverUrl}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    // handle 401, 404, 403

    return res.json();
}