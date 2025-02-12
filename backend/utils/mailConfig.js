import axios from 'axios';
import dns from 'dns'; // For DNS lookups

// Function to get MX records for a domain
const getMXRecords = (domain) => {
    return new Promise((resolve, reject) => {
        dns.resolveMx(domain, (err, addresses) => {
            if (err || !addresses || addresses.length === 0) {
                reject("No MX records found");
            } else {
                resolve(addresses);
            }
        });
    });
};

// Email validation function
export const verifyEmail = async (req, res) => {
    console.log("Verifying email...", req.body);
    try {
        const { email } = req.body; 
        console.log(email);
        
        // Validate email format first
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email address is required."
            });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format."
            });
        }

        const apiKey = process.env.HUNTER_API_KEY;
        const url = `https://api.hunter.io/v2/email-verifier`;

        // Step 1: Call Hunter API to check email validity
        const response = await axios.get(url, {
            params: {
                email: email,
                api_key: apiKey,
            },
        });

        console.log(response.data);

        const { data } = response;

        if (data && data.data) {
            const { result, status, score, disposable, webmail, accept_all, mx_records, domain } = data.data;

            let emailValid = false;
            let message = '';

            // Step 2: Perform DNS check for MX records to confirm email domain's deliverability
            try {
                const domainPart = email.split('@')[1];
                const mxRecords = await getMXRecords(domainPart);

                if (mxRecords.length > 0) {
                    // Valid MX records found for the domain
                    console.log(`MX records found for domain: ${domainPart}`);
                } else {
                    return res.status(400).json({
                        success: false,
                        message: "Email domain has no MX records, cannot receive emails."
                    });
                }
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to resolve MX records for the email domain.",
                });
            }

            // Step 3: Handle "risky" emails for trusted providers (Gmail, Yahoo, etc.)
            const trustedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'icloud.com'];
            const emailDomain = email.split('@')[1].toLowerCase();

            // If email is from a trusted domain and marked as "risky", still consider it valid
            if (trustedDomains.includes(emailDomain) && result !== 'undeliverable') {
                emailValid = true;
                message = 'Email is valid and deliverable (trusted domain).';
            } else if (result === 'deliverable') {
                emailValid = true;
                message = 'Email is valid and deliverable.';
            } else if (result === 'risky') {
                message = 'Email is risky, use caution before sending.';
            } else if (result === 'undeliverable') {
                message = 'Email is undeliverable, do not send email.';
            }

            // Final response with all relevant data
            return res.status(200).json({
                success: emailValid,
                message: message,
                result: {
                    email,
                    status,
                    score,
                    disposable,
                    webmail,
                    accept_all,
                    result,
                    mx_records
                }
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Email verification failed. No valid response from Hunter.io.',
            });
        }

    } catch (error) {
        console.error('Error verifying email with Hunter.io:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to verify email.',
            error: error.message || 'Unknown error',
        });
    }
};
