let saldo = 0.00;
let weeklyIncome = 0.00;
let savingsData = [];

window.onload = function() {
    loadSavedData();
};

function addSavings() {
    const savingsAmount = parseFloat(document.getElementById('savingsAmount').value);
    const savingsName = document.getElementById('savingsName').value;

    if (isNaN(savingsAmount) || savingsAmount <= 0 || savingsName.trim() === "") {
        alert('Por favor, ingrese una cantidad válida y un nombre de ahorro.');
        return;
    }

    saldo += savingsAmount;

    // Agrega detalles del depósito
    const depositDetailsList = document.getElementById('depositDetails');
    const depositDetailsItem = document.createElement('li');
    depositDetailsItem.innerHTML = `${savingsName} - ${getCurrentDate()} - $${savingsAmount.toFixed(2)} <button onclick="deleteSavings(this)">Eliminar</button>`;
    depositDetailsList.appendChild(depositDetailsItem);

    // Guarda los datos actualizados después de agregar el ahorro
    saveData();
}

function deleteSavings(button) {
    const depositDetailsList = document.getElementById('depositDetails');
    const depositDetailsItem = button.parentNode;

    // Extrae la cantidad del texto del elemento
    const savingsAmount = parseFloat(depositDetailsItem.textContent.match(/\d+\.\d+/));

    // Reduzca el saldo y actualice la interfaz
    saldo -= savingsAmount;
    document.getElementById('saldoAmount').innerHTML = `Saldo: $${saldo.toFixed(2)}`;

    // Elimina el elemento de detalles del depósito
    depositDetailsList.removeChild(depositDetailsItem);

    // Guarda los datos actualizados después de eliminar el ahorro
    saveData();
}

function resetSavings() {
    saldo = 0.00;
    document.getElementById('depositDetails').innerHTML = '';
    document.getElementById('saldoAmount').innerHTML = `Saldo: $${saldo.toFixed(2)}`;
    savingsData = [];
    clearStoredData();
    loadSavedData();
}

function saveData() {
    try {
        const depositDetailsList = document.getElementById('depositDetails');
        const dataToSave = {
            depositDetails: depositDetailsList.innerHTML,
            currentSavings: saldo.toFixed(2),
            weeklyIncome: weeklyIncome.toFixed(2),
            savingsData: JSON.stringify(savingsData)
        };
        window.localStorage.setItem('savedData', JSON.stringify(dataToSave));
    } catch (e) {
        console.error('Error al guardar datos en el LocalStorage:', e);
    }

    // Actualiza el saldo en la interfaz
    document.getElementById('saldoAmount').innerHTML = `Saldo: $${saldo.toFixed(2)}`;
}

function loadSavedData() {
    const savedData = window.localStorage.getItem('savedData');

    if (savedData !== null) {
        const parsedData = JSON.parse(savedData);

        const savedSavings = parsedData.currentSavings;
        if (!isNaN(parseFloat(savedSavings)) && isFinite(savedSavings)) {
            saldo = parseFloat(savedSavings);
            document.getElementById('saldoAmount').innerHTML = `Saldo: $${saldo.toFixed(2)}`;
        }

        const depositDetailsList = document.getElementById('depositDetails');
        const savedDepositDetails = parsedData.depositDetails;
        if (savedDepositDetails !== null) {
            depositDetailsList.innerHTML = savedDepositDetails;

            // Agrega eventos de clic a los nuevos botones "Eliminar" en los detalles del depósito
            const deleteButtons = depositDetailsList.querySelectorAll('li button');
            deleteButtons.forEach(button => {
                button.onclick = function() {
                    deleteSavings(this);
                };
            });
        }

        const savedWeeklyIncome = parsedData.weeklyIncome;
        if (!isNaN(parseFloat(savedWeeklyIncome)) && isFinite(savedWeeklyIncome)) {
            weeklyIncome = parseFloat(savedWeeklyIncome);
        }

        const savedSavingsData = parsedData.savingsData;
        if (savedSavingsData !== null) {
            savingsData = JSON.parse(savedSavingsData);
        }
    }
}

function clearStoredData() {
    try {
        window.localStorage.removeItem('savedData');
    } catch (e) {
        console.error('Error al limpiar el LocalStorage:', e);
    }
}

function getCurrentDate() {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    return `${day}/${month}/${year}`;
}
