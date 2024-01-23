import {declOfNum} from './declOfNum'

describe('declOfNum', () => {
    test('should return string', () => {
        expect(typeof declOfNum(123, ['a', 'b', 'c'])).toBe('string')
    })
    test('should return correct string with number', () => {
        expect(declOfNum(1, ['товар', 'товара', 'товаров'])).toBe("1 товар")
        expect(declOfNum(1021, ['товар', 'товара', 'товаров'])).toBe("1021 товар")

        expect(declOfNum(2, ['товар', 'товара', 'товаров'])).toBe("2 товара")
        expect(declOfNum(104, ['товар', 'товара', 'товаров'])).toBe("104 товара")


        expect(declOfNum(5, ['товар', 'товара', 'товаров'])).toBe("5 товаров")
        expect(declOfNum(120, ['товар', 'товара', 'товаров'])).toBe("120 товаров")
    })
})