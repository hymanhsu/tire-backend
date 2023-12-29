import { nanoid } from "nanoid"

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


