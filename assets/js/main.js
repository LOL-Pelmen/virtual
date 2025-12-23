// Основные скрипты для сайта колледжа связи

// Инициализация при загрузке DOM
document.addEventListener("DOMContentLoaded", () => {
  // Плавный скролл и фиксированный хедер
  const header = document.querySelector("header");

  function updateHeader() {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  // Дебаунсинг для оптимизации скролла
  let scrollTimer;
  window.addEventListener("scroll", () => {
    if (scrollTimer) {
      clearTimeout(scrollTimer);
    }
    scrollTimer = setTimeout(updateHeader, 10);
  });

  updateHeader();

  // Анимация при скролле
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (elementTop < windowHeight - 100) {
        element.classList.add("visible");
      }
    });
  };

  window.addEventListener("scroll", animateOnScroll);
  animateOnScroll(); // Инициализация при загрузке

  // Подсветка активного пункта меню
  function highlightActiveMenu() {
    const currentPage = window.location.pathname.split("/").pop();
    document.querySelectorAll("nav a").forEach((link) => {
      link.classList.remove("active");
      const linkPage = link.getAttribute("href");
      if (
        linkPage === currentPage ||
        (currentPage === "" && linkPage === "index.html") ||
        (currentPage === "index.html" && linkPage === "index.html")
      ) {
        link.classList.add("active");
      }
    });
  }

  highlightActiveMenu();

  // Плавные ссылки для якорей
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // Параллакс эффект для героя
  const hero = document.querySelector(".hero");
  if (hero) {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      hero.style.transform = `translate3d(0, ${rate}px, 0)`;
    });
  }

  // Интерактивные карточки
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transition = "all 0.3s ease";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transition = "all 0.6s ease";
    });
  });

  // Анимация счетчиков (если есть на странице)
  const counters = document.querySelectorAll(".counter");
  if (counters.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.getAttribute("data-target"));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
              current += step;
              if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
              } else {
                counter.textContent = target;
              }
            };

            updateCounter();
            observer.unobserve(counter);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => observer.observe(counter));
  }

  // Интерактивная карта (если есть)
  const interactiveMap = document.querySelector(".interactive-map");
  if (interactiveMap) {
    const points = interactiveMap.querySelectorAll(".map-point");
    points.forEach((point) => {
      point.addEventListener("click", () => {
        const info = point.getAttribute("data-info");
        alert(info);
      });
    });
  }

  // Модальные окна
  const modalTriggers = document.querySelectorAll("[data-modal]");
  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const modalId = trigger.getAttribute("data-modal");
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  });

  // Закрытие модальных окон
  document.querySelectorAll(".modal-close").forEach((closeBtn) => {
    closeBtn.addEventListener("click", () => {
      const modal = closeBtn.closest(".modal");
      if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "auto";
      }
    });
  });

  // Закрытие модалки по клику вне её области
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      e.target.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });

  // Формы с валидацией
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      const requiredFields = form.querySelectorAll("[required]");
      let isValid = true;

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = "#ef4444";
        } else {
          field.style.borderColor = "";
        }
      });

      if (!isValid) {
        e.preventDefault();
        alert("Пожалуйста, заполните все обязательные поля");
      }
    });
  });

  // Динамическое обновление года в футере
  const yearSpan = document.querySelector("#current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Тёмная/светлая тема (если нужно)
  const themeToggle = document.querySelector("#theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme");
      localStorage.setItem(
        "theme",
        document.body.classList.contains("dark-theme") ? "dark" : "light"
      );
    });

    // Проверка сохранённой темы
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-theme");
    }
  }

  // Слайдеры (если есть)
  const sliders = document.querySelectorAll(".slider");
  sliders.forEach((slider) => {
    const slides = slider.querySelectorAll(".slide");
    const prevBtn = slider.querySelector(".slider-prev");
    const nextBtn = slider.querySelector(".slider-next");
    let currentSlide = 0;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.style.display = i === index ? "block" : "none";
      });
      currentSlide = index;
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        showSlide((currentSlide - 1 + slides.length) % slides.length);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        showSlide((currentSlide + 1) % slides.length);
      });
    }

    showSlide(0);
  });

  // Анимация логотипа
  const logo = document.querySelector(".logo");
  if (logo) {
    logo.addEventListener("mouseenter", () => {
      logo.style.transform = "scale(1.05)";
    });

    logo.addEventListener("mouseleave", () => {
      logo.style.transform = "scale(1)";
    });
  }

  // Сообщение о загрузке
  console.log("Сайт Колледжа связи успешно загружен!");
});

// Экспорт функций для использования в других модулях
window.CollegeApp = {
  scrollToTop: () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  openModal: (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  },

  closeModal: (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  },
};
// Добавьте этот код в конец существующего main.js
// Мобильное меню
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const nav = document.querySelector("nav");

if (mobileMenuBtn && nav) {
  mobileMenuBtn.addEventListener("click", () => {
    nav.classList.toggle("active");
    mobileMenuBtn.classList.toggle("active");
  });

  // Закрытие меню при клике на ссылку
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
      mobileMenuBtn.classList.remove("active");
    });
  });
}

// Кнопка "Наверх"
const scrollTopBtn = document.querySelector(".scroll-top-btn");

if (scrollTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Обработка формы
const contactForm = document.getElementById("contactForm");
const successModal = document.getElementById("successModal");

if (contactForm && successModal) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Валидация
    const requiredFields = contactForm.querySelectorAll("[required]");
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        isValid = false;
        field.style.borderColor = "#ef4444";
      } else {
        field.style.borderColor = "";
      }
    });

    if (isValid) {
      // Симуляция отправки
      setTimeout(() => {
        successModal.classList.add("active");
        contactForm.reset();
      }, 500);
    }
  });
}

// Закрытие модального окна
document.querySelectorAll(".modal-close, .modal-close-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    successModal.classList.remove("active");
  });
});

// Обновление года в футере
const currentYearSpan = document.getElementById("current-year");
if (currentYearSpan) {
  currentYearSpan.textContent = new Date().getFullYear();
}
