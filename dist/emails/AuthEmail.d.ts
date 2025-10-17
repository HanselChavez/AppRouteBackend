interface IEmail {
    email: string;
    name: string;
    token: string;
}
export declare const sendConfirmationEmail: (user: IEmail) => Promise<void>;
export declare const sendPasswordResetToken: (user: IEmail) => Promise<void>;
export {};
