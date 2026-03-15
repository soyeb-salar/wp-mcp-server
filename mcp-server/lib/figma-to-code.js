/**
 * figma-to-code.js
 *
 * Figma Design Token Extraction and WordPress Code Generation
 */

/**
 * Extract design tokens from Figma data
 */
export function extractFigmaTokens(figmaData) {
    const tokens = {
        colors: {},
        typography: {},
        spacing: {},
        borderRadius: {},
        shadows: {},
        layout: {}
    };
    
    // Extract colors
    if (figmaData.colors) {
        figmaData.colors.forEach(color => {
            tokens.colors[color.name] = {
                value: rgbToHex(color.r, color.g, color.b, color.a),
                css: `--wp--preset--color--${kebabCase(color.name)}`,
                figma: color.id
            };
        });
    }
    
    // Extract typography
    if (figmaData.typography) {
        figmaData.typography.forEach(font => {
            tokens.typography[font.name] = {
                fontFamily: font.familyName,
                fontSize: `${font.fontSize}px`,
                fontWeight: font.fontWeight,
                lineHeight: font.lineHeightPercent / 100,
                letterSpacing: `${font.letterSpacing}px`,
                css: `--wp--preset--font-family--${kebabCase(font.name)}`
            };
        });
    }
    
    // Extract spacing
    if (figmaData.layoutGrids) {
        tokens.spacing = extractSpacing(figmaData.layoutGrids);
    }
    
    // Extract border radius
    if (figmaData.cornerRadius !== undefined) {
        tokens.borderRadius = {
            small: '4px',
            medium: '8px',
            large: '16px',
            full: '9999px'
        };
    }
    
    // Extract shadows
    if (figmaData.effects) {
        tokens.shadows = extractShadows(figmaData.effects);
    }
    
    return tokens;
}

/**
 * Convert Figma layout to CSS
 */
export function figmaToCSS(figmaNode) {
    const css = {
        display: 'flex',
        flexDirection: 'column',
        gap: '0px',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: '0px',
        position: 'relative'
    };
    
    // Auto Layout → Flexbox
    if (figmaNode.layoutMode === 'HORIZONTAL') {
        css.flexDirection = 'row';
    } else if (figmaNode.layoutMode === 'VERTICAL') {
        css.flexDirection = 'column';
    }
    
    // Gap
    if (figmaNode.itemSpacing) {
        css.gap = `${figmaNode.itemSpacing}px`;
    }
    
    // Padding
    if (figmaNode.paddingTop) {
        css.padding = `${figmaNode.paddingTop}px ${figmaNode.paddingRight}px ${figmaNode.paddingBottom}px ${figmaNode.paddingLeft}px`;
    }
    
    // Alignment
    if (figmaNode.primaryAxisAlignItems === 'CENTER') {
        css.justifyContent = 'center';
    } else if (figmaNode.primaryAxisAlignItems === 'SPACE_BETWEEN') {
        css.justifyContent = 'space-between';
    }
    
    if (figmaNode.counterAxisAlignItems === 'CENTER') {
        css.alignItems = 'center';
    } else if (figmaNode.counterAxisAlignItems === 'MAX') {
        css.alignItems = 'flex-end';
    }
    
    // Constraints → Positioning
    if (figmaNode.constraints) {
        if (figmaNode.constraints.horizontal === 'LEFT_RIGHT') {
            css.width = '100%';
        }
        if (figmaNode.constraints.vertical === 'TOP_BOTTOM') {
            css.height = '100%';
        }
    }
    
    return css;
}

/**
 * Generate WordPress theme.json from Figma tokens
 */
export function generateThemeJson(tokens) {
    return {
        version: 2,
        settings: {
            color: {
                palette: Object.entries(tokens.colors).map(([name, color]) => ({
                    slug: kebabCase(name),
                    color: color.value,
                    name: name
                }))
            },
            typography: {
                fontFamilies: Object.entries(tokens.typography).map(([name, font]) => ({
                    fontFamily: font.fontFamily,
                    slug: kebabCase(name),
                    name: name
                })),
                fontSizes: [
                    { slug: 'small', size: '0.875rem', name: 'Small' },
                    { slug: 'medium', size: '1rem', name: 'Medium' },
                    { slug: 'large', size: '1.25rem', name: 'Large' },
                    { slug: 'x-large', size: '1.5rem', name: 'Extra Large' }
                ]
            },
            spacing: {
                scale: {
                    steps: [
                        { slug: '10', size: '0.5rem' },
                        { slug: '20', size: '1rem' },
                        { slug: '30', size: '1.5rem' },
                        { slug: '40', size: '2rem' },
                        { slug: '50', size: '3rem' }
                    ]
                }
            },
            border: {
                radius: true,
                color: true,
                style: true,
                width: true
            },
            layout: {
                contentSize: '1200px',
                wideSize: '1400px'
            }
        },
        styles: {
            color: {
                background: 'var(--wp--preset--color--white)',
                text: 'var(--wp--preset--color--black)'
            },
            typography: {
                fontFamily: 'var(--wp--preset--font-family--system-font)',
                fontSize: 'var(--wp--preset--font-size--medium)',
                lineHeight: '1.6'
            },
            blocks: {
                'core/button': {
                    border: {
                        radius: 'var(--wp--preset--spacing--20)'
                    }
                }
            }
        }
    };
}

/**
 * Generate Gutenberg block from Figma component
 */
export function generateBlockFromFigma(figmaComponent, blockName) {
    return {
        blockJson: {
            apiVersion: 3,
            name: `wp-agent/${blockName}`,
            title: figmaComponent.name,
            category: 'design',
            description: `Generated from Figma component: ${figmaComponent.id}`,
            supports: {
                align: true,
                anchor: true,
                color: {
                    background: true,
                    text: true,
                    link: true
                },
                spacing: {
                    margin: true,
                    padding: true,
                    blockGap: true
                },
                typography: {
                    fontSize: true,
                    lineHeight: true
                }
            },
            attributes: {
                backgroundColor: { type: 'string' },
                textColor: { type: 'string' },
                style: { type: 'object' }
            }
        },
        editComponent: `
import { useBlockProps, InspectorControls, ColorPalette } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({
        style: {
            backgroundColor: attributes.backgroundColor,
            color: attributes.textColor,
            ...attributes.style
        }
    });
    
    return (
        <>
            <InspectorControls>
                <PanelBody title="Colors">
                    <ColorPalette
                        value={attributes.backgroundColor}
                        onChange={(color) => setAttributes({ backgroundColor: color })}
                    />
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                {/* Figma component content */}
            </div>
        </>
    );
}`,
        saveComponent: `
import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const blockProps = useBlockProps.save({
        style: {
            backgroundColor: attributes.backgroundColor,
            color: attributes.textColor,
            ...attributes.style
        }
    });
    
    return (
        <div {...blockProps}>
            {/* Static HTML from Figma */}
        </div>
    );
}`,
        cssVariables: generateCSSVariables(figmaComponent)
    };
}

/**
 * Generate CSS custom properties from Figma
 */
export function generateCSSVariables(figmaData) {
    const css = ':root {\n';
    
    if (figmaData.colors) {
        figmaData.colors.forEach(color => {
            css += `    --wp--preset--color--${kebabCase(color.name)}: ${rgbToHex(color.r, color.g, color.b, color.a)};\n`;
        });
    }
    
    if (figmaData.typography) {
        figmaData.typography.forEach(font => {
            css += `    --wp--preset--font-family--${kebabCase(font.name)}: ${font.familyName};\n`;
            css += `    --wp--preset--font-size--${kebabCase(font.name)}: ${font.fontSize}px;\n`;
        });
    }
    
    if (figmaData.layoutGrids) {
        figmaData.layoutGrids.forEach((grid, i) => {
            css += `    --wp--preset--spacing--${i + 10}: ${grid.section}px;\n`;
        });
    }
    
    css += '}\n';
    return css;
}

/**
 * Detect Figma component type and map to WordPress
 */
export function detectComponentType(figmaNode) {
    const mapping = {
        'Button': { type: 'core/button', confidence: 'high' },
        'Text/Paragraph': { type: 'core/paragraph', confidence: 'high' },
        'Text/Heading': { type: 'core/heading', confidence: 'high' },
        'Image': { type: 'core/image', confidence: 'high' },
        'Frame/Grid': { type: 'core/group', confidence: 'medium' },
        'Rectangle': { type: 'core/cover', confidence: 'medium' },
        'Component/Card': { type: 'custom/card-block', confidence: 'medium' },
        'Component/Nav': { type: 'core/navigation', confidence: 'high' },
        'Component/Hero': { type: 'custom/hero-block', confidence: 'medium' },
        'Component/Product': { type: 'woocommerce/product', confidence: 'medium' }
    };
    
    // Match by name pattern
    for (const [pattern, wordpress] of Object.entries(mapping)) {
        if (figmaNode.name.includes(pattern)) {
            return wordpress;
        }
    }
    
    // Default to group block
    return { type: 'core/group', confidence: 'low' };
}

// Helper functions
function rgbToHex(r, g, b, a = 1) {
    const toHex = (n) => {
        const hex = Math.round(n * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${a < 1 ? toHex(a) : ''}`;
}

function kebabCase(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function extractSpacing(grids) {
    const spacing = {};
    grids.forEach((grid, i) => {
        spacing[`level-${i}`] = `${grid.section}px`;
    });
    return spacing;
}

function extractShadows(effects) {
    return effects.filter(e => e.type === 'DROP_SHADOW').map(shadow => ({
        offsetX: `${shadow.offset.x}px`,
        offsetY: `${shadow.offset.y}px`,
        blur: `${shadow.radius}px`,
        spread: '0px',
        color: `rgba(${shadow.color.r * 255}, ${shadow.color.g * 255}, ${shadow.color.b * 255}, ${shadow.color.a})`
    }));
}
