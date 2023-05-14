import { env } from "@/env.mjs"
import { log } from "console";

export const getmyenv = () => {
    log(env.NODE_ENV);
    return env.NODE_ENV;
}