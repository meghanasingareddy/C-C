document.addEventListener("DOMContentLoaded", function () {



    const reservationForm =
        document.getElementById("reservation-form");


    if (reservationForm) {

        reservationForm.addEventListener("submit", function (e) {

            e.preventDefault();


            const name =
                document.getElementById("guest-name").value;


            const nook =
                document.getElementById("nook-select").value;


            const date =
                document.getElementById("reservation-date").value;


            alert(
                `Thank you ${name}! Your ${nook} reservation for ${date} has been received.`
            );


            reservationForm.reset();

        });

    }




    const newsletterForm =
        document.getElementById("newsletter-form");


    if (newsletterForm) {

        newsletterForm.addEventListener("submit", function (e) {

            e.preventDefault();


            alert(
                "Welcome to The Chapter Club! You are successfully subscribed."
            );


            newsletterForm.reset();

        });

    }





    const eventButtons =
        document.querySelectorAll(".event-btn");


    eventButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const eventName =
                this.getAttribute("data-event");


            alert(
                `Your RSVP for "${eventName}" has been registered!`
            );

        });

    });

});


















