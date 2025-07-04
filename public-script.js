/**
 * TRAINER REGISTRATION PRO - JavaScript Unifié Complet
 * ✅ FUSION COMPLÈTE : public-script.js + trainer-search-modern.js + gestion avancée téléphones
 * ✅ ÉLIMINATION : Tous les doublons et conflits
 * ✅ CONSERVATION : Toutes les fonctionnalités
 * 
 * Version: 4.0 - Unifiée et optimisée avec gestion téléphones internationaux
 */

(function($) {
    'use strict';

    // ===== VÉRIFICATIONS INITIALES =====
    if (typeof $ === 'undefined') {
        console.error('❌ Trainer Registration Pro: jQuery non trouvé');
        return;
    }

    if (typeof trainer_ajax === 'undefined') {
        console.error('❌ Trainer Registration Pro: Configuration AJAX manquante');
        return;
    }

    $(document).ready(function() {
        console.log('🚀 Trainer Registration Pro: Initialisation unifiée...');

        // ===== CONFIGURATION CENTRALISÉE =====
        const CONFIG = {
            form: {
                currentStep: 1,
                totalSteps: 4,
                submitting: false
            },
            search: {
                timeout: null,
                currentRequest: null,
                delay: 300
            },
            validation: {
                timeout: null
            },
            phone: {
                validCodes: [
                    '1', '7', '20', '27', '30', '31', '32', '33', '34', '36', '39', '40', '41', '43', '44', '45', '46', '47', '48', '49',
                    '51', '52', '53', '54', '55', '56', '57', '58', '60', '61', '62', '63', '64', '65', '66', '81', '82', '84', '86', '90', '91', '92', '93', '94', '95', '98',
                    '212', '213', '216', '218', '220', '221', '222', '223', '224', '225', '226', '227', '228', '229', '230', '231', '232', '233', '234', '235', '236', '237', '238', '239', '240', '241', '242', '243', '244', '245', '246', '247', '248', '249', '250', '251', '252', '253', '254', '255', '256', '257', '258', '260', '261', '262', '263', '264', '265', '266', '267', '268', '269', '290', '291', '297', '298', '299',
                    '350', '351', '352', '353', '354', '355', '356', '357', '358', '359', '370', '371', '372', '373', '374', '375', '376', '377', '378', '380', '381', '382', '383', '385', '386', '387', '389', '420', '421', '423', '590', '591', '592', '593', '594', '595', '596', '597', '598', '599',
                    '670', '672', '673', '674', '675', '676', '677', '678', '679', '680', '681', '682', '683', '684', '685', '686', '687', '688', '689', '690', '691', '692', '850', '852', '853', '855', '856', '880', '886'
                ],
                countryNames: {
                    '+33': 'France',
                    '+1': 'États-Unis/Canada',
                    '+44': 'Royaume-Uni',
                    '+49': 'Allemagne',
                    '+39': 'Italie',
                    '+34': 'Espagne',
                    '+41': 'Suisse',
                    '+32': 'Belgique',
                    '+31': 'Pays-Bas',
                    '+212': 'Maroc',
                    '+213': 'Algérie',
                    '+216': 'Tunisie',
                    '+262': 'La Réunion/Mayotte',
                    '+590': 'Guadeloupe',
                    '+594': 'Guyane',
                    '+596': 'Martinique'
                }
            }
        };

        // ===== CACHE DES ÉLÉMENTS DOM =====
        const elements = {
            form: $('#trpro-trainer-registration-form'),
            steps: $('.trpro-form-step'),
            progressSteps: $('.trpro-progress-step'),
            nextBtn: $('#trpro-next-step'),
            prevBtn: $('#trpro-prev-step'),
            submitBtn: $('#trpro-submit-form'),
            messages: $('#trpro-form-messages'),
            loading: $('#trpro-form-loading'),
            // Éléments téléphone
            countryCodeSelect: $('#trpro-country-code'),
            customCodeInput: $('#trpro-custom-code'),
            phoneInput: $('#trpro-phone')
        };

        // ===== INJECTION DES STYLES POUR TÉLÉPHONE =====
        injectPhoneStyles();

        // ===== INITIALISATION GLOBALE =====
        
        // Formulaire d'inscription
        if (elements.form.length > 0) {
            initFormNavigation();
            initRealTimeValidation();
            initFileUpload();
            initCheckboxes();
            initFormAnimations();
            initRegionsValidation();
            initAdvancedPhoneHandling(); // Nouveau système téléphone
            showStep(1);
            console.log('✅ Formulaire d\'inscription initialisé');
        }

        // Recherche de formateurs
        if ($('#trpro-trainer-search, #trpro-live-search').length > 0) {
            initSearch();
            console.log('✅ Recherche de formateurs initialisée');
        }

        // Cartes de formateurs
        if ($('.trpro-trainer-card, .trpro-trainer-card-modern').length > 0) {
            initTrainerCards();
            console.log('✅ Cartes de formateurs initialisées');
        }

        // Animations générales
        initGlobalAnimations();

        // ===== GESTION AVANCÉE DES TÉLÉPHONES =====
        
        function initAdvancedPhoneHandling() {
            if (!elements.countryCodeSelect.length || !elements.phoneInput.length) return;
            
            console.log('🚀 Initialisation du système téléphone avancé');
            
            // Gestion des indicatifs avec animation
            elements.countryCodeSelect.on('change', function() {
                handleCountryCodeChange($(this).val());
            });
            
            // Validation en temps réel de l'indicatif personnalisé
            elements.customCodeInput.on('input', function() {
                handleCustomCodeInput($(this));
            });
            
            // Formatage automatique du numéro
            elements.phoneInput.on('input', function() {
                handlePhoneInput($(this));
            });
            
            // Validation complète au blur
            elements.phoneInput.on('blur', function() {
                validateCompletePhoneNumber();
            });
            
            // Créer l'aperçu du numéro complet
            createPhonePreview();
        }

        function handleCountryCodeChange(selectedValue) {
            if (selectedValue === 'custom') {
                showCustomCodeInput();
                updatePhoneHelper('info', 'Saisissez votre indicatif pays (ex: +262 pour La Réunion)');
                
                setTimeout(() => {
                    elements.customCodeInput.focus();
                }, 150);
                
            } else {
                hideCustomCodeInput();
                elements.customCodeInput.val('');
                updatePhoneHelper('info', `Saisissez votre numéro pour ${getCountryName(selectedValue)}`);
                
                if (elements.phoneInput.val()) {
                    validateCompletePhoneNumber();
                }
            }
            
            updatePhonePreview();
        }

        function showCustomCodeInput() {
            const $input = elements.customCodeInput;
            
            $input.css({
                display: 'block',
                opacity: '0',
                transform: 'scale(0.95) translateX(-10px)'
            }).prop('required', true);
            
            requestAnimationFrame(() => {
                $input.css({
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: '1',
                    transform: 'scale(1) translateX(0)'
                });
            });
        }

        function hideCustomCodeInput() {
            const $input = elements.customCodeInput;
            
            $input.css({
                opacity: '0',
                transform: 'scale(0.95) translateX(-10px)'
            }).prop('required', false);
            
            setTimeout(() => {
                $input.hide();
            }, 300);
        }

        function handleCustomCodeInput($input) {
            let value = $input.val();
            
            // Ajouter + automatiquement si manquant
            if (value && !value.startsWith('+')) {
                value = '+' + value;
            }
            
            // Garder seulement les chiffres et le +
            value = value.replace(/[^\d+]/g, '');
            
            // Limiter la longueur (+ suivi de 1-4 chiffres)
            if (value.length > 5) {
                value = value.substring(0, 5);
            }
            
            $input.val(value);
            
            // Validation en temps réel
            validateCustomCode(value);
            updatePhonePreview();
        }

        function validateCustomCode(code) {
            const isValid = isValidCountryCode(code);
            const $formGroup = elements.customCodeInput.closest('.trpro-form-group');
            
            $formGroup.removeClass('error success');
            
            if (code.length === 0) {
                updatePhoneHelper('info', 'Saisissez votre indicatif pays (ex: +262)');
                return;
            }
            
            if (code.length === 1) {
                updatePhoneHelper('info', 'Continuez à taper votre indicatif...');
                return;
            }
            
            if (isValid && code.length >= 2) {
                $formGroup.addClass('success');
                const countryName = getCountryName(code) || 'Pays détecté';
                updatePhoneHelper('success', `✓ Indicatif "${code}" valide (${countryName})`);
            } else {
                $formGroup.addClass('error');
                updatePhoneHelper('error', 'Indicatif invalide. Format: +XXX (1-4 chiffres)');
            }
        }

        function handlePhoneInput($input) {
            const countryCode = getCurrentCountryCode();
            let value = $input.val();
            
            // Supprimer tout sauf les chiffres et espaces
            value = value.replace(/[^\d\s]/g, '');
            
            // Formater selon le pays
            const formatted = formatPhoneByCountry(value, countryCode);
            $input.val(formatted);
            
            // Validation en temps réel
            validatePhoneLength(value.replace(/\s/g, ''));
            updatePhonePreview();
        }

        function formatPhoneByCountry(phone, countryCode) {
            const digitsOnly = phone.replace(/\s/g, '');
            const code = countryCode.replace('+', '');
            
            switch (code) {
                case '33': // France
                    return formatFrenchPhone(digitsOnly);
                case '1': // USA/Canada
                    return formatUSPhone(digitsOnly);
                case '44': // UK
                    return formatUKPhone(digitsOnly);
                default:
                    return formatGenericPhone(digitsOnly);
            }
        }

        function formatFrenchPhone(digits) {
            if (digits.length === 0) return '';
            const formatted = digits.replace(/(\d{2})(?=\d)/g, '$1 ');
            return formatted.substring(0, 14); // Limiter à 10 chiffres + espaces
        }

        function formatUSPhone(digits) {
            if (digits.length === 0) return '';
            
            if (digits.length <= 3) {
                return digits;
            } else if (digits.length <= 6) {
                return digits.slice(0, 3) + ' ' + digits.slice(3);
            } else {
                return digits.slice(0, 3) + ' ' + digits.slice(3, 6) + ' ' + digits.slice(6, 10);
            }
        }

        function formatUKPhone(digits) {
            if (digits.length === 0) return '';
            
            if (digits.length <= 4) {
                return digits;
            } else if (digits.length <= 7) {
                return digits.slice(0, 4) + ' ' + digits.slice(4);
            } else {
                return digits.slice(0, 4) + ' ' + digits.slice(4, 7) + ' ' + digits.slice(7, 10);
            }
        }

        function formatGenericPhone(digits) {
            if (digits.length <= 8) {
                return digits.replace(/(\d{2})(?=\d)/g, '$1 ');
            } else {
                return digits.replace(/(\d{3})(?=\d)/g, '$1 ');
            }
        }

        function getCurrentCountryCode() {
            if (elements.countryCodeSelect.val() === 'custom') {
                return elements.customCodeInput.val() || '+';
            }
            return elements.countryCodeSelect.val();
        }

        function validatePhoneLength(digits) {
            const $formGroup = elements.phoneInput.closest('.trpro-form-group');
            
            $formGroup.removeClass('error success');
            
            if (digits.length === 0) {
                updatePhoneHelper('info', 'Saisissez votre numéro de téléphone');
                return;
            }
            
            if (digits.length < 7) {
                updatePhoneHelper('error', `Numéro trop court (${digits.length}/7 minimum)`);
                $formGroup.addClass('error');
            } else if (digits.length > 15) {
                updatePhoneHelper('error', `Numéro trop long (${digits.length}/15 maximum)`);
                $formGroup.addClass('error');
            } else {
                $formGroup.addClass('success');
                updatePhoneHelper('success', `✓ Numéro valide (${digits.length} chiffres)`);
            }
        }

        function validateCompletePhoneNumber() {
            const countryCode = getCurrentCountryCode();
            const digits = elements.phoneInput.val().replace(/\s/g, '');
            
            const validationResult = validatePhoneByCountry(digits, countryCode);
            
            const $formGroup = elements.phoneInput.closest('.trpro-form-group');
            $formGroup.removeClass('error success');
            
            if (validationResult.valid) {
                $formGroup.addClass('success');
                updatePhoneHelper('success', validationResult.message);
            } else {
                $formGroup.addClass('error');
                updatePhoneHelper('error', validationResult.message);
            }
            
            return validationResult.valid;
        }

        function validatePhoneByCountry(digits, countryCode) {
            const code = countryCode.replace('+', '');
            
            switch (code) {
                case '33': // France
                    if (digits.length !== 9 && digits.length !== 10) {
                        return { valid: false, message: 'Numéro français : 9 ou 10 chiffres requis' };
                    }
                    if (digits.length === 10 && !digits.startsWith('0')) {
                        return { valid: false, message: 'Numéro français doit commencer par 0' };
                    }
                    return { valid: true, message: '✓ Numéro français valide' };
                    
                case '1': // USA/Canada
                    if (digits.length !== 10) {
                        return { valid: false, message: 'Numéro US/Canada : 10 chiffres requis' };
                    }
                    return { valid: true, message: '✓ Numéro US/Canada valide' };
                    
                case '44': // UK
                    if (digits.length < 10 || digits.length > 11) {
                        return { valid: false, message: 'Numéro UK : 10-11 chiffres requis' };
                    }
                    return { valid: true, message: '✓ Numéro UK valide' };
                    
                default:
                    if (digits.length < 7 || digits.length > 15) {
                        return { valid: false, message: 'Numéro international : 7-15 chiffres requis' };
                    }
                    return { valid: true, message: '✓ Numéro international valide' };
            }
        }

        function createPhonePreview() {
            const $formGroup = elements.phoneInput.closest('.trpro-form-group');
            
            let $preview = $('#trpro-phone-preview');
            if ($preview.length === 0) {
                $preview = $('<div id="trpro-phone-preview" class="trpro-phone-preview" style="display:none;">' +
                           '<strong>Numéro complet :</strong> <span id="trpro-full-phone"></span></div>');
                $formGroup.append($preview);
            }
        }

        function updatePhonePreview() {
            const $preview = $('#trpro-phone-preview');
            const $fullPhoneSpan = $('#trpro-full-phone');
            
            if (!$preview.length || !$fullPhoneSpan.length) return;
            
            const countryCode = getCurrentCountryCode();
            const phone = elements.phoneInput.val().replace(/\s/g, '');
            
            if (countryCode && countryCode !== '+' && phone) {
                const fullNumber = `${countryCode} ${phone}`;
                $fullPhoneSpan.text(fullNumber);
                
                if ($preview.is(':hidden')) {
                    $preview.css({
                        display: 'block',
                        opacity: '0',
                        transform: 'translateY(-10px)'
                    });
                    
                    requestAnimationFrame(() => {
                        $preview.css({
                            transition: 'all 0.3s ease',
                            opacity: '1',
                            transform: 'translateY(0)'
                        });
                    });
                }
            } else {
                $preview.hide();
            }
        }

        function updatePhoneHelper(type, message) {
            let $helper = $('#trpro-phone-helper');
            
            if ($helper.length === 0) {
                const $formGroup = elements.phoneInput.closest('.trpro-form-group');
                $helper = $('<div id="trpro-phone-helper" class="trpro-field-help"></div>');
                $formGroup.append($helper);
            }
            
            const icons = {
                'info': 'fa-info-circle',
                'success': 'fa-check-circle',
                'error': 'fa-exclamation-circle'
            };
            
            $helper.removeClass('info success error').addClass(type)
                   .html(`<i class="fas ${icons[type]}"></i> ${message}`);
        }

        function isValidCountryCode(code) {
            if (!code || !code.startsWith('+')) return false;
            
            const digits = code.substring(1);
            if (!/^\d{1,4}$/.test(digits)) return false;
            
            return CONFIG.phone.validCodes.includes(digits);
        }

        function getCountryName(code) {
            return CONFIG.phone.countryNames[code] || null;
        }

        // ===== FORMULAIRE D'INSCRIPTION =====
        
        function initFormNavigation() {
            elements.nextBtn.on('click', handleNextStep);
            elements.prevBtn.on('click', handlePrevStep);
            elements.submitBtn.on('click', handleSubmit);
            elements.form.on('submit', function(e) {
                e.preventDefault();
                return false;
            });

            // Navigation clavier
            $(document).on('keydown', function(e) {
                if (elements.form.is(':visible') && e.key === 'Enter' && !e.shiftKey) {
                    const activeElement = document.activeElement;
                    if (activeElement.tagName !== 'TEXTAREA') {
                        e.preventDefault();
                        if (CONFIG.form.currentStep < CONFIG.form.totalSteps) {
                            handleNextStep();
                        } else {
                            handleSubmit();
                        }
                    }
                }
            });
        }

        function handleNextStep() {
            console.log(`🔄 Passage à l'étape ${CONFIG.form.currentStep + 1}`);
            
            if (validateCurrentStep()) {
                if (CONFIG.form.currentStep < CONFIG.form.totalSteps) {
                    CONFIG.form.currentStep++;
                    showStep(CONFIG.form.currentStep);
                }
            }
        }

        function handlePrevStep() {
            if (CONFIG.form.currentStep > 1) {
                CONFIG.form.currentStep--;
                showStep(CONFIG.form.currentStep);
            }
        }

        function handleSubmit() {
            console.log('📤 Soumission du formulaire...');
            
            if (CONFIG.form.submitting) return;
            
            if (validateCurrentStep()) {
                submitForm();
            }
        }

        function showStep(step) {
            // Masquer toutes les étapes
            elements.steps.removeClass('active').hide();
            
            // Afficher l'étape courante
            const $currentStep = $(`.trpro-form-step[data-step="${step}"]`);
            $currentStep.addClass('active').fadeIn(300);
            
            // Mise à jour de la barre de progression
            updateProgressBar(step);
            
            // Gestion des boutons
            elements.prevBtn.toggle(step > 1);
            
            if (step === CONFIG.form.totalSteps) {
                elements.nextBtn.hide();
                elements.submitBtn.show();
                generateSummary();
            } else {
                elements.nextBtn.show();
                elements.submitBtn.hide();
            }
            
            // Scroll et focus
            scrollToForm();
            setTimeout(() => {
                $currentStep.find('input, textarea, select').first().focus();
            }, 350);
        }

        function updateProgressBar(step) {
            elements.progressSteps.removeClass('active completed');
            
            for (let i = 1; i <= step; i++) {
                $(`.trpro-progress-step[data-step="${i}"]`).addClass('active');
            }
            
            for (let i = 1; i < step; i++) {
                $(`.trpro-progress-step[data-step="${i}"]`).addClass('completed');
            }
        }

        // ===== VALIDATION EN TEMPS RÉEL =====
        
        function initRealTimeValidation() {
            // Validation pendant la saisie
            elements.form.find('input, textarea, select').on('input', function() {
                const $field = $(this);
                clearTimeout(CONFIG.validation.timeout);
                CONFIG.validation.timeout = setTimeout(() => {
                    validateField($field);
                }, 300);
            });

            // Validation à la perte de focus
            elements.form.find('input, textarea, select').on('blur', function() {
                validateField($(this));
            });

            // Validation des checkboxes
            elements.form.find('input[type="checkbox"]').on('change', function() {
                const $field = $(this);
                const name = $field.attr('name');
                
                if (name === 'specialties[]') {
                    validateSpecialties();
                } else if (name === 'intervention_regions[]') {
                    validateRegions();
                } else if (name === 'rgpd_consent') {
                    validateRgpd();
                }
            });
        }

        function validateCurrentStep() {
            const $currentStepElement = $(`.trpro-form-step[data-step="${CONFIG.form.currentStep}"]`);
            const errors = [];
            
            clearStepErrors();
            
            switch (CONFIG.form.currentStep) {
                case 1:
                    errors.push(...validateStep1($currentStepElement));
                    break;
                case 2:
                    errors.push(...validateStep2($currentStepElement));
                    break;
                case 3:
                    errors.push(...validateStep3($currentStepElement));
                    break;
                case 4:
                    errors.push(...validateStep4($currentStepElement));
                    break;
            }
            
            if (errors.length > 0) {
                displayErrors(errors);
                scrollToFirstError();
                return false;
            }
            
            return true;
        }

        function validateStep1($step) {
            const errors = [];
            
            // Prénom
            const firstName = $step.find('#trpro-first-name').val().trim();
            if (!firstName) {
                errors.push({
                    field: 'first_name',
                    selector: '#trpro-first-name',
                    message: 'Le prénom est obligatoire'
                });
            }
            
            // Nom
            const lastName = $step.find('#trpro-last-name').val().trim();
            if (!lastName) {
                errors.push({
                    field: 'last_name',
                    selector: '#trpro-last-name',
                    message: 'Le nom est obligatoire'
                });
            }
            
            // Email
            const email = $step.find('#trpro-email').val().trim();
            if (!email) {
                errors.push({
                    field: 'email',
                    selector: '#trpro-email',
                    message: 'L\'adresse email est obligatoire'
                });
            } else if (!isValidEmail(email)) {
                errors.push({
                    field: 'email',
                    selector: '#trpro-email',
                    message: 'Format d\'email invalide'
                });
            }
            
            // Téléphone avec nouvelle validation
            const countryCode = getCurrentCountryCode();
            const phone = $step.find('#trpro-phone').val().trim();
            
            if (!phone) {
                errors.push({
                    field: 'phone',
                    selector: '#trpro-phone',
                    message: 'Le numéro de téléphone est obligatoire'
                });
            } else {
                const phoneValidation = validatePhoneByCountry(phone.replace(/\s/g, ''), countryCode);
                if (!phoneValidation.valid) {
                    errors.push({
                        field: 'phone',
                        selector: '#trpro-phone',
                        message: phoneValidation.message
                    });
                }
            }
            
            // Vérifier l'indicatif personnalisé si sélectionné
            if (countryCode === 'custom') {
                const customCode = elements.customCodeInput.val();
                if (!customCode) {
                    errors.push({
                        field: 'custom_country_code',
                        selector: '#trpro-custom-code',
                        message: 'L\'indicatif personnalisé est obligatoire'
                    });
                } else if (!isValidCountryCode(customCode)) {
                    errors.push({
                        field: 'custom_country_code',
                        selector: '#trpro-custom-code',
                        message: 'Indicatif pays invalide'
                    });
                }
            }
            
            // LinkedIn optionnel
            const linkedin = $step.find('#trpro-linkedin-url').val().trim();
            if (linkedin && !linkedin.includes('linkedin.com')) {
                errors.push({
                    field: 'linkedin_url',
                    selector: '#trpro-linkedin-url',
                    message: 'URL LinkedIn invalide'
                });
            }
            
            return errors;
        }

        function validateStep2($step) {
            const errors = [];
            
            // Spécialités
            const $specialties = $step.find('input[name="specialties[]"]:checked');
            if ($specialties.length === 0) {
                errors.push({
                    field: 'specialties',
                    selector: '.trpro-checkbox-grid',
                    message: 'Sélectionnez au moins une spécialité'
                });
            }
            
            // Régions d'intervention
            const $regions = $step.find('input[name="intervention_regions[]"]:checked');
            if ($regions.length === 0) {
                errors.push({
                    field: 'intervention_regions',
                    selector: '.trpro-regions-grid',
                    message: 'Sélectionnez au moins une zone d\'intervention'
                });
            }
            
            // Expérience
            const experience = $step.find('#trpro-experience').val().trim();
            if (!experience) {
                errors.push({
                    field: 'experience',
                    selector: '#trpro-experience',
                    message: 'Description de l\'expérience obligatoire'
                });
            } else if (experience.length < 50) {
                errors.push({
                    field: 'experience',
                    selector: '#trpro-experience',
                    message: `Description trop courte (${experience.length}/50 caractères minimum)`
                });
            }
            
            return errors;
        }

        function validateStep3($step) {
            const errors = [];
            
            // CV obligatoire
            const cvFile = $step.find('#trpro-cv-file')[0].files[0];
            if (!cvFile) {
                errors.push({
                    field: 'cv_file',
                    selector: '#trpro-cv-file',
                    message: 'Le CV est obligatoire'
                });
            }
            
            return errors;
        }

        function validateStep4($step) {
            const errors = [];
            
            // Consentement RGPD
            const rgpdConsent = $step.find('#trpro-rgpd-consent').prop('checked');
            if (!rgpdConsent) {
                errors.push({
                    field: 'rgpd_consent',
                    selector: '#trpro-rgpd-consent',
                    message: 'Le consentement RGPD est obligatoire'
                });
            }
            
            return errors;
        }

        // ===== GESTION DES RÉGIONS =====
        
        function initRegionsValidation() {
            $('input[name="intervention_regions[]"]').on('change', function() {
                validateRegions();
                updateRegionsCounter();
            });
            updateRegionsCounter();
        }

        function updateRegionsCounter() {
            const $checked = $('input[name="intervention_regions[]"]:checked');
            const count = $checked.length;
            
            let $counter = $('.trpro-regions-counter');
            if ($counter.length === 0) {
                $counter = $('<div class="trpro-regions-counter"></div>');
                $('.trpro-regions-grid').after($counter);
            }
            
            if (count > 0) {
                const text = count === 1 ? '1 zone sélectionnée' : `${count} zones sélectionnées`;
                const emoji = count <= 3 ? '📍' : count <= 6 ? '🗺️' : '🌍';
                $counter.html(`<span class="trpro-counter-text">${emoji} ${text}</span>`).show();
            } else {
                $counter.hide();
            }
        }

        // ===== GESTION DES FICHIERS =====
        
        function initFileUpload() {
            // Clic sur zone d'upload
            $(document).on('click', '.trpro-file-upload-area', function(e) {
                e.preventDefault();
                const targetInput = $(this).data('target');
                if (targetInput) {
                    $(`#${targetInput}`).trigger('click');
                }
            });

            // Drag & Drop
            $('.trpro-file-upload-area')
                .on('dragover', function(e) {
                    e.preventDefault();
                    $(this).addClass('dragover');
                })
                .on('dragleave', function(e) {
                    e.preventDefault();
                    $(this).removeClass('dragover');
                })
                .on('drop', function(e) {
                    e.preventDefault();
                    $(this).removeClass('dragover');
                    
                    const files = e.originalEvent.dataTransfer.files;
                    const targetInput = $(this).data('target');
                    
                    if (files.length > 0 && targetInput) {
                        const inputElement = $(`#${targetInput}`)[0];
                        if (inputElement) {
                            inputElement.files = files;
                            $(inputElement).trigger('change');
                        }
                    }
                });

            // Changement de fichier
            $(document).on('change', 'input[type="file"]', function() {
                const file = this.files[0];
                const fileId = $(this).attr('id');
                const $preview = $(`#${fileId}-preview`);
                
                if (file) {
                    showFilePreview(file, $preview, fileId);
                    validateFileField($(this), file);
                } else {
                    $preview.removeClass('active').empty();
                }
            });

            // Suppression de fichier
            $(document).on('click', '.trpro-file-remove', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const targetId = $(this).data('target');
                const $input = $(`#${targetId}`);
                $input.val('');
                $(`#${targetId}-preview`).removeClass('active').empty();
                $input.closest('.trpro-form-group').removeClass('error success');
            });
        }

        function showFilePreview(file, $preview, fileId) {
            let fileIcon = 'fas fa-file';
            if (file.type.includes('pdf')) fileIcon = 'fas fa-file-pdf';
            else if (file.type.includes('image')) fileIcon = 'fas fa-file-image';
            else if (file.type.includes('word')) fileIcon = 'fas fa-file-word';
            
            const fileSize = formatFileSize(file.size);
            
            const previewHtml = `
                <div class="trpro-file-info">
                    <i class="${fileIcon}"></i>
                    <div class="trpro-file-details">
                        <div class="trpro-file-name">${escapeHtml(file.name)}</div>
                        <div class="trpro-file-size">${fileSize}</div>
                    </div>
                    <button type="button" class="trpro-file-remove" data-target="${fileId}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            $preview.html(previewHtml).addClass('active');
        }

        // ===== SOUMISSION DU FORMULAIRE =====
        
        function submitForm() {
            CONFIG.form.submitting = true;
            
            elements.loading.fadeIn(200);
            elements.submitBtn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Envoi en cours...');
            
            const formData = new FormData(elements.form[0]);
            formData.append('action', 'submit_trainer_registration');
            formData.append('nonce', trainer_ajax.nonce);
            
            $.ajax({
                url: trainer_ajax.ajax_url,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                timeout: 30000,
                success: function(response) {
                    handleFormResponse(response);
                },
                error: function(xhr, status, error) {
                    handleFormError(xhr, status, error);
                },
                complete: function() {
                    elements.loading.fadeOut(200);
                    elements.submitBtn.prop('disabled', false).html('<i class="fas fa-paper-plane"></i> Envoyer ma candidature');
                    CONFIG.form.submitting = false;
                }
            });
        }

        function handleFormResponse(response) {
            if (response.success) {
                showMessage('success', response.data.message || 'Inscription réussie !');
                
                // Reset du formulaire
                elements.form[0].reset();
                $('.trpro-file-preview').removeClass('active').empty();
                $('.trpro-regions-counter').hide();
                CONFIG.form.currentStep = 1;
                showStep(CONFIG.form.currentStep);
                
                scrollToMessage();
                
                if (response.data.redirect) {
                    setTimeout(() => {
                        window.location.href = response.data.redirect;
                    }, 3000);
                }
            } else {
                const errorMessage = response.data?.message || 'Erreur lors de l\'inscription';
                showMessage('error', errorMessage);
            }
        }

        // ===== RECHERCHE DE FORMATEURS =====
        
        function initSearch() {
            const $searchInput = $('#trpro-trainer-search-input, #trpro-live-search');
            const $searchBtn = $('#trpro-search-trainers-btn');
            const $specialtyFilter = $('#trpro-specialty-filter');
            const $regionFilter = $('#trpro-region-filter');
            
            // Recherche en temps réel
            $searchInput.on('input', debounce(performSearch, CONFIG.search.delay));
            
            // Filtres
            $specialtyFilter.on('change', performSearch);
            $regionFilter.on('change', performSearch);
            
            // Bouton recherche
            $searchBtn.on('click', performSearch);
            
            // Recherche sur Enter
            $searchInput.on('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    performSearch();
                }
            });
            
            // Tags de recherche
            $('.trpro-suggestion-tag, .trpro-tag').on('click', function(e) {
                e.preventDefault();
                const searchTerm = $(this).data('search');
                const category = $(this).data('category');
                
                $searchInput.val(searchTerm);
                if (category && category !== 'all') {
                    $specialtyFilter.val(category);
                }
                
                performSearch();
            });
            
            // Chargement initial
            loadInitialTrainers();
        }

        function performSearch() {
            const searchData = {
                action: 'search_trainers',
                nonce: trainer_ajax.nonce,
                search_term: $('#trpro-trainer-search-input, #trpro-live-search').val().trim(),
                specialty_filter: $('#trpro-specialty-filter').val() || '',
                region_filter: $('#trpro-region-filter').val() || '',
                per_page: 12,
                page: 1
            };
            
            // Annuler requête précédente
            if (CONFIG.search.currentRequest) {
                CONFIG.search.currentRequest.abort();
            }
            
            showSearchLoading();
            
            CONFIG.search.currentRequest = $.ajax({
                url: trainer_ajax.ajax_url,
                type: 'POST',
                data: searchData,
                success: function(response) {
                    if (response.success) {
                        displaySearchResults(response.data);
                    } else {
                        showNoResults();
                    }
                },
                error: function(xhr, status, error) {
                    if (status !== 'abort') {
                        showSearchError();
                    }
                },
                complete: function() {
                    hideSearchLoading();
                    CONFIG.search.currentRequest = null;
                }
            });
        }

        function loadInitialTrainers() {
            showSearchLoading();
            
            $.ajax({
                url: trainer_ajax.ajax_url,
                type: 'POST',
                data: {
                    action: 'search_trainers',
                    nonce: trainer_ajax.nonce,
                    search_term: '',
                    specialty_filter: '',
                    region_filter: '',
                    per_page: 12,
                    page: 1
                },
                success: function(response) {
                    if (response.success && response.data) {
                        displaySearchResults(response.data);
                    }
                },
                complete: function() {
                    hideSearchLoading();
                }
            });
        }

        function displaySearchResults(data) {
            const $container = $('#trpro-trainers-grid, #trpro-search-results');
            
            if (data.html) {
                // Si le serveur renvoie du HTML
                $container.fadeOut(200, function() {
                    $(this).html(data.html).fadeIn(300);
                });
            } else if (data.trainers) {
                // Si le serveur renvoie des données JSON
                const html = data.trainers.map(trainer => generateTrainerCard(trainer)).join('');
                $container.fadeOut(200, function() {
                    $(this).html(html).fadeIn(300);
                });
            }
            
            updateResultsCount(data.total || 0);
        }

        function generateTrainerCard(trainer) {
            const trainerId = String(trainer.id).padStart(4, '0');
            const displayName = trainer.display_name || 'Formateur Expert';
            
            return `
                <article class="trpro-trainer-card-modern" data-trainer-id="${trainer.id}">
                    <div class="trpro-card-header">
                        <div class="trpro-trainer-avatar">
                            ${trainer.photo_url ? 
                                `<img src="${trainer.photo_url}" alt="Photo formateur" loading="lazy">` :
                                `<div class="trpro-avatar-placeholder"><i class="fas fa-user-graduate"></i></div>`
                            }
                            <div class="trpro-status-badge trpro-badge-verified">
                                <span>Vérifié</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="trpro-card-body">
                        <div class="trpro-trainer-identity">
                            <h3 class="trpro-trainer-title">
                                ${escapeHtml(displayName)}
                                <span class="trpro-trainer-id">#${trainerId}</span>
                            </h3>
                            ${trainer.company ? `<div class="trpro-trainer-company"><i class="fas fa-building"></i><span>${escapeHtml(trainer.company)}</span></div>` : ''}
                        </div>
                    </div>
                    
                    <div class="trpro-card-footer">
                        <div class="trpro-action-buttons">
                            <a href="mailto:${trainer_ajax.contact_email}?subject=Contact formateur %23${trainerId}" 
                               class="trpro-btn trpro-btn-primary">
                                <i class="fas fa-envelope"></i>
                                <span>Contacter</span>
                            </a>
                            <button class="trpro-btn trpro-btn-outline trpro-btn-profile" data-trainer-id="${trainer.id}">
                                <i class="fas fa-user"></i>
                                <span>Profil</span>
                            </button>
                        </div>
                    </div>
                </article>
            `;
        }

        // ===== GESTION DES CARTES =====
        
        function initTrainerCards() {
            // Boutons profil
            $(document).on('click', '.trpro-btn-profile, .trpro-btn-info', function(e) {
                e.preventDefault();
                const trainerId = $(this).data('trainer-id');
                loadTrainerProfile(trainerId);
            });
            
            // Fermeture modal
            $(document).on('click', '.trpro-modal-close, .trpro-modal-overlay', function(e) {
                if (e.target === this || $(e.target).hasClass('trpro-modal-close')) {
                    $('.trpro-modal-overlay').fadeOut(300, function() {
                        $(this).remove();
                    });
                    $('body').removeClass('modal-open');
                }
            });
            
            // Escape pour fermer
            $(document).on('keydown', function(e) {
                if (e.key === 'Escape') {
                    $('.trpro-modal-overlay').fadeOut(300, function() {
                        $(this).remove();
                    });
                    $('body').removeClass('modal-open');
                }
            });
        }

        function loadTrainerProfile(trainerId) {
            showProfileLoadingModal();
            
            $.ajax({
                url: trainer_ajax.ajax_url,
                type: 'POST',
                data: {
                    action: 'get_trainer_profile',
                    nonce: trainer_ajax.nonce,
                    trainer_id: trainerId
                },
                success: function(response) {
                    hideProfileLoadingModal();
                    
                    if (response.success && response.data) {
                        showProfileModal(response.data);
                    } else {
                        showProfileError(response.data?.message || 'Erreur lors du chargement du profil');
                    }
                },
                error: function() {
                    hideProfileLoadingModal();
                    showProfileError('Erreur de connexion');
                }
            });
        }

        function showProfileLoadingModal() {
            const loadingHTML = `
                <div class="trpro-modal-overlay active" id="trpro-profile-loading-modal">
                    <div class="trpro-modal-container">
                        <div class="trpro-modal-content">
                            <div class="trpro-modal-loading">
                                <div class="trpro-spinner"></div>
                                <p>Chargement du profil...</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            $('body').append(loadingHTML);
            $('body').addClass('modal-open');
        }

        function hideProfileLoadingModal() {
            $('#trpro-profile-loading-modal').remove();
            $('body').removeClass('modal-open');
        }

        function showProfileModal(profileData) {
            const regions = profileData.intervention_regions || [];
            const specialties = profileData.specialties || [];
            
            const modalHTML = `
                <div class="trpro-modal-overlay active" id="trpro-profile-modal-${profileData.id}">
                    <div class="trpro-modal-container">
                        <div class="trpro-modal-header">
                            <div class="trpro-modal-title">
                                <div class="trpro-modal-avatar">
                                    ${profileData.photo_url ? 
                                        `<img src="${profileData.photo_url}" alt="Photo du formateur">` :
                                        `<div class="trpro-modal-avatar-placeholder"><i class="fas fa-user-graduate"></i></div>`
                                    }
                                </div>
                                <div class="trpro-modal-info">
                                    <h4>${escapeHtml(profileData.display_name)}</h4>
                                    <p>Formateur Expert #${String(profileData.id).padStart(4, '0')}</p>
                                    ${profileData.company ? `<p class="trpro-modal-company">${escapeHtml(profileData.company)}</p>` : ''}
                                </div>
                            </div>
                            <button class="trpro-modal-close"><i class="fas fa-times"></i></button>
                        </div>
                        
                        <div class="trpro-modal-content">
                            ${regions.length > 0 ? `
                                <div class="trpro-modal-section">
                                    <h5><i class="fas fa-map-marker-alt"></i> Zones d'intervention</h5>
                                    <div class="trpro-modal-zones">
                                        ${regions.map(region => `
                                            <span class="trpro-zone-chip">
                                                <i class="fas fa-map-pin"></i>
                                                ${escapeHtml(region)}
                                            </span>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            
                            <div class="trpro-modal-section">
                                <h5><i class="fas fa-cogs"></i> Compétences techniques</h5>
                                <div class="trpro-detailed-specialties">
                                    ${specialties.map(specialty => `
                                        <div class="trpro-specialty-chip">
                                            <i class="fas fa-cog"></i>
                                            <span>${escapeHtml(specialty)}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            ${profileData.experience ? `
                                <div class="trpro-modal-section">
                                    <h5><i class="fas fa-briefcase"></i> Expérience professionnelle</h5>
                                    <div class="trpro-experience-full">
                                        ${escapeHtml(profileData.experience).replace(/\n/g, '<br>')}
                                    </div>
                                </div>
                            ` : ''}
                            
                            <div class="trpro-modal-actions">
                                <a href="mailto:${trainer_ajax.contact_email}?subject=Contact formateur %23${String(profileData.id).padStart(4, '0')}" 
                                   class="trpro-btn trpro-btn-primary trpro-btn-large">
                                    <i class="fas fa-envelope"></i>
                                    Contacter par Email
                                </a>
                                
                                ${profileData.linkedin_url ? `
                                    <a href="${profileData.linkedin_url}" 
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       class="trpro-btn trpro-btn-outline trpro-btn-large">
                                        <i class="fab fa-linkedin"></i>
                                        Voir LinkedIn
                                    </a>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            $('body').append(modalHTML);
            $('body').addClass('modal-open');
        }

        // ===== UTILITAIRES =====
        
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

        function escapeHtml(text) {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return String(text).replace(/[&<>"']/g, function(m) { return map[m]; });
        }

        function isValidEmail(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        function validateField($field) {
            const fieldName = $field.attr('name');
            const value = $field.val().trim();
            const $formGroup = $field.closest('.trpro-form-group');
            const $errorMsg = $field.siblings('.trpro-error-message');
            
            $formGroup.removeClass('error success');
            $errorMsg.text('').css('opacity', 0);
            
            let isValid = true;
            let errorMessage = '';
            
            // Validation selon le type
            switch (fieldName) {
                case 'first_name':
                case 'last_name':
                    if ($field.prop('required') && !value) {
                        isValid = false;
                        errorMessage = `Le ${fieldName === 'first_name' ? 'prénom' : 'nom'} est obligatoire`;
                    } else if (value && value.length < 2) {
                        isValid = false;
                        errorMessage = 'Minimum 2 caractères';
                    }
                    break;
                    
                case 'email':
                    if ($field.prop('required') && !value) {
                        isValid = false;
                        errorMessage = 'Email obligatoire';
                    } else if (value && !isValidEmail(value)) {
                        isValid = false;
                        errorMessage = 'Format email invalide';
                    }
                    break;
                    
                case 'phone':
                    // Validation gérée par le système avancé
                    return;
                    
                case 'experience':
                    if ($field.prop('required') && !value) {
                        isValid = false;
                        errorMessage = 'Description obligatoire';
                    } else if (value && value.length < 50) {
                        isValid = false;
                        errorMessage = `${value.length}/50 caractères minimum`;
                    }
                    break;
                    
                case 'linkedin_url':
                    if (value && !value.includes('linkedin.com')) {
                        isValid = false;
                        errorMessage = 'URL LinkedIn invalide';
                    }
                    break;
            }
            
            // Application du résultat
            if (isValid && value) {
                $formGroup.addClass('success');
                showSuccessIcon($field);
            } else if (!isValid) {
                $formGroup.addClass('error');
                $errorMsg.text(errorMessage).css('opacity', 1);
                showErrorIcon($field);
            }
            
            return isValid;
        }

        function showSuccessIcon($field) {
            const $formGroup = $field.closest('.trpro-form-group');
            $formGroup.find('.validation-icon').remove();
            $formGroup.append('<i class="fas fa-check-circle validation-icon success-icon"></i>');
        }

        function showErrorIcon($field) {
            const $formGroup = $field.closest('.trpro-form-group');
            $formGroup.find('.validation-icon').remove();
            $formGroup.append('<i class="fas fa-times-circle validation-icon error-icon"></i>');
        }

        function displayErrors(errors) {
            clearStepErrors();
            
            if (errors.length === 0) return;
            
            const $errorContainer = $(`
                <div class="trpro-step-errors">
                    <div class="trpro-error-header">
                        <i class="fas fa-exclamation-triangle"></i>
                        <strong>Veuillez corriger les erreurs suivantes :</strong>
                    </div>
                    <ul class="trpro-error-list"></ul>
                </div>
            `);
            
            const $errorList = $errorContainer.find('.trpro-error-list');
            
            errors.forEach(error => {
                const $errorItem = $(`
                    <li class="trpro-error-item">
                        <span class="trpro-error-text">
                            <i class="fas fa-times-circle"></i>
                            ${error.message}
                        </span>
                        <button type="button" class="trpro-error-goto" data-selector="${error.selector}">
                            Corriger
                        </button>
                    </li>
                `);
                
                $errorList.append($errorItem);
                highlightErrorField(error.selector);
            });
            
            const $currentStep = $(`.trpro-form-step[data-step="${CONFIG.form.currentStep}"]`);
            $currentStep.prepend($errorContainer);
            
            $errorContainer.hide().slideDown(300);
            
            $errorContainer.find('.trpro-error-goto').on('click', function() {
                const selector = $(this).data('selector');
                scrollToField(selector);
                $(selector).focus();
            });
        }

        function highlightErrorField(selector) {
            const $field = $(selector);
            const $formGroup = $field.closest('.trpro-form-group');
            
            $formGroup.addClass('error');
            $field.addClass('trpro-field-error-highlight');
            
            if (selector === '.trpro-checkbox-grid' || selector === '.trpro-regions-grid') {
                $(selector).addClass('trpro-error-highlight');
            }
            
            if (selector === '#trpro-rgpd-consent') {
                $('.trpro-required-consent').addClass('error');
            }
        }

        function clearStepErrors() {
            $('.trpro-step-errors').remove();
            $('.trpro-form-group').removeClass('error success');
            $('.trpro-error-message').text('').css('opacity', 0);
            $('.trpro-field-error-highlight').removeClass('trpro-field-error-highlight');
            $('.trpro-error-highlight').removeClass('trpro-error-highlight');
            $('.trpro-required-consent').removeClass('error');
        }

        function scrollToFirstError() {
            const $firstError = $('.trpro-step-errors');
            if ($firstError.length > 0) {
                $('html, body').animate({
                    scrollTop: $firstError.offset().top - 120
                }, 500);
            }
        }

        function scrollToField(selector) {
            const $field = $(selector);
            if ($field.length > 0) {
                $('html, body').animate({
                    scrollTop: $field.offset().top - 150
                }, 400);
            }
        }

        function scrollToForm() {
            const container = $('.trpro-registration-container');
            if (container.length > 0) {
                $('html, body').animate({
                    scrollTop: container.offset().top - 100
                }, 400);
            }
        }

        function scrollToMessage() {
            if (elements.messages.length > 0) {
                $('html, body').animate({
                    scrollTop: elements.messages.offset().top - 100
                }, 400);
            }
        }

        function showMessage(type, message) {
            const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
            
            elements.messages
                .removeClass('success error')
                .addClass(type)
                .html(`<i class="fas fa-${icon}"></i> ${escapeHtml(message)}`)
                .fadeIn(300);
            
            if (type === 'success') {
                setTimeout(() => {
                    elements.messages.fadeOut(300);
                }, 5000);
            }
        }

        function showSearchLoading() {
            $('#trpro-search-loading').show();
            $('#trpro-trainers-grid, #trpro-search-results').hide();
        }

        function hideSearchLoading() {
            $('#trpro-search-loading').hide();
            $('#trpro-trainers-grid, #trpro-search-results').show();
        }

        function showNoResults() {
            const $container = $('#trpro-trainers-grid, #trpro-search-results');
            $container.html(`
                <div class="trpro-no-results">
                    <div class="trpro-empty-icon">
                        <i class="fas fa-search-minus"></i>
                    </div>
                    <h3>Aucun résultat trouvé</h3>
                    <p>Essayez de modifier vos critères de recherche</p>
                </div>
            `).show();
        }

        function showSearchError() {
            const $container = $('#trpro-trainers-grid, #trpro-search-results');
            $container.html(`
                <div class="trpro-search-error">
                    <div class="trpro-error-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3>Erreur de recherche</h3>
                    <p>Impossible d'effectuer la recherche. Veuillez réessayer.</p>
                </div>
            `).show();
        }

        function showProfileError(message) {
            const errorHTML = `
                <div class="trpro-modal-overlay active" id="trpro-profile-error-modal">
                    <div class="trpro-modal-container">
                        <div class="trpro-modal-header">
                            <h4>Erreur</h4>
                            <button class="trpro-modal-close"><i class="fas fa-times"></i></button>
                        </div>
                        <div class="trpro-modal-content">
                            <div class="trpro-error-state">
                                <div class="trpro-error-icon">
                                    <i class="fas fa-exclamation-triangle"></i>
                                </div>
                                <p>${escapeHtml(message)}</p>
                                <button class="trpro-btn trpro-btn-primary" onclick="$('#trpro-profile-error-modal').remove(); $('body').removeClass('modal-open');">
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            $('body').append(errorHTML);
            $('body').addClass('modal-open');
        }

        function updateResultsCount(count) {
            const $counter = $('.trpro-results-count');
            if ($counter.length > 0) {
                const text = count === 0 ? 'Aucun formateur trouvé' : 
                           count === 1 ? '1 formateur trouvé' : 
                           `${count} formateurs trouvés`;
                $counter.text(text);
            }
        }

        function validateSpecialties() {
            const $checked = $('input[name="specialties[]"]:checked');
            const $container = $('.trpro-checkbox-grid');
            const $errorMsg = $('#trpro-specialties-error');
            
            $container.removeClass('trpro-error-highlight');
            $errorMsg.text('');
            
            if ($checked.length === 0) {
                $container.addClass('trpro-error-highlight');
                $errorMsg.text('Sélectionnez au moins une spécialité');
                return false;
            }
            
            return true;
        }

        function validateRegions() {
            const $checked = $('input[name="intervention_regions[]"]:checked');
            const $container = $('.trpro-regions-grid');
            const $errorMsg = $('#trpro-regions-error');
            
            $container.removeClass('trpro-error-highlight');
            $errorMsg.text('');
            
            if ($checked.length === 0) {
                $container.addClass('trpro-error-highlight');
                $errorMsg.text('Sélectionnez au moins une zone d\'intervention');
                return false;
            }
            
            return true;
        }

        function validateRgpd() {
            const $checkbox = $('#trpro-rgpd-consent');
            const $container = $('.trpro-required-consent');
            const $errorMsg = $('#trpro-rgpd-error');
            
            $container.removeClass('error');
            $errorMsg.text('');
            
            if (!$checkbox.prop('checked')) {
                $container.addClass('error');
                $errorMsg.text('Consentement RGPD obligatoire');
                return false;
            }
            
            return true;
        }

        function validateFileField($input, file) {
            const $formGroup = $input.closest('.trpro-form-group');
            const $errorMsg = $input.siblings('.trpro-error-message');
            const fieldName = $input.attr('name');
            
            $formGroup.removeClass('error success');
            $errorMsg.text('');
            
            let isValid = true;
            let errorMessage = '';
            
            if (fieldName === 'cv_file') {
                if (file.size > 5 * 1024 * 1024) {
                    isValid = false;
                    errorMessage = `Fichier trop volumineux (${formatFileSize(file.size)}). Maximum: 5MB`;
                } else {
                    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                    if (!allowedTypes.includes(file.type)) {
                        isValid = false;
                        errorMessage = 'Format non supporté. Utilisez PDF, DOC ou DOCX';
                    }
                }
            } else if (fieldName === 'photo_file') {
                if (file.size > 2 * 1024 * 1024) {
                    isValid = false;
                    errorMessage = `Image trop volumineuse (${formatFileSize(file.size)}). Maximum: 2MB`;
                } else {
                    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                    if (!allowedTypes.includes(file.type)) {
                        isValid = false;
                        errorMessage = 'Format non supporté. Utilisez JPG, PNG ou GIF';
                    }
                }
            }
            
            if (isValid) {
                $formGroup.addClass('success');
            } else {
                $formGroup.addClass('error');
                $errorMsg.text(errorMessage);
            }
        }

        function handleFormError(xhr, status, error) {
            let errorMessage = 'Erreur de connexion. Veuillez réessayer.';
            
            if (status === 'timeout') {
                errorMessage = 'La requête a expiré. Veuillez réessayer.';
            } else if (xhr.responseJSON?.data?.message) {
                errorMessage = xhr.responseJSON.data.message;
            }
            
            showMessage('error', errorMessage);
        }

        // ===== ANIMATIONS =====
        
        function initFormAnimations() {
            // Animation d'easing personnalisée
            if ($.easing) {
                $.easing.easeOutCubic = function(x, t, b, c, d) {
                    return c*((t=t/d-1)*t*t + 1) + b;
                };
            }
            
            // Animation des champs au focus
            elements.form.find('input, textarea, select').on('focus', function() {
                $(this).closest('.trpro-form-group').addClass('focused');
            }).on('blur', function() {
                $(this).closest('.trpro-form-group').removeClass('focused');
            });
        }

        function initGlobalAnimations() {
            // Intersection Observer pour les animations
            if (typeof IntersectionObserver !== 'undefined') {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('trpro-fade-in');
                        }
                    });
                }, { threshold: 0.1 });

                // Observer les éléments animables
                $('.trpro-specialty-card, .trpro-card, .trpro-trainer-card').each(function() {
                    observer.observe(this);
                });
            }
        }

        // ===== CHECKBOXES =====
        
        function initCheckboxes() {
            // Clic sur les items de checkbox
            $(document).on('click', '.trpro-checkbox-item', function(e) {
                if ($(e.target).is('input[type="checkbox"]') || $(e.target).is('label')) {
                    return;
                }
                
                const $checkbox = $(this).find('input[type="checkbox"]');
                $checkbox.prop('checked', !$checkbox.prop('checked')).trigger('change');
            });
            
            // Consentement
            $(document).on('click', '.trpro-consent-wrapper', function(e) {
                if ($(e.target).is('input[type="checkbox"]') || $(e.target).is('label')) {
                    return;
                }
                
                const $checkbox = $(this).find('input[type="checkbox"]');
                $checkbox.prop('checked', !$checkbox.prop('checked')).trigger('change');
            });
        }

        // ===== RÉSUMÉ DU FORMULAIRE =====
        
        function generateSummary() {
            const $summary = $('#trpro-registration-summary');
            $summary.empty();
            
            // Informations personnelles
            addSummaryItem($summary, 'Nom complet', `${$('#trpro-first-name').val()} ${$('#trpro-last-name').val()}`);
            addSummaryItem($summary, 'Email', $('#trpro-email').val());
            
            // Téléphone avec indicatif
            const countryCode = getCurrentCountryCode();
            const phone = $('#trpro-phone').val();
            addSummaryItem($summary, 'Téléphone', `${countryCode} ${phone}`);
            
            const company = $('#trpro-company').val();
            if (company) {
                addSummaryItem($summary, 'Entreprise', company);
            }
            
            const linkedin = $('#trpro-linkedin-url').val();
            if (linkedin) {
                addSummaryItem($summary, 'LinkedIn', linkedin);
            }
            
            // Spécialités
            const specialties = [];
            $('input[name="specialties[]"]:checked').each(function() {
                const label = $(this).siblings('label').text().trim();
                specialties.push(label);
            });
            if (specialties.length > 0) {
                addSummaryItem($summary, 'Spécialités', specialties.join(', '));
            }
            
            // Zones d'intervention
            const regions = [];
            $('input[name="intervention_regions[]"]:checked').each(function() {
                const label = $(this).siblings('label').text().trim();
                regions.push(label);
            });
            if (regions.length > 0) {
                addSummaryItem($summary, 'Zones d\'intervention', regions.join(', '));
            }
            
            // Fichiers
            const cvFile = $('#trpro-cv-file')[0].files[0];
            if (cvFile) {
                addSummaryItem($summary, 'CV', `${cvFile.name} (${formatFileSize(cvFile.size)})`);
            }
            
            const photoFile = $('#trpro-photo-file')[0].files[0];
            if (photoFile) {
                addSummaryItem($summary, 'Photo', `${photoFile.name} (${formatFileSize(photoFile.size)})`);
            }
        }

        function addSummaryItem($container, label, value) {
            if (!value) return;
            
            const $item = $(`
                <div class="trpro-summary-item">
                    <div class="trpro-summary-label">${escapeHtml(label)}</div>
                    <div class="trpro-summary-value">${escapeHtml(value)}</div>
                </div>
            `);
            
            $container.append($item);
        }

        // ===== INJECTION DES STYLES POUR TÉLÉPHONE =====
        
        function injectPhoneStyles() {
            const phoneStyles = `
                <style>
                .trpro-phone-preview {
                    background: #f1f5f9;
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    padding: 12px 16px;
                    margin-top: 12px;
                    font-family: 'Courier New', monospace;
                    font-weight: 600;
                    color: #475569;
                    transition: all 0.3s ease;
                }

                .trpro-field-help {
                    font-size: 13px;
                    margin-top: 6px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    transition: all 0.3s ease;
                }

                .trpro-field-help.info { color: #3b82f6; }
                .trpro-field-help.success { color: #10b981; }
                .trpro-field-help.error { color: #ef4444; }

                .trpro-custom-code-input {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                </style>
            `;
            
            $('head').append(phoneStyles);
        }

        // ===== DEBUG (Développement) =====
        
        if (window.location.hostname === 'localhost' || window.location.hostname.includes('dev')) {
            window.trainerDebug = {
                config: CONFIG,
                elements: elements,
                currentStep: () => CONFIG.form.currentStep,
                validateStep: () => validateCurrentStep(),
                showStep: (step) => showStep(step),
                resetForm: () => {
                    elements.form[0].reset();
                    $('.trpro-regions-counter').hide();
                    CONFIG.form.currentStep = 1;
                    showStep(1);
                },
                testPhone: (country, phone) => {
                    elements.countryCodeSelect.val(country).trigger('change');
                    elements.phoneInput.val(phone).trigger('input');
                }
            };
            console.log('🛠️ Debug disponible: window.trainerDebug');
        }

        // ===== CLEANUP =====
        
        $(window).on('beforeunload', function() {
            if (CONFIG.search.currentRequest) {
                CONFIG.search.currentRequest.abort();
            }
            clearTimeout(CONFIG.search.timeout);
            clearTimeout(CONFIG.validation.timeout);
        });

        console.log('✅ Trainer Registration Pro: Initialisation terminée');
    });

})(jQuery);
