/* ================================================
   AI Agent 学习网站 - 交互动画
   ================================================ */

document.addEventListener('DOMContentLoaded', function () {

    /* ============ 1. 页面加载动画 ============ */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.module-card, .feature-card, .roadmap-item, .demo-card, .quiz-card, .chapter-section, .resource-card').forEach((el, i) => {
        el.classList.add('animate-on-scroll');
        el.style.animationDelay = (i % 4) * 0.08 + 's';
        observer.observe(el);
    });

    /* ============ 2. Hero 打字机效果 ============ */
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(20px)';
        setTimeout(() => {
            heroTitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 300);
    }

    /* ============ 3. Hero 背景粒子 ============ */
    const hero = document.querySelector('.hero');
    if (hero) {
        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('hero-particle');
            particle.style.cssText = [
                `left:${Math.random() * 100}%`,
                `top:${Math.random() * 100}%`,
                `width:${Math.random() * 4 + 1}px`,
                `height:${Math.random() * 4 + 1}px`,
                `animation-delay:${Math.random() * 6}s`,
                `animation-duration:${Math.random() * 10 + 8}s`,
                `opacity:${Math.random() * 0.5 + 0.1}`
            ].join(';');
            hero.appendChild(particle);
        }
    }

    /* ============ 4. 导航滚动高亮 ============ */
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop - 100;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-links a[href="#${id}"]`);
            if (link && scrollY >= top && scrollY < top + height) {
                document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    /* ============ 5. 按钮涟漪效果 ============ */
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('.cta-btn, .btn-small, .reset-btn');
        if (btn) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            const rect = btn.getBoundingClientRect();
            ripple.style.left = (e.clientX - rect.left) + 'px';
            ripple.style.top = (e.clientY - rect.top) + 'px';
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        }
    });

    /* ============ 6. 卡片悬浮 3D 倾斜效果 ============ */
    document.querySelectorAll('.module-card, .feature-card, .resource-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            card.style.transform = `translateY(-6px) perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    /* ============ 7. 模块卡片点击波纹 ============ */
    document.querySelectorAll('.module-card, .roadmap-item').forEach(card => {
        card.addEventListener('click', function (e) {
            const circle = document.createElement('div');
            circle.classList.add('card-ripple');
            const rect = this.getBoundingClientRect();
            circle.style.left = (e.clientX - rect.left) + 'px';
            circle.style.top = (e.clientY - rect.top) + 'px';
            this.appendChild(circle);
            setTimeout(() => circle.remove(), 500);
        });
    });

    /* ============ 8. FAQ 手风琴 ============ */
    document.querySelectorAll('.faq-card').forEach(card => {
        const q = card.querySelector('.faq-question');
        if (q) {
            q.addEventListener('click', () => {
                const wasOpen = card.classList.contains('open');
                document.querySelectorAll('.faq-card').forEach(c => c.classList.remove('open'));
                if (!wasOpen) {
                    card.classList.add('open');
                    card.style.boxShadow = '0 8px 30px rgba(108,99,255,0.2)';
                } else {
                    card.style.boxShadow = '';
                }
            });
        }
    });

    /* ============ 9. 滚动进度条（章节页面）============ */
    if (document.querySelector('.chapter-page')) {
        const progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress';
        document.body.prepend(progressBar);
        window.addEventListener('scroll', () => {
            const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = scrolled + '%';
        }, { passive: true });
    }

    /* ============ 10. 路线图入场动画（数字递增）============ */
    const counters = document.querySelectorAll('.roadmap-num');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('pop-in');
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    /* ============ 11. 路线图连接线绘制动画 ============ */
    document.querySelectorAll('.roadmap-connector').forEach((line, i) => {
        line.style.transform = 'scaleY(0)';
        line.style.transformOrigin = 'top';
        setTimeout(() => {
            line.style.transition = 'transform 0.4s ease';
            line.style.transform = 'scaleY(1)';
        }, i * 150 + 500);
    });

    /* ============ 12. 测验选项选中动画 ============ */
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.addEventListener('mouseenter', () => {
            if (!opt.closest('.quiz-card').classList.contains('answered')) {
                opt.style.transform = 'translateX(4px)';
            }
        });
        opt.addEventListener('mouseleave', () => {
            opt.style.transform = '';
        });
    });

    /* ============ 13. 代码块复制按钮 ============ */
    document.querySelectorAll('.demo-card, .chapter-section').forEach(section => {
        const pre = section.querySelector('pre');
        if (pre) {
            const btn = document.createElement('button');
            btn.className = 'copy-btn';
            btn.textContent = '📋';
            btn.title = '复制代码';
            btn.style.cssText = [
                'position:absolute', 'top:10px', 'right:10px',
                'background:rgba(255,255,255,0.1)', 'border:1px solid rgba(255,255,255,0.2)',
                'color:#94a3b8', 'border-radius:6px', 'cursor:pointer',
                'padding:4px 8px', 'font-size:12px', 'transition:all 0.2s', 'z-index:10'
            ].join(';');
            btn.addEventListener('click', () => {
                const code = pre.textContent;
                navigator.clipboard.writeText(code).then(() => {
                    btn.textContent = '✅';
                    btn.style.background = 'rgba(16,185,129,0.2)';
                    setTimeout(() => { btn.textContent = '📋'; btn.style.background = ''; }, 1500);
                });
            });
            pre.style.position = 'relative';
            pre.parentElement.appendChild(btn);
        }
    });

    /* ============ 14. Hero 轨道旋转 ============ */
    const orbitRing = document.querySelector('.orbit-ring:nth-child(4)');
    if (orbitRing) {
        let rotateDeg = 0;
        function animateOrbit() {
            rotateDeg += 0.1;
            orbitRing.style.transform = `translate(-50%, -50%) rotate(${rotateDeg}deg)`;
            requestAnimationFrame(animateOrbit);
        }
        animateOrbit();
    }

    /* ============ 15. 回到顶部按钮 ============ */
    const backToTop = document.createElement('button');
    backToTop.id = 'backToTop';
    backToTop.innerHTML = '↑';
    backToTop.style.cssText = [
        'position:fixed', 'bottom:30px', 'right:30px',
        'width:48px', 'height:48px', 'border-radius:50%',
        'background:linear-gradient(135deg, #6c63ff, #a855f7)',
        'color:white', 'border:none', 'font-size:20px',
        'cursor:pointer', 'box-shadow:0 4px 20px rgba(108,99,255,0.4)',
        'display:none', 'z-index:999', 'transition:all 0.3s',
        'opacity:0', 'transform:translateY(20px)'
    ].join(';');
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.style.display = 'block';
            setTimeout(() => { backToTop.style.opacity = '1'; backToTop.style.transform = 'translateY(0)'; }, 10);
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.transform = 'translateY(20px)';
            setTimeout(() => { backToTop.style.display = 'none'; }, 300);
        }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ============ 16. 模块数字滚动动画 ============ */
    function animateNumber(el, target) {
        let current = 0;
        const step = target / 40;
        const interval = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(interval);
            }
            el.textContent = Math.floor(current).toString().padStart(2, '0');
        }, 30);
    }

    document.querySelectorAll('.module-num').forEach(el => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const text = el.textContent;
                    const num = parseInt(text);
                    if (!isNaN(num)) {
                        el.textContent = '00';
                        animateNumber(el, num);
                    }
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(el);
    });

    /* ============ 17. 页面切换淡入 ============ */
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.4s ease';
        document.body.style.opacity = '1';
    }, 100);

});

/* ============ CSS 动画定义 ============ */
const style = document.createElement('style');
style.textContent = `
    /* 滚动入场动画 */
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .animate-on-scroll.visible {
        opacity: 1;
        transform: translateY(0);
    }

    /* 路线图数字弹出 */
    .roadmap-num {
        transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease;
    }
    .roadmap-num.pop-in {
        animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    @keyframes popIn {
        0% { transform: scale(0.5); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
    }

    /* 按钮涟漪 */
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        width: 100px; height: 100px;
        margin-left: -50px; margin-top: -50px;
    }
    @keyframes ripple {
        to { transform: scale(4); opacity: 0; }
    }

    /* 卡片涟漪 */
    .card-ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(108,99,255,0.15);
        transform: scale(0);
        animation: cardRipple 0.5s ease-out;
        pointer-events: none;
        width: 100px; height: 100px;
        margin-left: -50px; margin-top: -50px;
    }
    @keyframes cardRipple {
        to { transform: scale(4); opacity: 0; }
    }

    /* Hero 粒子 */
    .hero-particle {
        position: absolute;
        background: rgba(108,99,255,0.6);
        border-radius: 50%;
        pointer-events: none;
        animation: float linear infinite;
    }
    @keyframes float {
        0% { transform: translateY(0) translateX(0); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100px) translateX(30px); opacity: 0; }
    }

    /* 滚动进度条 */
    #scroll-progress {
        position: fixed;
        top: 0; left: 0;
        height: 3px;
        background: linear-gradient(90deg, #6c63ff, #a855f7, #f472b6);
        width: 0%;
        z-index: 10000;
        transition: width 0.1s linear;
        box-shadow: 0 0 10px rgba(108,99,255,0.5);
    }

    /* 复制按钮悬停 */
    .copy-btn:hover {
        background: rgba(255,255,255,0.2) !important;
        color: white !important;
    }

    /* Quiz 选项动画 */
    .quiz-option {
        transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .quiz-option.correct, .quiz-option.wrong {
        transition: all 0.3s ease;
        transform: scale(1.02);
    }

    /* FAQ 卡片 */
    .faq-card {
        transition: all 0.3s ease;
    }
    .faq-card.open .faq-answer {
        animation: slideDown 0.3s ease;
    }
    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    /* Demo 代码块 */
    .demo-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .demo-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }

    /* 回到顶部按钮悬停 */
    #backToTop:hover {
        transform: scale(1.1) !important;
        box-shadow: 0 8px 30px rgba(108,99,255,0.6) !important;
    }

    /* Hero 轨道动画增强 */
    .agent-core {
        transition: box-shadow 0.5s ease;
    }

    /* Feature 卡片图标摇动 */
    .feature-card:hover .feature-icon {
        animation: wiggle 0.5s ease;
    }
    @keyframes wiggle {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-10deg); }
        75% { transform: rotate(10deg); }
    }

    /* 资源卡片悬浮发光 */
    .resource-card:hover {
        box-shadow: 0 0 30px rgba(108,99,255,0.15);
    }
`;
document.head.appendChild(style);
