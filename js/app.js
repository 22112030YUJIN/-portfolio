// 1) 섹션 로드 헬퍼
async function loadSectionInto(id, path) {
  const host = document.getElementById(id);
  if (!host) return;
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`${path} 불러오기 실패: ${res.status}`);
    const html = await res.text();
    host.innerHTML = html; // 파셜 삽입
  } catch (err) {
    console.error(err);
    host.innerHTML = `<div class="text-red-400 p-4">${path} 로드 실패</div>`;
  }
}

// 2) 모든 섹션 로드
async function loadAllSections() {
  await Promise.all([
    loadSectionInto('nav-container', 'sections/nav.html'),
    loadSectionInto('home-container', 'sections/header.html'),
    loadSectionInto('about-container', 'sections/about.html'),
    loadSectionInto('skills-container', 'sections/skills.html'),
    loadSectionInto('projects-container', 'sections/projects.html'),
    loadSectionInto('contact-container', 'sections/contact.html'),
    loadSectionInto('footer-container', 'sections/footer.html'),
  ]);
  initApp(); // 로드 후 초기화
}

// 3) 모바일 메뉴 토글
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-button');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });
  // 메뉴 내 링크 클릭 시 닫기 (모바일 UX)
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => menu.classList.add('hidden'));
  });
}

// 4) 섹션 페이드인/슬라이드 애니메이션
function initSectionReveal() {
  const sections = document.querySelectorAll('.section');
  function checkSections() {
    const triggerBottom = window.innerHeight * 0.8;
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < triggerBottom) {
        section.classList.add('visible');
      }
    });
  }
  window.addEventListener('scroll', checkSections);
  checkSections();
}

// 5) 네비게이션 active 상태 업데이트
function initActiveNav() {
  const navLinks = document.querySelectorAll('.nav-link');
  const targets = document.querySelectorAll('header[id], section[id]');
  function setActiveLink() {
    let current = '';
    const scrollY = window.pageYOffset;
    targets.forEach(sec => {
      const top = sec.offsetTop;
      if (scrollY >= top - 100) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', setActiveLink);
  setActiveLink();
}

// 6) 연락처 폼 (데모)
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    if (name && email && message) {
      alert('메시지가 성공적으로 전송되었습니다! (데모용)');
      form.reset();
    } else {
      alert('모든 필드를 입력해주세요.');
    }
  });
}

// 7) 프로젝트 "더 보기" 버튼
function initMoreProjectsBtn() {
  const btn = document.getElementById('load-more');
  if (!btn) return;
  btn.addEventListener('click', () => {
    alert('현재 표시된 프로젝트가 전부입니다. 더 많은 프로젝트가 추가될 예정입니다.');
  });
}

// 8) 스킬 프로그레스바 애니메이션
function animateSkillBars() {
  const bars = document.querySelectorAll('.skill-progress-bar');
  bars.forEach(bar => {
    const finalWidth = bar.style.width || '0%';
    bar.style.width = '0%';
    // 강제 리플로우 후 애니메이션
    requestAnimationFrame(() => {
      bar.style.transition = 'width 1s ease-out';
      bar.style.width = finalWidth;
    });
  });
}

function initSkillObserver() {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSkillBars();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  observer.observe(skillsSection);
}

// 9) 초기화 메인
function initApp() {
  initMobileMenu();
  initSectionReveal();
  initActiveNav();
  initContactForm();
  initMoreProjectsBtn();
  initSkillObserver();
}

// 시작
document.addEventListener('DOMContentLoaded', loadAllSections);