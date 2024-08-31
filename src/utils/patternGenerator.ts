export function createPattern(calendarType: string, index: number): string {
  const sunPattern = `
    M5,5 m-4,0 a4,4 0 1,1 8,0 a4,4 0 1,1 -8,0
    M5,1 L5,2 M8,2 L9,1 M2,8 L1,9 M8,8 L9,9 M2,2 L1,1
    M5,8 L5,9 M1,5 L2,5 M8,5 L9,5
    M3.5,3.5 L6.5,6.5 M3.5,6.5 L6.5,3.5
  `;

  const moonPattern = `
    M5,2 a3,3 0 0,1 0,6 a3,3 0 0,0 0,-6
    M3,4 L3,6 M7,4 L7,6
    M4,3.5 L6,3.5 M4,6.5 L6,6.5
  `;

  const basePatterns = [
    "M0,0 L10,10 M10,0 L0,10 M5,0 L5,10 M0,5 L10,5", // Cross
    "M0,5 A5,5 0 1,1 10,5 A5,5 0 1,1 0,5 M5,0 L5,10 M0,5 L10,5", // Circle with cross
    "M0,0 L10,10 M10,0 L0,10 M0,0 L10,0 L10,10 L0,10 Z", // Diamond
    "M2,2 L8,2 L8,8 L2,8 Z M0,0 L10,10 M10,0 L0,10", // Square with X
    "M5,0 L10,10 L0,10 Z M0,0 L10,0 M0,10 L10,10", // Triangle
    "M0,5 Q5,0 10,5 Q5,10 0,5 M0,0 L10,10 M10,0 L0,10", // Eye
    "M0,0 L3,5 L0,10 M10,0 L7,5 L10,10 M3,0 L7,10 M7,0 L3,10", // Star
  ];

  if (calendarType.toLowerCase().includes("solar")) {
    return sunPattern;
  } else if (calendarType.toLowerCase().includes("lunar")) {
    return moonPattern;
  } else {
    return basePatterns[index % basePatterns.length];
  }
}
