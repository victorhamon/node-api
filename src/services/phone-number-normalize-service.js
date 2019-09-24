'use strict';

const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

exports.normalize = async (tel, country) => {
    const number = phoneUtil.parseAndKeepRawInput(tel, country);

    console.log(number.getCountryCode());
    console.log(number.getNationalNumber());
    console.log(number.getExtension());
    console.log(number.getCountryCodeSource());
    console.log(phoneUtil.isValidNumber(number));
    console.log(phoneUtil.isValidNumberForRegion(number, country));
    console.log(phoneUtil.format(number, PNF.E164));
    console.log(phoneUtil.formatInOriginalFormat(number, country));
    console.log(phoneUtil.format(number, PNF.NATIONAL));
    console.log(phoneUtil.format(number, PNF.INTERNATIONAL));
    console.log(phoneUtil.formatOutOfCountryCallingNumber(number, 'US'));

    return phoneUtil.format(number, PNF.E164);
}