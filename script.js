
let fromAutocomplete;
let toAutocomplete;
let fromSelected = false;
let toSelected = false;

function initAutocomplete() {
    const fromInput = document.getElementById("from");
    const toInput = document.getElementById("to");

    const options = {
        componentRestrictions: { country: "in" },
        fields: ["formatted_address", "geometry"],
        types: ["geocode"]
    };

    // Create autocomplete objects
    fromAutocomplete = new google.maps.places.Autocomplete(fromInput, options);
    toAutocomplete = new google.maps.places.Autocomplete(toInput, options);

    // 🔹 FIX 3 GOES HERE (BIHAR BIAS)
    const biharBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(24.0, 83.0), // South-West Bihar
        new google.maps.LatLng(27.5, 88.0)  // North-East Bihar
    );

    fromAutocomplete.setBounds(biharBounds);
    toAutocomplete.setBounds(biharBounds);
    // 🔹 FIX 3 ENDS HERE

    // Detect proper selection
    fromAutocomplete.addListener("place_changed", () => {
        fromSelected = true;
    });

    toAutocomplete.addListener("place_changed", () => {
        toSelected = true;
    });

    // Reset if user types manually
    fromInput.addEventListener("input", () => fromSelected = false);
    toInput.addEventListener("input", () => toSelected = false);
}


async function calculatePrice() {
    const fromPlace = fromAutocomplete.getPlace();
const toPlace = toAutocomplete.getPlace();

if (!fromPlace || !fromPlace.formatted_address ||
    !toPlace || !toPlace.formatted_address) {
    alert("Please select locations from the suggestions");
    return;
}

const from = fromPlace.formatted_address;
const to = toPlace.formatted_address;

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
