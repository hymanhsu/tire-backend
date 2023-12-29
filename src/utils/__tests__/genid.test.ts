import { generate_id } from "../genid";
import {log} from 'console';

describe('genid module', () => {
    test('generate_id', () => {
        const id = generate_id();
        log("generated id = "+id);
        expect(id.length).toBe(21);
    });

    test('generate_id with sie', () => {
        const id = generate_id(10);
        log("generated id = "+id);
        expect(id.length).toBe(10);
    });

});
