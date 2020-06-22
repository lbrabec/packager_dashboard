window.env = {
    SUBDIR: '/',
    API: 'https://packager.fedorainfracloud.org:5000/api/v1/',
};

// convenience keys
window.env['PACKAGER_DASHBOARD_API'] = window.env.API + 'packager_dashboard/'
window.env['RELEASES_API'] = window.env.API + 'releases'
