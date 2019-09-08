module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'clover'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.([tj]sx?)$',
  coverageThreshold: {
    global: {
      statements: 65,
      branches: 65,
      functions: 65,
      lines: 65,
    },
  },
};
