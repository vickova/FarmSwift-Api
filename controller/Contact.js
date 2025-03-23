import nodemailer from 'nodemailer';


// Configure nodemailer (Use Gmail, Mailtrap, or SendGrid)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const contact = async(req, res)=>{
    console.log(req.body)
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'techiesinagric@gmail.com',
            subject: req.body.subject,
            html: `<h2>Hello, FarmSwift Team</h2>
                   <p>Trust this mail finds you well. ${req.body.message}</p>
                   <p>Thanky</p
                   <p>Kind regards</p>`
        });
        res.status(200).json({ success: true, message: 'Message sent successfully', data: req.body.email });
    } catch (err) {
        console.error("Contacting failed:", err);
        res.status(500).json({ success: false, message: "Failed to contact." });
    }
}