// Western-themed JavaScript for Cowboy Quick Shot Website

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.cowboy-hero');
        const crosshair = document.querySelector('.crosshair-overlay');
        
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
        
        if (crosshair) {
            crosshair.style.transform = `translate(-50%, -50%) rotate(${scrolled * 0.2}deg)`;
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .performance-card, .gallery-item');
    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Add gun loading sound effect simulation
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            // Add visual feedback
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Crosshair cursor effect
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mousemove', function(e) {
            const crosshair = document.querySelector('.crosshair-overlay');
            if (crosshair) {
                const rect = heroSection.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                crosshair.style.left = x + '%';
                crosshair.style.top = y + '%';
            }
        });
    }

    // Performance counter animation
    const performanceCards = document.querySelectorAll('.performance-card');
    performanceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const badge = this.querySelector('.performance-badge');
            if (badge) {
                badge.style.transform = 'scale(1.1)';
                badge.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const badge = this.querySelector('.performance-badge');
            if (badge) {
                badge.style.transform = 'scale(1)';
            }
        });
    });

    // Gallery lightbox effect
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                // Create lightbox
                const lightbox = document.createElement('div');
                lightbox.className = 'lightbox';
                lightbox.innerHTML = `
                    <div class="lightbox-content">
                        <img src="${img.src}" alt="${img.alt}">
                        <button class="lightbox-close">&times;</button>
                    </div>
                `;
                
                document.body.appendChild(lightbox);
                
                // Close lightbox
                const closeBtn = lightbox.querySelector('.lightbox-close');
                closeBtn.addEventListener('click', function() {
                    document.body.removeChild(lightbox);
                });
                
                lightbox.addEventListener('click', function(e) {
                    if (e.target === lightbox) {
                        document.body.removeChild(lightbox);
                    }
                });
            }
        });
    });

    // Floating elements animation
    const floatingElements = document.querySelectorAll('.floating-revolver, .floating-badge');
    floatingElements.forEach(element => {
        const randomDelay = Math.random() * 2;
        element.style.animationDelay = randomDelay + 's';
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Typewriter effect for hero subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const text = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroSubtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        // Start typewriter effect after a delay
        setTimeout(typeWriter, 1000);
    }

    // Western-style button click effects
    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Loading screen (if needed)
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
});

// Add CSS for additional animations
const additionalStyles = `
    .animate-in {
        animation: fadeInUp 0.8s ease-out forwards;
    }
    
    .header.scrolled {
        background: rgba(26, 26, 46, 0.98);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
    }
    
    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        animation: fadeIn 0.3s ease-out forwards;
    }
    
    .lightbox-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
    }
    
    .lightbox-content img {
        width: 100%;
        height: auto;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }
    
    .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        padding: 0;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 107, 53, 0.8);
        transition: all 0.3s ease;
    }
    
    .lightbox-close:hover {
        background: var(--accent-orange);
        transform: scale(1.1);
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        pointer-events: none;
        animation: rippleEffect 0.6s ease-out;
    }
    
    @keyframes rippleEffect {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        to {
            opacity: 1;
        }
    }
    
    body.loaded {
        overflow-x: hidden;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);