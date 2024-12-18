const apiUrl = "http://127.0.0.1:8000"; // Base API URL

/**
 * Add a new medicine.
 */
function addMedicine() {
  const nameInput = document.getElementById("add-medicine-name");
  const priceInput = document.getElementById("add-medicine-price");

  const name = nameInput.value.trim();
  const price = parseFloat(priceInput.value);

  if (!name || isNaN(price)) {
    alert("Please provide a valid medicine name and price.");
    return;
  }

  fetch(`${apiUrl}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ name, price }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to add medicine.");
      }
      return response.json();
    })
    .then(data => {
      alert(data.message); // Show success message
      nameInput.value = "";
      priceInput.value = "";
      return fetchAndDisplayMedicines(); // Refresh the medicines list
    })
    .catch(error => {
      console.error("Error adding medicine:", error);
      alert("Failed to add medicine. Please try again.");
    });
}

/**
 * Delete a specific medicine.
 */
function deleteMedicine() {
  const nameInput = document.getElementById("delete-medicine-name");
  const name = nameInput.value.trim();

  if (!name) {
    alert("Please provide a valid medicine name to delete.");
    return;
  }

  fetch(`${apiUrl}/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ name }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to delete medicine.");
      }
      return response.json();
    })
    .then(data => {
      alert(data.message); // Show success message
      nameInput.value = "";
      return fetchAndDisplayMedicines(); // Refresh the medicines list
    })
    .catch(error => {
      console.error("Error deleting medicine:", error);
      alert("Failed to delete medicine. Please try again.");
    });
}

/**
 * Search for a specific medicine.
 */
function searchMedicine() {
  const query = document.getElementById("search-bar").value.trim().toLowerCase();
  const medicinesContainer = document.getElementById("medicines-container");

  if (!query) {
    alert("Please enter a medicine name to search.");
    return;
  }

  fetch(`${apiUrl}/medicines/${query}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return response.json();
    })
    .then(medicine => {
      medicinesContainer.innerHTML = ""; // Clear current medicines

      // Create a medicine row matching the .subtopic CSS
      const medicineRow = document.createElement("div");
      medicineRow.classList.add("subtopic"); // Apply .subtopic styles

      // Name Column
      const nameCol = document.createElement("span");
      nameCol.textContent = medicine.name;

      // Price Column
      const priceCol = document.createElement("span");
      priceCol.textContent = `$${medicine.price.toFixed(2)}`;

      // Append columns to the row
      medicineRow.appendChild(nameCol);
      medicineRow.appendChild(priceCol);

      // Append the row to the container
      medicinesContainer.appendChild(medicineRow);
    })
    .catch(error => {
      console.error("Error searching for medicine:", error);
      medicinesContainer.innerHTML = "<p>Medicine not found!</p>";
    });
}

/**
 * Update a medicine's price.
 */
function updateMedicine() {
  const nameInput = document.getElementById("update-medicine-name");
  const priceInput = document.getElementById("update-medicine-price");

  const name = nameInput.value.trim();
  const price = parseFloat(priceInput.value);

  if (!name || isNaN(price)) {
    alert("Please provide a valid medicine name and new price.");
    return;
  }

  fetch(`${apiUrl}/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ name, price }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to update medicine.");
      }
      return response.json();
    })
    .then(data => {
      alert(data.message); // Show success message
      nameInput.value = "";
      priceInput.value = "";
      return fetchAndDisplayMedicines(); // Refresh the medicines list
    })
    .catch(error => {
      console.error("Error updating medicine:", error);
      alert("Failed to update medicine. Please try again.");
    });
}
/**
 * Fetch and display all medicines.
 */
function fetchAndDisplayMedicines() {
    const medicinesContainer = document.getElementById("medicines-container");
    medicinesContainer.innerHTML = ""; // Clear the current list

    fetch(`${apiUrl}/medicines`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.medicines && data.medicines.length > 0) {
                data.medicines.forEach(medicine => {
                    const medicineRow = document.createElement("div");
                    medicineRow.classList.add("subtopic");

                    // Name Column
                    const nameCol = document.createElement("span");
                    nameCol.textContent = medicine.name;

                    // Price Column
                    const priceCol = document.createElement("span");
                    priceCol.textContent = `$${medicine.price.toFixed(2)}`;

                    // Append columns to the row
                    medicineRow.appendChild(nameCol);
                    medicineRow.appendChild(priceCol);

                    // Append the row to the container
                    medicinesContainer.appendChild(medicineRow);
                });
            } else {
                medicinesContainer.innerHTML = "<p>No medicines found!</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching medicines:", error);
            medicinesContainer.innerHTML = "<p>Failed to load medicines. Please try again later.</p>";
        });
}

/**
 * Fetch and display the average price of medicines.
 */
function calculateAveragePrice() {
    const averagePriceDisplay = document.getElementById("average-price-display");

    fetch(`${apiUrl}/medicines/average`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.average_price) {
                averagePriceDisplay.textContent = `The average price of medicines is $${data.average_price.toFixed(2)}`;
            } else {
                averagePriceDisplay.textContent = `Error: ${data.error}`;
            }
        })
        .catch(error => {
            console.error("Error calculating average price:", error);
            averagePriceDisplay.textContent = "Failed to calculate average price. Please try again later.";
        });
}

// Attach event listeners to buttons
document.getElementById("view-all-button").addEventListener("click", fetchAndDisplayMedicines);
document.getElementById("calculate-average-button").addEventListener("click", calculateAveragePrice);
document.getElementById("add-medicine-button").addEventListener("click", addMedicine);
document.getElementById("delete-medicine-button").addEventListener("click", deleteMedicine);
document.getElementById("update-medicine-button").addEventListener("click", updateMedicine);
document.getElementById("search-button").addEventListener("click", searchMedicine);

// Automatically fetch and display medicines on page load
fetchAndDisplayMedicines();
