import {objToQueryStr} from './objToQueryStr'

describe('objToQueryStr', () => {
    test('should return string', () => {
        expect(typeof objToQueryStr()).toBe('string')
        expect(typeof objToQueryStr({})).toBe('string')
        expect(typeof objToQueryStr(null)).toBe('string')
        expect(typeof objToQueryStr({foo: 'baz'})).toBe('string')
    })

    test('should ignore falsy values and empty objects', () => {
        expect(objToQueryStr(null)).toBe('')
        expect(objToQueryStr(undefined)).toBe('')
        expect(objToQueryStr({})).toBe('')
        expect(objToQueryStr({foo: 'baz', bim: null, bam: undefined, foobar: 0})).toBe('?foo=baz&foobar=0')
    })

    test('should handle keys and values with spaces', () => {
        expect(objToQueryStr({"some key": "some value"}))
            .toBe(`?${encodeURIComponent('some key')}=${encodeURIComponent('some value')}`)
    })

    test('should return correct string', () => {
        expect(objToQueryStr({
            foo: "bar", "some thing": "something", abc: ['1', '2b', '3 c'], 
            empty: undefined, nullable: null, correct: true, uncorrect: false, n: 12, k: 0
        })).toBe('?foo=bar&some%20thing=something&abc=1&abc=2b&abc=3%20c&correct=true&n=12&k=0')
    })
})