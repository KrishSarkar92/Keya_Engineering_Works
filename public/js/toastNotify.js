const Toast = {
    init() {
        this.hideTimeout = null;
        this.el = document.createElement('div');
        this.el.className = 'toast';
        document.body.appendChild(this.el);
    },
    show(message, state) {
        clearTimeout(this.hideTimeout);
        this.el.textContent = message;
        this.el.className = 'toast toast-visible';

        if (state) this.el.classList.add(`toast-${state}`);

        this.hideTimeout = setTimeout(() => {
            this.el.classList.remove('toast-visible');
        }, 3000);
    }
};

document.addEventListener('DOMContentLoaded', () => Toast.init());

function notify() {
    const companyPurchase = document.getElementById('companyPurchaseGst');
    const companySale = document.getElementById('companySaleGst');
    const companySaleBill = document.getElementById('companySaleBillGst');

    const warnPurchase = document.getElementById("companyPurchaseWarn");
    const warnSale = document.getElementById("companySaleWarn");
    const warnSaleBill = document.getElementById("companySaleBillWarn");

    if (companyPurchase.value === "") {
        warnPurchase.innerHTML = "*Select Company";
        warnPurchase.style.color = "red";
        warnPurchase.style.fontWeight = "bold";
    } else {
        warnPurchase.innerHTML = "Selected";
        warnPurchase.style.color = "red";
        warnPurchase.style.fontWeight = "bold";
    }

    if (companySale.value === "") {
        warnSale.innerHTML = "*Select Company";
        warnSale.style.color = "red";
        warnSale.style.fontWeight = "bold";
    } else {
        warnSale.innerHTML = "Selected";
        warnSale.style.color = "red";
        warnSale.style.fontWeight = "bold";
    }

    if (companySaleBill.value === "") {
        warnSaleBill.innerHTML = "*Select Company";
        warnSaleBill.style.color = "red";
        warnSaleBill.style.fontWeight = "bold";
    } else {
        warnSaleBill.innerHTML = "Selected";
        warnSaleBill.style.color = "red";
        warnSaleBill.style.fontWeight = "bold";
    }

    const state = document.getElementById('toastNotify').value;
    const msgSuccess = "Data saved successfully";
    const msgError = "Error in saving data";

    if (state === 'success') {
        Toast.show(msgSuccess, state);
    } else if (state === 'error') {
        Toast.show(msgError, state);
    }
}

document.addEventListener('DOMContentLoaded', () => notify());
