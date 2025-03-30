document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const headerActions = document.querySelector('.header__actions');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
            headerActions.classList.toggle('active');
        });
    }
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-item__question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // If the clicked item wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    // Testimonial Slider
    const testimonialSlider = document.querySelector('.testimonials__slider');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.testimonials__nav-btn--prev');
    const nextBtn = document.querySelector('.testimonials__nav-btn--next');
    const dots = document.querySelectorAll('.testimonials__dot');
    
    let currentSlide = 0;
    const slideCount = Math.ceil(testimonialCards.length / (window.innerWidth >= 768 ? 3 : window.innerWidth >= 576 ? 2 : 1));
    
    function updateSlider() {
        const slideWidth = testimonialCards[0].offsetWidth + parseInt(getComputedStyle(testimonialCards[0]).marginRight);
        const slidesToShow = window.innerWidth >= 768 ? 3 : window.innerWidth >= 576 ? 2 : 1;
        const offset = -currentSlide * slidesToShow * slideWidth;
        
        testimonialSlider.style.transform = `translateX(${offset}px)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = Math.max(0, currentSlide - 1);
            updateSlider();
        });
        
        nextBtn.addEventListener('click', () => {
            currentSlide = Math.min(slideCount - 1, currentSlide + 1);
            updateSlider();
        });
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });
    
    window.addEventListener('resize', updateSlider);
    
    // Pricing Toggle
    const billingToggle = document.getElementById('billing-toggle');
    const monthlyPrices = document.querySelectorAll('.price.monthly, .period.monthly');
    const annualPrices = document.querySelectorAll('.price.annually, .period.annually');
    
    if (billingToggle) {
        billingToggle.addEventListener('change', function() {
            if (this.checked) {
                // Show annual prices
                monthlyPrices.forEach(el => el.style.display = 'none');
                annualPrices.forEach(el => el.style.display = 'block');
            } else {
                // Show monthly prices
                monthlyPrices.forEach(el => el.style.display = 'block');
                annualPrices.forEach(el => el.style.display = 'none');
            }
        });
    }
    
    // Input Tabs
    const inputTabs = document.querySelectorAll('.input-tab');
    const inputPanels = document.querySelectorAll('.input-panel');
    
    inputTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabType = tab.dataset.tab;
            
            // Update active tab
            inputTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update active panel
            inputPanels.forEach(panel => panel.classList.remove('active'));
            document.getElementById(`${tabType}-panel`).classList.add('active');
        });
    });
    
    // Custom Style Toggle
    const stylePreset = document.getElementById('style-preset');
    const customStyleGroup = document.getElementById('custom-style-group');
    
    if (stylePreset) {
        stylePreset.addEventListener('change', function() {
            if (this.value === 'custom') {
                customStyleGroup.style.display = 'block';
            } else {
                customStyleGroup.style.display = 'none';
            }
        });
    }
    
    // Image Upload
    const imageUpload = document.getElementById('image-upload');
    const imageInput = document.getElementById('image-input');
    const imagePreview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    const removeImage = document.getElementById('remove-image');
    
    if (imageUpload && imageInput) {
        imageUpload.addEventListener('click', () => {
            imageInput.click();
        });
        
        imageUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            imageUpload.classList.add('dragover');
        });
        
        imageUpload.addEventListener('dragleave', () => {
            imageUpload.classList.remove('dragover');
        });
        
        imageUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            imageUpload.classList.remove('dragover');
            
            if (e.dataTransfer.files.length) {
                handleImageFile(e.dataTransfer.files[0]);
            }
        });
        
        imageInput.addEventListener('change', () => {
            if (imageInput.files.length) {
                handleImageFile(imageInput.files[0]);
            }
        });
        
        if (removeImage) {
            removeImage.addEventListener('click', () => {
                imageInput.value = '';
                imageUpload.style.display = 'flex';
                imagePreview.style.display = 'none';
                previewImg.src = '';
            });
        }
    }
    
    function handleImageFile(file) {
        if (!file.type.match('image.*')) {
            alert('Please select an image file.');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            imageUpload.style.display = 'none';
            imagePreview.style.display = 'flex';
        };
        
        reader.readAsDataURL(file);
    }
    
    // Generate Asset Button
    const generateBtn = document.getElementById('generate-btn');
    const idleState = document.getElementById('idle-state');
    const loadingState = document.getElementById('loading-state');
    const resultState = document.getElementById('result-state');
    const errorState = document.getElementById('error-state');
    const currentStep = document.getElementById('current-step');
    const resultImage = document.getElementById('result-image');
    const errorText = document.getElementById('error-text');
    const regenerateBtn = document.getElementById('regenerate-btn');
    const downloadBtn = document.getElementById('download-btn');
    const tryAgainBtn = document.getElementById('try-again-btn');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            // Check if any input is provided
            let hasInput = false;
            const activePanel = document.querySelector('.input-panel.active');
            
            if (activePanel.id === 'image-panel') {
                hasInput = previewImg.src !== '';
            } else if (activePanel.id === 'html-panel' || activePanel.id === 'svg-panel') {
                const textarea = activePanel.querySelector('textarea');
                hasInput = textarea.value.trim() !== '';
            } else if (activePanel.id === 'figma-panel') {
                const figmaUrl = document.getElementById('figma-url');
                hasInput = figmaUrl.value.trim() !== '';
            } else if (activePanel.id === 'text-panel') {
                const textInput = document.getElementById('text-input');
                hasInput = textInput.value.trim() !== '';
            }
            
            if (!hasInput) {
                // Show error state
                idleState.style.display = 'none';
                loadingState.style.display = 'none';
                resultState.style.display = 'none';
                errorState.style.display = 'flex';
                errorText.textContent = i18next.t('playground.errors.noInput') || '请提供输入内容';
                return;
            }
            
            // Show loading state
            idleState.style.display = 'none';
            loadingState.style.display = 'flex';
            resultState.style.display = 'none';
            errorState.style.display = 'none';
            
            try {
                // Simulate API call with different steps
                const steps = [
                    i18next.t('playground.steps.analyzing') || '正在分析输入...',
                    i18next.t('playground.steps.generating') || '正在生成提示词...',
                    i18next.t('playground.steps.processing') || '正在处理...',
                    i18next.t('playground.steps.finalizing') || '正在完成资产生成...'
                ];
                
                for (let i = 0; i < steps.length; i++) {
                    currentStep.textContent = steps[i];
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                
                // Simulate success or error (90% success rate)
                if (Math.random() < 0.9) {
                    // Success
                    resultImage.src = 'img/sample-result.jpg'; // Use a placeholder image
                    
                    // Show result state
                    idleState.style.display = 'none';
                    loadingState.style.display = 'none';
                    resultState.style.display = 'flex';
                    errorState.style.display = 'none';
                } else {
                    // Error
                    throw new Error(i18next.t('playground.errors.processingFailed') || '处理失败，请重试');
                }
            } catch (error) {
                // Show error state
                idleState.style.display = 'none';
                loadingState.style.display = 'none';
                resultState.style.display = 'none';
                errorState.style.display = 'flex';
                errorText.textContent = error.message;
            }
        });
    }
    
    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', () => {
            generateBtn.click();
        });
    }
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            // Create a temporary link to download the image
            const link = document.createElement('a');
            link.href = resultImage.src;
            link.download = 'aetherforge-asset.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
    
    if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', () => {
            // Reset to idle state
            idleState.style.display = 'flex';
            loadingState.style.display = 'none';
            resultState.style.display = 'none';
            errorState.style.display = 'none';
        });
    }
});

