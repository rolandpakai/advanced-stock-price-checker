import { calculateAverage } from "./calculateAverage";

describe("calculateAverage", () => {
  describe("valid inputs", () => {
    test("should calculate average of numbers", () => {
      const numbers = [1, 2, 3, 4, 5];
      const result = calculateAverage(numbers);
      expect(result).toBe(3);
    });

    test("should calculate average of a single number", () => {
      const numbers = [42];
      const result = calculateAverage(numbers);
      expect(result).toBe(42);
    });

    test("should return 0 for empty array", () => {
      const numbers: number[] = [];
      const result = calculateAverage(numbers);
      expect(result).toBe(0);
    });
  });
});
