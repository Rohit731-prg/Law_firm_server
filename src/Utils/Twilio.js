import twilioConfig from "../Config/TwilioConfig.js";
import twilio from "twilio";

const client = twilio(twilioConfig.accountSid, twilioConfig.authToken);

export const sendSMS = async (phone, messageData) => {
    try {
        const message = await client.messages.create({
            body: messageData,
            from: twilioConfig.fromPhone,
            to: phone
        });
        return message;
    } catch (error) {
        throw error.message;
    }
}

export const bulkSms = async (numbers, message) => {
    try {
        for (let number of numbers) {
            await client.messages.create({
                body: message,
                from: twilioConfig.fromPhone,
                to: number,
            });
            console.log(`SMS sent to ${number}`);
        }
    } catch (error) {
        console.log(error);
    }
}