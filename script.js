let finalPrice = 0;
let finalDistance = 0;

const rates = {
    "Bolero": 14,
    "Grand i10": 12,
    "Ertiga": 15,
    "Scorpio": 18,
    "Any Available": 13
};

function calculatePrice() {

    if (typeof google === "undefined") {
        alert("Google Maps not loaded. Check API key.");
        return;
    }

    const from = document.getElementById("from").value.trim();
    const to = document.getElementById("to").value.trim();
    const vehicle = document.getElementById("vehicle").value;

    if (!from || !to || !vehicle) {
        alert("Please enter From, To and select Vehicle");
        return;
    }

    const service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix({
        origins: [from],
        destinations: [to],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC
    }, function (response, status) {

        if (status !== "OK") {
            alert("Distance calculation failed: " + status);
            return;
        }

        const result = response.rows[0].elements[0];

        if (result.status !== "OK") {
            alert("Route not found. Use full place names.");
            return;
        }

        finalDistance = result.distance.value / 1000;
        finalPrice = Math.round(finalDistance * rates[vehicle]);

        document.getElementById("price").innerText = finalPrice;
        document.getElementById("priceBox").classList.remove("hidden");
    });
}

function sendWhatsApp() {
    if (finalPrice === 0) {
        alert("Please calculate price first");
        return;
    }

    const message =
        `Hello Safar Mitra\n` +
        `Name: ${name.value}\n` +
        `Phone: ${phone.value}\n` +
        `From: ${from.value}\n` +
        `To: ${to.value}\n` +
        `Vehicle: ${vehicle.value}\n` +
        `Distance: ${finalDistance.toFixed(1)} km\n` +
        `Estimated Price: ₹${finalPrice}`;

    window.open(
        `https://wa.me/916205081544?text=${encodeURIComponent(message)}`,
        "_blank"
    );
}
