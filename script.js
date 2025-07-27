/* Main JavaScript file for Mudassar's portfolio website */

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeScrollAnimations();
    initializeSkillBars();
    initializeContactForm();
    initializeNavigation();
    initializeScrollToTop();
});

// ===== THEME TOGGLE =====
function initializeTheme() {
    const themeToggle = document.querySelector('#themeToggle');
    const body = document.querySelector('body');
    const localStorageThemeKey = 'theme';
    
    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem(localStorageThemeKey);
    if (savedTheme === 'light') {
        // Only keep light mode if explicitly saved
        updateThemeIcon(themeToggle, false);
    } else {
        // Default to dark mode
        body.classList.add('dark');
        updateThemeIcon(themeToggle, true);
        if (!savedTheme) {
            localStorage.setItem(localStorageThemeKey, 'dark');
        }
    }
    
    // Toggle theme
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark');
        const isDark = body.classList.contains('dark');
        
        if (isDark) {
            localStorage.setItem(localStorageThemeKey, 'dark');
        } else {
            localStorage.setItem(localStorageThemeKey, 'light');
        }
        
        updateThemeIcon(themeToggle, isDark);
    });
}

function updateThemeIcon(toggle, isDark) {
    const icon = toggle.querySelector('i');
    if (isDark) {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay for multiple elements
                const delay = index * 150; // 150ms delay between elements
                
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                
                // Unobserve the element after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with fade-in class
    const animatedElements = document.querySelectorAll('.fade-in');
    animatedElements.forEach((element, index) => {
        // Add custom delay based on element position
        element.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(element);
    });
}

// ===== SKILL BARS ANIMATION =====
function initializeSkillBars() {
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.progress-bar');
                
                progressBars.forEach((bar, index) => {
                    const progress = bar.getAttribute('data-progress');
                    
                    setTimeout(() => {
                        bar.style.width = progress + '%';
                    }, index * 200); // Staggered animation
                });
                
                skillObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });
    
    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        skillObserver.observe(skillsSection);
    }
}

// ===== CONTACT FORM =====
function initializeContactForm() {
    const contactForm = document.querySelector('#contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };
            
            // Validate form data
            if (!data.name || !data.email || !data.subject || !data.message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Update submit button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            // Send email using EmailJS
            emailjs.send('service_lnywb15', 'template_yvko4n7', {
                name: data.name,
                email: data.email,
                subject: data.subject,
                message: data.message
            })
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                showNotification('Message sent successfully!', 'success');
                contactForm.reset();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            })
            .catch(function(error) {
                console.log('FAILED...', error);
                showNotification('Failed to send message. Please try again.', 'error');
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// ===== NAVIGATION =====
function initializeNavigation() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Mobile menu toggle
    const hamburger = document.querySelector('#hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
// Keep navbar permanently fixed (removed hide/show logic)
    // Navbar will remain visible at all times
}

// ===== SCROLL TO TOP BUTTON =====
function initializeScrollToTop() {
    const scrollTopBtn = document.querySelector('.scroll-top-btn');
    
    if (scrollTopBtn) {
        // Initially hide the button
        scrollTopBtn.style.visibility = 'hidden';
        scrollTopBtn.style.opacity = '0';
        
        // Show/hide button based on scroll position
        const toggleScrollButton = () => {
            if (window.pageYOffset > 300) { // Show after scrolling 300px
                scrollTopBtn.style.visibility = 'visible';
                scrollTopBtn.style.opacity = '0.8';
            } else {
                scrollTopBtn.style.opacity = '0';
                setTimeout(() => {
                    scrollTopBtn.style.visibility = 'hidden';
                }, 300); // Wait for fade out animation
            }
        };
        
        // Add scroll event listener with debouncing for performance
        window.addEventListener('scroll', debounce(toggleScrollButton, 10));
        
        // Check initial scroll position
        toggleScrollButton();
    }
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add scroll-triggered animations for projects
function initializeProjectAnimations() {
    const projectCards = document.querySelectorAll('.project-card');
    
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
                
                projectObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        projectObserver.observe(card);
    });
}

// Initialize project animations after DOM load
document.addEventListener('DOMContentLoaded', initializeProjectAnimations);


