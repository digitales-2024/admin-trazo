export type UserLoginInput = {
    email: string;
    password: string;
};

export type UserLoginOutput = {
    id: string;
    name: string;
    email: string;
    phone: string;
    roles: { id: string; name: string }[];
};
