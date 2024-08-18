
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

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
});

client.on('message', async (msg) => {
    const chat = await msg.getChat();
    const contact = await msg.getContact();

    console.log(`💬 ${contact.pushname} : ${msg.body}\n`);

    try {
        switch (msg.body.toLowerCase()) {
            case '!ping':
                msg.reply('pong');
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
                        await chat.sendMessage('itu sticker mu sayangku aini🤍');
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
