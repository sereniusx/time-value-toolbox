export async function onRequest(context) {
    const { request, env } = context;

    if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    let payload;
    try {
        payload = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: "bad_json" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    const messages = payload?.messages;
    if (!Array.isArray(messages)) {
        return new Response(JSON.stringify({ error: "missing_messages" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    const resp = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
            model: "deepseek-chat",
            messages,
            temperature: 0.6
        })
    });

    const text = await resp.text();

    return new Response(text, {
        status: resp.status,
        headers: {
            "Content-Type": "application/json"
        }
    });
}
