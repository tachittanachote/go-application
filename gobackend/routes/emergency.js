const express = require("express");
const router = express.Router();
const vonage = require("../components/vonage")

router.post("/", async (req, res) => {
    console.log(req.body)
    var emergencyPacket = req.body.emergencyPacket;
    
    try { var sendMessage = await vonage.sendUnicodeMessage(emergencyPacket.emergency_phone_number, 
        'นี่คือข้อความขอความช่วยเหลือจากแอป GoTogether กรุณาติดต่อด่วนไปที่เบอร์ '+emergencyPacket.phone_number+' '+emergencyPacket.first_name+' '+emergencyPacket.last_name+'กำลังโดยสารรถยนต์อยู่ที่ตำแหน่งละติจูด '+emergencyPacket.message.lat+' ลองติจูด '+
        emergencyPacket.message.long+" บนรถยนต์"+emergencyPacket.brand+' '+emergencyPacket.model+' สี'+emergencyPacket.color+' ทะเบียน '+emergencyPacket.license_plate+' หรือแจ้งเจ้าหน้าที่ตำรวจ') }
    catch (e) { console.log(e) }
});

module.exports = router;
