
async function loadComponent(selector, filePath, cssPath, jsPath) {
    const container = document.querySelector(selector);
    if (container) {
        try {
            const response = await fetch(filePath);
            if (response.ok) {
                const html = await response.text();
                container.innerHTML = html;

                // Carrega o CSS do componente
                if (cssPath) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = cssPath;
                    document.head.appendChild(link);
                }

                // Carrega o JS do componente
                if (jsPath) {
                    const script = document.createElement('script');
                    script.src = jsPath;
                    document.body.appendChild(script);
                }
            } else {
                console.error(`Erro ao carregar o componente ${filePath}`);
            }
        } catch (error) {
            console.error('Erro ao carregar o componente:', error);
        }
    }
}

$(document).ready(function () {
    $('#sidebar-container').load('/components/menu/sidebar.html', function () {
        setTimeout(highlightActiveLink, 100);
    });
});

function highlightActiveLink() {
    const currentPath = window.location.pathname;
    const sidebarLinks = $('.sidebar ul li a');

    sidebarLinks.each(function () {
        const linkPath = $(this).attr('href');

        // Verifica se o caminho do link corresponde ao caminho atual
        if (linkPath === currentPath || currentPath.includes(linkPath)) {
            $(this).addClass('active');
        }
    });
}