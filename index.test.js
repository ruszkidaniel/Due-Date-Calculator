const calculateDueDate = require('./index');

describe('The due date calculator', () => {

    it('only accepts Date type submitDates with number type turnaroundTime', () => {
        
        expect(() => calculateDueDate("", 1))
            .toThrow('Invalid type of submitDate.');

        expect(() => calculateDueDate(new Date(), ""))
            .toThrow('Invalid type of turnaroundTime.');

    });

    it('asserts when turnaroundTime is negative', () => {

        expect(() => calculateDueDate(new Date(), -1))
            .toThrow('Turnaround time must be larger than 0.');

    });

    it('only accepts working hours', () => {
        [
            [2021, 5, 28, 7, 0],
            [2021, 5, 28, 8, 0],
            [2021, 5, 28, 17, 0],
            [2021, 5, 28, 18, 0]
        ].forEach(testCase => {
            expect(() => calculateDueDate(new Date(...testCase), 1))
                .toThrow('Submit hour must be in the working hour range.');
        });
    });

    it('can calculate same day due dates', () => {
        [
            [[2021, 5, 28, 9, 0], 1, [2021, 5, 28, 10, 0]],
            [[2021, 5, 28, 9, 0], 2, [2021, 5, 28, 11, 0]],
            [[2021, 5, 28, 9, 0], 3, [2021, 5, 28, 12, 0]],
            [[2021, 5, 28, 15, 0], 1, [2021, 5, 28, 16, 0]],
            [[2021, 5, 28, 15, 0], 2, [2021, 5, 28, 17, 0]]
        ].forEach(testCase => {
            expect(calculateDueDate(new Date(...testCase[0]), testCase[1]))
                .toEqual(new Date(...testCase[2]));
        });
    });

    it('can overflow to other days', () => {
        [
            [[2021, 5, 28, 10, 0], 7, [2021, 5, 28, 17, 0]],
            [[2021, 5, 28, 10, 0], 8, [2021, 5, 29, 10, 0]],
            [[2021, 5, 28, 10, 0], 9, [2021, 5, 29, 11, 0]],
            [[2021, 5, 28, 16, 0], 2, [2021, 5, 29, 10, 0]],
            [[2021, 5, 28, 16, 0], 3, [2021, 5, 29, 11, 0]],
        ].forEach(testCase => {
            expect(calculateDueDate(new Date(...testCase[0]), testCase[1]))
                .toEqual(new Date(...testCase[2]));
        });
    });

    it('can overflow multiple days', () => {
        [
            [[2021, 5, 28, 10, 0], 16, [2021, 5, 30, 10, 0]],
            [[2021, 5, 28, 9, 0], 16, [2021, 5, 29, 17, 0]], // edge case
            [[2021, 5, 28, 9, 0], 17, [2021, 5, 30, 10, 0]],
            [[2021, 5, 28, 9, 0], 32, [2021, 6,  1, 17, 0]], // edge case
            [[2021, 5, 28, 9, 0], 35, [2021, 6,  2, 12, 0]],
        ].forEach(testCase => {
            expect(calculateDueDate(new Date(...testCase[0]), testCase[1]))
                .toEqual(new Date(...testCase[2]));
        });
    });

    it('can skip weekends', () => {
        [
            [[2021, 5, 25, 16, 0], 2, [2021, 5, 28, 10, 0]],
            [[2021, 5, 24, 9, 0], 32, [2021, 5, 29, 17, 0]],
            [[2021, 5, 24, 9, 1], 32, [2021, 5, 30,  9, 1]],
            [[2021, 5, 24, 9, 0], 33, [2021, 5, 30, 10, 0]],
        ].forEach(testCase => {
            expect(calculateDueDate(new Date(...testCase[0]), testCase[1]))
                .toEqual(new Date(...testCase[2]));
        });
    });

    it('can skip multiple weekends', () => {
        [
            [[2021, 5,  7, 9, 0], 120, [2021, 5, 25, 17, 0]],
            [[2021, 5,  7, 9, 0], 121, [2021, 5, 28, 10, 0]],
        ].forEach(testCase => {
            expect(calculateDueDate(new Date(...testCase[0]), testCase[1]))
                .toEqual(new Date(...testCase[2]));
        });
    });

    it('ignores holidays', () => {
        [
            [[2021, 11, 23, 9, 0], 8, [2021, 11, 23, 17, 0]],
            [[2021, 11, 23, 9, 1], 32, [2021, 11, 29, 9, 1]],
            [[2021, 11, 23, 9, 0], 32, [2021, 11, 28, 17, 0]], // edge case
        ].forEach(testCase => {
            expect(calculateDueDate(new Date(...testCase[0]), testCase[1]))
                .toEqual(new Date(...testCase[2]));
        });
    });

});