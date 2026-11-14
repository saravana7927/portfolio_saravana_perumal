'use strict';

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toSlug(name) {
  return String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} while fetching ${url}`);
  }
  return await res.json();
}

// Profile
async function renderProfile() {
  const nameEl = document.querySelector('[data-profile-name]');
  const headlineEl = document.querySelector('[data-profile-headline]');
  const availabilityEl = document.querySelector('[data-profile-availability]');
  const emailEl = document.querySelector('[data-profile-email]');
  const phoneEl = document.querySelector('[data-profile-phone]');
  const locationEl = document.querySelector('[data-profile-location]');
  const socialsEl = document.querySelector('[data-profile-socials]');

  try {
    const data = await fetchJSON('./data/profile.json');

    if (nameEl) {
      nameEl.textContent = data.name || '';
      nameEl.title = data.name || '';
    }
    if (headlineEl) headlineEl.textContent = data.headline || '';
    if (availabilityEl) availabilityEl.textContent = data.availability || data.availability_text || '';
    if (emailEl) {
      emailEl.textContent = data.email || '';
      emailEl.href = data.email ? `mailto:${data.email}` : '#';
    }
    if (phoneEl) {
      phoneEl.textContent = data.phone || '';
      phoneEl.href = data.phone ? `tel:${data.phone.replace(/\s+/g, '')}` : '#';
    }
    if (locationEl) locationEl.textContent = data.location || '';
    if (socialsEl && Array.isArray(data.socials)) {
      socialsEl.innerHTML = data.socials.map(s => `
        <li class="social-item">
          <a href="${escapeHtml(s.url)}" class="social-link" target="_blank" rel="noopener noreferrer">
            <ion-icon name="${escapeHtml(s.icon)}"></ion-icon>
          </a>
        </li>
      `).join('');
    }
  } catch (err) {
    if (headlineEl) headlineEl.textContent = 'Failed to load profile details.';
  }
}

// About
async function renderAbout() {
  const container = document.querySelector('[data-about-text]');
  if (!container) return;

  try {
    const data = await fetchJSON('./data/about.json');
    if (Array.isArray(data.paragraphs)) {
      container.innerHTML = data.paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('');
    }
  } catch (err) {
    container.innerHTML = '<p class="fallback-message">Failed to load about me information.</p>';
  }
}

// Services
async function renderServices() {
  const list = document.querySelector('[data-service-list]');
  if (!list) return;

  try {
    const data = await fetchJSON('./data/services.json');
    if (Array.isArray(data.items)) {
      list.innerHTML = data.items.map(item => `
        <li class="service-item">
          <div class="service-icon-box">
            <ion-icon name="${escapeHtml(item.icon)}" style="font-size: 36px; color: var(--orange-yellow-crayola); margin: auto;"></ion-icon>
          </div>
          <div class="service-content-box">
            <h4 class="h4 service-item-title">${escapeHtml(item.title)}</h4>
            <p class="service-item-text">${escapeHtml(item.text)}</p>
          </div>
        </li>
      `).join('');
    }
  } catch (err) {
    list.innerHTML = '<li class="fallback-message">Failed to load services.</li>';
  }
}

// Experience
async function renderExperience() {
  const list = document.querySelector('[data-experience-list]');
  if (!list) return;

  try {
    const data = await fetchJSON('./data/experience.json');
    if (Array.isArray(data.items)) {
      list.innerHTML = data.items.map(item => `
        <li class="timeline-item">
          <h4 class="h4 timeline-item-title">${escapeHtml(item.role)} &mdash; ${escapeHtml(item.company)}</h4>
          <span>${escapeHtml(item.period)}${item.location ? ` | ${escapeHtml(item.location)}` : ''}</span>
          <div class="timeline-text">
            <ul>
              ${(item.bullets || []).map(b => `<li>${escapeHtml(b)}</li>`).join('')}
            </ul>
          </div>
        </li>
      `).join('');
    }
  } catch (err) {
    list.innerHTML = '<li class="fallback-message">Failed to load experience history.</li>';
  }
}

// Education
async function renderEducation() {
  const list = document.querySelector('[data-education-list]');
  if (!list) return;

  try {
    const data = await fetchJSON('./data/education.json');
    if (Array.isArray(data.items)) {
      list.innerHTML = data.items.map(item => `
        <li class="timeline-item">
          <h4 class="h4 timeline-item-title">${escapeHtml(item.school)}</h4>
          <span>${escapeHtml(item.period)}</span>
          <p class="timeline-text">${escapeHtml(item.degree)}</p>
        </li>
      `).join('');
    }
  } catch (err) {
    list.innerHTML = '<li class="fallback-message">Failed to load education details.</li>';
  }
}

// Skills
async function renderSkills() {
  const list = document.querySelector('[data-skills-list]');
  if (!list) return;

  try {
    const data = await fetchJSON('./data/skills.json');
    if (Array.isArray(data.groups)) {
      list.innerHTML = data.groups.map(group => {
        if (group.name && group.name.toLowerCase() === 'also worked with') {
          return `
            <div class="skills-also-worked">
              <p><strong>${escapeHtml(group.name)}:</strong> ${(group.items || []).map(escapeHtml).join(', ')}</p>
            </div>
          `;
        }
        return `
          <div class="skills-group">
            <h4 class="skills-group-title">${escapeHtml(group.name)}</h4>
            <div class="skills-tags">
              ${(group.items || []).map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('')}
            </div>
          </div>
        `;
      }).join('');
    }
  } catch (err) {
    list.innerHTML = '<p class="fallback-message">Failed to load skills.</p>';
  }
}

// Projects and filters
async function renderProjects() {
  const projectList = document.querySelector('[data-project-list]');
  const filterList = document.querySelector('[data-filter-list]');
  const selectList = document.querySelector('[data-select-list]');

  try {
    const data = await fetchJSON('./data/projects.json');
    const visibleProjects = (data.items || []).filter(item => item.visible !== false);

    const categorySet = [];
    visibleProjects.forEach(item => {
      const cats = item.category ? item.category.split(/\s*[/,]\s*/) : [];
      cats.forEach(c => {
        const trimmed = c.trim();
        if (trimmed && !categorySet.includes(trimmed)) {
          categorySet.push(trimmed);
        }
      });
    });

    const preferredOrder = ['ai-interfaces', 'web-apps', 'mobile'];
    categorySet.sort((a, b) => {
      const idxA = preferredOrder.indexOf(toSlug(a));
      const idxB = preferredOrder.indexOf(toSlug(b));
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

    if (filterList) {
      let filterHtml = `<li class="filter-item"><button class="active" data-filter-btn value="all">All</button></li>`;
      categorySet.forEach(cat => {
        const slug = toSlug(cat);
        filterHtml += `<li class="filter-item"><button data-filter-btn value="${slug}">${escapeHtml(cat)}</button></li>`;
      });
      filterList.innerHTML = filterHtml;
    }

    if (selectList) {
      let selectHtml = `<li class="select-item"><button data-select-item value="all">All</button></li>`;
      categorySet.forEach(cat => {
        const slug = toSlug(cat);
        selectHtml += `<li class="select-item"><button data-select-item value="${slug}">${escapeHtml(cat)}</button></li>`;
      });
      selectList.innerHTML = selectHtml;
    }

    if (projectList) {
      projectList.innerHTML = visibleProjects.map(item => {
        const cats = item.category ? item.category.split(/\s*[/,]\s*/) : [];
        const categorySlugs = cats.map(toSlug).join(' ');
        const projectUrl = item.demo_url || item.github_url || '';
        const isGitHub = Boolean(item.github_url && !item.demo_url);
        const linkIcon = isGitHub ? 'logo-github' : 'open-outline';
        const linkText = isGitHub ? 'GitHub' : 'View Project';

        const tagsHtml = (item.tags || []).map(t => `<span class="project-tag">${escapeHtml(t)}</span>`).join('');
        const linkWrapperStart = projectUrl
          ? `<a href="${escapeHtml(projectUrl)}" target="_blank" rel="noopener noreferrer">`
          : `<div class="project-card-wrapper">`;
        const linkWrapperEnd = projectUrl ? `</a>` : `</div>`;

        const linkBtnHtml = projectUrl ? `
          <div class="project-links">
            <span class="project-link-btn">
              <ion-icon name="${linkIcon}"></ion-icon> ${linkText}
            </span>
          </div>
        ` : '';

        return `
          <li class="project-item active" data-filter-item data-category="${categorySlugs}">
            ${linkWrapperStart}
              <figure class="project-img">
                <div class="project-item-icon-box">
                  <ion-icon name="eye-outline"></ion-icon>
                </div>
                <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy">
              </figure>

              <h3 class="project-title">${escapeHtml(item.title)}</h3>

              <p class="project-category">${escapeHtml(item.category)}</p>

              <p class="project-desc">${escapeHtml(item.description)}</p>
              <p class="project-role">Role: ${escapeHtml(item.role)}</p>
              <div class="project-tags">
                ${tagsHtml}
              </div>

              ${linkBtnHtml}
            ${linkWrapperEnd}
          </li>
        `;
      }).join('');
    }

    if (typeof window.initPortfolioFilter === 'function') {
      window.initPortfolioFilter();
    }
  } catch (err) {
    if (projectList) {
      projectList.innerHTML = '<li class="fallback-message">Failed to load projects.</li>';
    }
  }
}

// Initial render
function init() {
  renderProfile();
  renderAbout();
  renderServices();
  renderExperience();
  renderEducation();
  renderSkills();
  renderProjects();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
