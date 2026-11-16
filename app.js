/* ==========================================================================
   AUTOCLEANPRO - INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initTabs();
  initCalculator();
  initComparisonSlider();
  initFAQ();
  initSmoothScroll();
});

/* 1. Mobile Navigation */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const panel = document.getElementById('mobileNavPanel');
  if (!toggleBtn || !panel) return;

  toggleBtn.addEventListener('click', () => {
    panel.classList.toggle('is-active');
    const isOpen = panel.classList.contains('is-active');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    toggleBtn.innerHTML = isOpen 
      ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`
      : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
  });

  // Close when clicking a link
  panel.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      panel.classList.remove('is-active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
    });
  });
}

/* 2. Service Category Tabs */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filter = btn.dataset.filter;

      serviceCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/* 3. Interactive Quote / Pricing Calculator */
function initCalculator() {
  const sizeInputs = document.querySelectorAll('input[name="carSize"]');
  const packSelect = document.getElementById('calcPackSelect');
  const extraCheckboxes = document.querySelectorAll('.calc-extra-check');
  const totalDisplay = document.getElementById('calcTotalPrice');
  const detailList = document.getElementById('calcSummaryDetails');
  const whatsappBtn = document.getElementById('calcWhatsappBtn');

  if (!packSelect || !totalDisplay) return;

  function recalculate() {
    let sizeBonus = 0;
    let sizeLabel = 'Turismo / Compacto';

    const selectedSize = document.querySelector('input[name="carSize"]:checked');
    if (selectedSize) {
      sizeBonus = parseFloat(selectedSize.dataset.surcharge || 0);
      sizeLabel = selectedSize.dataset.label || 'Turismo';
    }

    const selectedPackOpt = packSelect.options[packSelect.selectedIndex];
    const basePrice = parseFloat(selectedPackOpt.dataset.price || 0);
    const packName = selectedPackOpt.text.split('(')[0].trim();

    let extrasTotal = 0;
    const selectedExtras = [];

    extraCheckboxes.forEach(cb => {
      if (cb.checked) {
        const p = parseFloat(cb.dataset.price || 0);
        extrasTotal += p;
        selectedExtras.push({ name: cb.dataset.name, price: p });
      }
    });

    const finalTotal = basePrice + sizeBonus + extrasTotal;

    // Update Display
    totalDisplay.textContent = `${finalTotal} €`;

    // Update Summary Details
    if (detailList) {
      detailList.innerHTML = `
        <li style="display:flex; justify-content:space-between; margin-bottom:0.5rem; color:#fff;">
          <span><strong>Servicio:</strong> ${packName}</span>
          <span>${basePrice} €</span>
        </li>
        <li style="display:flex; justify-content:space-between; margin-bottom:0.5rem; color:var(--text-muted); font-size:0.88rem;">
          <span><strong>Tamaño:</strong> ${sizeLabel}</span>
          <span>+${sizeBonus} €</span>
        </li>
        ${selectedExtras.map(e => `
          <li style="display:flex; justify-content:space-between; margin-bottom:0.4rem; color:var(--text-muted); font-size:0.85rem;">
            <span>+ ${e.name}</span>
            <span>+${e.price} €</span>
          </li>
        `).join('')}
      `;
    }

    // Format WhatsApp link
    if (whatsappBtn) {
      let msg = `Hola AutoCleanPro! He calculado un presupuesto en vuestra web y me gustaría reservar cita:%0A%0A`;
      msg += `🚗 *Vehículo:* ${sizeLabel}%0A`;
      msg += `✨ *Servicio Base:* ${packName} (${basePrice}€)%0A`;
      if (selectedExtras.length > 0) {
        msg += `🔧 *Extras añadidos:*%0A`;
        selectedExtras.forEach(e => {
          msg += `   - ${e.name} (+${e.price}€)%0A`;
        });
      }
      msg += `%0A💰 *Total Estimado:* ${finalTotal}€%0A`;
      msg += `📍 ¿Qué disponibilidad tenéis en los próximos días?`;

      whatsappBtn.href = `https://wa.me/34655858159?text=${msg}`;
    }
  }

  sizeInputs.forEach(i => i.addEventListener('change', recalculate));
  packSelect.addEventListener('change', recalculate);
  extraCheckboxes.forEach(cb => cb.addEventListener('change', recalculate));

  recalculate();
}

/* 4. Interactive Before & After Slider */
function initComparisonSlider() {
  const container = document.getElementById('comparisonContainer');
  const afterLayer = document.getElementById('afterLayer');
  const handle = document.getElementById('sliderHandle');

  if (!container || !afterLayer || !handle) return;

  let isDragging = false;

  function setSliderPosition(x) {
    const rect = container.getBoundingClientRect();
    let pos = ((x - rect.left) / rect.width) * 100;

    if (pos < 5) pos = 5;
    if (pos > 95) pos = 95;

    afterLayer.style.width = `${pos}%`;
    handle.style.left = `${pos}%`;
  }

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.clientX);
  });

  // Touch Support for Mobile
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches[0]) setSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || !e.touches[0]) return;
    setSliderPosition(e.touches[0].clientX);
  }, { passive: true });
}

/* 5. FAQ Accordion */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all other items for clean accordion behavior
      faqItems.forEach(other => other.classList.remove('is-open'));

      if (!isOpen) {
        item.classList.add('is-open');
      }
    });
  });
}

/* 6. Smooth Scroll for Anchor Links */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = 85;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });
}
