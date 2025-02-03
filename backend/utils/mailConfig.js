import axios from 'axios';

// Function to verify email with Hunter.io
export const verifyEmail = async (req, res) => {
    try {
        const { email } = req.body;

        // Your Hunter.io API Key (store it in environment variables for security)
        const apiKey = process.env.HUNTER_API_KEY; // Set this in .env file
        const url = `https://api.hunter.io/v2/email-verifier`;

        const response = await axios.get(url, {
            params: {
                email: email,
                api_key: apiKey,
            },
        });

        const { data } = response;

        // Check if the email is deliverable
        if (data.data.result === 'deliverable') {
            return res.status(200).json({
                success: true,
                message: 'Email is valid and deliverable.',
                result: data.data,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: `Email is not deliverable: ${data.data.result}`,
                result: data.data,
            });
        }
    } catch (error) {
        console.error('Error verifying email with Hunter.io:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to verify email.',
            error: error.message,
        });
    }
};
