/**
 * Roles
 */
export const ROLE_CUST = "CUST";
export const ROLE_ROOT = "ROOT";
export const ROLE_ADMN = "ADMN";
export const ROLE_MERT = "MERT";
export const ROLE_MANR = "MANR";
export const ROLE_STAF = "STAF";
/**
 * Return ttl, unit is hour
 * @param roleId
 * @returns
 */
export const get_session_ttl = (roleId) => {
    switch (roleId) {
        case ROLE_ROOT:
            return 1 * 60 * 60;
        case ROLE_ADMN:
            return 8 * 60 * 60;
        case ROLE_MERT:
            return 8 * 60 * 60;
        case ROLE_MANR:
            return 8 * 60 * 60;
        case ROLE_STAF:
            return 8 * 60 * 60;
        case ROLE_CUST:
            return 24 * 60 * 60;
    }
    return 0;
};
;
export const ROLES_WITH_AMDIN = [ROLE_ROOT, ROLE_ADMN];
/**
 * Judge if allow based on role
 * @param role
 * @param allows
 * @returns
 */
export const allowByRole = (role, allows) => {
    return allows.includes(role);
};
/**
 * Product status
 */
export const PRODUCT_INITIAL = "INITIAL";
export const PRODUCT_ONLINE = "ONLINE";
export const PRODUCT_OFFLINE = "OFFLINE";
