const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const schedule = require('node-schedule');
const moment = require('moment-timezone'); // Pastikan Anda menginstal moment-timezone

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox']
    }
});

const TARGET_PHONE_NUMBER = '62882009127056@c.us'; // Ganti dengan nomor target yang diinginkan

client.on('qr', (qr) => {
    // Generate and display QR code for authentication
    qrcode.generate(qr, { small: true });
    console.log('QR code generated! Scan it with your WhatsApp app.');
});

client.on('ready', () => {
    console.log('Client is ready!');

    // Definisikan nomor target dan pesan
    const targetNumber = '6282136600468';
    const morningMessage = `
*Selamat Pagi Dek*

> Bangun wes jam 6
> Selamat beraktifitas dek
> semoga golek ngilmu ne barokah,
> seng pinter, ojo ngelali nang mas aris.
> Tak cekel janjimu , I Love You

---------------------------------------
- Pesan Otomatis by NesBot            
---------------------------------------`;
    const eveningMessage = `
*Selamat Malem Dek*

> Wes wayahe tidur, aktifikasmu berat. 
> ojo pegang hp terus
> tidur harus 8 jam sehari ben badan mu tetep sehat nggeh dek.
> I Love You

----------------------------------------------------------------
- Pesan Otomatis by NesBot               
----------------------------------------------------------------`;

    // Jadwalkan pesan pagi dengan zona waktu Jakarta
    schedule.scheduleJob('55 7 * * *', {
        tz: 'Asia/Jakarta'
    }, () => {
        client.sendMessage(`${targetNumber}@c.us`, morningMessage);
        console.log('Pesan pagi terkirim!');
    });

    // Jadwalkan pesan malam dengan zona waktu Jakarta
    schedule.scheduleJob('30 20 * * *', {
        tz: 'Asia/Jakarta'
    }, () => {
        client.sendMessage(`${targetNumber}@c.us`, eveningMessage);
        console.log('Pesan malam terkirim!');
    });
});

client.on('message', async (msg) => {
    const chat = await msg.getChat();
    const contact = await msg.getContact();

    console.log(`💬 ${contact.pushname} : ${msg.body}\n`);

    try {
        switch (msg.body.toLowerCase()) {
            case '!info':
                msg.reply('pripun');
                break;

            case '!stiker':
            case '!sticker':
            case 'st':
                if (msg.hasMedia) {
                    const media = await msg.downloadMedia();
                    await chat.sendMessage(media, {
                        sendMediaAsSticker: true,
                        stickerName: 'NESABOT -',
                        stickerAuthor: 'BY RYSNANTO'
                    });
                    console.log(`💬 ${contact.pushname} : Sticker sent!\n`);

                    // Kirim pesan khusus jika nomor pengirim cocok
                    if (contact.id._serialized === TARGET_PHONE_NUMBER) {
                        await chat.sendMessage('Sticker mu sudah jadi adek🤍');
                    }
                } else {
                    msg.reply('Send image with caption !sticker');
                }
                break;

            case '!error':
                // Simulate an error for testing
                throw new Error('This is a simulated error');
                break;

            default:
                // Handle other commands or messages if needed
                break;
        }
    } catch (error) {
        console.error('Error occurred:', error);
    }
});

client.initialize();
