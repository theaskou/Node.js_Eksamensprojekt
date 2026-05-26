export const COLORS = [
  { name: "turquoise", value: "#58B99E" },
  { name: "light-blue", value: "#B4F2FB" },
  { name: "blue", value: "#5098D6" },
  { name: "purple", value: "#925FB1" },
  { name: "dark-green", value: "#3C8725" },
  { name: "green", value: "#56AB68" },
  { name: "cobalt", value: "#1855E6" },
  { name: "lime", value: "#90CC3F" },
  { name: "yellow", value: "#EBC545" },
  { name: "orange", value: "#D9833B" },
  { name: "red", value: "#D65746" },
  { name: "dark-red", value: "#B24334" },
];

export function resolveColor(name) {
  return COLORS.find((color) => color.name === name).value;
}
