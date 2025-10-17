"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetToken = exports.sendConfirmationEmail = void 0;
const nodemailer_1 = require("../config/nodemailer");
const sendConfirmationEmail = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const info = yield nodemailer_1.transporter.sendMail({
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
});
exports.sendConfirmationEmail = sendConfirmationEmail;
const sendPasswordResetToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const info = yield nodemailer_1.transporter.sendMail({
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
});
exports.sendPasswordResetToken = sendPasswordResetToken;
//# sourceMappingURL=AuthEmail.js.map