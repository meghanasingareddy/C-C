/* ==========================================================================
   Chai & Chapter - Simple JavaScript Behavior
   Consistent with Krish's Handicraft Store reference patterns
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

    // 1. Reservation Form Submission
    const reservationForm = document.getElementById('nook-reservation-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('guest-name').value;
            const nook = document.getElementById('nook-select').options[document.getElementById('nook-select').selectedIndex].text;
            const date = document.getElementById('reservation-date').value;

            alert(`Thank you ${name}! Your reservation for "${nook}" on ${date} has been received. We will confirm via SMS/Email shortly.`);
            reservationForm.reset();
        });
    }

    // 2. Newsletter Form Submission
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Welcome to The Chapter Club! You have successfully subscribed to our monthly book recommendations.');
            newsletterForm.reset();
        });
    }

    // 3. Event RSVP Buttons
    const rsvpButtons = document.querySelectorAll('.event-rsvp-btn');
    rsvpButtons.forEach(button => {
        button.addEventListener('click', function () {
            const eventName = this.getAttribute('data-event') || 'this event';
            alert(`Your RSVP spot for "${eventName}" at Chai & Chapter has been registered! We look forward to seeing you.`);
        });
    });

    // 4. Simple ScrollReveal Animation (If ScrollReveal library is loaded)
    if (typeof ScrollReveal !== 'undefined') {
        const sr = ScrollReveal({
            origin: 'top',
            distance: '30px',
            duration: 800,
            reset: false
        });

        sr.reveal('.home-data, .home-img-wrapper', { interval: 200 });
        sr.reveal('.reservation-card', { delay: 200 });
        sr.reveal('.service-card', { interval: 150 });
        sr.reveal('.product-card', { interval: 100 });
        sr.reveal('.event-card', { interval: 150 });
        sr.reveal('.about-img-box, .about-data', { interval: 200 });
        sr.reveal('.review-card', { interval: 150 });
        sr.reveal('.newsletter-card', { delay: 200 });
    }

});
