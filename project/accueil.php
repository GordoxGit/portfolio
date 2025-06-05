<?php
// Démarrer la session PHP tout au début du script
ini_set('session.use_strict_mode', 1);
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', isset($_SERVER['HTTPS']));
ini_set('session.cookie_samesite', 'Lax');
session_start();

// --- CONFIGURATION DE LA BASE DE DONNÉES ---
$db_host = 'localhost';
$db_name = 'rapportsite';
$db_user = 'root';
$db_pass = 'uD4kHXXn2W9gFPb'; // Assurez-vous que c'est le bon mot de passe pour votre environnement de développement
// --- FIN CONFIGURATION BDD ---

// --- CONFIGURATION DES RAPPORTS ---
$reports_data = [
    [
        "id" => "stockgenius_archi_spa",
        "title" => "SPA - Architecture StockGenius XAU",
        "url" => "structure.html", // S'assurer que structure.html est dans le même répertoire que accueil.php
        "description" => "Application SPA interactive présentant l'architecture du projet StockGenius XAU."
    ],
    [
        "id" => "comparative_study_ai_trading_models",
        "title" => "Étude Comparative : Modèles d'IA pour le Trading (XAU/USD)", // Traduit
        "url" => "model_compare.html", // Chemin vers le nouveau rapport
        "description" => "Une étude approfondie comparant divers modèles d'IA pour le trading XAU/USD, incluant architectures, coûts, performances et critères de sélection." // Traduit
    ],
    [
        "id" => "optimisation_strategies_trading",
        "title" => "Optimisation des Stratégies de Trading Algorithmique",
        "url" => "strategie.html", // Assurez-vous que ce nom de fichier correspond
        "description" => "Un guide complet sur les techniques, métriques et pièges de l'optimisation des stratégies de trading."
    ],
    [
        "id" => "analyse_sources_donnees_xauusd",
        "title" => "Analyse des Sources de Données XAU/USD (2005-2025)",
        "url" => "donnee.html", // Assurez-vous que ce nom de fichier correspond
        "description" => "Examen détaillé des fournisseurs de données XAU/USD pour le trading quantitatif, incluant accès, coûts et exemples."
    ],
    // Vous pouvez ajouter d'autres rapports ici
];
// --- FIN CONFIGURATION RAPPORTS ---

$login_error = '';
$is_logged_in = isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true;

if (isset($_POST['logout'])) {
    $_SESSION = array();
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    session_destroy();
    header("Location: accueil.php");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['username']) && isset($_POST['password'])) {
    $username_attempt = trim($_POST['username']);
    $password_attempt = $_POST['password'];

    if (empty($username_attempt) || empty($password_attempt)) {
        $login_error = "Veuillez remplir tous les champs.";
    } else {
        try {
            $conn = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

            $stmt = $conn->prepare("SELECT id, username, password_hash FROM users WHERE username = :username LIMIT 1");
            $stmt->bindParam(':username', $username_attempt, PDO::PARAM_STR);
            $stmt->execute();

            if ($stmt->rowCount() == 1) {
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                if (password_verify($password_attempt, $user['password_hash'])) {
                    session_regenerate_id(true);
                    $_SESSION['loggedin'] = true;
                    $_SESSION['user_id'] = $user['id'];
                    $_SESSION['username'] = $user['username'];
                    $is_logged_in = true;
                    header("Location: accueil.php"); 
                    exit;
                } else {
                    $login_error = "Nom d'utilisateur ou mot de passe incorrect.";
                }
            } else {
                $login_error = "Nom d'utilisateur ou mot de passe incorrect.";
            }
        } catch(PDOException $e) {
            $login_error = "Erreur de connexion à la base de données. Veuillez réessayer plus tard.";
            // Log l'erreur de manière sécurisée, ne pas l'afficher directement à l'utilisateur en production
            error_log("Erreur BDD - Rapports (" . $e->getCode() . "): " . $e->getMessage());
        }
        $conn = null;
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portail Sécurisé - Romain Begot</title>
    <meta name="robots" content="noindex, nofollow"> <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="css/secret-style.css"> 
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* Styles spécifiques pour la page de connexion et le tableau de bord */
        .login-container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .dashboard-bg {
            background: linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%); /* Fond légèrement ajusté pour la douceur */
        }
        
        /* Effet de lueur subtile pour le logo */
        .logo-glow {
            filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
        }
        /* Styles pour le spinner de chargement */
        .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border-left-color: #0ea5e9; /* sky-500 pour correspondre au design */
            animation: spin 1s ease infinite;
            margin-left: auto;
            margin-right: auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .card-enhanced {
            transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
        }
        .card-enhanced:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -4px rgba(0, 0, 0, 0.07);
        }
    </style>
</head>
<body class="text-slate-800 bg-slate-50">

<?php if (!$is_logged_in): ?>
    <div class="login-container flex items-center justify-center p-4">
        <div class="w-full max-w-md bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl fade-in">
            <div class="text-center mb-8">
                <img src="../img/22 mai 2025, 13_51_32.png" alt="Logo Romain Begot" class="mx-auto h-16 w-auto mb-4 logo-glow">
                <h1 class="text-2xl font-bold text-slate-800 mb-2">Portail Sécurisé</h1>
                <p class="text-slate-600">Accès aux rapports techniques</p>
            </div>
            
            <form method="POST" action="accueil.php" class="space-y-6">
                <div class="space-y-4">
                    <div>
                        <label for="username-input" class="block text-sm font-medium text-slate-700 mb-2">
                            Nom d'utilisateur
                        </label>
                        <input type="text" id="username-input" name="username" 
                               class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                               value="<?php echo isset($_POST['username']) ? htmlspecialchars($_POST['username']) : ''; ?>" 
                               required>
                    </div>
                    <div>
                        <label for="password-input" class="block text-sm font-medium text-slate-700 mb-2">
                            Mot de passe
                        </label>
                        <input type="password" id="password-input" name="password" 
                               class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                               required>
                    </div>
                </div>
                
                <button type="submit" class="w-full btn-enhanced bg-sky-600 text-white py-3 hover:bg-sky-700">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                    Se connecter
                </button>
            </form>
            
            <?php if ($login_error): ?>
                <div class="mt-4 error-message p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg">
                    <?php echo htmlspecialchars($login_error); ?>
                </div>
            <?php endif; ?>
        </div>
    </div>
<?php else: ?>
    <div class="dashboard-bg min-h-screen flex flex-col">
        <header class="enhanced-header bg-slate-800 text-white p-4 shadow-md">
            <div class="container mx-auto flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <a href="../index.html" class="hover:opacity-80 transition-opacity">
                        <img src="../img/22 mai 2025, 13_51_32.png" alt="Logo" class="h-10 w-auto"> </a>
                    <div>
                        <h1 class="text-xl font-semibold tracking-tight">Portail des Rapports</h1>
                        <p class="text-sm text-sky-300">Bienvenue, <?php echo htmlspecialchars($_SESSION['username']); ?> !</p>
                    </div>
                </div>
                <form method="POST" action="accueil.php">
                    <input type="hidden" name="logout" value="1">
                    <button type="submit" class="btn-enhanced bg-red-600 text-white hover:bg-red-700">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                        Déconnexion
                    </button>
                </form>
            </div>
        </header>

        <div class="flex flex-1 overflow-hidden container mx-auto mt-4 mb-4 gap-4">
            <aside class="w-1/3 lg:w-1/4 bg-white shadow-xl rounded-lg border border-slate-200 p-6 overflow-y-auto">
                <h2 class="text-xl font-semibold text-slate-800 mb-6">Rapports disponibles</h2>
                <div id="report-list" class="space-y-3">
                    </div>
            </aside>

            <main class="w-2/3 lg:w-3/4 bg-white shadow-xl rounded-lg border border-slate-200 p-1">
                <div id="iframe-placeholder" class="flex items-center justify-center h-full">
                    <div class="text-center p-10">
                        <div class="spinner mb-4"></div> 
                        <h3 class="text-xl font-medium text-slate-700 mb-2">Sélectionnez un rapport</h3>
                        <p class="text-slate-500">Choisissez un rapport dans le menu de gauche pour le visualiser.</p>
                    </div>
                </div>
                <div id="iframe-container" class="enhanced-iframe-container hidden h-full">
                    <iframe id="report-viewer-iframe" class="w-full h-full border-0 rounded-lg" 
                            title="Visualiseur de rapport"
                            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals">
                    </iframe>
                </div>
            </main>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Tableau de bord chargé.'); // Traduit
            
            const reportsData = <?php echo json_encode($reports_data); ?>;
            const reportList = document.getElementById('report-list');
            const iframeContainer = document.getElementById('iframe-container');
            const iframePlaceholder = document.getElementById('iframe-placeholder');
            const reportIframe = document.getElementById('report-viewer-iframe');
            let activeButton = null;

            function createReportButton(report) {
                const button = document.createElement('button');
                button.className = 'w-full text-left p-4 bg-slate-50 hover:bg-sky-100 rounded-lg border border-slate-200 transition-all card-enhanced focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500';
                button.innerHTML = `
                    <div class="font-semibold text-sky-700">${report.title}</div>
                    <div class="text-sm text-slate-600 mt-1">${report.description}</div>
                `;
                button.onclick = () => loadReport(report.url, button);
                return button;
            }

            function loadReport(url, button) {
                console.log('Chargement du rapport :', url); // Traduit
                
                if (activeButton) {
                    activeButton.classList.remove('bg-sky-200', 'border-sky-400', 'shadow-lg');
                    activeButton.classList.add('bg-slate-50', 'hover:bg-sky-100');
                }
                
                button.classList.remove('bg-slate-50', 'hover:bg-sky-100');
                button.classList.add('bg-sky-200', 'border-sky-400', 'shadow-lg'); // Style plus prononcé pour l'actif
                activeButton = button;
                
                iframePlaceholder.classList.remove('hidden');
                iframeContainer.classList.add('hidden');
                reportIframe.src = 'about:blank';

                setTimeout(() => {
                    reportIframe.src = url;
                }, 50); 
                
                reportIframe.onload = function() {
                    console.log('Rapport chargé avec succès :', url); // Traduit
                    iframePlaceholder.classList.add('hidden');
                    iframeContainer.classList.remove('hidden');
                };
                
                reportIframe.onerror = function() {
                    console.error('Erreur lors du chargement du rapport :', url); // Traduit
                    iframeContainer.classList.add('hidden');
                    iframePlaceholder.classList.remove('hidden');
                    iframePlaceholder.innerHTML = `<div class="text-center text-red-500 p-10">Erreur lors du chargement du rapport: ${url}</div>`; // Traduit
                };
            }

            if (reportsData.length > 0) {
                reportsData.forEach(report => {
                    const button = createReportButton(report);
                    reportList.appendChild(button);
                });

                const firstButton = reportList.querySelector('button');
                if (firstButton) {
                    setTimeout(() => loadReport(reportsData[0].url, firstButton), 200);
                }
            } else {
                iframePlaceholder.innerHTML = '<div class="text-center text-slate-600 p-10">Aucun rapport disponible.</div>'; // Traduit
            }
        });
    </script>
<?php endif; ?>
</body>
</html>
