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

export const AVATARS = [
  { name: "blackbird", src: "/avatars/blackbird.png" },
  { name: "crow", src: "/avatars/crow.png" },
  { name: "duck", src: "/avatars/duck.png" },
  { name: "hummingbird", src: "/avatars/hummingbird.png" },
  { name: "kiwi", src: "/avatars/kiwi.png" },
  { name: "mallard", src: "/avatars/mallard.png" },
  { name: "robin", src: "/avatars/robin.png" },
  { name: "oriole", src: "/avatars/oriole.png" },
  { name: "sparrow", src: "/avatars/sparrow.png" },
  { name: "stork", src: "/avatars/stork.png" },
  { name: "tit", src: "/avatars/tit.png" },
  { name: "white-owl", src: "/avatars/white-owl.png" },
];

export function resolveColor(name) {
  return COLORS.find((color) => color.name === name).value;
}
