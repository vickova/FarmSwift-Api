import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const getBankList = async (req, res) => {
    try {
        const response = await axios.get("https://api.flutterwave.com/v3/banks/NG", {
            headers: { Authorization: `Bearer ${process.env.FLW_SECRET_KEY}` }
        });

        res.json({ success: true, banks: response.data.data });

    } catch (error) {
        console.error("Error fetching banks:", error.response?.data || error.message);
        res.status(500).json({ success: false, message: "Error fetching banks" });
    }
};

