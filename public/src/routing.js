import { Router } from "@vaadin/router";
import "../views/shiftSchedule-view";

window.addEventListener("load", () => {
  initRouter();
});

function initRouter() {
  const router = new Router(document.querySelector("main"));
  router.setRoutes([
    {
      path: "/",
      component: "shift-schedule",
      action: () => {
        activeMenuItem("schedule");
      },
    },
    {
      path: "/employees",
      component: "employees-view",
      action: () => {
        import("../views/employees-view");
        activeMenuItem("employees");
      },
    },
    {
      path: "(.*)",
      component: "not-found-view",
      action: () => {
        import("../views/not-found-view");
      },
    },
  ]);
}

function activeMenuItem(itemId) {
  const activeButton = document.getElementById(itemId);

  // Get all buttons with class="btn" inside the container
  var btns = document.getElementsByClassName("button");

  for (var i = 0; i < btns.length; i++) {
    if (btns[i].id === itemId) {
      btns[i].className += " active";
    } else {
      btns[i].className = "button";
    }
  }
}
