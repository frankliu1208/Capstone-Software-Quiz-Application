import nodemailer from 'nodemailer';

export async function sendEmailToCandidate(candidateEmail, quizId, quizName) {

    console.log("now we are in sendEmailToCandidate function")
    let htmlOutput = `
        <p>Dear friend, you are invited to join a test, the test name is ${quizName}</p>
        <p>Click <a href="http://localhost:5000/api/candidate_take_quiz/${quizId}">here</a> to take the quiz.</p>
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
            refreshToken: '1//040hNRPOG6pdiCgYIARAAGAQSNwF-L9IruDyBjySX56fX9dYOaUPv-oBjuIjCdXVRNhtPjFP3uvd3B8zATRC9KX3MtleqdlZxuCA'
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: "osucs467quizapp@gmail.com",           // sender address
        to: candidateEmail,                   // list of receivers
        subject: "You have a new quiz to take",                // Subject line
        text: `Dear friend, you are invited to join a test, the test name is ${quizName}`,
        html: htmlOutput,
    })
    console.log('Message sent: %s', info.messageId);
}


export async function sendEmailToEmployer(candidateEmail) {

    console.log("now we are in sendEmailToEmployer function")
    let htmlOutput = `
        <p>Dears, the candidate  with the email address: ${candidateEmail}  finished the quiz, please go to the application to hava a look </p>
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
            refreshToken: '1//040hNRPOG6pdiCgYIARAAGAQSNwF-L9IruDyBjySX56fX9dYOaUPv-oBjuIjCdXVRNhtPjFP3uvd3B8zATRC9KX3MtleqdlZxuCA'
        }
    });

    let employerEmail = "iwork1208@gmail.com"  // this is a mock, assume that this is an email address from employer
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: "osucs467quizapp@gmail.com",           // sender address
        to: employerEmail,                   // list of receivers
        subject: "A candidate has completed the quiz",                // Subject line
        text: `Dears, a candidate has finished the quiz,  his/her email address is ${candidateEmail}`,
        html: htmlOutput,
    })
    console.log('Message sent: %s', info.messageId);


}

