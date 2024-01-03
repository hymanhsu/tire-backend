/**
 * Roles
 */
export const ROLE_ROOT = "ROOT";
export const ROLE_ADMN = "ADMN";
export const ROLE_MERT = "MERT";
export const ROLE_MANR = "MANR";
export const ROLE_STAF = "STAF";
export const ROLE_CUST = "CUST";

/**
 * Return ttl, unit is hour
 * @param roleId 
 * @returns 
 */
export const get_session_ttl = (roleId: string) => {
    switch (roleId) {
        case ROLE_ROOT:
            return 1;
        case ROLE_ADMN:
            return 8;
        case ROLE_MERT:
            return 8;
        case ROLE_MANR:
            return 8;
        case ROLE_STAF:
            return 8;
        case ROLE_CUST:
            return 24;
    }
    return 0;
}

