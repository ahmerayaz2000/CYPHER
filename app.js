/* ==========================================================================
   CYPHER PREMIUM FRONTEND APPLICATION STATE ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---------------------------------------------------------
  // 1. DYNAMIC BACKGROUND PARTICLES MESH CANVAS
  // ---------------------------------------------------------
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 40;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? 'rgba(0, 255, 136, 0.25)' : 'rgba(0, 180, 255, 0.25)';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 255, 136, ${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    };
    animateParticles();
  }

  // ---------------------------------------------------------
  // 2. PREMIUM CUSTOM CURSOR TRAILS
  // ---------------------------------------------------------
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');
  
  if (cursor && follower && window.innerWidth > 600) {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const tickCursor = () => {
      cursorX += (mouseX - cursorX) * 0.18;
      cursorY += (mouseY - cursorY) * 0.18;
      followerX += (mouseX - followerX) * 0.08;
      followerY += (mouseY - followerY) * 0.08;

      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      follower.style.left = `${followerX}px`;
      follower.style.top = `${followerY}px`;

      requestAnimationFrame(tickCursor);
    };
    tickCursor();

    const updateHoverables = () => {
      const hoverables = document.querySelectorAll('a, button, .pricing-card, .portfolio-card, input, checkbox, textarea, .faq-trigger, .hotspot-element, .url-option-btn, .addon-card');
      hoverables.forEach(elem => {
        elem.addEventListener('mouseenter', () => {
          cursor.classList.add('hovering');
          follower.classList.add('hovering');
        });
        elem.addEventListener('mouseleave', () => {
          cursor.classList.remove('hovering');
          follower.classList.remove('hovering');
        });
      });
    };
    updateHoverables();
    // Re-expose hover updates if dynamic elements load
    window.refreshHoverables = updateHoverables;
  }

  // ---------------------------------------------------------
  // 3. HEADER EFFECTS ON SCROLL & MOBILE NAVBAR TOGGLE
  // ---------------------------------------------------------
  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  const mobileToggle = document.getElementById('mobile-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mainNav.classList.toggle('active');
    });

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mainNav.classList.remove('active');
      });
    });
  }

  // ---------------------------------------------------------
  // 4. PLAYABLE INTERACTIVE SANDBOX LESSONS LOGIC
  // ---------------------------------------------------------
  
  // TABS NAVIGATION CONTROLLER
  const tabs = document.querySelectorAll('.sandbox-tab-btn');
  const contents = document.querySelectorAll('.sandbox-tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (tab.disabled) return;
      
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      document.getElementById(targetId).classList.add('active');
    });
  });

  // GAME LESSON 1: PHISHING HOTSPOTS INTERMEDIARY
  const hotspots = document.querySelectorAll('.hotspot-element');
  const inspectorOutput = document.getElementById('inspector-output');
  const phishActions = document.getElementById('phish-actions-container');
  const phishFeedback = document.getElementById('phish-feedback');
  const passTabBtn = document.querySelector('[data-tab="password-tab"]');
  
  let checkedHotspots = { sender: false, url: false, greeting: false };
  
  const clueDescriptions = {
    sender: `<div class="clue-report-box danger">
      <div class="clue-report-title"><i class="fa-solid fa-triangle-exclamation"></i> Threat: Domain Deception</div>
      <p class="clue-report-text">The sender addresses as <strong>Stripe Security</strong> but uses the domain <strong>stripe-support@alert-resolve.co</strong>. Actual Stripe mail ONLY comes from verified <strong>stripe.com</strong>. Hackers buy lookalike domains to trick your staff.</p>
    </div>`,
    url: `<div class="clue-report-box danger">
      <div class="clue-report-title"><i class="fa-solid fa-circle-nodes"></i> Threat: Suspicious Redirect</div>
      <p class="clue-report-text">The verification button redirects to <strong>http://secured-stripe-verify.co/payouts</strong>. Notice it lacks secure **HTTPS** encryption, and uses a fake domain. Clicking this exposes merchant banking passwords immediately.</p>
    </div>`,
    greeting: `<div class="clue-report-box">
      <div class="clue-report-title"><i class="fa-solid fa-flag"></i> Indicator: Generic Alarmist Greeting</div>
      <p class="clue-report-text">The email greets you broadly and signs off as <strong>Stripe Automated Global Support Team</strong>. Legitimate merchant bank alerts always address you by your registered business name or customer ID to confirm identity.</p>
    </div>`
  };

  hotspots.forEach(hs => {
    hs.addEventListener('click', () => {
      const type = hs.getAttribute('data-hotspot');
      hs.classList.add('checked');
      checkedHotspots[type] = true;
      
      // Load Clue description in Inspector
      inspectorOutput.innerHTML = clueDescriptions[type];
      
      // Check if all clues are analyzed to unlock the final assessment
      if (checkedHotspots.sender && checkedHotspots.url && checkedHotspots.greeting) {
        phishActions.style.display = 'block';
      }
    });
  });

  // Verify Assessment
  const assessPhish = document.getElementById('assess-phish-btn');
  const assessSafe = document.getElementById('assess-safe-btn');

  if (assessPhish) {
    assessPhish.addEventListener('click', () => {
      phishFeedback.className = 'feedback-toast text-green';
      phishFeedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> <strong>EXCELLENT ASSESSMENT!</strong> You successfully identified the threat and secured the company. Lesson 2 (Password Architect) is now unlocked!`;
      
      // Unlock next tab
      passTabBtn.disabled = false;
      passTabBtn.classList.add('pulse-glow-btn');
    });
  }

  if (assessSafe) {
    assessSafe.addEventListener('click', () => {
      phishFeedback.className = 'feedback-toast text-danger';
      phishFeedback.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <strong>SECURITY BREACH!</strong> You categorized the mail as safe. Your credentials have been compromised. Review the warnings and try again.`;
    });
  }

  // GAME LESSON 2: PASSWORD ARCHITECT SECURITY EVALUATOR
  const passInput = document.getElementById('pass-test-input');
  const togglePassBtn = document.getElementById('pass-toggle-visibility');
  const strengthBar = document.getElementById('strength-bar-fill');
  const strengthRating = document.getElementById('strength-rating-text');
  const crackTimeVal = document.getElementById('crack-time-val');
  const passContinueBtn = document.getElementById('pass-continue-btn');
  const browsingTabBtn = document.querySelector('[data-tab="browsing-tab"]');

  // Checklist Rule selectors
  const ruleLen = document.getElementById('rule-length');
  const ruleUp = document.getElementById('rule-upper');
  const ruleLow = document.getElementById('rule-lower');
  const ruleNum = document.getElementById('rule-num');
  const ruleSpec = document.getElementById('rule-special');

  const checkIcon = '<span class="rule-icon"><i class="fa-solid fa-circle-check text-green"></i></span>';
  const crossIcon = '<span class="rule-icon"><i class="fa-solid fa-circle-xmark text-danger"></i></span>';

  // Toggle visible text in input
  if (togglePassBtn && passInput) {
    togglePassBtn.addEventListener('click', () => {
      const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passInput.setAttribute('type', type);
      togglePassBtn.innerHTML = type === 'password' ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
    });
    // Default hidden
    passInput.setAttribute('type', 'password');
  }

  if (passInput) {
    passInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (!val) {
        resetPasswordScore();
        return;
      }

      // Check constraints
      const hasLength = val.length >= 12;
      const hasUpper = /[A-Z]/.test(val);
      const hasLower = /[a-z]/.test(val);
      const hasNumber = /[0-9]/.test(val);
      const hasSpecial = /[^A-Za-z0-9]/.test(val);

      // Update checkmarks
      ruleLen.innerHTML = `${hasLength ? checkIcon : crossIcon} At least 12 characters`;
      ruleUp.innerHTML = `${hasUpper ? checkIcon : crossIcon} Contains uppercase letters`;
      ruleLow.innerHTML = `${hasLower ? checkIcon : crossIcon} Contains lowercase letters`;
      ruleNum.innerHTML = `${hasNumber ? checkIcon : crossIcon} Contains numbers`;
      ruleSpec.innerHTML = `${hasSpecial ? checkIcon : crossIcon} Contains symbols (!@#$%)`;

      // Calculate total passed
      let score = 0;
      if (hasLength) score += 1.5; // Heavy weight on length
      if (hasUpper) score += 1;
      if (hasLower) score += 1;
      if (hasNumber) score += 1;
      if (hasSpecial) score += 1;

      // Map scores to levels
      if (score <= 1.5) {
        strengthBar.style.width = '20%';
        strengthBar.style.backgroundColor = 'var(--danger-color)';
        strengthRating.className = 'status-weak';
        strengthRating.textContent = 'WEAK / COMPROMISED';
        crackTimeVal.className = 'time-instant';
        crackTimeVal.textContent = 'INSTANTLY';
        passContinueBtn.disabled = true;
      } else if (score <= 3.5) {
        strengthBar.style.width = '45%';
        strengthBar.style.backgroundColor = 'var(--warning-color)';
        strengthRating.className = 'status-medium';
        strengthRating.textContent = 'MEDIUM VULNERABILITY';
        crackTimeVal.className = 'time-fast';
        crackTimeVal.textContent = '3.5 HOURS';
        passContinueBtn.disabled = true;
      } else if (score < 5.5) {
        strengthBar.style.width = '75%';
        strengthBar.style.backgroundColor = 'var(--accent-cyan)';
        strengthRating.className = 'status-strong';
        strengthRating.textContent = 'STRONG INTEGRITY';
        crackTimeVal.className = 'time-slow';
        crackTimeVal.textContent = '48 YEARS';
        passContinueBtn.disabled = true;
      } else {
        // Complete shield
        strengthBar.style.width = '100%';
        strengthBar.style.backgroundColor = 'var(--accent-green)';
        strengthRating.className = 'status-secure';
        strengthRating.textContent = 'UNBREAKABLE SHIELD';
        crackTimeVal.className = 'time-centuries';
        crackTimeVal.textContent = '9.4 BILLION CENTURIES';
        passContinueBtn.disabled = false; // Unlock Lock button!
      }
    });
  }

  const resetPasswordScore = () => {
    strengthBar.style.width = '0';
    strengthRating.className = 'status-weak';
    strengthRating.textContent = 'EMPTY';
    crackTimeVal.className = 'time-instant';
    crackTimeVal.textContent = 'INSTANTLY';
    passContinueBtn.disabled = true;
    
    ruleLen.innerHTML = `${crossIcon} At least 12 characters`;
    ruleUp.innerHTML = `${crossIcon} Contains uppercase letters`;
    ruleLow.innerHTML = `${crossIcon} Contains lowercase letters`;
    ruleNum.innerHTML = `${crossIcon} Contains numbers`;
    ruleSpec.innerHTML = `${crossIcon} Contains symbols (!@#$%)`;
  };

  // Continue to URL Quiz Tab
  if (passContinueBtn) {
    passContinueBtn.addEventListener('click', () => {
      browsingTabBtn.disabled = false;
      browsingTabBtn.classList.add('pulse-glow-btn');
      
      // Auto transition to tab
      browsingTabBtn.click();
    });
  }

  // GAME LESSON 3: SAFE BROWSING QUIZ CHOICES
  const urlBtns = document.querySelectorAll('.url-option-btn');
  const urlFeedback = document.getElementById('url-feedback-box');
  const certTabBtn = document.getElementById('cert-tab-btn');

  urlBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const choice = btn.getAttribute('data-option');
      
      // Clear previous classes
      urlBtns.forEach(b => {
        b.classList.remove('correct', 'wrong');
        b.disabled = true; // Disable further clicking once locked in
      });

      urlFeedback.style.display = 'block';

      if (choice === 'C') {
        btn.classList.add('correct');
        urlFeedback.className = 'url-quiz-feedback text-green';
        urlFeedback.innerHTML = `<h5>🎉 CORRECT SELECTION!</h5><p>This path uses secure **https://** encryption and resides on the genuine, verified primary domain <strong>paypal.com</strong>. You have completed all interactive training sandbox metrics!</p>`;
        
        // Unlock Certificate Tab
        certTabBtn.disabled = false;
        certTabBtn.classList.add('pulse-glow-btn');
        
        setTimeout(() => {
          certTabBtn.click();
        }, 1500);
      } else {
        btn.classList.add('wrong');
        urlFeedback.className = 'url-quiz-feedback text-danger';
        
        if (choice === 'A') {
          urlFeedback.innerHTML = `<h5>❌ INSECURE DOMAIN ACCESS</h5><p>Notice that this URL uses <strong>http://</strong> (unencrypted) and the main host domain is <strong>secure-login-3.com</strong>, NOT paypal.com. Paypal is merely a subdomain trick here. Let's refresh and try again!</p>`;
        } else {
          urlFeedback.innerHTML = `<h5>❌ TYPOSQUATTING SPAM PATH</h5><p>Notice the domain is <strong>paypal-signin.com</strong>. Hackers use hyphens to link brand names with generic action words to build unverified, malicious domains. Refresh the challenge to try again!</p>`;
        }
        
        // Re-enable after delay to allow retry
        setTimeout(() => {
          urlBtns.forEach(b => {
            b.classList.remove('wrong');
            b.disabled = false;
          });
          urlFeedback.style.display = 'none';
        }, 3000);
      }
    });
  });

  // ---------------------------------------------------------
  // 5. CANVAS CERTIFICATE DRAWING & MINTING ENGINE
  // ---------------------------------------------------------
  const generateCertBtn = document.getElementById('generate-cert-btn');
  const certNameInput = document.getElementById('cert-name-input');
  const certCanvas = document.getElementById('certificate-canvas');
  const successModalOverlay = document.getElementById('success-modal-overlay');
  const successModal = document.getElementById('success-modal');
  const successModalClose = document.getElementById('success-modal-close');
  const successTitle = document.getElementById('success-title');
  const successMessage = document.getElementById('success-message');

  if (generateCertBtn && certCanvas) {
    generateCertBtn.addEventListener('click', () => {
      const name = certNameInput.value.trim() || 'Security Champion';
      const ctx = certCanvas.getContext('2d');
      
      // Set high-res canvas sizes
      certCanvas.width = 800;
      certCanvas.height = 600;

      // 1. Draw graphite background
      ctx.fillStyle = '#0b0c10';
      ctx.fillRect(0, 0, 800, 600);

      // 2. Draw glowing cyber borders
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 6;
      ctx.strokeRect(15, 15, 770, 570);
      
      ctx.strokeStyle = '#00b4ff';
      ctx.lineWidth = 1;
      ctx.strokeRect(25, 25, 750, 550);

      // 3. Draw Watermark digital lock shield graphic in center
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.04)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(400, 280, 110, 0, Math.PI * 2);
      ctx.stroke();

      // 4. Certificate text titles
      ctx.textAlign = 'center';
      
      // Title
      ctx.fillStyle = '#00ff88';
      ctx.font = '800 24px Syne';
      ctx.fillText('CYPHER DEFENSE ACADEMY', 400, 90);

      // Subtitle
      ctx.fillStyle = '#9aa0b5';
      ctx.font = '500 13px "Share Tech Mono"';
      ctx.fillText('OFFICIAL CYBER AWARENESS COMPLIANCE REGISTRY', 400, 120);

      // Certify line
      ctx.fillStyle = '#f1f3f9';
      ctx.font = '300 16px Outfit';
      ctx.fillText('This officially registers that the micro-lessons graduate', 400, 190);

      // GRADUATE NAME (Glowing Green Outfit)
      ctx.fillStyle = '#00ff88';
      ctx.font = '800 36px Outfit';
      ctx.fillText(name.toUpperCase(), 400, 250);

      // Underline
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(250, 270);
      ctx.lineTo(550, 270);
      ctx.stroke();

      // Achievement narrative
      ctx.fillStyle = '#f1f3f9';
      ctx.font = '300 15px Outfit';
      ctx.fillText('has successfully defeated all interactive sandbox breaches in Phishing Email', 400, 320);
      ctx.fillText('Analysis, Password Cracking Protection, and Safe Domain Identification,', 400, 345);
      ctx.fillText('securing the official certification title of:', 400, 370);

      // CERTIFICATION TITLE (Glowing Electric Cyan Syne)
      ctx.fillStyle = '#00b4ff';
      ctx.font = '800 26px Syne';
      ctx.fillText('CYBER SHIELD CHAMPION', 400, 430);

      // Footer metadata
      const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      ctx.fillStyle = '#9aa0b5';
      ctx.font = '500 11px "Share Tech Mono"';
      ctx.fillText(`DATE OF REGISTRY: ${date.toUpperCase()}`, 250, 520);
      
      const secureHash = 'HASH: 0x' + Array.from({length: 8}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase();
      ctx.fillText(`VERIFIABLE COMPLIANCE ID: ${secureHash}`, 550, 520);

      // Transform canvas to downloadable image link
      const dataURL = certCanvas.toDataURL('image/png');

      // Trigger Success modal popup customized for Cert Claim!
      if (successModalOverlay && successModal) {
        successTitle.textContent = "Certificate Minted!";
        successMessage.innerHTML = `Congratulations, <strong>${name}</strong>! Your Cyber Shield Certificate is compiled and registered on the blockchain. Click below to download your verifiable image badge.`;
        
        // Custom button redirect
        successModalClose.innerHTML = '<i class="fa-solid fa-cloud-arrow-down"></i> Download Certificate';
        
        // Remove previous listeners and attach download action
        const newClose = successModalClose.cloneNode(true);
        successModalClose.parentNode.replaceChild(newClose, successModalClose);
        
        newClose.addEventListener('click', () => {
          const downloadLink = document.createElement('a');
          downloadLink.href = dataURL;
          downloadLink.download = `${name.replace(/\s+/g, '_')}_Cypher_Certificate.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);

          // Close modal
          successModalOverlay.classList.remove('active');
          successModal.classList.remove('active');
        });

        successModalOverlay.classList.add('active');
        successModal.classList.add('active');
        
        // Canvas shower confetti!
        triggerConfettiShower();
      }
    });
  }

  // ---------------------------------------------------------
  // 6. E-COMMERCE CART DRIVER & CONFIGURATOR SELECTION
  // ---------------------------------------------------------
  let activeCartItem = null;
  let cartAddons = [];

  const cartBtn = document.getElementById('cart-btn');
  const cartClose = document.getElementById('cart-close');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartCountBadges = document.querySelectorAll('.cart-count');
  
  const cartEmptyState = document.getElementById('cart-empty');
  const cartActiveContent = document.getElementById('cart-content');
  const cartContinueShop = document.getElementById('cart-continue-shopping');
  
  const cartItemTitle = document.getElementById('cart-item-title');
  const cartItemPrice = document.getElementById('cart-item-price');
  const cartRemoveBtn = document.getElementById('cart-remove');
  
  const baseTotalVal = document.getElementById('base-total-val');
  const addonsRow = document.getElementById('addons-row');
  const addonsTotalVal = document.getElementById('addons-total-val');
  const grandTotalVal = document.getElementById('grand-total-val');
  
  const addonCheckboxes = document.querySelectorAll('.addon-checkbox');

  const openCart = () => {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
  };
  const closeCart = () => {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
  };

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
  if (cartContinueShop) cartContinueShop.addEventListener('click', closeCart);

  // Direct package click triggers
  const buyBtns = document.querySelectorAll('.add-to-cart-btn');
  buyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-package-id');
      const name = btn.getAttribute('data-package-name');
      const price = parseFloat(btn.getAttribute('data-package-price'));
      
      activeCartItem = { id, name, price };
      
      // Reset addons
      addonCheckboxes.forEach(cb => cb.checked = false);
      cartAddons = [];
      
      updateCartDisplay();
      openCart();
    });
  });

  const updateCartPrices = () => {
    if (!activeCartItem) return;
    
    const basePrice = activeCartItem.price;
    let addonsTotal = 0;
    
    cartAddons.forEach(ad => {
      addonsTotal += ad.price;
    });

    const grandTotal = basePrice + addonsTotal;

    baseTotalVal.textContent = `$${basePrice.toLocaleString()}/mo`;
    cartItemPrice.textContent = `$${basePrice.toLocaleString()}/mo`;
    
    if (addonsTotal > 0) {
      addonsRow.style.display = 'flex';
      addonsTotalVal.textContent = `+$${addonsTotal.toLocaleString()}`;
    } else {
      addonsRow.style.display = 'none';
    }

    grandTotalVal.textContent = `$${grandTotal.toLocaleString()}/mo`;
  };

  addonCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const id = checkbox.getAttribute('data-addon-id');
      const name = checkbox.getAttribute('data-addon-name');
      const price = parseFloat(checkbox.getAttribute('data-addon-price'));

      if (checkbox.checked) {
        cartAddons.push({ id, name, price });
      } else {
        cartAddons = cartAddons.filter(ad => ad.id !== id);
      }
      updateCartPrices();
    });
  });

  const updateCartDisplay = () => {
    if (activeCartItem) {
      cartEmptyState.style.display = 'none';
      cartActiveContent.style.display = 'flex';
      cartItemTitle.textContent = activeCartItem.name;
      
      cartCountBadges.forEach(b => b.textContent = '1');
      updateCartPrices();
      
      showCheckoutStep(1);
    } else {
      cartEmptyState.style.display = 'flex';
      cartActiveContent.style.display = 'none';
      cartCountBadges.forEach(b => b.textContent = '0');
    }
  };

  if (cartRemoveBtn) {
    cartRemoveBtn.addEventListener('click', () => {
      activeCartItem = null;
      cartAddons = [];
      updateCartDisplay();
    });
  }

  // ---------------------------------------------------------
  // 7. SECURE MULTI-STEP CHECKOUT DRIVERS
  // ---------------------------------------------------------
  const step1Panel = document.getElementById('checkout-step-1');
  const step2Panel = document.getElementById('checkout-step-2');
  const stepDot1 = document.getElementById('step-dot-1');
  const stepDot2 = document.getElementById('step-dot-2');
  const checkoutNextBtn = document.getElementById('checkout-next-btn');
  const checkoutPayBtn = document.getElementById('checkout-pay-btn');

  const showCheckoutStep = (step) => {
    if (step === 1) {
      step1Panel.classList.add('active');
      step2Panel.classList.remove('active');
      stepDot1.classList.add('active');
      stepDot2.classList.remove('active');
    } else {
      step1Panel.classList.remove('active');
      step2Panel.classList.add('active');
      stepDot1.classList.remove('active');
      stepDot2.classList.add('active');
    }
  };

  if (checkoutNextBtn) {
    checkoutNextBtn.addEventListener('click', () => {
      showCheckoutStep(2);
    });
  }

  // Card details sync formatting
  const cardNameInput = document.getElementById('card-name');
  const cardNumInput = document.getElementById('card-number');
  const cardExpInput = document.getElementById('card-exp');
  
  const cardHolderPreview = document.getElementById('card-holder-preview');
  const cardNumPreview = document.getElementById('card-num-preview');
  const cardExpPreview = document.getElementById('card-expiry-preview');

  if (cardNameInput) {
    cardNameInput.addEventListener('input', (e) => {
      cardHolderPreview.textContent = e.target.value.toUpperCase() || 'YOUR NAME';
    });
  }

  if (cardNumInput) {
    cardNumInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      let formatted = '';
      for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) formatted += ' ';
        formatted += value[i];
      }
      e.target.value = formatted;
      cardNumPreview.textContent = formatted || '•••• •••• •••• ••••';
    });
  }

  if (cardExpInput) {
    cardExpInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\//g, '').replace(/[^0-9]/gi, '');
      if (value.length > 2) {
        e.target.value = value.substring(0, 2) + '/' + value.substring(2, 4);
      } else {
        e.target.value = value;
      }
      cardExpPreview.textContent = e.target.value || 'MM/YY';
    });
  }

  // Payment process simulation
  if (checkoutPayBtn) {
    checkoutPayBtn.addEventListener('click', () => {
      if (!cardNameInput.value || !cardNumInput.value || !cardExpInput.value) {
        alert('Please fill out cardholder name, card number, and expiry date to simulate payment.');
        return;
      }

      checkoutPayBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authorizing Cypher Guard...';
      checkoutPayBtn.disabled = true;

      setTimeout(() => {
        checkoutPayBtn.innerHTML = 'Authorize Seat Subscriptions <i class="fa-solid fa-lock"></i>';
        checkoutPayBtn.disabled = false;
        
        closeCart();
        
        if (successModalOverlay && successModal) {
          successTitle.textContent = "Subscriptions Confirmed!";
          successMessage.innerHTML = "Welcome to CYPHER! Your flat-rate secure training portal is initialized. We have sent a corporate administrator login invitation directly to your business email.";
          
          successModalClose.innerHTML = 'Enter Admin Portal';
          
          // Re-attach standard close listener
          const newClose = successModalClose.cloneNode(true);
          successModalClose.parentNode.replaceChild(newClose, successModalClose);
          
          newClose.addEventListener('click', () => {
            successModalOverlay.classList.remove('active');
            successModal.classList.remove('active');
          });

          successModalOverlay.classList.add('active');
          successModal.classList.add('active');
          
          triggerConfettiShower();
        }

        activeCartItem = null;
        cartAddons = [];
        updateCartDisplay();
      }, 2000);
    });
  }

  // ---------------------------------------------------------
  // 8. CONFETTI SUITE DRILLS
  // ---------------------------------------------------------
  const confettiCanvas = document.getElementById('confetti-canvas');
  const triggerConfettiShower = () => {
    if (!confettiCanvas) return;
    const cctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    
    let pieces = [];
    const count = 100;
    const colors = ['#00ff88', '#00b4ff', '#ffd60a', '#ff3b30', '#ffffff'];

    class ConfettiPiece {
      constructor() {
        this.x = Math.random() * confettiCanvas.width;
        this.y = -20;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = Math.random() * 4 + 4;
        this.size = Math.random() * 8 + 6;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.rotation = Math.random() * 360;
        this.rotSpeed = (Math.random() - 0.5) * 5;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotSpeed;
      }
      draw() {
        cctx.save();
        cctx.translate(this.x, this.y);
        cctx.rotate(this.rotation * Math.PI / 180);
        cctx.fillStyle = this.color;
        cctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        cctx.restore();
      }
    }

    for (let i = 0; i < count; i++) {
      pieces.push(new ConfettiPiece());
    }

    let frames = 0;
    const renderConfetti = () => {
      cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      pieces.forEach(p => {
        p.update();
        p.draw();
      });
      frames++;
      if (frames < 180) {
        requestAnimationFrame(renderConfetti);
      } else {
        cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      }
    };
    renderConfetti();
  };

  // ---------------------------------------------------------
  // 9. INTERACTIVE 2D SCHEDULING CALENDAR PLANNER
  // ---------------------------------------------------------
  const calendarMonthYear = document.getElementById('calendar-month-year');
  const calendarDays = document.getElementById('calendar-days');
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');
  const confirmBookingBtn = document.getElementById('confirm-booking-btn');
  const timeSlotBtns = document.querySelectorAll('.time-slot-btn');

  let currentYear = 2026;
  let currentMonth = 5; // June is 5 (0-indexed)
  let selectedDate = null;
  let selectedTimeSlot = null;

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const renderCalendar = () => {
    if (!calendarDays || !calendarMonthYear) return;
    
    calendarDays.innerHTML = '';
    calendarMonthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;

    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    let adjustedFirstDay = firstDayIndex - 1;
    if (adjustedFirstDay < 0) adjustedFirstDay = 6; // Sunday index 6

    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Padding empty days
    for (let i = 0; i < adjustedFirstDay; i++) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'calendar-day disabled';
      calendarDays.appendChild(emptyDiv);
    }

    // Days grid
    for (let day = 1; day <= totalDays; day++) {
      const dayBtn = document.createElement('button');
      dayBtn.className = 'calendar-day';
      dayBtn.textContent = day;
      dayBtn.type = 'button';

      const dateObj = new Date(currentYear, currentMonth, day);
      const dayOfWeek = dateObj.getDay(); // 0 Sunday, 6 Saturday
      const today = new Date();
      
      // Disable past dates or weekends
      if (dateObj < today || dayOfWeek === 0 || dayOfWeek === 6) {
        dayBtn.classList.add('disabled');
        dayBtn.disabled = true;
      }

      if (selectedDate && 
          selectedDate.day === day && 
          selectedDate.month === currentMonth && 
          selectedDate.year === currentYear) {
        dayBtn.classList.add('active');
      }

      dayBtn.addEventListener('click', () => {
        document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('active'));
        dayBtn.classList.add('active');
        selectedDate = { day, month: currentMonth, year: currentYear };
        validateCalendarBooking();
      });

      calendarDays.appendChild(dayBtn);
    }
  };

  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCalendar();
    });
  }
  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar();
    });
  }

  timeSlotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeSlotBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTimeSlot = btn.getAttribute('data-time');
      validateCalendarBooking();
    });
  });

  const validateCalendarBooking = () => {
    if (selectedDate && selectedTimeSlot) {
      confirmBookingBtn.disabled = false;
    } else {
      confirmBookingBtn.disabled = true;
    }
  };

  if (confirmBookingBtn) {
    confirmBookingBtn.addEventListener('click', () => {
      if (!selectedDate || !selectedTimeSlot) return;
      const formattedDate = `${monthNames[selectedDate.month]} ${selectedDate.day}, ${selectedDate.year}`;
      
      alert(`🎉 Simulated Drill consultation booked!\n\n📅 Date: ${formattedDate}\n⏰ Time: ${selectedTimeSlot}\n\nOur cyber engineer has sent a Google Meet invitation directly to your email.`);
      
      selectedDate = null;
      selectedTimeSlot = null;
      document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('active'));
      timeSlotBtns.forEach(b => b.classList.remove('active'));
      validateCalendarBooking();
    });
  }

  renderCalendar();

  // ---------------------------------------------------------
  // 10. DYNAMIC TESTIMONIALS SLIDER
  // ---------------------------------------------------------
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const prevTestimonial = document.getElementById('prev-testimonial');
  const nextTestimonial = document.getElementById('next-testimonial');
  let currentSlide = 0;

  const showSlide = (idx) => {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slides[idx].classList.add('active');
    dots[idx].classList.add('active');
    currentSlide = idx;
  };

  if (nextTestimonial) {
    nextTestimonial.addEventListener('click', () => {
      let next = currentSlide + 1;
      if (next >= slides.length) next = 0;
      showSlide(next);
    });
  }

  if (prevTestimonial) {
    prevTestimonial.addEventListener('click', () => {
      let prev = currentSlide - 1;
      if (prev < 0) prev = slides.length - 1;
      showSlide(prev);
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'));
      showSlide(idx);
    });
  });

  // ---------------------------------------------------------
  // 11. FAQ ACCORDIONS
  // ---------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');
    
    if (trigger && panel) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        faqItems.forEach(fi => {
          fi.classList.remove('active');
          fi.querySelector('.faq-panel').style.maxHeight = null;
        });

        if (!isActive) {
          item.classList.add('active');
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    }
  });

  // ---------------------------------------------------------
  // 12. CONCIERGE CHATBOT OBJECTIONS ADVISOR
  // ---------------------------------------------------------
  const conciergeTrigger = document.getElementById('concierge-trigger');
  const conciergeClose = document.getElementById('concierge-close');
  const conciergePanel = document.getElementById('concierge-panel');
  const conciergeHistory = document.getElementById('concierge-chat-history');
  const conciergeInput = document.getElementById('concierge-input');
  const conciergeSend = document.getElementById('concierge-send');
  const chatPing = document.querySelector('.chat-ping');
  
  const toggleConcierge = () => {
    conciergePanel.classList.toggle('active');
    if (chatPing) chatPing.style.display = 'none';
  };

  if (conciergeTrigger) conciergeTrigger.addEventListener('click', toggleConcierge);
  if (conciergeClose) conciergeClose.addEventListener('click', toggleConcierge);

  setTimeout(() => {
    if (conciergePanel && !conciergePanel.classList.contains('active')) {
      if (chatPing) chatPing.style.display = 'block';
    }
  }, 7000);

  const appendChatBubble = (sender, message) => {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    bubble.innerHTML = `<p>${message}</p><span class="chat-time">${time}</span>`;
    conciergeHistory.appendChild(bubble);
    conciergeHistory.scrollTop = conciergeHistory.scrollHeight;
  };

  const objectionAnswers = {
    compliance: "Absolutely! CYPHER interactive course certificates fully meet the regulatory standards for SOC2 Type II, ISO27001, HIPAA, and PCI-DSS compliance audits. Auditors love our clean PDF training completion registers.",
    drills: "With our **Apex Guardian** and **Enterprise Shield** packages, our system generates and sends scheduled safe, mock phishing emails to your staff. The admin dashboard tracks reports vs clicks, instantly showing your team's vulnerability ratings.",
    audit: "Yes! You can organize a free mock phishing audit for up to 10 employees. Scroll down to our **Free Security Audit Section** on the home page and book a live 15-minute consulting slot with our CISO engineering team."
  };

  const genericAnswers = [
    "Excellent! We would love to collaborate. Tell us: when is your targeted SOC2 or compliance audit deadline?",
    "Understood. We can set up automated, safe phishing drills for your engineering team in under 24 hours. Would you like to check out now?",
    "That is a vital concern. We integrate directly into Slack and Teams to send micro-training notifications asynchronously to employees."
  ];

  const triggerBotResponse = (key) => {
    appendChatBubble('agent', objectionAnswers[key] || "Understood! Let's arrange a consultation to address this specific requirement.");
  };

  const faqPrompts = document.querySelectorAll('.faq-prompt-btn');
  faqPrompts.forEach(btn => {
    btn.addEventListener('click', () => {
      const questionText = btn.textContent;
      const key = btn.getAttribute('data-question');
      appendChatBubble('user', questionText);
      setTimeout(() => {
        triggerBotResponse(key);
      }, 700);
    });
  });

  const handleUserSendMessage = () => {
    const text = conciergeInput.value.trim();
    if (!text) return;

    appendChatBubble('user', text);
    conciergeInput.value = '';

    setTimeout(() => {
      const idx = Math.floor(Math.random() * genericAnswers.length);
      appendChatBubble('agent', genericAnswers[idx]);
    }, 1000);
  };

  if (conciergeSend) conciergeSend.addEventListener('click', handleUserSendMessage);
  if (conciergeInput) {
    conciergeInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleUserSendMessage();
    });
  }

  // ---------------------------------------------------------
  // 13. DYNAMIC CONTACT INQUIRY ADVISOR FORM
  // ---------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formSubmitBtn = document.getElementById('form-submit-btn');

  if (contactForm && formSubmitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const clientName = document.getElementById('client-name').value;
      
      formSubmitBtn.disabled = true;
      formSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Contacting advisor...';

      setTimeout(() => {
        formSubmitBtn.disabled = false;
        formSubmitBtn.innerHTML = 'Consult Cyber Advisor <i class="fa-solid fa-shield-virus"></i>';
        
        alert(`📬 Thank you, ${clientName}!\n\nYour cyber audit request has been logged. A senior security advisor will reach out via email within 2 hours to organize your mock phishing campaign.`);
        
        contactForm.reset();
      }, 1500);
    });
  }

});
