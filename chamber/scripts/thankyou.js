document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const formDataContainer = document.getElementById('formData');

    if(formDataContainer) {
        let dataHtml = '';
        params.forEach((value, key) => {
            let label = key.charAt(0).toUpperCase() + key.slice(1);
            if (label === 'Fname') label = 'First Name';
            if (label === 'Lname') label = 'Last Name';
            if (label === 'Bizname') label = 'Business Name';
            if (label === 'Memlevel') label = 'Membership Level';
            
            dataHtml += `<p><strong>${label}:</strong> ${value}</p>`;
        });
        formDataContainer.innerHTML = dataHtml;
    }
});