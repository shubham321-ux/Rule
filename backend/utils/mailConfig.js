import axios from 'axios';

// Function to verify email with Hunter.io
export const verifyEmail = async (req, res) => {
    try {
        const { email } = req.body;

        
        const apiKey = "2fb88446891a43c8fad4b535b60ee831da066f24"; 
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
