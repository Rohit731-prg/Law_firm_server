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