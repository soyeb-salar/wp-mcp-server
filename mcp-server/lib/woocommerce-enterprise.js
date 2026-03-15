/**
 * woocommerce-enterprise.js
 *
 * Extended WooCommerce: Subscriptions, Multi-Vendor, Product Add-ons, Import/Export
 */

/**
 * Get WooCommerce Subscriptions integration guide
 */
export function getSubscriptionsGuide() {
    return {
        overview: 'WooCommerce Subscriptions allows selling products with recurring payments.',
        keyClasses: {
            WC_Subscription: 'Main subscription object (extends WC_Order)',
            WCS_Subscription: 'Subscription helper class',
            WC_Subscriptions_Manager: 'Legacy subscription management'
        },
        hooks: {
            wcs_renewal_order_created: 'Fires when renewal order is created',
            wcs_renewal_payment_complete: 'Fires when renewal payment completes',
           woocommerce_subscription_status_updated: 'Subscription status changed',
            wcs_check_billing_matches_shipping: 'Validate billing/shipping match',
            wcs_copy_order_address: 'Copy address from subscription to order'
        },
        codeExamples: {
            createSubscription: `
// Get subscription object
$subscription = wcs_get_subscription($subscription_id);

// Get related orders
$renewal_orders = $subscription->get_related_orders('renewal');

// Get next payment date
$next_payment = $subscription->get_time('next_payment');

// Update subscription meta
$subscription->update_meta_data('_billing_period', 'month');
$subscription->save();`,
            renewalHook: `
add_action('wcs_renewal_order_created', function($renewal_order, $subscription) {
    // Add custom meta to renewal order
    $renewal_order->update_meta_data('_subscription_renewal', true);
    $renewal_order->save();
    
    // Send custom notification
    wc_mail_subscription_notification($subscription, $renewal_order);
}, 10, 2);`,
            subscriptionProduct: `
// Create subscription product
$product = new WC_Product_Subscription();
$product->set_name('Monthly Subscription');
$product->set_regular_price('29.99');
$product->set_prop('_subscription_period', 'month');
$product->set_prop('_subscription_period_interval', 1);
$product->set_prop('_subscription_length', 12); // 12 months
$product->save();`
        },
        bestPractices: [
            'Always use WC_Subscription CRUD methods, not direct meta',
            'Hook into wcs_renewal_order_created for custom renewal logic',
            'Use Action Scheduler for subscription-related background tasks',
            'Store subscription data in HPOS-compatible tables',
            'Test with both manual and automatic renewals'
        ]
    };
}

/**
 * Get Multi-Vendor (Dokan/WCFM) integration guide
 */
export function getMultiVendorGuide() {
    return {
        platforms: {
            dokan: {
                name: 'Dokan',
                url: 'https://dokan.co',
                marketShare: '40%+',
                keyFunctions: [
                    'dokan_get_seller_id_by_order()',
                    'dokan_get_seller_earnings_by_order()',
                    'dokan_is_seller_dashboard()',
                    'dokan_get_navigation_url()'
                ],
                hooks: {
                    dokan_new_seller_product_saved: 'New vendor product created',
                    dokan_order_status_changed: 'Order status changed',
                    dokan_before_saving_settings: 'Before vendor settings save',
                    dokan_withdraw_request_created: 'Withdrawal request created'
                }
            },
            wcfm: {
                name: 'WCFM Marketplace',
                url: 'https://wclovers.com',
                marketShare: '25%+',
                keyFunctions: [
                    'wcfm_get_vendor_id_by_post()',
                    'wcfm_get_vendor_store_name()',
                    'wcfm_is_vendor()',
                    'wcfm_get_page_id()'
                ],
                hooks: {
                    wcfmmp_product_list_item_after: 'After product list item',
                    wcfmmp_vendor_settings_tab: 'Vendor settings tab',
                    wcfmmp_order_after_shop_details: 'After order shop details'
                }
            },
            wc_vendors: {
                name: 'WC Vendors',
                url: 'https://wcvendors.com',
                marketShare: '20%+',
                keyFunctions: [
                    'wcv_get_vendor_id_by_post()',
                    'wcv_get_commission_percentage()',
                    'wcv_is_vendor()'
                ]
            }
        },
        commissionCalculation: `
// Dokan - Get vendor commission
function dokan_get_vendor_commission($order_id, $product_id) {
    $seller_id = dokan_get_seller_id_by_order($order_id);
    $commission = dokan_get_seller_earnings_by_order($order_id, $product_id);
    
    // Commission percentage
    $percentage = dokan_get_seller_percentage($seller_id);
    
    return [
        'seller_id' => $seller_id,
        'commission' => $commission,
        'percentage' => $percentage
    ];
}

// WCFM - Get vendor commission
function wcfm_get_vendor_commission($order_id, $product_id) {
    $vendor_id = wcfm_get_vendor_id_by_post($product_id);
    $commission = get_post_meta($order_id, '_wcfm_commission_' . $product_id, true);
    
    return [
        'vendor_id' => $vendor_id,
        'commission' => $commission
    ];
}`,
        vendorOnboarding: `
// Auto-approve new vendors
add_filter('dokan_new_seller_approved', '__return_true');

// Set default commission
add_action('dokan_new_seller_created', function($seller_id, $seller_info) {
    update_user_meta($seller_id, 'dokan_profile_settings', [
        'payment' => ['paypal' => ['email' => '']],
        'store' => ['name' => $seller_info['shopname']],
        'commission' => 90 // 90% to vendor
    ]);
}, 10, 2);`,
        shippingIntegration: `
// Vendor-specific shipping
add_filter('woocommerce_package_rates', function($rates, $package) {
    $vendor_id = dokan_get_seller_id_by_order($package['contents'][0]['data']->get_product()->get_id());
    
    // Modify shipping rates based on vendor
    foreach ($rates as $rate_key => $rate) {
        if ($vendor_id) {
            // Apply vendor-specific shipping discount
            $rates[$rate_key]->cost = $rate->cost * 0.9; // 10% discount
        }
    }
    
    return $rates;
}, 10, 2);`
    };
}

/**
 * Get Product Add-ons integration guide
 */
export function getProductAddonsGuide() {
    return {
        types: {
            text: 'Text input field',
            textarea: 'Multi-line text area',
            select: 'Dropdown selection',
            radio: 'Radio buttons',
            checkbox: 'Checkbox (yes/no)',
            file_upload: 'File upload field',
            custom_price: 'Customer-defined price',
            date_picker: 'Date selection',
            color_picker: 'Color selection'
        },
        cartItemData: `
// Add custom cart item data
add_filter('woocommerce_add_cart_item_data', function($cart_item_data, $product_id, $variation_id) {
    if (isset($_POST['engraving_text'])) {
        $cart_item_data['engraving_text'] = sanitize_text_field($_POST['engraving_text']);
        $cart_item_data['_unique_key'] = md5(microtime().rand());
    }
    
    if (isset($_FILES['custom_upload'])) {
        require_once(ABSPATH . 'wp-admin/includes/image.php');
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        require_once(ABSPATH . 'wp-admin/includes/media.php');
        
        $attachment_id = media_handle_upload('custom_upload', 0);
        if (!is_wp_error($attachment_id)) {
            $cart_item_data['custom_upload'] = $attachment_id;
            $cart_item_data['_unique_key'] = md5(microtime().rand());
        }
    }
    
    return $cart_item_data;
}, 10, 3);

// Display in cart
add_filter('woocommerce_get_item_data', function($item_data, $cart_item) {
    if (isset($cart_item['engraving_text'])) {
        $item_data[] = [
            'name' => 'Engraving Text',
            'value' => $cart_item['engraving_text']
        ];
    }
    
    if (isset($cart_item['custom_upload'])) {
        $image_url = wp_get_attachment_url($cart_item['custom_upload']);
        $item_data[] = [
            'name' => 'Custom Upload',
            'value' => '<img src="' . esc_url($image_url) . '" width="50">'
        ];
    }
    
    return $item_data;
}, 10, 2);

// Save to order
add_action('woocommerce_checkout_create_order_line_item', function($item, $cart_item_key, $values, $order) {
    if (isset($values['engraving_text'])) {
        $item->add_meta_data('Engraving Text', $values['engraving_text']);
    }
    
    if (isset($values['custom_upload'])) {
        $item->add_meta_data('Custom Upload ID', $values['custom_upload']);
    }
}, 10, 4);`,
        priceAdjustment: `
// Adjust price based on add-ons
add_filter('woocommerce_product_get_price', function($price, $product) {
    if (isset($_POST['gift_wrap'])) {
        $price = (float)$price + 5.00; // Add $5 for gift wrap
    }
    
    if (isset($_POST['priority_shipping'])) {
        $price = (float)$price + 10.00; // Add $10 for priority
    }
    
    return $price;
}, 10, 2);`
    };
}

/**
 * Get Import/Export guide
 */
export function getImportExportGuide() {
    return {
        importer: {
            class: 'WC_Product_CSV_Importer',
            usage: `
// Import products from CSV
require_once WC_ABSPATH . 'includes/admin/importers/class-wc-product-csv-importer.php';

$file = WP_CONTENT_DIR . '/uploads/products.csv';

$args = [
    'parse' => true,
    'start_pos' => 0,
    'end_pos' => 100, // Batch size
    'mapping' => [
        'ID' => 'ID',
        'Type' => 'Type',
        'SKU' => 'SKU',
        'Name' => 'Name',
        'Published' => 'Published',
        'Is featured?' => 'Is featured?',
        'Visibility in catalog' => 'Visibility in catalog',
        'Short description' => 'Short description',
        'Description' => 'Description',
        'Date sale price starts' => 'Date sale price starts',
        'Date sale price ends' => 'Date sale price ends',
        'Price' => 'Price',
        'Regular Price' => 'Regular Price',
        'Sale Price' => 'Sale Price',
        'Categories' => 'Categories',
        'Tags' => 'Tags',
        'Images' => 'Images',
        'Download 1 URL' => 'Download 1 URL',
    ]
];

$importer = new WC_Product_CSV_Importer($file, $args);
$results = $importer->import();

// Results contain: imported, skipped, updated, failed
return $results;`
        },
        exporter: {
            class: 'WC_Product_CSV_Exporter',
            usage: `
// Export products to CSV
require_once WC_ABSPATH . 'includes/export/abstract-wc-csv-exporter.php';
require_once WC_ABSPATH . 'includes/export/class-wc-product-csv-exporter.php';

$exporter = new WC_Product_CSV_Exporter();
$exporter->set_column_names([
    'ID' => 'ID',
    'Type' => 'Type',
    'SKU' => 'SKU',
    'Name' => 'Name',
    'Published' => 'Published',
    'Price' => 'Price',
    'Categories' => 'Categories',
    'Tags' => 'Tags',
    'Images' => 'Images'
]);
$exporter->set_limit(100);
$exporter->set_offset(0);

$export_data = $exporter->export_data();

// Write to file
file_put_contents(WP_CONTENT_DIR . '/uploads/export.csv', $export_data);`
        },
        batchProcessing: `
// Use Action Scheduler for large imports
add_action('wp', function() {
    if (!isset($_GET['run_import'])) return;
    
    $file = WP_CONTENT_DIR . '/uploads/products.csv';
    $total_lines = count(file($file));
    $batch_size = 100;
    
    for ($i = 0; $i < $total_lines; $i += $batch_size) {
        as_schedule_single_action(
            time() + ($i / $batch_size),
            'wp_agent_batch_import',
            [
                'file' => $file,
                'start' => $i,
                'end' => min($i + $batch_size, $total_lines)
            ]
        );
    }
});

add_action('wp_agent_batch_import', function($file, $start, $end) {
    require_once WC_ABSPATH . 'includes/admin/importers/class-wc-product-csv-importer.php';
    
    $args = [
        'parse' => true,
        'start_pos' => $start,
        'end_pos' => $end
    ];
    
    $importer = new WC_Product_CSV_Importer($file, $args);
    $results = $importer->import();
    
    // Log results
    error_log("Batch import: " . json_encode($results));
}, 10, 3);`
    };
}

/**
 * Get HPOS (High-Performance Order Storage) guide
 */
export function getHPOSGuide() {
    return {
        overview: 'HPOS uses dedicated tables instead of wp_posts/wp_postmeta for orders.',
        declaration: `
// Declare HPOS compatibility in plugin main file
add_action('before_woocommerce_init', function() {
    if (class_exists(\\Automattic\\WooCommerce\\Utilities\\FeaturesUtil::class)) {
        \\Automattic\\WooCommerce\\Utilities\\FeaturesUtil::declare_compatibility(
            'custom_order_tables',
            __FILE__,
            true
        );
    }
});`,
        orderCrud: `
// Create order (HPOS-compatible)
$order = wc_create_order();
$order->set_status('pending');
$order->add_product(wc_get_product($product_id), $quantity);
$order->set_customer_id($customer_id);
$order->set_billing_first_name($first_name);
$order->set_billing_email($email);
$order->calculate_totals();
$order->save();

// Get order (HPOS-compatible)
$order = wc_get_order($order_id);

// Query orders (HPOS-compatible)
$orders = wc_get_orders([
    'status' => 'processing',
    'limit' => 10,
    'customer_id' => $customer_id
]);

// NEVER use WP_Query for orders with HPOS enabled!
// WRONG: new WP_Query(['post_type' => 'shop_order'])`,
        metaHandling: `
// Order meta (HPOS-compatible)
$order->update_meta_data('_custom_field', $value);
$order->save();

$value = $order->get_meta('_custom_field');

// Use WC_Data methods, not add_post_meta/get_post_meta`,
        migration: `
// Check if HPOS is enabled
$is_hpos_enabled = wc_get_container()->get(
    \\Automattic\\WooCommerce\\Internal\\DataStores\\Orders\\DataSynchronizer::class
)->data_sync_is_enabled();

// Get order counts
$stats = \\Automattic\\WooCommerce\\Internal\\Admin\\Orders\\ListTable::get_order_stats();`
    };
}
