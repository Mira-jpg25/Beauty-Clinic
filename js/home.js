document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener('click', function(e) {

        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            e.preventDefault();

            target.scrollIntoView({
                behavior: 'smooth'
            });
        }

    });

});

const currentPage = window.location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('.navbar .nav-link').forEach(link => {

    const linkPage = link.getAttribute('href');

    if (linkPage === currentPage) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }

});
