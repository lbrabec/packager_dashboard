window.env = {
    SUBDIR: '/',
    API: 'https://packager-dashboard.stg.fedoraproject.org/api/v1/',
    REFRESH_INTERVAL: 1000*60*15,
};

// convenience keys
window.env['PACKAGER_DASHBOARD_API'] = window.env.API + 'packager_dashboard/'
window.env['RELEASES_API'] = window.env.API + 'releases'
window.env['LANDINGPAGE_API'] = window.env.API + 'landing_page'
window.env['CACHING_INFO_API'] = window.env.API + 'packager_dashboard_caching'
window.env['DEPLOYMENT_ENV'] = window.env.API + 'deployment_env'
window.env['VERSION'] = '/version.json'
