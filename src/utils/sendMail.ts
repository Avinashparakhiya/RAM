import sgMail from '@sendgrid/mail';
import 'dotenv/config';

// Set the SendGrid API key
if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY is not defined in the environment variables');
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendMail = async (to: string, subject: string, html: string): Promise<void> => {
    try {
        const msg = {
            to,
            from: {
                email: 'notifications-noreply@tallect.com', // Replace with your verified sender email
                name: 'Tallect',
            },
            subject,
            html,
        };

        await sgMail.send(msg);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};