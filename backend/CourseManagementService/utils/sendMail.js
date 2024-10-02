import axios from 'axios'

const sendMail = async(mailData) => {
    try {
        let {data} = await axios.post(`${process.env.NOTIFICATION_SERVER_URL}send-notification`, mailData);
        console.log(data);
    } catch (error) {
        console.log(error.message)
    }
}

export default sendMail;