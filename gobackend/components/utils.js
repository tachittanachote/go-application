exports.validatePhoneNumber = (phoneNumber) => {
    if (phoneNumber.length < 10 || phoneNumber.length > 11) return false;
    if (phoneNumber.length === 11 && phoneNumber.charAt(0) === "6" && phoneNumber.charAt(1) === "6") return true;
    if (phoneNumber.length === 10 && phoneNumber.charAt(0) === "0") return true;
    return false;
};

exports.formatPhoneNumber = (phoneNumber) => {
    if (phoneNumber.length === 11 && phoneNumber.charAt(0) === "6" && phoneNumber.charAt(1) === "6") return phoneNumber;
    if (phoneNumber.length === 10 && phoneNumber.charAt(0) === "0") return phoneNumber.replace(phoneNumber.charAt(0), "66")
};

exports.localPhoneNumberFormatter = (phoneNumber) => {
    return phoneNumber.replace(phoneNumber.charAt(0), "").replace(phoneNumber.charAt(1), "0");
};

exports.generateNumbers = (length) => {
    return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1));
};

exports.randString = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

exports.validateEmail = (email) => {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}