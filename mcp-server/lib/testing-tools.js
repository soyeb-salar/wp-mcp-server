/**
 * testing-tools.js
 *
 * PHPUnit, Pest PHP, WP_Mock, and E2E Testing Setup
 */

/**
 * Get PHPUnit configuration for WordPress plugin
 */
export function getPhpUnitConfig() {
    return {
        composerJson: {
            require_dev: {
                'phpunit/phpunit': '^10.0',
                'yoast/phpunit-polyfills': '^2.0',
                'brain/monkey': '^2.6',
                'wp-phpunit/wp-phpunit': '^6.0'
            },
            scripts: {
                'test': 'phpunit',
                'test:coverage': 'phpunit --coverage-html=coverage'
            }
        },
        phpunitXml: `<?xml version="1.0"?>
<phpunit
    bootstrap="tests/bootstrap.php"
    backupGlobals="false"
    colors="true"
    convertErrorsToExceptions="true"
    convertNoticesToExceptions="true"
    convertWarningsToExceptions="true"
    convertDeprecationsToExceptions="true"
>
    <testsuites>
        <testsuite name="Unit">
            <directory suffix="Test.php">./tests/Unit</directory>
        </testsuite>
        <testsuite name="Integration">
            <directory suffix="Test.php">./tests/Integration</directory>
        </testsuite>
    </testsuites>
    <coverage>
        <include>
            <directory suffix=".php">./inc</directory>
        </include>
    </coverage>
</phpunit>`,
        bootstrap: `<?php
/**
 * PHPUnit bootstrap file
 */
$_tests_dir = getenv('WP_TESTS_DIR');
if (!$_tests_dir) {
    $_tests_dir = rtrim(sys_get_temp_dir(), '/\\') . '/wordpress-tests-lib';
}

if (!file_exists($_tests_dir . '/includes/functions.php')) {
    echo "Could not find $_tests_dir/includes/functions.php\n";
    exit(1);
}

require_once $_tests_dir . '/includes/functions.php';

function _manually_load_plugin() {
    require dirname(__DIR__) . '/my-plugin.php';
}
tests_add_filter('muplugins_loaded', '_manually_load_plugin');

require $_tests_dir . '/includes/bootstrap.php';
require dirname(__DIR__) . '/vendor/yoast/phpunit-polyfills/phpunitpolyfills-autoload.php';`
    };
}

/**
 * Get Pest PHP configuration
 */
export function getPestConfig() {
    return {
        composerJson: {
            require_dev: {
                'pestphp/pest': '^2.0',
                'pestphp/pest-plugin-laravel': '^2.0'
            },
            scripts: {
                'test': './vendor/bin/pest',
                'test:coverage': './vendor/bin/pest --coverage'
            }
        },
        pestConfig: `<?php

use PHPUnit\\Framework\\Expectation;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
*/

uses(Tests\\TestCase::class)->in('Feature');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
*/

expect()->extend('toBeTrue', function () {
    return \\PHPUnit\\Framework\\Assert::assertTrue($this->value);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
*/

function wp() {
    return \\WP_Mock::wpPassthruFunction(...\\func_get_args());
}`,
        example: `<?php

it('registers activation hook correctly', function () {
    $plugin = new MyPlugin\\Plugin();
    
    expect($plugin->get_version())->toBe('1.0.0');
    expect($plugin->get_basename())->toBe('my-plugin/my-plugin.php');
});

it('sanitizes input correctly', function () {
    $input = '<script>alert("xss")</script>Hello';
    $sanitized = my_plugin_sanitize($input);
    
    expect($sanitized)->not->toContain('<script>');
    expect($sanitized)->toContain('Hello');
});`
    };
}

/**
 * Get WP_Mock setup
 */
export function getWPMockSetup() {
    return {
        setup: `<?php

namespace Tests\\Unit;

use WP_Mock;
use WP_Mock\\TestCase;

class MyPluginTest extends TestCase {
    
    public function setUp(): void {
        parent::setUp();
        WP_Mock::setUp();
    }
    
    public function tearDown(): void {
        WP_Mock::tearDown();
        parent::tearDown();
    }
}`,
        examples: {
            mockAction: `
public function test_action_is_added() {
    WP_Mock::expectActionAdded('init', ['MyPlugin\\Plugin', 'init']);
    
    $plugin = new \\MyPlugin\\Plugin();
    $plugin->init();
    
    $this->assertConditionsMet();
}`,
            mockFilter: `
public function test_filter_is_applied() {
    WP_Mock::onFilter('my_plugin_title')
        ->with('Original Title')
        ->reply('Filtered Title');
    
    $result = apply_filters('my_plugin_title', 'Original Title');
    
    $this->assertEquals('Filtered Title', $result);
}`,
            mockFunction: `
public function test_wp_function_is_called() {
    WP_Mock::userFunction('get_option', [
        'times' => 1,
        'args' => ['my_plugin_settings'],
        'return' => ['key' => 'value']
    ]);
    
    $settings = get_option('my_plugin_settings');
    
    $this->assertEquals(['key' => 'value'], $settings);
}`,
            mockNonce: `
public function test_nonce_verification() {
    WP_Mock::userFunction('wp_verify_nonce', [
        'args' => ['abc123', 'my_action'],
        'return' => true
    ]);
    
    $result = wp_verify_nonce('abc123', 'my_action');
    
    $this->assertTrue($result);
}`
        }
    };
}

/**
 * Get E2E testing with Playwright
 */
export function getPlaywrightSetup() {
    return {
        packageJson: {
            devDependencies: {
                '@playwright/test': '^1.40.0',
                '@wordpress/e2e-test-utils': '^10.0.0'
            },
            scripts: {
                'test:e2e': 'playwright test',
                'test:e2e:ui': 'playwright test --ui',
                'test:e2e:debug': 'playwright test --debug'
            }
        },
        playwrightConfig: `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    timeout: 30000,
    expect: {
        timeout: 5000
    },
    use: {
        baseURL: 'http://localhost:8889',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure'
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] }
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] }
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] }
        }
    ],
    webServer: {
        command: 'npm run wp:env:start',
        port: 8889
    }
});`,
        exampleTests: `import { test, expect } from '@playwright/test';

test.describe('WordPress Admin', () => {
    test.beforeEach(async ({ page }) => {
        // Login before each test
        await page.goto('/wp-login.php');
        await page.fill('#user_login', 'admin');
        await page.fill('#user_pass', 'password');
        await page.click('#wp-submit');
        await page.waitForNavigation();
    });
    
    test('can create a new post', async ({ page }) => {
        await page.goto('/wp-admin/post-new.php');
        
        // Fill title
        await page.fill('input.editor-post-title__input', 'E2E Test Post');
        
        // Fill content
        await page.keyboard.type('This is test content created by Playwright.');
        
        // Publish
        await page.click('button.editor-post-publish-panel__toggle');
        await page.waitForSelector('button.editor-post-publish-button');
        await page.click('button.editor-post-publish-button');
        await page.waitForSelector('.components-snackbar');
        
        // Verify
        const snackbar = page.locator('.components-snackbar');
        await expect(snackbar).toBeVisible();
    });
    
    test('can activate plugin', async ({ page }) => {
        await page.goto('/wp-admin/plugins.php');
        
        // Activate plugin
        const pluginRow = page.locator('tr[data-slug="my-plugin"]');
        const activateLink = pluginRow.locator('text=Activate');
        
        if (await activateLink.isVisible()) {
            await activateLink.click();
            await page.waitForSelector('.notice-success');
        }
        
        // Verify activation
        const deactivateLink = pluginRow.locator('text=Deactivate');
        await expect(deactivateLink).toBeVisible();
    });
    
    test('can create WooCommerce product', async ({ page }) => {
        await page.goto('/wp-admin/post-new.php?post_type=product');
        
        // Product name
        await page.fill('input#title', 'E2E Test Product');
        
        // Product price
        await page.fill('input#_regular_price', '29.99');
        
        // Publish
        await page.click('button#publish');
        await page.waitForNavigation();
        
        // Verify
        await expect(page.locator('#message')).toBeVisible();
    });
});`
    };
}

/**
 * Get GitHub Actions workflow for testing
 */
export function getGitHubActionsWorkflow() {
    return {
        workflow: `name: CI/CD

on:
    push:
        branches: [main, develop]
    pull_request:
        branches: [main]

jobs:
    test:
        runs-on: ubuntu-latest
        
        services:
            mysql:
                image: mysql:8.0
                env:
                    MYSQL_ROOT_PASSWORD: root
                    MYSQL_DATABASE: wordpress_test
                options: >-
                    --health-cmd="mysqladmin ping"
                    --health-interval=10s
                    --health-timeout=5s
                    --health-retries=3
                ports:
                    - 3306:3306
        
        strategy:
            matrix:
                php: ['8.1', '8.2', '8.3']
                wordpress: ['latest']
        
        steps:
            - uses: actions/checkout@v4
            
            - name: Setup PHP
              uses: shivammathur/setup-php@v2
              with:
                  php-version: \${{ matrix.php }}
                  extensions: mysql, mysqli
                  tools: composer:v2
                  coverage: xdebug
        
            - name: Install Composer dependencies
              run: composer install --prefer-dist --no-progress
        
            - name: Install NPM dependencies
              run: npm ci
        
            - name: Setup WordPress
              run: |
                  bash bin/install-wp-tests.sh wordpress_test root root 127.0.0.1 \${{ matrix.wordpress }}
        
            - name: Run PHPUnit Tests
              run: composer test
        
            - name: Run PHPCS
              run: composer phpcs
        
            - name: Run PHPStan
              run: composer phpstan
        
            - name: Upload Coverage
              uses: codecov/codecov-action@v3
              with:
                  file: coverage.xml
                  fail_ci_if_error: true

    e2e:
        runs-on: ubuntu-latest
        
        steps:
            - uses: actions/checkout@v4
            
            - name: Setup Node
              uses: actions/setup-node@v4
              with:
                  node-version: '20'
            
            - name: Install dependencies
              run: npm ci
            
            - name: Install Playwright
              run: npx playwright install --with-deps
            
            - name: Start WordPress environment
              run: npm run wp:env:start
            
            - name: Run E2E tests
              run: npm run test:e2e
            
            - name: Upload test results
              uses: actions/upload-artifact@v4
              if: failure()
              with:
                  name: playwright-report
                  path: playwright-report/`,
        installScript: `#!/bin/bash
# bin/install-wp-tests.sh

set -ex

DB_NAME=$1
DB_USER=$2
DB_PASS=$3
DB_HOST=$4
WP_VERSION=$5

# Download WordPress
wget -nv https://github.com/WordPress/WordPress/archive/$WP_VERSION.zip
unzip -q $WP_VERSION.zip
rm $WP_VERSION.zip

# Setup test database
mysql -u $DB_USER -p$DB_PASS -e "CREATE DATABASE IF NOT EXISTS $DB_NAME"

# Download WP test library
svn co --quiet https://develop.svn.wordpress.org/tags/$WP_VERSION/tests/phpunit/includes/
svn co --quiet https://develop.svn.wordpress.org/tags/$WP_VERSION/tests/phpunit/data/

# Configure WP tests
cat <<EOF > wp-tests-config.php
<?php
define('ABSPATH', dirname(__FILE__) . '/wordpress/');
define('DB_NAME', '$DB_NAME');
define('DB_USER', '$DB_USER');
define('DB_PASSWORD', '$DB_PASS');
define('DB_HOST', '$DB_HOST');
define('DB_CHARSET', 'utf8');
define('DB_COLLATE', '');
EOF

echo "WordPress test environment ready!"`
    };
}
