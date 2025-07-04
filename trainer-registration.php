<?php
/**
 * Plugin Name: Trainer Registration Pro
 * Plugin URI: https://yoursite.com/trainer-registration-pro
 * Description: Plugin pour gérer les inscriptions des formateurs IT avec conformité RGPD
 * Version: 1.2.0
 * Author: Votre Nom
 * License: GPL v2 or later
 * Text Domain: trainer-registration-pro
 */

// Sécurité - Empêcher l'accès direct
if (!defined('ABSPATH')) {
    exit;
}

// Constantes du plugin
define('TRAINER_REGISTRATION_VERSION', '1.2.0');
define('TRAINER_REGISTRATION_PLUGIN_URL', plugin_dir_url(__FILE__));
define('TRAINER_REGISTRATION_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('TRAINER_REGISTRATION_PLUGIN_BASENAME', plugin_basename(__FILE__));

/**
 * Classe principale du plugin
 */
class TrainerRegistrationPlugin {

    private static $instance = null;
    private $admin = null;
    private $public = null;
    private $shortcodes = null;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // Hooks d'activation/désactivation
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));

        // Initialisation du plugin
        add_action('init', array($this, 'init'));
        add_action('plugins_loaded', array($this, 'load_textdomain'));
    }

    public function init() {
        // Charger les dépendances
        $this->load_dependencies();
        
        // Initialiser les classes
        if (class_exists('TrainerRegistrationPublic')) {
            $this->public = new TrainerRegistrationPublic();
        }
        
        if (class_exists('TrainerRegistrationShortcodes')) {
            $this->shortcodes = new TrainerRegistrationShortcodes();
        }
        
        if (is_admin() && class_exists('TrainerRegistrationAdmin')) {
            $this->admin = new TrainerRegistrationAdmin();
        }
        
        // Hooks additionnels
        add_filter('upload_mimes', array($this, 'add_upload_mimes'));
    }

    public function load_textdomain() {
        load_plugin_textdomain(
            'trainer-registration-pro',
            false,
            dirname(plugin_basename(__FILE__)) . '/languages/'
        );
    }

    private function load_dependencies() {
        // Classes principales
        $required_files = array(
            'includes/class-trainer-registration-admin.php',
            'includes/class-trainer-registration-public.php',
            'includes/class-trainer-registration-shortcodes.php',
            'includes/migration-database.php',
            'includes/regions-utilities.php',
            'includes/trpro-functions.php'
        );
        
        foreach ($required_files as $file) {
            $file_path = TRAINER_REGISTRATION_PLUGIN_PATH . $file;
            if (file_exists($file_path)) {
                require_once $file_path;
            }
        }
    }

    public function activate() {
        // Créer les tables
        $this->create_tables();
        
        // ✅ NOUVEAU : Vérifier et migrer si nécessaire
        $this->check_and_migrate_database();
        
        // Créer les dossiers d'upload
        $this->create_upload_folders();
        
        // Définir les options par défaut
        $this->set_default_options();
        
        // Flush rewrite rules
        flush_rewrite_rules();
    }

    public function deactivate() {
        flush_rewrite_rules();
    }

    /**
     * ✅ CORRIGÉ : Création de table complète avec experience_level
     */
    private function create_tables() {
        global $wpdb;

        $charset_collate = $wpdb->get_charset_collate();
        $table_name = $wpdb->prefix . 'trainer_registrations';
        
        $sql = "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            first_name varchar(100) NOT NULL,
            last_name varchar(100) NOT NULL,
            email varchar(100) NOT NULL,
            phone varchar(50) NOT NULL,
            company varchar(200),
            specialties text NOT NULL,
            intervention_regions text,
            experience_level varchar(20) DEFAULT 'intermediaire',
            experience text NOT NULL,
            cv_file varchar(255) NOT NULL,
            photo_file varchar(255),
            linkedin_url varchar(255),
            bio text,
            availability varchar(50),
            hourly_rate varchar(20),
            rgpd_consent tinyint(1) NOT NULL DEFAULT 0,
            marketing_consent tinyint(1) NOT NULL DEFAULT 0,
            status varchar(20) DEFAULT 'pending',
            admin_notes text,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY email (email),
            KEY status (status),
            KEY created_at (created_at),
            KEY specialties (specialties(100)),
            KEY intervention_regions (intervention_regions(100)),
            KEY experience_level (experience_level)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }
    
    /**
     * ✅ NOUVEAU : Vérifier et migrer la base existante
     */
    private function check_and_migrate_database() {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'trainer_registrations';
        
        // Vérifier si la table existe
        $table_exists = $wpdb->get_var("SHOW TABLES LIKE '$table_name'") === $table_name;
        
        if ($table_exists) {
            // Vérifier si le champ intervention_regions existe
            $regions_column = $wpdb->get_results(
                "SHOW COLUMNS FROM $table_name LIKE 'intervention_regions'"
            );
            
            // Si le champ n'existe pas, l'ajouter
            if (empty($regions_column)) {
                $wpdb->query(
                    "ALTER TABLE $table_name ADD COLUMN intervention_regions TEXT AFTER specialties"
                );
                error_log('TrainerRegistration: Champ intervention_regions ajouté à la table existante');
            }
            
            // ✅ NOUVEAU : Vérifier si le champ experience_level existe
            $experience_column = $wpdb->get_results(
                "SHOW COLUMNS FROM $table_name LIKE 'experience_level'"
            );
            
            // Si le champ n'existe pas, l'ajouter
            if (empty($experience_column)) {
                $wpdb->query(
                    "ALTER TABLE $table_name ADD COLUMN experience_level varchar(20) DEFAULT 'intermediaire' AFTER intervention_regions"
                );
                
                // Ajouter un index
                $wpdb->query("ALTER TABLE $table_name ADD INDEX idx_experience_level (experience_level)");
                
                error_log('TrainerRegistration: Champ experience_level ajouté à la table existante');
                
                // Migrer les données existantes
                $this->migrate_existing_experience_levels();
            }
            
            // ✅ NOUVEAU : Vérifier si le champ phone est assez large
            $phone_column = $wpdb->get_results(
                "SHOW COLUMNS FROM $table_name LIKE 'phone'"
            );
            
            if (!empty($phone_column)) {
                $phone_type = $phone_column[0]->Type;
                if (strpos($phone_type, 'varchar(20)') !== false) {
                    $wpdb->query(
                        "ALTER TABLE $table_name MODIFY COLUMN phone varchar(50) NOT NULL"
                    );
                    error_log('TrainerRegistration: Champ phone élargi pour les indicatifs');
                }
            }
        }
        
        // Mettre à jour la version de la base
        update_option('trainer_registration_db_version', '1.2.0');
    }
    
    /**
     * ✅ NOUVEAU : Migrer les niveaux d'expérience pour les données existantes
     */
    private function migrate_existing_experience_levels() {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'trainer_registrations';
        
        // Récupérer tous les formateurs sans niveau d'expérience
        $trainers = $wpdb->get_results("
            SELECT id, experience 
            FROM $table_name 
            WHERE experience_level IS NULL OR experience_level = ''
        ");
        
        foreach ($trainers as $trainer) {
            $experience_text = strtolower($trainer->experience);
            $experience_level = 'intermediaire'; // Par défaut
            
            // Analyser le texte pour déterminer le niveau
            if (preg_match('/\b(15|16|17|18|19|20|\d{2})\s*(ans?|années?)\b/', $experience_text, $matches)) {
                $years = intval($matches[1]);
                if ($years >= 15) {
                    $experience_level = 'expert';
                } elseif ($years >= 7) {
                    $experience_level = 'senior';
                } elseif ($years >= 3) {
                    $experience_level = 'intermediaire';
                } else {
                    $experience_level = 'junior';
                }
            } elseif (preg_match('/\b([5-9]|1[0-4])\s*(ans?|années?)\b/', $experience_text, $matches)) {
                $years = intval($matches[1]);
                if ($years >= 7) {
                    $experience_level = 'senior';
                } else {
                    $experience_level = 'intermediaire';
                }
            } elseif (preg_match('/\b([1-2])\s*(ans?|années?)\b/', $experience_text)) {
                $experience_level = 'junior';
            } elseif (preg_match('/(expert|expertise|experte?|senior|lead|architect|directeur|manager|chef)/i', $experience_text)) {
                $experience_level = 'expert';
            } elseif (preg_match('/(junior|débutant|commence|début|apprenti)/i', $experience_text)) {
                $experience_level = 'junior';
            }
            
            // Mettre à jour le niveau
            $wpdb->update(
                $table_name,
                array('experience_level' => $experience_level),
                array('id' => $trainer->id),
                array('%s'),
                array('%d')
            );
        }
        
        error_log('TrainerRegistration: Migration des niveaux d\'expérience terminée pour ' . count($trainers) . ' formateur(s)');
    }

    private function create_upload_folders() {
        $upload_dir = wp_upload_dir();
        $folders = array(
            '/trainer-files/',
            '/trainer-files/cv/',
            '/trainer-files/photos/'
        );
        
        foreach ($folders as $folder) {
            $dir_path = $upload_dir['basedir'] . $folder;
            
            if (!file_exists($dir_path)) {
                wp_mkdir_p($dir_path);
                
                // Créer un fichier .htaccess pour la sécurité
                $htaccess_content = "Options -Indexes\ndeny from all\n";
                file_put_contents($dir_path . '.htaccess', $htaccess_content);
                
                // Créer un fichier index.php vide
                file_put_contents($dir_path . 'index.php', '<?php // Silence is golden');
            }
        }
    }

    private function set_default_options() {
        $defaults = array(
            'trainer_auto_approve' => 0,
            'trainer_require_photo' => 0,
            'trainer_max_cv_size' => 5, // MB
            'trainer_max_photo_size' => 2, // MB
            'trainer_notification_email' => get_option('admin_email'),
            'trainer_notify_new_registration' => 1,
            'trainer_contact_email' => get_option('admin_email'),
            'trainer_contact_phone' => '',
            'trainer_company_name' => get_bloginfo('name'),
            'trainer_data_retention' => 3 // années
        );

        foreach ($defaults as $option => $value) {
            if (get_option($option) === false) {
                add_option($option, $value);
            }
        }
    }

    public function add_upload_mimes($mimes) {
        // Ajouter les types MIME pour les CV
        $mimes['doc'] = 'application/msword';
        $mimes['docx'] = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        
        return $mimes;
    }
}

// Initialiser le plugin
TrainerRegistrationPlugin::get_instance();

/**
 * ✅ NOUVEAU : Script de migration pour bases existantes
 * À exécuter une seule fois en admin
 */
function trainer_registration_manual_migration() {
    if (!current_user_can('manage_options')) {
        return;
    }
    
    global $wpdb;
    $table_name = $wpdb->prefix . 'trainer_registrations';
    
    $messages = array();
    
    // Vérifier le champ intervention_regions
    $regions_column = $wpdb->get_results(
        "SHOW COLUMNS FROM $table_name LIKE 'intervention_regions'"
    );
    
    if (empty($regions_column)) {
        $result = $wpdb->query(
            "ALTER TABLE $table_name ADD COLUMN intervention_regions TEXT AFTER specialties"
        );
        
        if ($result !== false) {
            $messages[] = '✅ Champ intervention_regions ajouté avec succès !';
        } else {
            $messages[] = '❌ Erreur lors de l\'ajout du champ intervention_regions : ' . $wpdb->last_error;
        }
    } else {
        $messages[] = 'ℹ️ Le champ intervention_regions existe déjà.';
    }
    
    // ✅ NOUVEAU : Vérifier le champ experience_level
    $experience_column = $wpdb->get_results(
        "SHOW COLUMNS FROM $table_name LIKE 'experience_level'"
    );
    
    if (empty($experience_column)) {
        $result = $wpdb->query(
            "ALTER TABLE $table_name ADD COLUMN experience_level varchar(20) DEFAULT 'intermediaire' AFTER intervention_regions"
        );
        
        if ($result !== false) {
            $wpdb->query("ALTER TABLE $table_name ADD INDEX idx_experience_level (experience_level)");
            $messages[] = '✅ Champ experience_level ajouté avec succès !';
        } else {
            $messages[] = '❌ Erreur lors de l\'ajout du champ experience_level : ' . $wpdb->last_error;
        }
    } else {
        $messages[] = 'ℹ️ Le champ experience_level existe déjà.';
    }
    
    // ✅ NOUVEAU : Vérifier la taille du champ phone
    $phone_column = $wpdb->get_results(
        "SHOW COLUMNS FROM $table_name LIKE 'phone'"
    );
    
    if (!empty($phone_column)) {
        $phone_type = $phone_column[0]->Type;
        if (strpos($phone_type, 'varchar(20)') !== false) {
            $result = $wpdb->query(
                "ALTER TABLE $table_name MODIFY COLUMN phone varchar(50) NOT NULL"
            );
            
            if ($result !== false) {
                $messages[] = '✅ Champ phone élargi pour les indicatifs internationaux !';
            } else {
                $messages[] = '❌ Erreur lors de l\'élargissement du champ phone : ' . $wpdb->last_error;
            }
        } else {
            $messages[] = 'ℹ️ Le champ phone a déjà la bonne taille.';
        }
    }
    
    foreach ($messages as $message) {
        $class = strpos($message, '✅') !== false ? 'success' : (strpos($message, '❌') !== false ? 'error' : 'info');
        echo '<div class="notice notice-' . $class . '"><p>' . $message . '</p></div>';
    }
}

// Hook pour exécuter la migration depuis l'admin
add_action('wp_ajax_trainer_manual_migration', 'trainer_registration_manual_migration');

/**
 * ✅ NOUVEAU : Hook pour déclencher les migrations automatiquement
 */
add_action('plugins_loaded', function() {
    if (is_admin()) {
        $current_version = get_option('trainer_registration_db_version', '1.0.0');
        
        if (version_compare($current_version, TRAINER_REGISTRATION_VERSION, '<')) {
            // Inclure et exécuter les migrations
            if (class_exists('TrainerRegistrationMigration')) {
                $migration = TrainerRegistrationMigration::get_instance();
                $migration->run_migrations();
            }
        }
    }
});
