/*
 * Cheng Tsz Hung (25017438D)
 * Awwab Hamam (22103907D)
 */
let scanner = null;

async function initializeScanner() {
    try {
        scanner = new Html5QrcodeScanner("reader", {
            qrbox: {
                width: 250,
                height: 250,
            },
            fps: 5,
        });

        scanner.render(onScanSuccess, onScanError);
    } catch (err) {
        console.error('Error initializing scanner:', err);
        alert('Could not initialize QR scanner');
    }
}

async function onScanSuccess(decodedText) {
    try {
        if (decodedText && decodedText.split && decodedText.split('.').length === 2) {
            const token = decodedText.trim();
            const response = await fetch('/api/tickets/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });
            const contentType = response.headers.get('content-type') || '';
            if (!response.ok) {
                const text = await response.text();
                console.error('Validation response not OK', response.status, text);
                displayError('Server error during validation');
                if (typeof playErrorSound === 'function') playErrorSound();
                return;
            }
            if (!contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Validation returned non-JSON response:', text);
                displayError('Invalid server response during validation');
                if (typeof playErrorSound === 'function') playErrorSound();
                return;
            }
            const data = await response.json();
            if (data.valid) {
                displayTicketInfo(data.ticketInfo);
                if (typeof playSuccessSound === 'function') playSuccessSound();
            } else {
                displayError(data.message || 'Invalid ticket');
                playErrorSound && playErrorSound();
            }
            return;
        }

        let ticketCode = decodedText;
        try {
            const url = new URL(decodedText);
            const parts = url.pathname.split('/').filter(Boolean);
            if (parts.length) {
                ticketCode = parts[parts.length - 1];
            }
        } catch (err) {
            // not a URL, keep decodedText
        }

        const params = new URLSearchParams(window.location.search);
        const scannerKey = params.get('scannerKey');

        const body = { ticketCode };
        if (scannerKey) body.scannerKey = scannerKey;

        const response = await fetch('/api/tickets/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        const contentType = response.headers.get('content-type') || '';
        if (!response.ok) {
            const text = await response.text();
            console.error('Validation response not OK', response.status, text);
            displayError('Server error during validation');
            if (typeof playErrorSound === 'function') playErrorSound();
            return;
        }

        if (!contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Validation returned non-JSON response:', text);
            displayError('Invalid server response during validation');
            if (typeof playErrorSound === 'function') playErrorSound();
            return;
        }

        const data = await response.json();
        if (data.valid) {
            displayTicketInfo(data.ticketInfo);
            if (typeof playSuccessSound === 'function') playSuccessSound();
        } else {
            displayError(data.message || 'Invalid ticket');
            if (typeof playErrorSound === 'function') playErrorSound();
        }
    } catch (err) {
        console.error('Error validating ticket:', err);
        displayError('Could not validate ticket');
    }
}

function onScanError(err) {
    console.warn(err);
}

function displayTicketInfo(ticketInfo) {
    const infoDiv = document.getElementById('ticketInfo');
    infoDiv.innerHTML = `
        <div class="alert alert-success">
            <h4>Valid Ticket!</h4>
            <p>Booth: ${ticketInfo.boothNumber}</p>
            <p>Owner: ${ticketInfo.userName}</p>
            <p>Entry Time: ${new Date().toLocaleTimeString()}</p>
        </div>
    `;
}

function displayError(message) {
    const infoDiv = document.getElementById('ticketInfo');
    infoDiv.innerHTML = `
        <div class="alert alert-danger">
            <h4>Invalid Ticket</h4>
            <p>${message}</p>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', initializeScanner);