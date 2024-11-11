// hamburger menu
const hamburgerButton = document.querySelector("#btn-hamburger");
const sidebarLists = document.querySelector("#sidebar-lists");

const openSidebar = () => {
  sidebarLists.classList.remove("hidden");
  hamburgerButton.setAttribute("aria-expanded", true);
  hamburgerButton.querySelector(".sr-only").textContent = "Close menu";
};

const closeSidebar = () => {
  sidebarLists.classList.add("hidden");
  hamburgerButton.setAttribute("aria-expanded", false);
  hamburgerButton.querySelector(".sr-only").textContent = "Open menu";
};

const toggleSidebar = () => {
  const isSidebarExpanded =
    hamburgerButton.getAttribute("aria-expanded") === "true";

  if (isSidebarExpanded) {
    closeSidebar();
  } else {
    openSidebar();
  }
};

hamburgerButton.addEventListener("click", toggleSidebar);
