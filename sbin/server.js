import { resolve, fromFileUrl } from "https://deno.land/std@0.200.0/path/mod.ts";
import { serve } from "../core/server/main.js"
import { createSvelteServer } from "../core/server/static_server.js"
import { createRestfulServer } from "../core/server/restful_server.js"

const root = resolve(fromFileUrl(import.meta.url), "../..");

serve([
    createRestfulServer(Object.assign({}, 
        (await import("../service/hello.js")).default,
    )),
    createSvelteServer({
        static: `${root}/public`,
        module: `${root}/node_modules`, // => /@module
        compile: {
            dev: Deno.env.DEBUG ? true : false,
        }
    }),
    function(_url, _req) {
        return new Response("file not found", {status: 404})
    }
], {
    // hostname: "127.0.0.1",
    // port: 3000,
})