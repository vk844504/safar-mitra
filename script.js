let fromAutocomplete;
let toAutocomplete;

function initAutocomplete() {
    const fromInput = document.getElementById("from");
    const toInput = document.getElementById("to");

    fromAutocomplete = new google.maps.places.Autocomplete(fromInput, {
        types: ["geocode"],
        componentRestrictions: { country: "in" }
    });

    toAutocomplete = new google.maps.places.Autocomplete(toInput, {
        types: ["geocode"],
        componentRestrictions: { country: "in" }
    });
}
let finalPrice = 0;
let finalDistance = 0;

const rates = {
    "Bolero": 14,
    "Grand i10": 12,
    "Ertiga": 15,
    "Scorpio": 18,
    "Any Available": 13
};

async function calculatePrice() {
    const from = document.getElementById("from").value.trim();
    const to = document.getElementById("to").value.trim();
    const vehicle = document.getElementById("vehicle").value;

    if (!from || !to || !vehicle) {
        alert("Please fill all fields");
        return;
    }

    try {
        const res = await fetch("http://localhost:5000/calculate-distance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ from, to })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Distance error");
            return;
        }

        finalDistance = data.distanceKm;
        finalPrice = Math.round(finalDistance * rates[vehicle]);

        document.getElementById("price").innerText = finalPrice;
        document.getElementById("priceBox").classList.remove("hidden");

    } catch {
        alert("Backend not reachable");
    }
}

function sendWhatsApp() {
    if (finalPrice === 0) {
        alert("Calculate price first");
        return;
    }

    const message =
        `Hello Safar Mitra\n` +
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
