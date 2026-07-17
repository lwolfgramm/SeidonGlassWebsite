const filters = [...document.querySelectorAll(".portfolio-filter")];
const projects = [...document.querySelectorAll(".project-card")];

filters.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;
    filters.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));

    projects.forEach((project) => {
      const show = selected === "all" || project.dataset.category.split(" ").includes(selected);
      project.hidden = !show;
    });
  });
});
