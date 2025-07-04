<?php
/**
 * Template carte formateur moderne CORRIGÉ - Sans ID, badges basés sur l'expérience
 * 
 * Fichier: public/partials/trainer-card-modern.php
 * Variable disponible: $trainer (objet avec les données du formateur)
 */

if (!defined('ABSPATH')) {
    exit;
}

// Récupérer les paramètres de contact
$contact_email = get_option('trainer_contact_email', get_option('admin_email'));
$contact_phone = get_option('trainer_contact_phone', '');

// ✅ ANONYMISATION DU NOM : Première lettre du nom + point + prénom complet
$display_name = '';
if (!empty($trainer->last_name) && !empty($trainer->first_name)) {
    $display_name = strtoupper(substr($trainer->last_name, 0, 1)) . '. ' . $trainer->first_name;
} else {
    $display_name = 'Formateur Expert';
}

// Parser les spécialités
$specialties = array_map('trim', explode(',', $trainer->specialties));
$main_specialties = array_slice($specialties, 0, 3);
$remaining_count = count($specialties) - 3;

// ✅ Parser les régions d'intervention si disponibles
$intervention_regions = array();
if (!empty($trainer->intervention_regions)) {
    $intervention_regions = array_map('trim', explode(',', $trainer->intervention_regions));
}

// Mapping des régions avec labels français
$region_labels = array(
    'auvergne-rhone-alpes' => 'Auvergne-Rhône-Alpes',
    'bourgogne-franche-comte' => 'Bourgogne-Franche-Comté',
    'bretagne' => 'Bretagne',
    'centre-val-de-loire' => 'Centre-Val de Loire',
    'corse' => 'Corse',
    'grand-est' => 'Grand Est',
    'hauts-de-france' => 'Hauts-de-France',
    'ile-de-france' => 'Île-de-France',
    'normandie' => 'Normandie',
    'nouvelle-aquitaine' => 'Nouvelle-Aquitaine',
    'occitanie' => 'Occitanie',
    'pays-de-la-loire' => 'Pays de la Loire',
    'provence-alpes-cote-azur' => 'Provence-Alpes-Côte d\'Azur',
    'outre-mer' => 'DOM-TOM',
    'europe' => 'Europe',
    'international' => 'International',
    'distanciel' => 'Distanciel'
);

// ✅ NOUVEAU : Badge de niveau d'expérience basé sur experience_level
$experience_level = $trainer->experience_level ?? 'intermediaire';
$experience_badges = array(
    'junior' => array(
        'label' => 'Junior',
        'class' => 'junior',
        'icon' => 'fas fa-seedling',
        'description' => '< 3 ans d\'expérience'
    ),
    'intermediaire' => array(
        'label' => 'Intermédiaire',
        'class' => 'intermediaire',
        'icon' => 'fas fa-chart-line',
        'description' => '3-7 ans d\'expérience'
    ),
    'senior' => array(
        'label' => 'Senior',
        'class' => 'senior',
        'icon' => 'fas fa-award',
        'description' => '7-15 ans d\'expérience'
    ),
    'expert' => array(
        'label' => 'Expert',
        'class' => 'expert',
        'icon' => 'fas fa-crown',
        'description' => '15+ ans d\'expérience'
    )
);

$experience_badge = $experience_badges[$experience_level] ?? $experience_badges['intermediaire'];

// Mapping des icônes par spécialité
$specialty_icons = [
    'administration-systeme' => 'fas fa-server',
    'reseaux' => 'fas fa-network-wired', 
    'cloud' => 'fab fa-aws',
    'devops' => 'fas fa-infinity',
    'securite' => 'fas fa-shield-alt',
    'telecoms' => 'fas fa-satellite-dish',
    'developpement' => 'fas fa-code',
    'bases-donnees' => 'fas fa-database'
];
?>

<article class="trpro-trainer-card-modern" 
         itemscope 
         itemtype="https://schema.org/Person"
         data-trainer-id="<?php echo esc_attr($trainer->id); ?>"
         data-specialties="<?php echo esc_attr($trainer->specialties); ?>"
         data-regions="<?php echo esc_attr($trainer->intervention_regions ?? ''); ?>"
         data-experience-level="<?php echo esc_attr($experience_level); ?>">
    
    <!-- Card Header avec photo et badge -->
    <div class="trpro-card-header">
        <div class="trpro-trainer-avatar">
            <?php if (!empty($trainer->photo_file)): ?>
                <?php 
                $upload_dir = wp_upload_dir();
                $photo_url = $upload_dir['baseurl'] . '/' . $trainer->photo_file;
                ?>
                <img src="<?php echo esc_url($photo_url); ?>" 
                     alt="Photo du formateur <?php echo esc_attr($display_name); ?>" 
                     loading="lazy"
                     itemprop="image">
            <?php else: ?>
                <div class="trpro-avatar-placeholder">
                    <i class="fas fa-user-graduate"></i>
                </div>
            <?php endif; ?>
            
            <!-- ✅ Badge de niveau d'expérience -->
            <div class="trpro-status-badge trpro-badge-<?php echo $experience_badge['class']; ?>" 
                 title="<?php echo esc_attr($experience_badge['description']); ?>">
                <i class="<?php echo $experience_badge['icon']; ?>"></i>
                <span><?php echo $experience_badge['label']; ?></span>
            </div>
        </div>
        
        <!-- Badges de vérification -->
        <div class="trpro-verification-badges">
            <div class="trpro-badge trpro-verified" title="Profil vérifié">
                <i class="fas fa-check-circle"></i>
            </div>
            <?php if (!empty($trainer->cv_file)): ?>
                <div class="trpro-badge trpro-cv-badge" title="CV disponible">
                    <i class="fas fa-file-pdf"></i>
                </div>
            <?php endif; ?>
            <?php if (!empty($intervention_regions)): ?>
                <div class="trpro-badge trpro-location-badge" title="<?php echo count($intervention_regions); ?> zone(s) d'intervention">
                    <i class="fas fa-map-marker-alt"></i>
                </div>
            <?php endif; ?>
        </div>
    </div>
    
    <!-- Card Body -->
    <div class="trpro-card-body">
        <!-- ✅ Informations principales avec nom anonymisé (SANS ID) -->
        <div class="trpro-trainer-identity">
            <h3 class="trpro-trainer-name" itemprop="name">
                <?php echo esc_html($display_name); ?>
            </h3>
            
            <?php if (!empty($trainer->company)): ?>
                <div class="trpro-trainer-company" itemprop="worksFor">
                    <i class="fas fa-building"></i>
                    <span><?php echo esc_html($trainer->company); ?></span>
                </div>
            <?php endif; ?>
        </div>

        <!-- ✅ Zones d'intervention -->
        <?php if (!empty($intervention_regions)): ?>
            <div class="trpro-intervention-zones">
                <div class="trpro-zones-header">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>Zones d'intervention</span>
                </div>
                <div class="trpro-zones-list">
                    <?php 
                    $displayed_regions = array_slice($intervention_regions, 0, 2);
                    $remaining_regions = count($intervention_regions) - 2;
                    
                    foreach ($displayed_regions as $region): 
                        $region_label = $region_labels[$region] ?? ucfirst(str_replace('-', ' ', $region));
                    ?>
                        <span class="trpro-zone-tag"><?php echo esc_html($region_label); ?></span>
                    <?php endforeach; ?>
                    
                    <?php if ($remaining_regions > 0): ?>
                        <span class="trpro-zone-tag trpro-zone-more">+<?php echo $remaining_regions; ?></span>
                    <?php endif; ?>
                </div>
            </div>
        <?php endif; ?>
        
        <!-- Spécialités avec icônes -->
        <div class="trpro-specialties-section" itemprop="knowsAbout">
            <div class="trpro-specialties-grid">
                <?php foreach ($main_specialties as $specialty): 
                    $specialty = trim($specialty);
                    if (!empty($specialty)):
                        $icon = $specialty_icons[$specialty] ?? 'fas fa-cog';
                        $label = ucfirst(str_replace('-', ' ', $specialty));
                ?>
                    <div class="trpro-specialty-item">
                        <i class="<?php echo esc_attr($icon); ?>"></i>
                        <span><?php echo esc_html($label); ?></span>
                    </div>
                <?php 
                    endif;
                endforeach; 
                
                if ($remaining_count > 0):
                ?>
                    <div class="trpro-specialty-item trpro-specialty-more">
                        <i class="fas fa-plus"></i>
                        <span>+<?php echo $remaining_count; ?></span>
                    </div>
                <?php endif; ?>
            </div>
        </div>
        
        <!-- Extrait d'expérience -->
        <?php if (!empty($trainer->experience)): ?>
            <div class="trpro-experience-preview" itemprop="description">
                <div class="trpro-experience-text">
                    <?php echo esc_html(wp_trim_words($trainer->experience, 25, '...')); ?>
                </div>
            </div>
        <?php endif; ?>
        
        <!-- Métadonnées -->
        <div class="trpro-trainer-meta">
            <?php if (!empty($trainer->availability)): ?>
                <div class="trpro-meta-item">
                    <i class="fas fa-calendar-check"></i>
                    <span><?php echo esc_html(ucfirst(str_replace('-', ' ', $trainer->availability))); ?></span>
                </div>
            <?php endif; ?>
            
            <?php if (!empty($trainer->hourly_rate)): ?>
                <div class="trpro-meta-item">
                    <i class="fas fa-euro-sign"></i>
                    <span><?php echo esc_html($trainer->hourly_rate); ?></span>
                </div>
            <?php endif; ?>
            
            <div class="trpro-meta-item">
                <i class="fas fa-calendar-plus"></i>
                <span>Inscrit <?php echo human_time_diff(strtotime($trainer->created_at)); ?></span>
            </div>
        </div>
    </div>
    
    <!-- Card Footer avec actions -->
    <div class="trpro-card-footer">
        <div class="trpro-action-buttons">
            <?php if (!empty($contact_email)): ?>
                <a href="mailto:<?php echo esc_attr($contact_email); ?>?subject=Contact formateur <?php echo esc_attr($display_name); ?>&body=Bonjour,%0D%0A%0D%0AJe souhaite entrer en contact avec le formateur <?php echo esc_attr($display_name); ?> concernant ses spécialités en <?php echo esc_attr($trainer->specialties); ?>.%0D%0A%0D%0ACordialement" 
                   class="trpro-btn trpro-btn-primary"
                   title="Contacter ce formateur">
                    <i class="fas fa-envelope"></i>
                    <span>Contacter</span>
                </a>
            <?php endif; ?>
            
            <!-- ✅ Bouton pour voir le profil détaillé -->
            <button class="trpro-btn trpro-btn-outline trpro-btn-profile" 
                    data-trainer-id="<?php echo esc_attr($trainer->id); ?>"
                    title="Voir le profil détaillé">
                <i class="fas fa-user"></i>
                <span>Profil</span>
            </button>
        </div>
        
        <!-- Liens supplémentaires -->
        <div class="trpro-additional-links">
            <?php if (!empty($trainer->linkedin_url)): ?>
                <a href="<?php echo esc_url($trainer->linkedin_url); ?>" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="trpro-social-link"
                   title="Voir le profil LinkedIn">
                    <i class="fab fa-linkedin"></i>
                </a>
            <?php endif; ?>
            
            <?php if (!empty($contact_phone)): ?>
                <a href="tel:<?php echo esc_attr(preg_replace('/[^0-9+]/', '', $contact_phone)); ?>" 
                   class="trpro-social-link"
                   title="Appeler">
                    <i class="fas fa-phone"></i>
                </a>
            <?php endif; ?>
        </div>
    </div>
    
    <!-- Indicateur de popularité/matching (simulé) -->
    <div class="trpro-popularity-indicator">
        <div class="trpro-popularity-bar" style="width: <?php echo rand(60, 95); ?>%;"></div>
    </div>
</article>

<style>
/* ===== STYLES POUR LES NOUVELLES FONCTIONNALITÉS ===== */

/* Nom anonymisé (SANS ID) */
.trpro-trainer-name {
    font-size: 1.25rem;
    font-weight: 700;
    color: #0a2540;
    margin-bottom: 8px;
    text-align: center;
}

/* ✅ NOUVEAUX STYLES pour les badges d'expérience */
.trpro-status-badge {
    position: absolute;
    bottom: -8px;
    right: -8px;
    border-radius: 12px;
    padding: 4px 8px;
    font-size: 11px;
    font-weight: 600;
    border: 2px solid white;
    display: flex;
    align-items: center;
    gap: 4px;
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.trpro-badge-junior {
    background: linear-gradient(135deg, #22c55e, #16a34a);
}

.trpro-badge-intermediaire {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.trpro-badge-senior {
    background: linear-gradient(135deg, #f59e0b, #d97706);
}

.trpro-badge-expert {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
}

/* Zones d'intervention */
.trpro-intervention-zones {
    margin-bottom: 16px;
    padding: 12px;
    background: #f0f9ff;
    border-radius: 8px;
    border: 1px solid #e0f2fe;
}

.trpro-zones-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #0369a1;
}

.trpro-zones-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.trpro-zone-tag {
    background: #0ea5e9;
    color: white;
    padding: 3px 8px;
    border-radius: 10px;
    font-size: 0.7rem;
    font-weight: 500;
}

.trpro-zone-more {
    background: #64748b;
}

/* Badge de localisation */
.trpro-location-badge {
    background: #0ea5e9;
    color: white;
}

/* Responsive pour les nouvelles fonctionnalités */
@media (max-width: 768px) {
    .trpro-intervention-zones {
        padding: 8px;
    }
    
    .trpro-zones-list {
        justify-content: center;
    }
}

/* Animation pour les nouvelles zones */
.trpro-zone-tag {
    animation: fadeInScale 0.3s ease-out;
}

@keyframes fadeInScale {
    from {
        opacity: 0;
        transform: scale(0.8);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* Amélioration de l'espacement des cartes */
.trpro-trainer-identity {
    margin-bottom: 16px;
    text-align: center;
}

.trpro-trainer-company {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    color: #635bff;
    font-size: 0.875rem;
    font-weight: 500;
    margin-top: 8px;
}

.trpro-trainer-company i {
    font-size: 0.75rem;
}

/* ✅ Animation des badges d'expérience */
.trpro-status-badge {
    animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
    0%, 100% { 
        transform: scale(1);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    50% { 
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }
}

/* Pause animation au hover */
.trpro-trainer-card-modern:hover .trpro-status-badge {
    animation-play-state: paused;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // ===== GESTION DES MODALS DE PROFIL =====
    const profileButtons = document.querySelectorAll('.trpro-btn-profile');
    
    profileButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const trainerId = this.dataset.trainerId;
            
            // Charger le profil via AJAX
            loadTrainerProfile(trainerId);
        });
    });

    function loadTrainerProfile(trainerId) {
        // Afficher un loading
        showProfileLoadingModal();
        
        // Requête AJAX pour récupérer le profil
        jQuery.ajax({
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
        
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
        document.body.classList.add('modal-open');
    }

    function hideProfileLoadingModal() {
        const modal = document.getElementById('trpro-profile-loading-modal');
        if (modal) {
            modal.remove();
        }
        document.body.classList.remove('modal-open');
    }

    function showProfileModal(profileData) {
        const regions = profileData.intervention_regions || [];
        const specialties = profileData.specialties || [];
        
        // Mapping des badges d'expérience
        const experienceBadges = {
            'junior': { label: 'Junior', icon: 'fas fa-seedling', class: 'junior' },
            'intermediaire': { label: 'Intermédiaire', icon: 'fas fa-chart-line', class: 'intermediaire' },
            'senior': { label: 'Senior', icon: 'fas fa-award', class: 'senior' },
            'expert': { label: 'Expert', icon: 'fas fa-crown', class: 'expert' }
        };
        
        const experienceBadge = experienceBadges[profileData.experience_level] || experienceBadges['intermediaire'];
        
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
                                <div class="trpro-modal-badge trpro-badge-${experienceBadge.class}">
                                    <i class="${experienceBadge.icon}"></i>
                                    <span>${experienceBadge.label}</span>
                                </div>
                            </div>
                            <div class="trpro-modal-info">
                                <h4>${escapeHtml(profileData.display_name)}</h4>
                                <p>Formateur ${experienceBadge.label}</p>
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
                            <a href="mailto:${trainer_ajax.contact_email || 'contact@example.com'}?subject=Contact formateur ${escapeHtml(profileData.display_name)}" 
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
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.body.classList.add('modal-open');
        
        // Ajouter les event listeners pour fermer
        const modal = document.getElementById(`trpro-profile-modal-${profileData.id}`);
        const closeBtn = modal.querySelector('.trpro-modal-close');
        
        closeBtn.addEventListener('click', function() {
            modal.remove();
            document.body.classList.remove('modal-open');
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                modal.remove();
                document.body.classList.remove('modal-open');
            }
        });
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
                            <button class="trpro-btn trpro-btn-primary" onclick="document.getElementById('trpro-profile-error-modal').remove(); document.body.classList.remove('modal-open');">
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', errorHTML);
        document.body.classList.add('modal-open');
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
    
    // ===== AMÉLIORATION DES INTERACTIONS =====
    
    // Effet hover sur les cartes
    const trainerCards = document.querySelectorAll('.trpro-trainer-card-modern');
    
    trainerCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.08)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.06), 0 4px 6px rgba(0, 0, 0, 0.04)';
        });
    });

    // Animation d'apparition progressive des cartes
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observer toutes les cartes
    trainerCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        cardObserver.observe(card);
    });
});
</script>
