const INGREDIENTS = [
  "a",
  "b",
  "z"
];

function getsoup() {
  var i1 = INGREDIENTS[Math.floor(Math.random * INGREDIENTS.length)];  // pick random ingredient

  var soup_name = i1 + " soup";

  document.getElementById("soupName").innerText = soup_name;
}