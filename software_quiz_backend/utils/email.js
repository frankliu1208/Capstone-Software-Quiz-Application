import nodemailer from 'nodemailer';




export async function sendEmailToCandidate(candidateEmail, quizName) {

    // TODO:  need to test below links is working
    let htmlOutput = `
        <p>Click <a href="http://localhost:5000/api/candidate_take_quiz/${quizName}">here</a> to take the quiz.</p>
    `
    console.log(htmlOutput)

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'osucs467quizapp@gmail.com',
            pass: 'CS467quizappOSU'
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



