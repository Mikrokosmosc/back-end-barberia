import bcrypt from "bcryptjs";

const password = process.env.BCRYPT_PASSWORD;

bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;

    console.log(hash);
});

//hash