
// 数字字符串，比如常见的id
export const numStr = (str: string): boolean => /^\d+$/.test(str)

// Boolean字符串，true/True/false/False
export const boolStr = (str: string): boolean => str.toLocaleLowerCase() === 'true' || str.toLocaleLowerCase() === 'false'