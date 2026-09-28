(function () {
  "use strict";

  var STORAGE_KEY = "portfolio-theme";
  var root = document.documentElement;
  var themeToggle = document.getElementById("theme-toggle");
  var navToggle = document.querySelector(".nav__toggle");
  var navMenu = document.getElementById("nav-menu");
  var navLinks = document.querySelectorAll(".nav__link");

  function getPreferredTheme() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      themeToggle.setAttribute("aria-label", "Switch to light theme");
    } else {
      root.removeAttribute("data-theme");
      themeToggle.setAttribute("aria-label", "Switch to dark theme");
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }

  function initTheme() {
    applyTheme(getPreferredTheme());
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }

  function closeMobileNav() {
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  function initMobileNav() {
    navToggle.addEventListener("click", function () {
      var expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navMenu.classList.toggle("is-open", !expanded);
      navToggle.setAttribute("aria-label", expanded ? "Open menu" : "Close menu");
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        var href = link.getAttribute("href");
        if (href && href.charAt(0) === "#" && href.length > 1) {
          var target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            if (history.pushState) {
              history.pushState(null, "", href);
            } else {
              location.hash = href;
            }
          }
        }
        if (window.matchMedia("(max-width: 767px)").matches) {
          closeMobileNav();
        }
      });
    });

    var logoLink = document.querySelector(".nav__logo");
    if (logoLink) {
      logoLink.addEventListener("click", function (e) {
        var href = logoLink.getAttribute("href");
        if (href && href.charAt(0) === "#" && href.length > 1) {
          var target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            if (history.pushState) {
              history.pushState(null, "", href);
            }
          }
        }
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navMenu.classList.contains("is-open")) {
        closeMobileNav();
        navToggle.focus();
      }
    });
  }

  function initScrollSpy() {
    var sections = document.querySelectorAll("main section[id]");

    if (!("IntersectionObserver" in window)) {
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }
          var id = entry.target.getAttribute("id");
          navLinks.forEach(function (link) {
            var href = link.getAttribute("href");
            link.classList.toggle("is-active", href === "#" + id);
          });
        });
      },
      {
        rootMargin: "-" + getComputedStyle(document.documentElement).getPropertyValue("--nav-height").trim() + " 0px -55% 0px",
        threshold: 0
      }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  initTheme();
  initMobileNav();
  initScrollSpy();
})();
