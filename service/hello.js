import { HttpError } from "../core/server/error.js";

export default {
    /**
     * 
     * @param {URLSearchParams} query
     * @param {Object} body
     */
    "/hello": function (_method, query, body) {
        const r = {}
        for(const [key, value] of query.entries()) { // each 'entry' is a [key, value] tupple
            r[key] = value;
        }
        return Object.assign(r, body)
    },
    "/error": function (_method, _query, _body) {
        return new HttpError("failed to do something", 12345, 400, "failed to do something")
    },
    "/chunk": function (_method, _query, _body) {
        const stream = new ReadableStream({
            // type: "direct",
            async start(controller) {
                const encoder = new TextEncoder();
                for (let i=0;i<100;++i) {
                    controller.enqueue(encoder.encode(`event: data\ndata: ${i}\n\n`))
                    // controller.flush()
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
                controller.close()
            },
        })
        return new Response(stream, {
            headers: {
                "content-type": "text/event-stream",
                // "content-type": "application/json",
                "transfer-encoding": "chunked",
            }
        })
    }
}