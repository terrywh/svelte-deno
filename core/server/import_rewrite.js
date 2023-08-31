import { basename } from "https://deno.land/std@0.200.0/path/mod.ts";
import { init, parse } from "npm:es-module-lexer";

await init

export function rewrite(code, path, rewriteHandler) {
    if (!rewriteHandler) rewriteHandler = defaultHandler
    const [is] = parse(code, basename(path))
    let r = "", o = 0
    for (const i of is) {
        r += code.substring(o, i.s)
        o = i.e
        r += rewriteHandler(i.n, defaultHandler) || "<unknown-module-path>"
    }
    r += code.substring(o)
    return r
}

export function defaultHandler(n) {
    if (n.startsWith("/") || n.startsWith("./") || n.startsWith("../")) // 相对或绝对路径保持不变
        return n
    return `/@module/${n}/index.mjs` // 访问非 JS 文件 | 内部包，补充完整路径
}