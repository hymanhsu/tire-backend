import {get_session_ttl} from "../constants"


describe('constants module', () => {
    test('get_session_ttl', () => {
        expect(get_session_ttl("ROOT")).toBe(1);
        expect(get_session_ttl("ADMN")).toBe(8);
        expect(get_session_ttl("MERT")).toBe(8);
        expect(get_session_ttl("MANR")).toBe(8);
        expect(get_session_ttl("STAF")).toBe(8);
        expect(get_session_ttl("CUST")).toBe(24);
    });


});
