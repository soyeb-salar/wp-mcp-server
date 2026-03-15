/**
 * wp-actions.js
 * 
 * Provides actionable generators and commands for common WordPress tasks,
 * such as creating posts, users, or scaffolding scaffolding.
 */

/**
 * Generates exact WP-CLI commands and accompanying PHP (if necessary)
 * for a specific user action.
 * 
 * @param {string} action - The action requested (e.g., 'create_post', 'create_user')
 * @param {Object} params - Dynamic parameters (e.g., { title: 'Hello', content: 'World' })
 * @returns {{ action: string, wp_cli: string[], php: string, description: string }}
 */
export function generateWpAction(action, params = {}) {
  switch (action.toLowerCase()) {
    case 'create_post':
      const title = params.title || 'Draft Post';
      const content = params.content || 'Content goes here.';
      const status = params.status || 'publish';
      const type = params.post_type || 'post';
      
      return {
        action: 'create_post',
        description: `Creates a new '${type}' in WordPress with status '${status}'.`,
        wp_cli: [
          `wp post create --post_type="${type}" --post_title="${title}" --post_content="${content}" --post_status="${status}"`
        ],
        php: `
// PHP equivalent using wp_insert_post()
$post_data = array(
    'post_title'   => wp_strip_all_tags( '${title}' ),
    'post_content' => '${content}',
    'post_status'  => '${status}',
    'post_type'    => '${type}',
);
$post_id = wp_insert_post( $post_data );
if ( is_wp_error( $post_id ) ) {
    error_log( $post_id->get_error_message() );
}`.trim()
      };
      
    case 'create_user':
      const user = params.username || 'newuser';
      const email = params.email || 'user@example.com';
      const role = params.role || 'subscriber';
      
      return {
        action: 'create_user',
        description: `Creates a new user '${user}' with role '${role}'.`,
        wp_cli: [
          `wp user create ${user} ${email} --role=${role} --send-email`
        ],
        php: `
// PHP equivalent using wp_create_user / wp_insert_user
$user_id = wp_insert_user( array(
    'user_login' => '${user}',
    'user_email' => '${email}',
    'role'       => '${role}',
    'user_pass'  => wp_generate_password()
) );`.trim()
      };

    default:
      return {
        error: "Unknown action. Available actions: 'create_post', 'create_user'"
      };
  }
}
