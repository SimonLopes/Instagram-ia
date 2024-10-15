const Auth = {
    isAuthenticated: () => {
        return localStorage.getItem('token') !== null;
    },
    
    requireAuth: (redirectUrl = '/login') => {
        if (!Auth.isAuthenticated()) {
            window.location.href = redirectUrl;
        }
    }
};