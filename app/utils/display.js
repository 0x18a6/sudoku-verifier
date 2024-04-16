export const display = (container, msg) => {
  const c = document.getElementById(container);
  const p = document.createElement("p");
  p.textContent = msg;
  c.appendChild(p);
};
