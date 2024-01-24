import { nanoid, customAlphabet } from "nanoid"

const prettyNanoid = customAlphabet('1234567890abcdef', 10);

/**
 * Generate unique id
 * @param size 
 * @returns 
 */
export function generate_id(size?: number): string {
    if(size == undefined){
        return nanoid();
    }else{
        return nanoid(size);
    }
}


export function generate_pretty_id(size?: number): string {
    if(size == undefined){
        return prettyNanoid();
    }else{
        return prettyNanoid(size);
    }
}

