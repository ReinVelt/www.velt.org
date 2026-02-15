<?php
/**
 * Website Analytics Dashboard
 * Analyzes Apache access logs and tracking data
 */

// Configuration
define('TRACKING_LOG', __DIR__ . '/visitor_tracking.log');
define('APACHE_LOG', '/var/log/apache2/access.log'); // Adjust path as needed
define('LINES_TO_READ', 10000); // Number of recent log lines to analyze

// Try to find Apache log in common locations
$apacheLogs = [
    '/var/log/apache2/access.log',
    '/var/log/httpd/access_log',
    '/usr/local/apache2/logs/access_log',
    '/var/log/apache2/other_vhosts_access.log',
];

foreach ($apacheLogs as $log) {
    if (file_exists($log) && is_readable($log)) {
        define('APACHE_LOG_FOUND', $log);
        break;
    }
}

/**
 * Parse Apache access log line (Common/Combined format)
 */
function parseApacheLogLine($line) {
    // Pattern for Apache Combined Log Format
    $pattern = '/^(\S+) \S+ \S+ \[([^\]]+)\] "([A-Z]+) ([^\s]+)[^"]*" (\d+) (\d+|-) "([^"]*)" "([^"]*)"/';
    
    if (preg_match($pattern, $line, $matches)) {
        return [
            'ip' => $matches[1],
            'timestamp' => $matches[2],
            'method' => $matches[3],
            'url' => $matches[4],
            'status' => (int)$matches[5],
            'size' => $matches[6] === '-' ? 0 : (int)$matches[6],
            'referrer' => $matches[7],
            'user_agent' => $matches[8],
        ];
    }
    return null;
}

/**
 * Get country from IP (simplified - uses external API)
 */
function getCountryFromIP($ip) {
    static $cache = [];
    
    if (isset($cache[$ip])) {
        return $cache[$ip];
    }
    
    // Skip local IPs
    if ($ip === '127.0.0.1' || strpos($ip, '192.168.') === 0 || strpos($ip, '10.') === 0) {
        $cache[$ip] = 'Local';
        return 'Local';
    }
    
    // Use ip-api.com (free for non-commercial, 45 requests/minute)
    $url = "http://ip-api.com/json/{$ip}?fields=country,countryCode";
    $context = stream_context_create(['http' => ['timeout' => 2]]);
    $response = @file_get_contents($url, false, $context);
    
    if ($response) {
        $data = json_decode($response, true);
        $country = $data['country'] ?? 'Unknown';
        $cache[$ip] = $country;
        return $country;
    }
    
    $cache[$ip] = 'Unknown';
    return 'Unknown';
}

/**
 * Analyze Apache access log
 */
function analyzeApacheLog($logFile, $maxLines = 10000) {
    if (!file_exists($logFile) || !is_readable($logFile)) {
        return null;
    }
    
    $stats = [
        'total_requests' => 0,
        'unique_ips' => [],
        'pages' => [],
        'status_codes' => [],
        'ips' => [],
        'countries' => [],
        'user_agents' => [],
        'referrers' => [],
        'traffic_by_hour' => array_fill(0, 24, 0),
    ];
    
    // Read last N lines efficiently
    $lines = [];
    $file = new SplFileObject($logFile, 'r');
    $file->seek(PHP_INT_MAX);
    $lastLine = $file->key();
    $startLine = max(0, $lastLine - $maxLines);
    
    for ($i = $startLine; $i <= $lastLine; $i++) {
        $file->seek($i);
        $line = $file->current();
        if ($line) {
            $lines[] = $line;
        }
    }
    
    foreach ($lines as $line) {
        $entry = parseApacheLogLine($line);
        if (!$entry) continue;
        
        $stats['total_requests']++;
        
        // Track unique IPs
        $stats['unique_ips'][$entry['ip']] = true;
        
        // Count requests per IP
        if (!isset($stats['ips'][$entry['ip']])) {
            $stats['ips'][$entry['ip']] = 0;
        }
        $stats['ips'][$entry['ip']]++;
        
        // Track pages (only successful HTML requests)
        if ($entry['status'] == 200 && (strpos($entry['url'], '.html') !== false || $entry['url'] === '/')) {
            if (!isset($stats['pages'][$entry['url']])) {
                $stats['pages'][$entry['url']] = 0;
            }
            $stats['pages'][$entry['url']]++;
        }
        
        // Status codes
        if (!isset($stats['status_codes'][$entry['status']])) {
            $stats['status_codes'][$entry['status']] = 0;
        }
        $stats['status_codes'][$entry['status']]++;
        
        // Referrers
        if ($entry['referrer'] !== '-' && !empty($entry['referrer'])) {
            if (!isset($stats['referrers'][$entry['referrer']])) {
                $stats['referrers'][$entry['referrer']] = 0;
            }
            $stats['referrers'][$entry['referrer']]++;
        }
        
        // Hour distribution
        if (preg_match('/\d{2}:(\d{2}):\d{2}/', $entry['timestamp'], $matches)) {
            $hour = (int)$matches[1];
            $stats['traffic_by_hour'][$hour]++;
        }
    }
    
    $stats['unique_ips'] = count($stats['unique_ips']);
    
    return $stats;
}

/**
 * Analyze tracking log
 */
function analyzeTrackingLog($logFile) {
    if (!file_exists($logFile)) {
        return null;
    }
    
    $stats = [
        'total_pageviews' => 0,
        'unique_visitors' => [],
        'unique_sessions' => [],
        'pages' => [],
        'referrers' => [],
        'page_flows' => [],
        'exit_pages' => [],
    ];
    
    $lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    
    foreach ($lines as $line) {
        $data = json_decode($line, true);
        if (!$data) continue;
        
        if ($data['type'] === 'pageview') {
            $stats['total_pageviews']++;
            $stats['unique_visitors'][$data['visitorId']] = true;
            $stats['unique_sessions'][$data['sessionId']] = true;
            
            $url = $data['url'];
            if (!isset($stats['pages'][$url])) {
                $stats['pages'][$url] = 0;
            }
            $stats['pages'][$url]++;
            
            $referrer = $data['referrer'] ?? 'direct';
            if (!isset($stats['referrers'][$referrer])) {
                $stats['referrers'][$referrer] = 0;
            }
            $stats['referrers'][$referrer]++;
        } elseif ($data['type'] === 'pageexit') {
            $url = $data['url'];
            if (!isset($stats['exit_pages'][$url])) {
                $stats['exit_pages'][$url] = 0;
            }
            $stats['exit_pages'][$url]++;
        }
    }
    
    $stats['unique_visitors'] = count($stats['unique_visitors']);
    $stats['unique_sessions'] = count($stats['unique_sessions']);
    
    return $stats;
}

// Get statistics
$apacheStats = defined('APACHE_LOG_FOUND') ? analyzeApacheLog(APACHE_LOG_FOUND, LINES_TO_READ) : null;
$trackingStats = analyzeTrackingLog(TRACKING_LOG);

// Get top countries (sample - in real use, you'd cache this)
$topCountries = [];
if ($apacheStats) {
    $topIPs = array_slice($apacheStats['ips'], 0, 10, true);
    foreach ($topIPs as $ip => $count) {
        $country = getCountryFromIP($ip);
        if (!isset($topCountries[$country])) {
            $topCountries[$country] = 0;
        }
        $topCountries[$country] += $count;
    }
    arsort($topCountries);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analytics Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: #0a0e27;
            color: #e0e6ed;
            padding: 20px;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        
        h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .subtitle {
            color: #8b93a7;
            margin-bottom: 30px;
            font-size: 0.95rem;
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 24px;
            backdrop-filter: blur(10px);
        }
        
        .card h2 {
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #8b93a7;
            margin-bottom: 12px;
        }
        
        .card .value {
            font-size: 2.5rem;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .card .label {
            color: #8b93a7;
            font-size: 0.9rem;
            margin-top: 5px;
        }
        
        .section {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 20px;
        }
        
        .section h2 {
            font-size: 1.3rem;
            margin-bottom: 20px;
            color: #e0e6ed;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        th {
            text-align: left;
            padding: 12px;
            background: rgba(102, 126, 234, 0.1);
            border-bottom: 2px solid rgba(102, 126, 234, 0.3);
            font-weight: 600;
            color: #a0aec0;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        td {
            padding: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        tr:hover {
            background: rgba(102, 126, 234, 0.05);
        }
        
        .bar-container {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 8px 0;
        }
        
        .bar-label {
            min-width: 100px;
            color: #cbd5e0;
            font-size: 0.9rem;
        }
        
        .bar-wrapper {
            flex: 1;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
            height: 24px;
            position: relative;
            overflow: hidden;
        }
        
        .bar {
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            height: 100%;
            border-radius: 4px;
            transition: width 0.3s ease;
        }
        
        .bar-value {
            min-width: 50px;
            text-align: right;
            color: #cbd5e0;
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        .warning {
            background: rgba(255, 193, 7, 0.1);
            border: 1px solid rgba(255, 193, 7, 0.3);
            color: #ffc107;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .info {
            background: rgba(33, 150, 243, 0.1);
            border: 1px solid rgba(33, 150, 243, 0.3);
            color: #2196f3;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .refresh-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.95rem;
            margin-bottom: 20px;
            transition: transform 0.2s;
        }
        
        .refresh-btn:hover {
            transform: translateY(-2px);
        }
        
        code {
            background: rgba(0, 0, 0, 0.3);
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 Analytics Dashboard</h1>
        <p class="subtitle">Real-time visitor analytics and statistics</p>
        
        <button class="refresh-btn" onclick="location.reload()">🔄 Refresh Data</button>
        
        <?php if (!defined('APACHE_LOG_FOUND')): ?>
        <div class="warning">
            ⚠️ Apache access log not found. Checked common locations. Update <code>APACHE_LOG</code> in this file.
        </div>
        <?php endif; ?>
        
        <?php if ($trackingStats): ?>
        <h3 style="margin: 30px 0 15px; font-size: 1.5rem;">Client-Side Tracking Data</h3>
        <div class="grid">
            <div class="card">
                <h2>Total Pageviews</h2>
                <div class="value"><?= number_format($trackingStats['total_pageviews']) ?></div>
                <div class="label">from tracking script</div>
            </div>
            <div class="card">
                <h2>Unique Visitors</h2>
                <div class="value"><?= number_format($trackingStats['unique_visitors']) ?></div>
                <div class="label">distinct visitor IDs</div>
            </div>
            <div class="card">
                <h2>Sessions</h2>
                <div class="value"><?= number_format($trackingStats['unique_sessions']) ?></div>
                <div class="label">unique sessions</div>
            </div>
            <div class="card">
                <h2>Pages Tracked</h2>
                <div class="value"><?= count($trackingStats['pages']) ?></div>
                <div class="label">different URLs</div>
            </div>
        </div>
        
        <div class="section">
            <h2>📄 Most Visited Pages (Client Tracking)</h2>
            <table>
                <thead>
                    <tr>
                        <th>Page</th>
                        <th style="text-align: right;">Views</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    arsort($trackingStats['pages']);
                    $topPages = array_slice($trackingStats['pages'], 0, 15, true);
                    foreach ($topPages as $page => $count):
                    ?>
                    <tr>
                        <td><?= htmlspecialchars($page) ?></td>
                        <td style="text-align: right; font-weight: 600;"><?= number_format($count) ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        
        <div class="section">
            <h2>🔗 Top Referrers</h2>
            <?php
            arsort($trackingStats['referrers']);
            $topReferrers = array_slice($trackingStats['referrers'], 0, 10, true);
            $maxReferrer = max(array_values($topReferrers));
            foreach ($topReferrers as $referrer => $count):
                $width = ($count / $maxReferrer) * 100;
            ?>
            <div class="bar-container">
                <div class="bar-label"><?= htmlspecialchars(substr($referrer, 0, 30)) ?></div>
                <div class="bar-wrapper">
                    <div class="bar" style="width: <?= $width ?>%;"></div>
                </div>
                <div class="bar-value"><?= $count ?></div>
            </div>
            <?php endforeach; ?>
        </div>
        <?php else: ?>
        <div class="info">
            ℹ️ No tracking data yet. Visit some pages to generate data.
        </div>
        <?php endif; ?>
        
        <?php if ($apacheStats): ?>
        <h3 style="margin: 30px 0 15px; font-size: 1.5rem;">Apache Access Log Analysis</h3>
        <div class="info">
            📁 Analyzing last <?= number_format(LINES_TO_READ) ?> lines from: <code><?= APACHE_LOG_FOUND ?></code>
        </div>
        
        <div class="grid">
            <div class="card">
                <h2>Total Requests</h2>
                <div class="value"><?= number_format($apacheStats['total_requests']) ?></div>
                <div class="label">HTTP requests</div>
            </div>
            <div class="card">
                <h2>Unique IPs</h2>
                <div class="value"><?= number_format($apacheStats['unique_ips']) ?></div>
                <div class="label">different IP addresses</div>
            </div>
            <div class="card">
                <h2>Pages Served</h2>
                <div class="value"><?= count($apacheStats['pages']) ?></div>
                <div class="label">HTML pages (200 OK)</div>
            </div>
            <div class="card">
                <h2>Status Codes</h2>
                <div class="value"><?= count($apacheStats['status_codes']) ?></div>
                <div class="label">different HTTP codes</div>
            </div>
        </div>
        
        <div class="section">
            <h2>🌍 Top Visitors by IP</h2>
            <table>
                <thead>
                    <tr>
                        <th>IP Address</th>
                        <th>Region/Country</th>
                        <th style="text-align: right;">Requests</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    arsort($apacheStats['ips']);
                    $topIPs = array_slice($apacheStats['ips'], 0, 20, true);
                    foreach ($topIPs as $ip => $count):
                        $country = getCountryFromIP($ip);
                    ?>
                    <tr>
                        <td><code><?= htmlspecialchars($ip) ?></code></td>
                        <td><?= htmlspecialchars($country) ?></td>
                        <td style="text-align: right; font-weight: 600;"><?= number_format($count) ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        
        <?php if (!empty($topCountries)): ?>
        <div class="section">
            <h2>🗺️ Traffic by Region/Country</h2>
            <?php
            $maxCountry = max(array_values($topCountries));
            foreach ($topCountries as $country => $count):
                $width = ($count / $maxCountry) * 100;
            ?>
            <div class="bar-container">
                <div class="bar-label"><?= htmlspecialchars($country) ?></div>
                <div class="bar-wrapper">
                    <div class="bar" style="width: <?= $width ?>%;"></div>
                </div>
                <div class="bar-value"><?= $count ?></div>
            </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
        
        <div class="section">
            <h2>📄 Most Requested Pages (Apache Log)</h2>
            <table>
                <thead>
                    <tr>
                        <th>URL</th>
                        <th style="text-align: right;">Requests</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    arsort($apacheStats['pages']);
                    $topApachePages = array_slice($apacheStats['pages'], 0, 20, true);
                    foreach ($topApachePages as $url => $count):
                    ?>
                    <tr>
                        <td><?= htmlspecialchars($url) ?></td>
                        <td style="text-align: right; font-weight: 600;"><?= number_format($count) ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        
        <div class="section">
            <h2>⏰ Traffic by Hour (24h)</h2>
            <?php
            $maxHour = max($apacheStats['traffic_by_hour']);
            foreach ($apacheStats['traffic_by_hour'] as $hour => $count):
                $width = $maxHour > 0 ? ($count / $maxHour) * 100 : 0;
            ?>
            <div class="bar-container">
                <div class="bar-label"><?= sprintf('%02d:00', $hour) ?></div>
                <div class="bar-wrapper">
                    <div class="bar" style="width: <?= $width ?>%;"></div>
                </div>
                <div class="bar-value"><?= $count ?></div>
            </div>
            <?php endforeach; ?>
        </div>
        
        <div class="section">
            <h2>📊 HTTP Status Codes</h2>
            <?php
            ksort($apacheStats['status_codes']);
            foreach ($apacheStats['status_codes'] as $code => $count):
            ?>
            <div class="bar-container">
                <div class="bar-label"><?= $code ?></div>
                <div class="bar-wrapper">
                    <div class="bar" style="width: <?= ($count / $apacheStats['total_requests']) * 100 ?>%;"></div>
                </div>
                <div class="bar-value"><?= number_format($count) ?></div>
            </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
        
        <p style="text-align: center; color: #666; margin: 40px 0 20px; font-size: 0.9rem;">
            📈 Dashboard generated on <?= date('Y-m-d H:i:s') ?>
        </p>
    </div>
</body>
</html>
