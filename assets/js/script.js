'use strict';

// Element toggle function
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

// Sidebar toggle
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

if (sidebar && sidebarBtn) {
  sidebarBtn.addEventListener("click", function () {
    elementToggleFunc(sidebar);
  });
}

// Form validation
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

if (form && formInputs && formBtn) {
  formInputs.forEach(input => {
    input.addEventListener("input", function () {
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }
    });
  });
}

// Page navigation
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const target = (this.getAttribute("data-page-target") || this.textContent || "").trim().toLowerCase();

    for (let j = 0; j < navigationLinks.length; j++) {
      const btnTarget = (navigationLinks[j].getAttribute("data-page-target") || navigationLinks[j].textContent || "").trim().toLowerCase();
      if (btnTarget === target) {
        navigationLinks[j].classList.add("active");
      } else {
        navigationLinks[j].classList.remove("active");
      }
    }

    for (let k = 0; k < pages.length; k++) {
      const pageTarget = (pages[k].getAttribute("data-page") || "").trim().toLowerCase();
      if (pageTarget === target) {
        pages[k].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[k].classList.remove("active");
      }
    }
  });
}

// Filter functionality
const filterSelect = document.querySelector('[data-select]');
const selectValue = document.querySelector('[data-selecct-value]');

if (filterSelect) {
  filterSelect.addEventListener('click', function () {
    elementToggleFunc(this);
  });
}

const initPortfolioFilter = function () {
  const filterButtons = document.querySelectorAll('[data-filter-btn]');
  const selectItems = document.querySelectorAll('[data-select-item]');
  const portfolioItems = document.querySelectorAll('.project-list .project-item');

  const filterFunc = function (selectedValue) {
    for (let i = 0; i < portfolioItems.length; i++) {
      const item = portfolioItems[i];
      const itemCategory = (item.getAttribute('data-category') || '').toLowerCase();
      const categories = itemCategory.split(/\s+/);
      if (selectedValue === 'all' || categories.includes(selectedValue)) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    }
  };

  filterButtons.forEach(button => {
    button.addEventListener('click', function () {
      const category = (this.getAttribute('value') || this.value || '').trim().toLowerCase();
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      if (selectValue) {
        selectValue.innerText = this.innerText;
      }
      filterFunc(category);
    });
  });

  selectItems.forEach(item => {
    item.addEventListener('click', function () {
      const category = (this.getAttribute('value') || this.value || '').trim().toLowerCase();
      if (selectValue) {
        selectValue.innerText = this.innerText;
      }
      filterButtons.forEach(btn => {
        const btnVal = (btn.getAttribute('value') || btn.value || '').trim().toLowerCase();
        if (btnVal === category) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
      filterFunc(category);
      if (filterSelect) {
        filterSelect.classList.remove('active');
      }
    });
  });
};

window.initPortfolioFilter = initPortfolioFilter;
initPortfolioFilter();
