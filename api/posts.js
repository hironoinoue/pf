export default async function handler(req, res) {
    try {
        const response = await fetch(process.env.MICROCMS_API_URL, {
            headers: {
                "X-MICROCMS-API-KEY":process.env.MICROCMS_API_KEY,
            },
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}