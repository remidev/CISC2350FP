// Dark mode toggle functionality using Bootstrap's data-bs-theme

(function() {
    // Get saved theme or default to light
    const getStoredTheme = () => localStorage.getItem('theme') || 'light';
    const setStoredTheme = theme => localStorage.setItem('theme', theme);
    
    // Apply theme to document
    const setTheme = theme => {
        document.documentElement.setAttribute('data-bs-theme', theme);
        updateToggleButton(theme);
    };
    
    // Update button icon and text
    const updateToggleButton = theme => {
        const button = document.getElementById('darkModeToggle');
        if (button) {
            button.innerHTML = theme === 'dark' 
                ? '◑' // Right half black for switching to light
                : '◐'; // Left half black for switching to dark
            button.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
        }
    };
    
    // Toggle between light and dark
    window.toggleDarkMode = function() {
        const currentTheme = document.documentElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        setStoredTheme(newTheme);
    };
    
    // Apply stored theme on page load
    setTheme(getStoredTheme());
})();
