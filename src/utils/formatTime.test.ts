import formatTime from "./formatTime";

describe("formatTime", () => {
  it("formats milliseconds as hh:mm:ss", () => {
    expect(formatTime(0)).toBe("00:00:00");
    expect(formatTime(65_000)).toBe("00:01:05");
    expect(formatTime(3_600_000)).toBe("01:00:00");
  });

  it("formats label variant", () => {
    expect(formatTime(0, true)).toBe(" 0min 0s");
    expect(formatTime(3_600_000, true)).toBe("1h 0min 0s");
    expect(formatTime(3_600_000 + 120_000 + 5_000, true)).toBe("1h 2min 5s");
  });
});

