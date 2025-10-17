import { transporter } from "../config/nodemailer";

interface IEmail {
    email: string;
    name: string;
    token: string;
}

export const sendConfirmationEmail = async (user: IEmail) => {
    const info = await transporter.sendMail({
        from: "MueblesNova <noreply@mueblesnova.com>",
        to: user.email,
        subject: "MueblesNova - Confirma tu cuenta",
        text: "MueblesNova - Confirma tu cuenta",
        html: `<p>Hola: ${user.name}, has creado tu cuenta en MueblesNova, ya casi esta todo listo, solo debes confirmar tu cuenta</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account/${user.token}">Confirmar cuenta</a>
                <p>Este enlace expira en 10 minutos</p>
            `,
    });

    console.log("Mensaje enviado", info.messageId);
};

export const sendPasswordResetToken = async (user: IEmail) => {
    const info = await transporter.sendMail({
        from: "MueblesNova <noreply@mueblesnova.com>",
        to: user.email,
        subject: "MueblesNova - Reestablece tu contraseña",
        text: "MueblesNova - Reestablece tu contraseña",
        html: `<p>Hola: ${user.name}, has solicitado reestablecer tu contraseña.</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password/${user.token}">Reestablecer contraseña</a>
                <p>Este enlace expira en 10 minutos</p>
            `,
    });

    console.log("Mensaje enviado", info.messageId);
};
