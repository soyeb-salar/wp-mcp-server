/**
 * multi-editor.js
 *
 * Multi-Editor Switchboard - Support for Gutenberg, Elementor, Divi, WPBakery
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const knowledgeBasePath = join(__dirname, '..', '..', 'wc-agent.md');

/**
 * Get Gutenberg block scaffold with block.json v3
 */
export function getGutenbergScaffold(blockName, options = {}) {
    const defaults = {
        namespace: 'wp-agent',
        category: 'widgets',
        icon: 'admin-generic',
        supports: ['align', 'className'],
        attributes: {},
        usesContext: [],
        providesContext: []
    };
    
    const config = { ...defaults, ...options };
    
    return {
        blockJson: {
            apiVersion: 3,
            name: `${config.namespace}/${blockName}`,
            title: blockName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            category: config.category,
            icon: config.icon,
            description: `Custom ${blockName} block`,
            textdomain: config.namespace,
            supports: config.supports,
            attributes: config.attributes,
            usesContext: config.usesContext,
            providesContext: config.providesContext,
            editorScript: `file:./index.js`,
            editorStyle: `file:./index.css`,
            style: `file:./style-index.css`,
            renderCallback: 'render_callback'
        },
        fileStructure: [
            'block.json',
            'index.js',
            'edit.js',
            'save.js',
            'render.php',
            'style.css',
            'editor.css',
            'src/index.js',
            'src/edit.js',
            'src/save.js',
            'src/style.css'
        ],
        commands: [
            `npx @wordpress/create-block ${blockName}`,
            `npm run start`,
            `npm run build`
        ]
    };
}

/**
 * Get Elementor widget scaffold
 */
export function getElementorScaffold(widgetName, options = {}) {
    const config = {
        namespace: 'wp-agent',
        category: 'general',
        ...options
    };
    
    return {
        classStructure: {
            extends: '\\Elementor\\Widget_Base',
            methods: [
                'get_name()',
                'get_title()',
                'get_icon()',
                'get_categories()',
                'get_keywords()',
                'get_style_depends()',
                'get_script_depends()',
                'register_controls()',
                'render()',
                '_content_template()'
            ]
        },
        controls: {
            sections: [
                {
                    name: 'section_content',
                    type: 'section',
                    tab: '\\Elementor\\Controls_Manager::TAB_CONTENT',
                    controls: ['title', 'description', 'image']
                },
                {
                    name: 'section_style',
                    type: 'section',
                    tab: '\\Elementor\\Controls_Manager::TAB_STYLE',
                    controls: ['color', 'typography', 'spacing']
                }
            ]
        },
        fileStructure: [
            `widgets/${widgetName}.php`,
            `assets/css/${widgetName}.css`,
            `assets/js/${widgetName}.js`
        ]
    };
}

/**
 * Get Divi module scaffold
 */
export function getDiviScaffold(moduleName, options = {}) {
    const config = {
        namespace: 'wp-agent',
        ...options
    };
    
    return {
        classStructure: {
            extends: 'ET_Builder_Module',
            properties: [
                '$name',
                '$slug',
                '$vb_support',
                '$main_css_element',
                '$settings_modal_tabs'
            ],
            methods: [
                'get_name()',
                'get_slug()',
                'get_categories()',
                'get_vb_support()',
                'get_fields()',
                'render()',
                'get_advanced_fields_config()'
            ]
        },
        whitelistedFields: [
            'background_color',
            'background_image',
            'background_video_mp4',
            'background_video_webm',
            'parallax',
            'parallax_method',
            'background_size',
            'background_position',
            'background_repeat',
            'background_blend',
            'background_enable_pattern',
            'background_pattern_radial_direction',
            'background_pattern_start_point',
            'background_pattern_size',
            'background_pattern_repeat',
            'background_pattern_horizontal_offset',
            'background_pattern_vertical_offset',
            'background_pattern_rotate',
            'background_pattern_rotate_offset',
            'background_mask',
            'background_enable_mask',
            'module_id',
            'module_class',
            'module_alignment',
            'custom_css_before',
            'custom_css_after'
        ],
        fileStructure: [
            `modules/${moduleName}/${moduleName}.php`,
            `modules/${moduleName}/style.css`,
            `modules/${moduleName}/js/${moduleName}.js`
        ]
    };
}

/**
 * Get WPBakery shortcode scaffold
 */
export function getWPBakeryScaffold(shortcodeName, options = {}) {
    const config = {
        namespace: 'wp-agent',
        base: 'shortcode',
        ...options
    };
    
    return {
        vcMap: {
            name: shortcodeName,
            base: config.base,
            title: shortcodeName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            category: 'Content',
            icon: 'icon-wpb-ui-slider',
            params: [
                {
                    type: 'textfield',
                    heading: 'Title',
                    param_name: 'title',
                    value: 'Default Title'
                },
                {
                    type: 'textarea',
                    heading: 'Content',
                    param_name: 'content',
                    value: 'Default Content'
                }
            ]
        },
        shortcode: `[${shortcodeName} title="Example" content="Example Content"]`,
        fileStructure: [
            `shortcodes/${shortcodeName}/${shortcodeName}.php`,
            `shortcodes/${shortcodeName}/view.php`,
            `shortcodes/${shortcodeName}/style.css`
        ]
    };
}

/**
 * Get editor comparison table
 */
export function getEditorComparison() {
    return {
        editors: [
            {
                name: 'Gutenberg',
                type: 'Native Block Editor',
                bestFor: 'Modern WordPress, FSE, Performance',
                architecture: 'block.json + React',
                frontend: 'Interactivity API or static HTML',
                learningCurve: 'Medium',
                marketShare: '65%+'
            },
            {
                name: 'Elementor',
                type: 'Visual Page Builder',
                bestFor: 'Design flexibility, Marketing sites',
                architecture: 'Widget_Base class',
                frontend: 'Canvas rendering',
                learningCurve: 'Easy',
                marketShare: '15%+'
            },
            {
                name: 'Divi',
                type: 'Visual Page Builder',
                bestFor: 'All-in-one theme + builder',
                architecture: 'ET_Builder_Module',
                frontend: 'Proprietary rendering',
                learningCurve: 'Easy',
                marketShare: '8%+'
            },
            {
                name: 'WPBakery',
                type: 'Legacy Page Builder',
                bestFor: 'Legacy sites, ThemeForest themes',
                architecture: 'Shortcodes + vc_map',
                frontend: 'Shortcode parsing',
                learningCurve: 'Easy',
                marketShare: '5%+'
            }
        ],
        recommendations: {
            newProjects: 'Gutenberg (block.json v3)',
            clientRequests: 'Elementor Pro',
            themeDevelopment: 'Gutenberg + FSE',
            legacySupport: 'WPBakery compatibility layer'
        }
    };
}

/**
 * Get builder-specific CSS variables
 */
export function getBuilderCSSVariables(builder) {
    const variables = {
        elementor: {
            colors: [
                '--e-global-color-primary',
                '--e-global-color-secondary',
                '--e-global-color-text',
                '--e-global-color-accent'
            ],
            typography: [
                '--e-global-typography-primary-font-family',
                '--e-global-typography-primary-font-weight',
                '--e-global-typography-primary-font-size'
            ],
            spacing: [
                '--e-global-spacing-default'
            ]
        },
        divi: {
            colors: [
                '--et-global-color-primary',
                '--et-global-color-secondary',
                '--et-global-color-accent'
            ],
            typography: [
                '--et-global-font-family-body',
                '--et-global-font-size-body'
            ]
        },
        gutenberg: {
            colors: [
                '--wp--preset--color--primary',
                '--wp--preset--color--secondary',
                '--wp--preset--color--background',
                '--wp--preset--color--foreground'
            ],
            typography: [
                '--wp--preset--font-family--system-font',
                '--wp--preset--font-size--small',
                '--wp--preset--font-size--normal'
            ],
            spacing: [
                '--wp--preset--spacing--20',
                '--wp--preset--spacing--30',
                '--wp--preset--spacing--40'
            ]
        }
    };
    
    return variables[builder] || {};
}
