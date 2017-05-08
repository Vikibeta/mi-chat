// 1995-01-01 => 23岁     2017(currentYear) - 1995 + 1 = 23

export default function (birth) {
  let birthYear = birth.substr(0, 4);
  let currentYear = new Date().getFullYear();
  return currentYear - birthYear + 1;
}
