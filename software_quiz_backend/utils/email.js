import nodemailer from 'nodemailer';




export async function sendEmailToCandidate(candidateEmail, quizName) {

    console.log("now we are in sendEmailToCandidate function")
    // TODO:  need to test below links is working
    let htmlOutput = `
        <p>Click <a href="http://localhost:5000/api/candidate_take_quiz/${quizName}">here</a> to take the quiz.</p>
    `
    console.log(htmlOutput)

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'osucs467quizapp@gmail.com',
            pass: 'CS467quizappOSU',
            clientId: '464562373315-aams5un736pm3pamqktup9aojqshmtv0.apps.googleusercontent.com',
            clientSecret: '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',
            refreshToken: '1//04UYtme_9y3CwCgYIARAAGAQSNwF-L9IrMfqk6tflOYthwSip5ijfA8SfOBwwddVN-N68XC6ZuoE76XSBlEsngc3koJgKUVlK5ko'
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: "osucs467quizapp@gmail.com",           // sender address
        to: candidateEmail,                   // list of receivers
        subject: "The quiz is completed by the candidate",                // Subject line
        text: `Dear friend, you are invited to join a test, the test name is ${quizName}`,
        html: htmlOutput,
    })

    console.log('Message sent: %s', info.messageId);


}



