window.env = {
    SUBDIR: '/',
    API: 'https://packager-dashboard.stg.fedoraproject.org/api/v1/',
    APIv2: 'https://packager-dashboard.stg.fedoraproject.org/api/v2/',
    REFRESH_INTERVAL: 1000*60*15,
};

// convenience keys
window.env['PACKAGER_DASHBOARD_API'] = window.env.API + 'packager_dashboard/'
window.env['RELEASES_API'] = window.env.API + 'releases'
window.env['LANDINGPAGE_API'] = window.env.API + 'landing_page'
window.env['CACHING_INFO_API'] = window.env.API + 'packager_dashboard_caching'
window.env['DEPLOYMENT_ENV'] = window.env.API + 'deployment_env'
window.env['VERSION'] = '/version.json'
window.env['SERVICE_MESSAGES'] = window.env.API + 'motd/service_messages'
window.env['LINKED_USER'] = window.env.API + 'current_user'
window.env['LINK_USER'] = window.env.API + 'oidc_login?redirect=' + window.location.href
window.env['UNLINK_USER'] = window.env.API + 'oidc_logout?redirect=' + window.location.href

window.env['PACKAGER_DASHBOARD_APIv2'] = window.env.APIv2 + 'packager_dashboard'
