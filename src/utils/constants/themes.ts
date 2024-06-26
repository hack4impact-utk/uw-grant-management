const theme = {
  primaryBlue: '#005191',
  primaryBlueRGBA: (percent: number) =>
    `rgba(0, 81, 145, .${percent.toFixed(0)})`,
  primaryYellow: '#FFB351',
  primaryYellowRGBA: (percent: number) =>
    `rgba(255, 179, 81, .${percent.toFixed(0)})`,
  whiteRGBA: (percent: number) => `rgba(255, 255, 255, .${percent.toFixed(0)})`,
  primaryGray: '#778899',
  primaryGrayHsl: (percent: number) => `hsl(210, 14%, ${percent.toFixed(0)}%)`,
};
export default theme;
