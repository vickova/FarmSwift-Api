import SellerDetails from '../model/SellerDetails.js';
import axios from 'axios';
import dotenv from 'dotenv';



dotenv.config();

export const addSellerDetails = async (req, res) => {
    console.log(process.env.FLW_SECRET_KEY)
    try {
        const { bankName, user, accountNumber, bankCode } = req.body;
console.log(bankName)
console.log(accountNumber)
console.log(bankCode)
        // Validate Bank Details with Flutterwave
        const validateBank = await axios.post(
            "https://api.flutterwave.com/v3/accounts/resolve",
            { account_number:accountNumber, account_bank: Number(bankCode) },
            {
                headers: {
                    Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log(validateBank)
        if (!validateBank.data || !validateBank.data.status || validateBank.data.status !== "success") {
            return res.status(400).json({ error: "Invalid bank details provided" });
        }

        // Save to Database
        const updatedSeller = await SellerDetails.findOneAndUpdate(
            { user }, // Find seller by user ID
            { bankName, accountNumber, bankCode },
            { new: true, upsert: true } // Create if not found
        );

        res.json({ message: "Bank details validated & updated successfully!", seller: updatedSeller });
    } catch (error) {
        console.error("Error adding bank details:", error.response?.data || error);
        res.status(500).json({ error: "Server error while updating bank details" });
    }
};
